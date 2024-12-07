from prompt_toolkit import PromptSession, print_formatted_text, HTML
from prompt_toolkit.completion import WordCompleter
from prompt_toolkit.styles import Style
import sys, os, subprocess, random

# Function to clear the console
def clear_programm():
    subprocess.run('cls' if os.name == 'nt' else 'clear', shell=True)

# Function to exit the program
def exit_programm():
    print_formatted_text(HTML(f"<ansired>Exiting…</ansired>"))
    sys.exit()

# Define multiple leet speak dictionaries
leet_dicts = [
    {
        "A": "Λ", 'B': 'ß', 'C': '₵', "D": "Đ", "E": "Σ", "F": "F", 'G': '₲', 'H': 'H',
        "I": "Ї", 'J': 'J', 'K': '₭', 'L': 'L', 'M': 'M', 'N': 'И', "O": "Ø", 'P': 'P',
        'Q': 'Q', 'R': 'Я', "S": "Ѕ", 'T': 'Ŧ', 'U': 'Ц', 'V': 'V', 'W': 'Ш', 'X': 'Ж',
        'Y': '¥', 'Z': 'Z', "a": "Λ", 'b': 'ß', 'c': '₵', "d": "Đ", "e": "Σ", "f": "F",
        'g': '₲', 'h': 'H', "i": "Ї", 'j': 'J', 'k': '₭', 'l': 'L', 'm': 'M', 'n': 'И',
        "o": "Ø", 'p': 'P', 'q': 'Q', 'r': 'Я', "s": "Ѕ", 't': 'Ŧ', 'u': 'Ц', 'v': 'V',
        'w': 'Ш', 'x': 'Ж', 'y': '¥', 'z': 'Z', '1': '1', '2': '2', '3': '3', '4': '4',
        '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '0': '0'
    },
    {
        "A": "Δ", 'B': 'β', 'C': 'C', "D": "D", "E": "Σ", "F":"Ғ", 'G': 'G', 'H': 'H',
        "I": "I", 'J': 'J', 'K': 'Ҝ', 'L': 'L', 'M': 'M', 'N': 'Π', "O": "Ω", 'P': 'P',
        'Q': 'Q', 'R': 'R', "S": "S", 'T': 'T', 'U': 'U', 'V': 'V', 'W': 'Ш', 'X': 'X',
        'Y': 'Ψ', 'Z': 'Z', "a": "Δ", 'b': 'β', 'c': 'C', "d": "D", "e": "Σ", "f":"Ғ",
        'g': 'G', 'h': 'H', "i": "I", 'j': 'J', 'k': 'Ҝ', 'l': 'L', 'm': 'M', 'n': 'Π',
        "o": "Ω", 'p': 'P', 'q': 'Q', 'r': 'R', "s": "S", 't': 'T', 'u': 'U', 'v': 'V',
        'w': 'Ш', 'x': 'X', 'y': 'Ψ', 'z': 'Z', '1': '1', '2': '2', '3': '3', '4': '4',
        '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '0': '0'
    },
    {
        "A":("@","4"), 'B': 'в', 'C': '¢', "D": "đ", "E": ("€","3", "Э"), "F":"₣", 'G': '6', 'H': 'н',
        "I": ("¡","1"), 'J': 'J', 'K': 'K', 'L': 'L', 'M': 'M', 'N': 'и', "O": ("0","Ø"), 'P': '₱',
        'Q': 'Q', 'R': 'я', "S": ("$","5", "§"), 'T': '7', 'U': 'U', 'V': '√', 'W': 'щ', 'X': 'X',
        'Y': 'Y', 'Z': '2', "a": ("@","4"), 'b': 'в', 'c': '¢', "d": "đ", "e": ("€","3", "Э"), "f":"₣",
        'g': '6', 'h': 'н', "i": ("¡","1"), 'j': 'j', 'k': 'k', 'l': 'l', 'm': 'm', 'n': 'и',
        "o": ("0","Ø"), 'p': '₱', 'q': 'q', 'r': 'я', "s": ("$","5", "§"), 't': '7', 'u': 'u', 'v': '√',
        'w': 'щ', 'x': 'x', 'y': 'y', 'z': '2', '1': '1', '2': '2', '3': '3', '4': '4',
        '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '0': '0'
    },
    {
        "A": "丹", 'B': '乃', 'C': '匚', "D": "刀", "E": "モ", "F":"下", 'G': 'ム', 'H': '卄',
        "I": "工", 'J': 'Ｊ', 'K': 'Ｋ', 'L': 'ㄥ', 'M': '爪', 'N': 'れ', "O": "口", 'P': '匕',
        'Q': 'Ｑ', 'R': '尺', "S": "ち", 'T': '匕', 'U': '∪', 'V': '∨', 'W': '山', 'X': 'メ',
        'Y': 'ㄚ', 'Z': '乙', "a": "丹", 'b': '乃', 'c': '匚', "d": "刀", "e": "モ", "f":"下",
        'g': 'ム', 'h': '卄', "i": "工", 'j': 'Ｊ', 'k': 'Ｋ', 'l': 'ㄥ', 'm': '爪', 'n': 'れ',
        "o": "口", 'p': '匕', 'q': 'Ｑ', 'r': '尺', "s": "ち", 't': '匕', 'u': '∪', 'v': '∨',
        'w': '山', 'x': 'メ', 'y': 'ㄚ', 'z': '乙', '1': '1', '2': '2', '3': '3', '4': '4',
        '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '0': '0'
    }
]


