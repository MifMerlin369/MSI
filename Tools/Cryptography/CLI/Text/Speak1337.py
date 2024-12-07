from prompt_toolkit import prompt
from prompt_toolkit import print_formatted_text
from prompt_toolkit.formatted_text import HTML
from prompt_toolkit import PromptSession
from prompt_toolkit.styles import Style

import re, os, sys, random, subprocess
from termcolor import colored

session = PromptSession()


def leet_translate(text):
    leet_dict = {
    'A': ('a', '4', '@', '/-\\', '/\\', '^', 'aye', 'ci', 'λ', '∂', '//-\\', '/=\\', 'ae', 'α', 'Д'),
    'B': ('b', 'в', 'ь', '8', '|3', '6', '13', 'l3', ']3', '|o', '1o', 'lo', 'ß', ']]3', '|8', 'l8', '18', ']8'),
    'C': ('c', '(', '<', '[', '{', 'sea', 'see', '©', '¢'),
    'D': ('d', '|]', 'l]', '1]', '|)', 'l)', '1)', '[)', '|}', 'l]', '1}', '])', 'i>', '|>', 'l>', '1>', '0', 'cl', 'o|', 'o1', 'ol', 'Ð', '∂', 'ð', 'đ'),
    'E': ('e', '3', '&', '[-', '€', 'ii', 'ə', '£', 'iii', 'ε', '₤', 'Є'),
    'F': ('f', '|=', ']=', '}', 'ph', '(=', '[=', 'ʃ', 'eph', 'ƒ'),
    'G': ('g', '6', '9', '(+', 'C-', 'gee', 'jee', '(Y,', 'cj', '-', '(γ,', '(-'),
    'H': ('h', '|-|', '#', '[-]', '{-}', ']-[', ')-(', '(-)', ':-:', '}{', '-{', 'aych', '╫', ']-[[', 'aech', 'н'),
    'I': ('!', '1', '|', 'l', 'eye', '3y3', 'ai', 'i'),
    'J': ('j', '|', '/', ']', '</', ')', 'ʝ', 'ul', 'u1', 'u|', 'jay', '(/', ']', '_|', 'ul', 'u1', 'jay', '(/'),
    'K': ('k', 'x', '|<', '|x', '|{', '/<', '\\<', '/x', '\\x', 'ɮ', 'kay'),
    'L': ('l', '1', '7', '|', '1_', 'l_', 'lJ', '£', '¬', 'el', '|_'),
    'M': ('m', '//\\', '|\\/|', 'em', '|v|', '[v]', '^^', 'nn', '//\\//\\', '(V)', '(/)', '/|\\', '/|/|', '.\\', '/^^\\', '/V\\', '|^^|', 'JVL', '][\\//][', '[]/[]', '[]v[]', '(t)', '/\\/\\', '/v\\', '|V|', ']V[', 'AA', '|Y|', '/X\\', '[]\\/][', '[]V[]', '][\\//][', '(V)', 'N\\', 'м', '|/|', '[V]', '(/)'),
    'N': ('n', '|\\|', '/\\/', '//\\//', '[\\]', '<\\>', '{\\}', '//', '[]\\[]', ']\\[', '', '₪', '/|/', 'in', '/|/', '/V', 'И', 'и', 'п', 'ŋ'),
    'O': ('o', '0', '()', 'oh', '[]', '{}', '¤', 'Ω', 'ω', '', '[[]]', 'oh', 'ø', '<>', 'Ø', 'Θ', 'о', 'ө'),
    'P': ('p', '|', 'l*', '1*', '|o', 'lo', '1o', '|>', 'l>', '1>', '|', 'l', '1', '?', '9', '[]d', '|7', 'l7', '17', 'q', '|d', 'ld', '1d', '℗', '|º', '1º', 'lº', 'þ', '¶', 'pee', '|2', '|D'),
    'Q': ('q', '0_', 'o_', '0,', 'o,', '(,)', '[,]', '<|', '<l', '<1', 'cue', '9', '¶', 'kew', ' kw'),
    'R': ('r', '|2', 'l2', '12', '2', '/2', 'I2', '|^', 'l^', '1^', '|', 'l~', '1~', 'lz', '[z', '|', 'l', '1', '.-', '®', 'Я', 'ʁ', '|?', 'l?', '1?', 'arr', '|Z'),
    'S': ('s', '5', '$', 'z', 'es', '2', '§', 'š', '\\``', 'ŝ', 'ş'),
    'T': ('t', '7', '+', '-|-', '-l-', '-1-', '1', '\'][\'', '†'),
    'U': ('u', '|_|', 'l_l', '1_1', '(_)', '[_]', '{_}', 'y3w', 'm', '\\_/', '\\_\\', '/_/', 'µ', 'yew', 'yoo', 'yuu'),
    'V': ('v', '\\/', '\\/\\/', '√', '|/', '\\|', '\\/'),
    'W': ('w', '\\/\\/\\/', 'vv', '\'//', '\\\\\'', '\\^/', '(n)', '\\x/', '\\|/', '\\_|_/', '\\_l_/', '\\_1_/', '\\/\\/\\/\\/', '\\_:_/', ']i[', 'uu', 'Ш', 'ɰ', '1/\\/', '\\/1/', '1/1/', '\\/\\/', '|\\|\\|', '|/|/', '|\\/', '\\/\\/', '(/\\)', '\\^/', '|/\\|', '\\X/', '\\_|_/', 'Ш', '\\V/'),
    'X': ('x', '%', '><', '><,', '}{', 'ecks', 'x', ', *', ')(', 'ex', 'Ж', '×'),
    'Y': ('y', 'j', '/', '(', '-/', '\'/', '\\-/', 'Ψ', 'φ', 'λ', 'Ч', '¥', '``//', '\\j', 'wai', '\\|/', 'ү'),
    'Z': ('z', '2', '~/_', '%', '7_', 'ʒ', '≥', '/_', '(/)', '>_')
    }

    leet_dict_inverse = {v: k for k, valeurs in leet_dict.items() for v in valeurs}

    translation = ''
    for char in text:
        char_upper = char.upper()
        if char_upper in leet_dict:
            leet_variants = leet_dict[char_upper]
            random_variant = random.choice(leet_variants)
            translation += random_variant
        else:
            translation += char

    return translation

