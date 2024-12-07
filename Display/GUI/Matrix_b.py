import random
import sys
import time
import argparse
from termcolor import colored


color_list = ["red", "cyan", "green", "blue"]
color_choice = random.choice(color_list)
space = [" ", "  "]
space_choice = random.choice(space)
if space_choice == " ":
    length_chars = 30
else:
    length_chars = 20

# Liste des caractères à afficher.
matrix_chars_list = [
    "Λß₵ĐΣF₲HЇJ₭LMИØPQRЅŦЦVWЖ¥ZΔβCΣFҒGҜΠΩΨ¢đ₣6н¡₱я§7√щ丹乃匚刀モム卄工爪れ口匕尺ち∪∨山メㄚ乙0123456789",
    "#@&%$€¥£¢§1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    "你好世界中文字符汉字测试数据示例随机生成",
    "ॐअआइईउऊएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसहऋॠऌॡक्षत्रज्ञ"
]

# Parser pour les arguments en ligne de commande
parser = argparse.ArgumentParser(description="Matrix-style character display")
parser.add_argument('-c', '--chars', type=int, choices=range(len(matrix_chars_list)), default=None, help='Index of character set to use (default: random)')
parser.add_argument('-l', '--length', type=int, default=length_chars, help='Length of the character string to display')
parser.add_argument('-s', '--speed', type=float, default=0.1, help='Scrolling speed in seconds')
args = parser.parse_args()

# Sélection aléatoire du jeu de caractères si aucun n'est spécifié
if args.chars is None:
    matrix_chars = random.choice(matrix_chars_list)
else:
    matrix_chars = matrix_chars_list[args.chars]

string_length = args.length
scroll_speed = args.speed

def main(args=None):
    try:
        while True:
            # Génère une chaîne de caractères aléatoires
            matrix_string = " ".join(random.choice(matrix_chars) for _ in range(string_length))
            # Affiche la chaîne de caractères en couleur choisie sur fond noir
            print(colored(matrix_string, color=color_choice, on_color="on_black"))
            # Pause pour le défilement
            time.sleep(scroll_speed)
    except KeyboardInterrupt:
        # Gère l'interruption clavier (Ctrl+C)
        print(colored("KeyboardInterrupt", "red"))
        sys.exit()
    except EOFError:
        # Gère la fin de fichier (Ctrl+D)
        sys.exit()
    except Exception as e:
        # Gère toute autre exception
        print(colored(e, 'red'))
        sys.exit()

if __name__ == "__main__":
    main()


# il ne fonctionne pas avec argument dans GUI

