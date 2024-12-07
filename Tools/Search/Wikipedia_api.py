from prompt_toolkit import prompt
import wikipediaapi
from termcolor import colored
from bs4 import BeautifulSoup
import re, requests, sys, os


page_cache = {}
current_language = 'en'

class InternetConnectionError(Exception):
    pass


class WikipediaAPIError(Exception):
    pass


def is_internet_available():
    try:
        requests.get("https://www.google.com", timeout=5)
        return True
    except requests.ConnectionError:
        return False


def remove_html_tags(text):
    clean = re.compile('<.*?>')
    return re.sub(clean, '', text)


def colorize_heading_and_content(text):
    soup = BeautifulSoup(text, 'html.parser')

    for heading in soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']):
        heading_text = heading.get_text()
        colored_heading = colored(heading_text, 'red')
        heading.string = colored_heading

    for element in soup.find_all(['p', 'ul', 'ol', 'li']):
        element_text = element.get_text()
        colored_element = colored(element_text, 'green')
        element.string = colored_element

    return remove_html_tags(str(soup))

def extract_language_from_query(search_query):
    global current_language
    lang_pattern = re.compile(r'-lang\s+([a-zA-Z]+)')

    match = lang_pattern.search(search_query)
    if match:
        language = match.group(1)
        search_query = lang_pattern.sub('', search_query).strip()
        current_language = language
        return language, search_query
    return None, search_query

def view_cache():
    try:
        with open('saved_cache.txt', 'r', encoding='utf-8') as file:
            content = file.read()
            print(content)
    except FileNotFoundError:
        print(colored("The file saved_cache.txt does not exist.", 'yellow'))
    except Exception as e:
        print(colored(f"Error reading the file: {e}", 'yellow'))


def save_cache_to_text_file():
    try:
        with open('saved_cache.txt', 'w', encoding='utf-8') as file:
            for query, content in page_cache.items():
                file.write(f"Query: {query}\n{content}\n{'=' * 50}\n")
    except FileNotFoundError as file_error:
        print(colored("Error: File not found.", 'yellow'), file_error)
    except PermissionError as permission_error:
        print(colored(f"Unexpected error while saving the cache to saved_cache.txt: {e}", 'yellow'))
    except Exception as e:
        print(colored(f"Unexpected error while saving the cache to saved_cache.txt: {e}", 'yellow'))


def delete_cache_file():
    try:
        os.remove('saved_cache.txt')
        print(colored("The file saved_cache.txt has been deleted.", 'yellow'))
    except FileNotFoundError:
        print(colored("The file saved_cache.txt does not exist.", 'yellow'))
    except Exception as e:
        print(colored(f"Error deleting saved_cache.txt: {e}", 'yellow'))


def search_wikipedia(user_query, user_agent, language='fr'):
    if user_query in page_cache:
        return page_cache[user_query]

    try:
        wiki_wiki = wikipediaapi.Wikipedia(
            language=language,
            extract_format=wikipediaapi.ExtractFormat.HTML,
            user_agent=user_agent
        )

        page = wiki_wiki.page(user_query)

        if not page.exists():
            raise WikipediaAPIError("The page was not found.")

        content = page.text
        colored_content = colorize_heading_and_content(content)

        page_cache[user_query] = colored_content
        save_cache_to_text_file()

        return colored_content
    except requests.ConnectionError:
        raise InternetConnectionError("Internet connection error. Please check your connection.")
    except requests.RequestException as e:
        raise WikipediaAPIError(f"Error querying the Wikipedia API: {e}")
    except Exception as e:
        raise WikipediaAPIError(f"An error occurred during the search: {e}")


def handle_user_input(search_query, user_agent):
    global current_language
    #default_language = 'fr'  # Langue par défaut
    if not is_internet_available():
        raise InternetConnectionError("Internet connection not available. Please check your connection.")

    if search_query.lower() == 'exit':
        sys.exit()

    elif re.match(r'^-lang\s+[a-zA-Z]+$', search_query.lower()):
        match = re.search(r'^-lang\s+([a-zA-Z]+)$', search_query.lower())
        default_language = match.group(1)
        current_language = default_language
        print(colored(f"The default language has been set to '{current_language}'.", 'yellow'))
    elif search_query.strip():
        language, query = extract_language_from_query(search_query)
        if language:
            current_language = language
            print(colored(f"The specific language for this search is '{language}'.", 'yellow'))
        else:
            print(colored(f"The language is set to '{current_language}'.", 'yellow'))
            
        if query.lower() == '-view':
            view_cache()
        elif query.lower() == '-save':
            save_cache_to_text_file()
        elif query.lower() == '-del':
            delete_cache_file()
        else:
            colored_content = search_wikipedia(query, user_agent, current_language)
            sections = colored_content.split('\x1b[31m')

            section_iterator = iter(sections)
            next_section = next(section_iterator)
            print(next_section)

            for section in section_iterator:
                user_input = prompt("Wikipédia $ ")

                if user_input.lower() == 'exit':
                    sys.exit()
                elif user_input.strip():
                    search_query = user_input
                    handle_user_input(search_query, user_agent)
                    return
                else:
                    print(colored(section, "red"))
    else:
        print(colored("Please enter a search term.", "yellow"))

def main():
    user_agent = "votre@email.com"

    while True:
        try:
            search_query = prompt("Wikipédia $ ")
            handle_user_input(search_query, user_agent)
        except InternetConnectionError as e:
            print(colored(f"ERROR: {e}", 'yellow'))
        except WikipediaAPIError as e:
            print(colored(f"ERROR: {e}", 'yellow'))
        except Exception as e:
            print(colored(f"ERROR: {e}", 'yellow'))

if __name__ == "__main__":
    main()



"""
gerer gmail

"""

