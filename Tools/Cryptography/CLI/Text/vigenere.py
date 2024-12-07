from prompt_toolkit import prompt, print_formatted_text
from prompt_toolkit.formatted_text import HTML

import argparse

def vigenere_cipher(message, key, mode):
    key_length = len(key)
    key_as_int = [ord(i) for i in key]
    message_int = [ord(i) for i in message]
    key_int = [key_as_int[i % key_length] for i in range(len(message_int))]

    if mode == 'encode':
        cipher_int = [(message_int[i] + key_int[i]) % 256 for i in range(len(message_int))]
    elif mode == 'decode':
        cipher_int = [(message_int[i] - key_int[i]) % 256 for i in range(len(message_int))]
    else:
        raise ValueError("Mode should be 'encode' or 'decode'.")

    cipher = ''.join([chr(i) for i in cipher_int])
    return cipher

def main(args=None):
    parser = argparse.ArgumentParser(description="Encode or decode a text using the Vigenère cipher.")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('-e', '--encode', action='store_true', help="Encode the text.")
    group.add_argument('-d', '--decode', action='store_true', help="Decode the text.")
    parser.add_argument('-k', '--key', type=str, required=True, help="The key for encoding or decoding.")
    parser.add_argument('text', type=str, help="The text to encode or decode.")

    args = parser.parse_args(args)

    try:
        mode = 'encode' if args.encode else 'decode'
        result = vigenere_cipher(args.text, args.key, mode)


        if mode == 'encode':
            print_formatted_text(HTML(f"<ansigreen>Encrypted text: {result}</ansigreen>"))
        else:
            print_formatted_text(HTML(f"<ansigreen>Decrypted text: {result}</ansigreen>"))
    except Exception as e:
        print_formatted_text(HTML(f"<ansired>Error: {str(e)}</ansired>"))

if __name__ == "__main__":
    main()
