import random, time
import tkinter as tk
from random import randint
from random import choice, randrange, paretovariate

MATRIX_CHARS_alpha= "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz*@"

MATRIX_CHARS_bravo = "@अआइईउऊऋएऐऑओऔकखगघचछजझटठडढणतथदधनपफबभमयरलवशषसहीबभचछजझञटठडढणतथदधनपफबभमयरलवशषसहक़ख़ग़ज़ड़ढ़फ़य़ॠॡक़ख़ग़ज़ड़ढ़फ़य़ॠॡ"

MATRIX_CHARS_charlie = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz*@ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي"

MATRIX_CHARS_echo = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz*@爱本长的地二发个好和一见可了么妳女人是他它我要以这中"

MATRIX_CHARS_foxtrot= "ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜﾍｲｸﾁﾄﾉﾌﾖﾙﾚﾛﾝ"

MATRIX_CHARS_golf = "ÇÈÌÍÐÑÒ×ØÙÚÝÞßà£¤¥§ª¶º»¿ÄÅéêíïåæçèðñòöøùýþāćĉėěĝģħīıķĽŁłńňōŒœŕŗśŝšťūųŸźżŽžșțëĈĎďĠŘ°«±ΔΞΛ"


MATRIX_CHARS_all = [MATRIX_CHARS_alpha, MATRIX_CHARS_bravo, MATRIX_CHARS_charlie, MATRIX_CHARS_echo, MATRIX_CHARS_foxtrot, MATRIX_CHARS_golf]

MATRIX_CHARS = random.choice(MATRIX_CHARS_all)
if MATRIX_CHARS == MATRIX_CHARS_alpha:
    title_Window = "Code ALPHA"
elif MATRIX_CHARS == MATRIX_CHARS_bravo:
    title_Window = "Code BRAVO"
elif MATRIX_CHARS == MATRIX_CHARS_charlie:
    title_Window = "Code CHARLIE"
elif MATRIX_CHARS == MATRIX_CHARS_echo:
    title_Window = "Code ECHO"
elif MATRIX_CHARS == MATRIX_CHARS_foxtrot:
    title_Window = "Code FOXTROT"
elif MATRIX_CHARS == MATRIX_CHARS_golf:
    title_Window = "Code GOLF"
else:
    title_Window = "Code N/A"




STRING_LENGTH = 6
SCROLL_SPEED = 100  # Temps en millisecondes

def matrix_scroll():
    root = tk.Tk()
    root.title(title_Window)
    root.configure(bg="black")
    root.geometry("700x500")  # Taille de la fenêtre
    
    canvas = tk.Canvas(root, bg="black", highlightthickness=0)
    canvas.pack(fill=tk.BOTH, expand=True)
    
    while True:
        matrix_string = "".join(random.choice(MATRIX_CHARS) for _ in range(STRING_LENGTH))
        color = random.choice(["red", "green", "yellow", "blue", "magenta", "cyan", "white"])
        canvas.delete("all")
        canvas.create_text(
            root.winfo_width() / 2,
            root.winfo_height() / 2,
            text=matrix_string,
            font=("Courier", 20),  # Taille de la police
            fill=color
        )
        root.update()
        time.sleep(SCROLL_SPEED / 900)


if __name__ == "__main__":
    try:
        matrix_scroll()
    except KeyboardInterrupt:
        print ("KeyboardInterrupt")
        sys.exit()
    except EOFError:
        sys.exit()
    except Exception as e:
        print(colored(e, 'red'))




