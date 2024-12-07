from prompt_toolkit import prompt
from termcolor import colored
from bs4 import BeautifulSoup
import re
import wikipedia
import requests

class InternetConnectionError(Exception):
    pass

class WikipediaAPIError(Exception):
    pass

# Déclarez un dictionnaire pour mettre en cache les pages consultées
page_cache = {}

def is_internet_available():
    try:
        # Attempt to connect to a well-known website (e.g., Google) to check internet connectivity
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

def search_wikipedia(user_query, language='fr'):
    # Vérifiez si la page est déjà en cache
    if user_query in page_cache:
        return page_cache[user_query]

    try:
        # Faites la requête à l'API Wikipedia
        wikipedia.set_lang(language)
        results = wikipedia.search(user_query)
        
        if not results:
            print("Aucun résultat trouvé pour votre recherche.")
            return None
        elif len(results) == 1:
            # S'il y a un seul résultat, utilisez-le
            page = wikipedia.page(results[0])
        else:
            # S'il y a plusieurs résultats, demandez à l'utilisateur de préciser
            print("Plusieurs résultats trouvés. Veuillez préciser votre recherche :")
            for i, result in enumerate(results, start=1):
                print(f"{i}. {result}")
            choice = prompt("Entrez le numéro du résultat que vous souhaitez afficher : ")
            try:
                choice = int(choice)
                if 1 <= choice <= len(results):
                    page = wikipedia.page(results[choice - 1])
                else:
                    print("Choix invalide. Affichage du premier résultat.")
                    page = wikipedia.page(results[0])
            except ValueError:
                print("Choix invalide. Affichage du premier résultat.")
                page = wikipedia.page(results[0])

        content = page.content
        colored_content = colorize_heading_and_content(content)

        # Mise en cache du résultat
        page_cache[user_query] = colored_content

        return colored_content
    except requests.ConnectionError:
        print("Erreur de connexion Internet. Veuillez vérifier votre connexion.")
        return None
    except Exception as e:
        print(f"Une erreur s'est produite lors de la recherche : {e}")
        return None



def main():
    while True:
        try:
            if not is_internet_available():
                raise InternetConnectionError("Connexion Internet non disponible. Veuillez vérifier votre connexion.")

            search_query = prompt("Wikipédia $ ")

            if search_query.lower() == 'exit':
                print("Programme terminé.")
                break
            elif search_query.strip():
                lang_option = re.search(r'-lang\s+([a-zA-Z]+)', search_query)
                if lang_option:
                    language = lang_option.group(1)
                    search_query = search_query.replace(lang_option.group(0), "").strip()
                else:
                    language = 'fr'

                colored_content = search_wikipedia(search_query, language)

                sections = colored_content.split('\x1b[31m')

                for section in sections:
                    print(colored(section, "cyan"))  # couleurs
                    user_input = input("Wikipédia $ ")
                    if user_input.lower() == 'exit':
                        print("Programme terminé.")
                        return
                    elif user_input.strip():
                        search_query = user_input
                        break
            else:
                print("Veuillez entrer un terme de recherche.")
        except InternetConnectionError as e:
            print(f"Erreur : {e}")
        except WikipediaAPIError as e:
            print(f"Erreur : {e}")
        except Exception as e:
            print(f"Une erreur s'est produite : {e}")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(colored("KeyboardInterrupt", "red"))
        sys.exit()
    except EOFError:
        sys.exit()
    except Exception as e:
        print(colored(e, 'red'))


"""
specifier langue, par défaut englais
enregistrer cache dans un txt en mode ajout sans écrasé sauf permission de user,
conyenues des balises h1...h6 en rouge,

"""