# Choose a random leet dictionary at startup
selected_leet_dict = random.choice(leet_dicts)

# Function to convert text to custom leet speak
def to_custom_leet_speak(text):
    translation = ''
    for char in text:
        if char in selected_leet_dict:
            leet_variants = selected_leet_dict[char]
            # If multiple variants are available, choose one randomly
            if isinstance(leet_variants, tuple):
                translation += random.choice(leet_variants)
            else:
                translation += leet_variants
        else:
            translation += char

    return translation

# Function to display help text
def display_help():
    help_text = """
    <b>LEET SPEAK (1337) Translator</b>
    
    <b>Description:</b>
    This program converts your input text into "leet speak" (also known as 1337 speak), 
    a form of modified text often used on the internet. Leet speak uses various characters 
    to replace letters, creating a unique and stylized way of writing.

    <b>Commands:</b>
    <b>-h, --help</b>                Display this help message
    <b>-l, --lang</b>                Change the leet speak dictionary. Use this command to switch to a different leet speak translation style.
    <b>exit</b>                Quit the program
    <b>cls/clear</b>           Clear the screen
    
    <b>Example usage:</b>
    <b>1337 $ : Hello World</b> - Translates "Hello World" into leet speak using the current dictionary.
    
    This program supports multiple leet speak styles. By using the "-lang change" command, 
    you can cycle through different dictionaries to see various leet speak variations.
    """
    print_formatted_text(HTML(help_text), style=style)


# Function to change leet dictionary
def change_leet_dict():
    global selected_leet_dict
    selected_leet_dict = random.choice(leet_dicts)
    print_formatted_text(HTML("<output>Leet speak dictionary changed.</output>"), style=style)

# Word completer for command suggestions
words = ['cls', 'clear', 'exit', '-h', '--help', '-l', '-lang']
completer = WordCompleter(words, ignore_case=True)

# Style for the prompt and output
style = Style.from_dict({
    'prompt': 'ansicyan bold',
    'output': 'ansigreen',
    'error': 'ansired bold',
    'input': 'ansiyellow bold',
    'input-text': 'ansiwhite'
})




# Main function to handle user inputs
def main():
    # Create a prompt session
    session = PromptSession(completer=completer, style=style)
    # Initial display message
    print_formatted_text(HTML("""<output>LEET SPEAK (1337)\n\n</output>"""), style=style)

    while True:
        try:
            user_input = session.prompt(
                HTML('<prompt>1337 $ : </prompt>'),
                completer=completer,
                style=style
            )
            
            if user_input.lower() == 'exit':
                exit_programm()
            elif user_input.lower() in ["clear", "cls"]:
                clear_programm()
            elif user_input.lower() == '-h' or user_input.lower() == '--help':
                display_help()
            elif user_input.lower() == '-l' or user_input.lower() == '--lang':
                change_leet_dict()
            else:
                leet_text = to_custom_leet_speak(user_input)
                print_formatted_text(HTML(f"<output>leet speak: {leet_text}</output>"), style=style)
        
        except KeyboardInterrupt:
            print_formatted_text(HTML(f"<ansired>KeyboardInterrupt</ansired>"))
            sys.exit()
        except EOFError:
            sys.exit()
        except Exception as e:
            print_formatted_text(HTML(f"<ansired>ERROR: {e}</ansired>"))

if __name__ == "__main__":
    main()



