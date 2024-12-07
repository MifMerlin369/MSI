import requests, os, sys, time, socket
from googletrans import LANGUAGES
from termcolor import colored
from autocorrect import Speller


def slowprint(s):
    for c in s + '\n':
        sys.stdout.write(c)
        sys.stdout.flush()
        time.sleep(1./60)

def exit_p():
    print(colored("Exiting...", "red"))
    sys.exit()

def quit_p():
    print(colored("Quitting...", "red"))
    sys.exit()

def is_internet_available():
    try:
        socket.create_connection(("www.google.com", 80))
        return True
    except OSError:
        return False

def is_valid_url(url):
    try:
        response = requests.head(url)
        return response.status_code == 200
    except requests.exceptions.RequestException:
        return False

while True:
    try:
        text = input(colored("Text: ", "red"))
        if text.lower() == "--language":
            print(colored("Supported languages:", "green"))
            for code, language in LANGUAGES.items():
                print(colored(f"{code}: {language}", "green"))
            continue

        if text.lower() == "exit":
            exit_p()
        if text.lower() == "quit":
            quit_p()
        if text.lower() in ["clear", "cls"]:
            os.system('cls' if os.name == 'nt' else 'clear')
            continue

        dest_language = input(colored("Language: ", "red"))

        if is_valid_url(text):
            continue

        if not is_internet_available():
            print(colored("Internet connection is not available", 'red'))
            continue

        url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl={dest_language}&dt=t&q={text}"
        response = requests.get(url)
        if response.status_code == 200:
            translation = response.json()[0][0][0]
            slowprint(colored("Translation: ", "red") + colored(translation, "green") + "\n")
        else:
            print(colored("Error during translation.", "red"))

    except KeyboardInterrupt:
        print(colored("KeyboardInterrupt", "red"))
        sys.exit()
    except EOFError:
        sys.exit()
    except Exception as e:
        print(colored(e, 'red'))