def get_user_input():
    text = session.prompt(
    HTML('<cyan>$ Leet speak : </cyan>'),
    style=Style.from_dict({
    '':          '#00FF00'
            })
    )
    return text.strip()

history = {}

def process_history_command(command):
    global history
    if command == "history":
        print_formatted_text(HTML(f"<ansiyellow>History</ansiyellow>"))
        for entry in history:
            print_formatted_text(HTML(f"<ansigreen>{entry} : {history[entry]}</ansigreen>"))
        print("\n" * 1)
    elif command == "history -c":
        history.clear()
        print_formatted_text(HTML(f"<ansiyellow>History cleared</ansiyellow>"))
    elif command.startswith("history -r"):
        filename = command[10:].strip()
        if filename:
            with open(filename, "a") as file:
                for entry in history:
                    file.write(f"{entry} : {history[entry]}\n")
            print_formatted_text(HTML(f"<ansiyellow>History saved to '{filename}'</ansiyellow>"))
    elif command.startswith("history -w"):
        filename = command[10:].strip()
        if filename:
            with open(filename, "w") as file:
                for entry in history:
                    file.write(f"{entry} : {history[entry]}\n")
            print_formatted_text(HTML(f"<ansiyellow>History saved to '{filename}'</ansiyellow>"))
    else:
        print_formatted_text(HTML(f"<ansired>Unrecognized history command</ansired>"))

def clear_p():
    subprocess.run('cls' if os.name == 'nt' else 'clear', shell=True)

def exit_p():
    print_formatted_text(HTML(f"<ansired>Exiting...</ansired>"))
    sys.exit()

def quit_p():
    print_formatted_text(HTML(f"<ansired>Quitting...</ansired>"))
    sys.exit()

def help_p():
    print_formatted_text(HTML(f"<ansicyan>Information!...</ansicyan>"))

def leet_prompt():
    text = get_user_input()
    if text.lower() == 'exit':
        exit_p()
    elif text.lower() in ['cls', 'clear']:
        clear_p()
    elif text.lower() in ["-h", "--help"]:
        help_p()
    elif text.startswith("history"):
        process_history_command(text)
    elif text:
        translation = leet_translate(text)
        print_formatted_text(HTML(f"Leet speak: <ansigreen>{translation}</ansigreen>"))

        history[text] = translation
    else:
        print_formatted_text(HTML(f"<ansired>Enter some text to translate to Leet speak</ansired>"))


def main():
    while True:
        try:
            leet_prompt()
        except KeyboardInterrupt:
            print_formatted_text(HTML(f"<ansired>KeyboardInterrupt...</ansired>"))
            sys.exit()
        except EOFError:
            sys.exit()
        except Exception as error:
            print(colored(f"ERROR! {error}", "red"))


if __name__ == '__main__':
    main()

