import argparse
from prompt_toolkit import print_formatted_text
from prompt_toolkit.formatted_text import HTML

def xor_encrypt(plaintext, key):
    encrypted = ""
    key_length = len(key)
    
    for i in range(len(plaintext)):
        encrypted_char = chr(ord(plaintext[i]) ^ ord(key[i % key_length]))
        encrypted += encrypted_char
    
    return encrypted

def xor_decrypt(ciphertext, key):
    decrypted = ""
    key_length = len(key)
    
    for i in range(len(ciphertext)):
        decrypted_char = chr(ord(ciphertext[i]) ^ ord(key[i % key_length]))
        decrypted += decrypted_char
    
    return decrypted

def main(args=None):
    parser = argparse.ArgumentParser(description="Encrypt or decrypt a text using XOR cipher.")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('-e', '--encrypt', type=str, help="Encrypt the text.")
    group.add_argument('-d', '--decrypt', type=str, help="Decrypt the text.")
    parser.add_argument('-k', '--key', type=str, required=True, help="The key for encryption or decryption.")

    args = parser.parse_args(args)

    try:
        if args.encrypt:
            encrypted_text = xor_encrypt(args.encrypt, args.key)
            print_formatted_text(HTML(f"<ansigreen>Encrypted text: {encrypted_text}</ansigreen>"))
        elif args.decrypt:
            decrypted_text = xor_decrypt(args.decrypt, args.key)
            print_formatted_text(HTML(f"<ansigreen>Decrypted text: {decrypted_text}</ansigreen>"))
    except Exception as e:
        print_formatted_text(HTML(f"<ansired>Error: {str(e)}</ansired>"))

if __name__ == "__main__":
    main()
# les arguments sont spécifique en un endroit.
