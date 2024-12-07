import argparse
from hashlib import sha256, md5, sha224, sha512, sha1
from prompt_toolkit import print_formatted_text
from prompt_toolkit.formatted_text import HTML

def generate_key(key):
    keys1 = sha256(key.encode('ascii')).hexdigest()
    keys2 = md5(key.encode('ascii')).hexdigest()
    keys3 = sha224(key.encode('ascii')).hexdigest()
    keys4 = sha512(key.encode('ascii')).hexdigest()
    keys5 = sha1(key.encode('ascii')).hexdigest()

    keys = keys1 + keys2 + keys3 + keys4 + keys5
    keys += keys4 + keys3 + keys2 + keys1 + keys
    return keys

def xor_strings(bin_message, bin_key):
    return ''.join('0' if bit_m == bit_k else '1' for bit_m, bit_k in zip(bin_message, bin_key))

def encode(message, key):
    keys = generate_key(key)
    message_bin = '0' + bin(int.from_bytes(message.encode(), 'big'))[2:]
    key_bin = '0' + bin(int.from_bytes(keys.encode(), 'big'))[2:]

    if len(message_bin) > len(key_bin):
        raise ValueError("Key is too short for the text, please use a longer key.")

    encrypted_bin = xor_strings(message_bin, key_bin[:len(message_bin)])
    return encrypted_bin

def decode(encrypted_message, key):
    keys = generate_key(key)
    key_bin = '0' + bin(int.from_bytes(keys.encode(), 'big'))[2:]

    if len(encrypted_message) > len(key_bin):
        raise ValueError("Key is too short for the encrypted text, please use a longer key.")

    decrypted_bin = xor_strings(encrypted_message, key_bin[:len(encrypted_message)])
    binary_int = int(decrypted_bin, 2)
    byte_number = (binary_int.bit_length() + 7) // 8
    decrypted_message = binary_int.to_bytes(byte_number, "big").decode()
    return decrypted_message

def main(args=None):
    parser = argparse.ArgumentParser(description="Encrypt or decrypt a text using a custom XOR cipher with hashed keys.")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('-e', '--encode', type=str, help="Message to encode")
    group.add_argument('-d', '--decode', type=str, help="Message to decode")
    parser.add_argument('-k', '--key', type=str, required=True, help="Key for encryption/decryption")

    args = parser.parse_args(args)

    try:
        if args.encode:
            encrypted_message = encode(args.encode, args.key)
            print_formatted_text(HTML(f"<ansigreen>Encrypted text: {encrypted_message}</ansigreen>"))
        elif args.decode:
            decrypted_message = decode(args.decode, args.key)
            print_formatted_text(HTML(f"<ansigreen>Decrypted text: {decrypted_message}</ansigreen>"))
    except ValueError as e:
        print(f'Error: {e}')
    except Exception as e:
        print(f'An unexpected error occurred: {e}')

if __name__ == '__main__':
    main()

# les arguments sont spécifique en un endroit.

