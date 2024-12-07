import os, sys, platform, argparse, textwrap

# Fonction pour obtenir les séparateurs de chemin en fonction du système
def get_path_separator():
    if os.name == 'nt':  # Windows
        return '\\'
    return '/'  # Linux ou macOS

# Fonction pour traiter le changement de répertoire
def change_directory(path, use_physical=False, use_extended=False, exit_on_failure=False):
    """
    Change le répertoire de travail et affiche le nouveau répertoire.
    """
    try:
        # Si aucun argument n'est donné (juste "cd"), afficher le répertoire actuel
        if not path:
            if platform.system() == 'Windows':  # Vérifie si le système est Windows
                print(os.getcwd())  # Afficher le répertoire actuel
            else:
                path = os.path.expanduser("~")  # Aller au répertoire utilisateur (Unix/Linux/Mac)
                os.chdir(path)  # Changer effectivement de répertoire
                print(os.getcwd())  # Afficher le nouveau répertoire
            return

        
        # Si l'option /? est utilisée, afficher l'aide
        if os.name == 'nt' and path == "/?":
            print_help()
            return

        # Si le chemin est seulement "\", se rendre à la racine du lecteur actuel (Windows uniquement)
        if path == "\\" and os.name == 'nt':
            current_drive = os.getcwd().split(":")[0] + ":"
            path = current_drive + "\\"

        """if os.name == 'nt' and path == "\\":  # Gère la racine du lecteur sur Windows
            current_drive = os.path.splitdrive(os.getcwd())[0]
            path = current_drive + "\\"
            """
        # Si l'option `-` est utilisée, revenir au répertoire précédent
        if path == "-":
            path = os.environ.get("OLDPWD")
            if not path:
                print("Error: No previous directory found.", file=sys.stderr)
                sys.exit(1)
        elif path == "~":
            path = os.path.expanduser("~")

        # Pour Windows, s'assurer que les barres sont inversées
        if os.name == 'nt':
            path = path.replace("/", "\\")
            # Si le chemin commence par "/d", changer de lecteur et de répertoire
            if path.startswith("\\d") or path.startswith("\\D"):
                drive_letter = path[2:3].upper()  # Extraire la lettre du lecteur
                path = path[3:].strip()  # Extraire le chemin sans la lettre du lecteur
                os.chdir(f"{drive_letter}:\\{path}")  # Changer de lecteur et répertoire
                print(f"Changed to {os.getcwd()}")  # Afficher le nouveau répertoire
                return
        else:
            # Sur Linux, remplacer les \ par des / pour les chemins relatifs
            path = path.replace("\\", "/")
        
        # Résoudre les liens symboliques selon les options
        if use_physical:
            path = os.path.realpath(path)
        else:
            path = os.path.abspath(os.path.normpath(path))

        # Tenter de changer de répertoire
        os.chdir(path)

        # Mise à jour des variables d'environnement pour PWD et OLDPWD
        os.environ["OLDPWD"] = os.environ.get("PWD", os.getcwd())
        os.environ["PWD"] = os.getcwd()

        # Affichage du répertoire actuel après le changement
        print(os.getcwd())

    except FileNotFoundError:
        print(f"Error: Directory '{path}' does not exist.", file=sys.stderr)
        sys.exit(1)
    except PermissionError:
        print(f"Error: Permission denied for accessing '{path}'.", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error: Unexpected issue: {str(e)}", file=sys.stderr)
        sys.exit(1)

def print_help():
    help_text =textwrap.dedent(r"""
    Displays the name of or changes the current directory.

    CHDIR [drive:][path]
    CHDIR[..]
    CD [drive:][path]
    CD[..]
    
        ..  Specifies that you want to change to the parent directory.
    
    Type CD drive: to display the current directory in the specified drive.
    Type CD without parameters to display the current drive and directory.
    
    Use the /D switch to change current drive in addition to changing current
    directory for a drive.
    
    If Command Extensions are enabled, the CHDIR command:
      - Does not treat spaces as delimiters, so it is possible to CD into a
        subdirectory name that contains a space without surrounding
        the name with quotes. For example:
    
            cd \winnt\profiles\username\programs\start menu
    
        is the same as:
    
            cd "\winnt\profiles\username\programs\start menu"
    
      - Supports the use of the double-dot syntax to move up one directory level:
    
            cd ..
    """)
    print(help_text)

def main(args=None):
    parser = argparse.ArgumentParser(
    prog='cd',
    formatter_class=argparse.RawDescriptionHelpFormatter,
    description=textwrap.dedent("""    Change the shell working directory.
  
    Change the current directory to DIR.  The default DIR is the value of the
    HOME shell variable. If DIR is "-", it is converted to $OLDPWD.

    The variable CDPATH defines the search path for the directory containing
    DIR.  Alternative directory names in CDPATH are separated by a colon (:).
    A null directory name is the same as the current directory.  If DIR begins
    with a slash (/), then CDPATH is not used.

    If the directory is not found, and the shell option `cdable_vars' is set,
    the word is assumed to be  a variable name.  If that variable has a value,
    its value is used for DIR."""),
    epilog=textwrap.dedent('''\
    The default is to follow symbolic links, as if `-L' were specified.
    `..' is processed by removing the immediately previous pathname component
    back to a slash or the beginning of DIR.

    Exit Status:
    Returns 0 if the directory is changed, and if $PWD is set successfully when
    -P is used; non-zero otherwise.
    
    [Mif Merlin (MSI)]
        ''')
    )
    parser.add_argument(
        "path",
        nargs=argparse.REMAINDER,  # Collect all remaining arguments as part of the path
        help="Change the shell working director",
    )
    
    parser.add_argument(
        "-L", "--logical",
        action="store_true",
        help="Force symbolic links to be followed: resolve symbolic links in DIR after processing instances of `..`",
    )
    parser.add_argument(
        "-P", "--physical",
        action="store_true",
        help="Use the physical directory structure without following symbolic links: resolve symbolic links in DIR before processing instances of `..`",
    )
    parser.add_argument(
        "-e", "--exit-on-failure",
        action="store_true",
        help="If -P is supplied and the current working directory cannot be determined, exit with a non-zero status.",
    )
    parser.add_argument(
        "-@", "--extended-attributes",
        action="store_true",
        help="On systems that support it, present a file with extended attributes as a directory containing the file attributes.",
    )

    args = parser.parse_args(args)

    # Combine all path arguments into a single string and clean spaces
    raw_path = " ".join(args.path).strip() if args.path else ""
    
    # Si l'option -P est activée, utiliser la structure physique
    if args.physical:
        raw_path = os.path.realpath(raw_path)

    # Si l'option -L est activée, suivre les liens symboliques (comportement par défaut)
    if args.logical:
        # On peut explicitement indiquer qu'on suit les liens symboliques, mais c'est déjà par défaut.
        pass

    # Si l'option -@ est activée, afficher les attributs étendus (cela peut être complexe à implémenter selon l'OS)
    # Gestion des attributs étendus
    if args.extended_attributes:
        if os.name == "posix":
            print("Extended attributes are currently not implemented.")
        else:
            print("Extended attributes are not supported on this platform.")

    # Changer de répertoire avec ou sans gestion stricte des erreurs
    try:
        change_directory(raw_path, use_physical=args.physical)
    except Exception as e:
        # Si l'option -e est activée, gérer les erreurs avec une sortie non-zéro
        if args.exit_on_failure:
            sys.exit(1)  # Quitter immédiatement
        else:
            print(f"Warning: {str(e)}", file=sys.stderr)

if __name__ == "__main__":
    main()

