import argparse
from pytube import YouTube, Playlist
from tqdm import tqdm
import re
import os
from concurrent.futures import ThreadPoolExecutor
import logging
import time
from pytube.exceptions import RegexMatchError, VideoUnavailable, PytubeError
from urllib.error import URLError

def setup_logging():
    logging.basicConfig(filename='youtube_downloader.log', level=logging.INFO,
                        format='%(asctime)s - %(levelname)s - %(message)s')

def on_progress(stream, chunk, bytes_remaining):
    total_size = stream.filesize
    bytes_downloaded = total_size - bytes_remaining
    percentage_of_completion = bytes_downloaded / total_size * 100
    tqdm.write(f"Downloading {stream.title}: {percentage_of_completion:.2f}% complete", end="\r")

def download_with_retries(func, *args, max_attempts=5, **kwargs):
    attempt = 0
    while attempt < max_attempts:
        try:
            return func(*args, **kwargs)
        except (RegexMatchError, VideoUnavailable, PytubeError, URLError) as e:
            logging.error(f"Error during download attempt {attempt + 1} for {args[0]}: {e}")
            print(f"An error occurred while downloading: {e}")
            attempt += 1
            time.sleep(2)
        except Exception as e:
            logging.error(f"Unexpected error during download attempt {attempt + 1} for {args[0]}: {e}")
            print(f"An unexpected error occurred while downloading: {e}")
            break

def download_video(url, output_path=".", audio_only=False, resolution=None, rename=None):
    yt = YouTube(url, on_progress_callback=on_progress)
    
    if audio_only:
        stream = yt.streams.filter(only_audio=True).first()
    elif resolution:
        stream = yt.streams.filter(res=resolution).first()
    else:
        stream = yt.streams.get_highest_resolution()
    
    if not stream:
        raise PytubeError(f"No stream found for the given parameters: audio_only={audio_only}, resolution={resolution}")
    
    output_file = os.path.join(output_path, stream.default_filename)
    
    if os.path.exists(output_file):
        logging.info(f"The file '{stream.title}' already exists in '{output_path}'.")
        print(f"The file '{stream.title}' already exists in '{output_path}'. Skipping download.")
        return
    
    stream.download(output_path)
    
    if rename:
        base, ext = os.path.splitext(output_file)
        new_file = os.path.join(output_path, rename + ext if not audio_only else '.mp3')
        os.rename(output_file, new_file)
        logging.info(f"Download and rename of '{yt.title}' to '{rename}' completed successfully.")
        print(f"Download and rename of '{yt.title}' to '{rename}' completed successfully.")
    else:
        if audio_only:
            base, ext = os.path.splitext(output_file)
            new_file = base + '.mp3'
            os.rename(output_file, new_file)
            logging.info(f"Download of audio '{yt.title}' completed successfully.")
            print(f"Download of audio '{yt.title}' completed successfully.")
        else:
            logging.info(f"Download of video '{yt.title}' completed successfully.")
            print(f"Download of video '{yt.title}' completed successfully.")

def download_playlist(url, output_path=".", audio_only=False, max_threads=4, resolution=None, rename=None):
    try:
        playlist = Playlist(url)
        logging.info(f"Downloading playlist '{playlist.title}'...")
        print(f"Downloading playlist '{playlist.title}'...")

        with ThreadPoolExecutor(max_workers=max_threads) as executor:
            futures = [executor.submit(download_with_retries, download_video, video_url, output_path, audio_only, resolution, rename) for video_url in playlist.video_urls]
            for future in tqdm(futures, desc="Downloading videos", unit="video"):
                future.result()
    
    except (RegexMatchError, VideoUnavailable, PytubeError, URLError, Exception) as e:
        logging.error(f"Error downloading playlist {url}: {e}")
        print(f"An error occurred while downloading the playlist: {e}")

def valid_url(url):
    regex = re.compile(r'^(https?://)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)/.+')
    return re.match(regex, url) is not None

def main():
    setup_logging()
    
    parser = argparse.ArgumentParser(description="YouTube Video Downloader")
    parser.add_argument("urls", help="URL(s) of YouTube video or playlist to download, separated by commas")
    parser.add_argument("-o", "--output", default=".", help="Output directory for downloaded video or audio")
    parser.add_argument("-a", "--audio", action="store_true", help="Download audio only")
    parser.add_argument("-t", "--threads", type=int, default=4, help="Number of threads for parallel download")
    parser.add_argument("-r", "--resolution", help="Specify video resolution (e.g., 720p, 1080p)")
    parser.add_argument("-ren", "--rename", help="List of new names for downloaded files, separated by commas")
    
    args = parser.parse_args()

    urls = [url.strip() for url in args.urls.split(',')]
    renames = [name.strip() for name in args.rename.split(',')] if args.rename else [None] * len(urls)

    if len(urls) != len(renames):
        print("Number of URLs and number of new names must be identical.")
        return

    for url, rename in zip(urls, renames):
        if not valid_url(url):
            logging.warning(f"Provided URL is not valid: {url}")
            print(f"Provided URL is not valid: {url}. Please provide a valid YouTube URL.")
            continue
        
        if 'playlist' in url:
            download_with_retries(download_playlist, url, args.output, args.audio, args.threads, args.resolution, rename)
        else:
            download_with_retries(download_video, url, args.output, args.audio, args.resolution, rename)

if __name__ == "__main__":
    main()
