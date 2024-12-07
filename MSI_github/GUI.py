# GUI files

import subprocess
import os


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

def clock():
    Clock_d.run()

dicts_commands_gui = {
    #"command": script.run,
    
    # Commandes pour exécuter différents scripts
    'bas': lambda: execute_script("blagues.sh", "bash"),
    'batch': lambda: execute_script("blagues.bat", "batch"),
    'sad': lambda: execute_script("blagues.c", "c"),
    'run_cpp': lambda: execute_script("path/to/blagues.cpp", "cpp"),
    'run_go': lambda: execute_script("path/to/blagues.go", "go"),
    'run_js': lambda: execute_script("path/to/blagues.js", "js")
}


