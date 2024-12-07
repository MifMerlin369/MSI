from prompt_toolkit import prompt, print_formatted_text
from prompt_toolkit.formatted_text import HTML

import sys
import argparse

def shift_message(msg: str, key: int):
    result = ""
    for char in msg:
        if char.isalpha():
            if char.islower():
                i = (ord(char) - 97 + key) % 26 + 97
            else:
                i = (ord(char) - 65 + key) % 26 + 65
            result += chr(i)
        else:
            result += char
    return result

def main(args=None):
    parser = argparse.ArgumentParser(description="Encode or decode a text using Caesar cipher.")
    parser.add_argument('-e', '--encode', metavar='TEXT', type=str, help="The text to encode.")
    parser.add_argument('-d', '--decode', metavar='TEXT', type=str, help="The text to decode.")
    parser.add_argument('-k', '--key', metavar='KEY', type=int, required=True, help="The key for encoding/decoding.")
    
    if args is None:
        args = sys.argv[1:]
    
    args = parser.parse_args(args)

    if args.encode:
        print_formatted_text(HTML(f"Encrypted text <ansigreen>{shift_message(args.encode, args.key)}</ansigreen>"))
    elif args.decode:
        print_formatted_text(HTML(f"Decrypted text <ansigreen>{shift_message(args.decode, 26 - (args.key % 26))}</ansigreen>"))
    else:
        parser.print_help()
        sys.exit(1)

if __name__ == "__main__":
    main()
