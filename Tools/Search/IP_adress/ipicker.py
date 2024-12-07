import json, random, re, sys, urllib.request, subprocess, os
from tabulate import tabulate

R = '\033[91m'
Y = '\033[93m'
G = '\033[92m'
CY = '\033[96m'
W = '\033[97m'


def help_p():
    print("""
    Get information about a specific IP address of a machine or website.

    Note: This program requires an active internet connection to retrieve information.

    You can directly enter an IP address to get information or use 'myip' to display details of your own IP address.

    Available commands:

    xxxxx         : Details of the entered IP address.
    myip          : Display information about your system's IP address.
    help, --info  : Show program usage information.
    exit, quit    : Quit the program.
    cls, clear    : Clear the console screen.

    Please enter a valid IP address or use one of the above commands.
    """)


def start():
    print(CY + """
 _ ______ _       _                 
| (_____ (_)     | |                
| |_____) )  ____| |  _ _____  ____ 
| |  ____/ |/ ___) |_/ ) ___ |/ ___)
| | |    | ( (___|  _ (| ____| |    
|_|_|    |_|\____)_| \_)_____)_|   """ + Y + """MSI""" + G + """




             

IP Address information
""")


def clear_p():
    subprocess.run('cls' if os.name == 'nt' else 'clear', shell=True)
    start()


def exit_p():
    print(R + "Exiting..." + W)
    sys.exit()


def quit_p():
    print(R + "Quitting..." + W)
    sys.exit()


def get_user_input():
    command = str(input(CY + "$ " + CY)).lower()
    if command == "":
        print(R + "Invalid command")
        return get_user_input()
    return command


def is_valid_ip(ip):
    pattern = r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$'
    if re.match(pattern, ip):
        return True
    else:
        return False


def display_table(data):
    table = []
    for key, value in data.items():
        if value:
            table.append([key, value])
        else:
            table.append([key, "N/A"])

    headers = ["Key", "Value"] # ici
    table_format = random.choice(["grid", "plain", "simple", "github", "pipe", "orgtbl"])
    print(tabulate(table, headers=headers, tablefmt=table_format), "\n")


def get_system_ip():
    url = 'http://ip-api.com/json/'
    try:
        response = urllib.request.urlopen(url)
        data = json.load(response)
        display_table(data)
    except urllib.error.URLError:
        print(R + "\nError! " + Y + "Please check your internet connection!\n" + W)


def handle_command(command):
    if command == "myip":
        get_system_ip()
    elif is_valid_ip(command):
        url = 'http://ip-api.com/json/' + command
        try:
            response = urllib.request.urlopen(url)
            data = json.load(response)
            display_table(data)
        except KeyError:
            print(R + "\nError! Invalid IP/Website Address!\n" + W)
    else:
        print(R + "Invalid command or IP address !")


def main():
    try:
        start()
        while True:
            command = get_user_input()
            if command == "exit":
                exit_p()
            elif command == "quit":
                exit_p()
            elif command in ["cls", "clear"]:
                clear_p()
            elif command == "help":
                help_p()
            else:
                try:
                    handle_command(command)
                except urllib.error.URLError:
                    print(R + "\nError! " + Y + "Please check your internet connection!\n" + W)
                    continue
    except KeyboardInterrupt:
        print(R + "KeyboardInterrupt" + W)
        sys.exit()
    except EOFError:
        sys.exit()
    except Exception as e:
        print(R + str(e) + W)

if __name__ == '__main__':
    main()

