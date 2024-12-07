# CLI files
import subprocess  # pour exécuter les scripts d'autres langages
import os

# importer des programmes
from Display.CLI import Msi_help, pymatrix, Matrix_b

from Tools.Search import Phone_number, Wikipedia_api, Wikipedia_search
from Tools.Cryptography.CLI.Text import Cessar, Speak1337, leet1337, vigenere, Xor, Xor2

from Tools.Search.IP_adress import spyrod, ipicker
from Tools.components import cd

# fonctions pour executer les scripts des autres languages que python
def execute_script(file_name, file_type):
    try:
        # Vérification de l'existence du fichier
        if not os.path.exists(file_name):
            print(f"Error: '{file_name}' does not exist.") #mdf 
            return

        # Dictionnaire pour les commandes de compilation et d'exécution
        commands = {
            "bash": lambda: subprocess.run(["/bin/bash", file_name], check=True),
            "batch": lambda: subprocess.call(file_name, shell=True),
            "c": lambda: subprocess.call(f"gcc -o {file_name.split('.')[0]} {file_name}", shell=True),
            "cpp": lambda: subprocess.call(f"g++ -o {file_name.split('.')[0]} {file_name}", shell=True),
            "go": lambda: subprocess.call(f"go build -o {file_name.split('.')[0]} {file_name}", shell=True),
            "js": lambda: subprocess.run(["node", file_name], check=True),
        }

        if file_type in commands:
            # Compiler si nécessaire
            if file_type in ["c", "cpp", "go"]:
                compile_result = commands[file_type]()
                if compile_result != 0:
                    print(f"Erreur lors de la compilation du programme {file_type}.")
                    return
            
            # Exécuter le script
            if file_type in ["c", "cpp", "go"]:
                result = subprocess.call(f"./{file_name.split('.')[0]}", shell=True)
            else:
                result = commands[file_type]()
        else:
            print(f"Type de fichier non pris en charge : {file_type}")

    except subprocess.CalledProcessError as e:
        print(f"Erreur lors de l'exécution du script {file_type.capitalize()} : {e}")
    except Exception as e:
        print(f"Erreur : {e}")


# appellations des scripts
def Wikipedia():
    Wiki_pedia.main()

def xxor(args):
    xor_main(args)

def matrixN(): # is a CLI so in gui
    Matrix_a.matrix() #.run(args)

# Dictionnaire de commandes
dicts_commands_cli = { # il est possible de mettre espace dans une commande
    'msi --help': Msi_help.help_msi,
    'msi -h': Msi_help.help_msi,
    'msi --infos': Msi_help.help_msi,
    'msi -i': Msi_help.help_msi,
    'WikiPA': Wikipedia_api.main,
    'wikipedia_search': Wikipedia_search.main,
    'phone': Phone_number.main,
    'cessar': Cessar.main,
    'leet': leet1337.main,
    '1337': Speak1337.main,
    'xor': Xor.main,
    'xor2': Xor2.main,
    'viginere': vigenere.main,
    'spyrods': spyrod.main,
    'ipickers': ipicker.main,
    'cd': cd.main,
    'chdir': cd.main,
    
    # Commandes pour exécuter différents scripts
    'run_bash': lambda: execute_script("script.sh", "bash"),
    'run_batch': lambda: execute_script("script.bat", "batch"),
    'run_C': lambda: execute_script("script.c", "c"),
    'run_cpp': lambda: execute_script("script.cpp", "cpp"),
    'run_go': lambda: execute_script("script.go", "go"),
    'run_js': lambda: execute_script("script.js", "js"),
    
    
}

