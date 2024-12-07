import os, subprocess, sys, platform, time, random, getpass, datetime, shlex, functools, fnmatch, threading, concurrent.futures, asyncio, inspect, stat, shutil, re

from termcolor import colored
from os.path import join, isdir, isfile, splitext

from prompt_toolkit import PromptSession, print_formatted_text, HTML, prompt
from prompt_toolkit.auto_suggest import AutoSuggestFromHistory
from prompt_toolkit.history import FileHistory, InMemoryHistory
from prompt_toolkit.completion import Completer, Completion
from prompt_toolkit.key_binding import KeyBindings
from prompt_toolkit.formatted_text import HTML
from prompt_toolkit.shortcuts import prompt
from prompt_toolkit.filters import Condition
from prompt_toolkit.styles import Style

# importer les sous programmes
import CLI, GUI, WEB

from CLI import dicts_commands_cli
from GUI import dicts_commands_gui
from WEB import dicts_commands_web, open_web


class SystemCommandCompleter(Completer):
    def __init__(self, cli_commands, gui_commands, web_commands):
        self.cli_commands = cli_commands
        self.gui_commands = gui_commands
        self.web_commands = web_commands
        self.command_cache = None
        self.cache_lock = threading.Lock()
        self.executor = concurrent.futures.ThreadPoolExecutor(max_workers=4)

    def get_completions(self, document, complete_event):
        word_before_cursor = document.get_word_before_cursor(WORD=False)
        system_completions = self.get_system_completions(word_before_cursor)
        path_completions = self.get_path_completions(word_before_cursor)
        completions = system_completions + path_completions
        for completion in completions:
            yield Completion(completion, start_position=-len(word_before_cursor))

    def get_system_completions(self, word):
        # Récupérer toutes les commandes système et celles des dictionnaires
        if self.command_cache is None:
            with self.cache_lock:
                if self.command_cache is None:  # Double-checked locking
                    self.command_cache = self._collect_system_commands()

        # Ajouter les commandes des dictionnaires
        dictionary_commands = list(self.cli_commands.keys()) + \
                              list(self.gui_commands.keys()) + \
                              list(self.web_commands.keys())
        all_commands = self.command_cache.union(dictionary_commands)
        return [cmd for cmd in all_commands if cmd.startswith(word)]

    def _collect_system_commands(self):
        path_dirs = os.environ["PATH"].split(os.pathsep)
        system_commands = set()
        for path_dir in path_dirs:
            try:
                for filename in os.listdir(path_dir):
                    if os.access(os.path.join(path_dir, filename), os.X_OK):
                        system_commands.add(filename)
            except OSError:
                pass
        return system_commands

    @functools.lru_cache(maxsize=128)
    def get_path_completions(self, word):
        if not word:
            return []
        if word.startswith('~'):
            word = os.path.expanduser(word)
        dirname = os.path.dirname(word)
        if not dirname:
            dirname = '.'
        try:
            names = os.listdir(dirname)
        except OSError:
            return []
        completions = []
        for name in names:
            full_path = os.path.join(dirname, name)
            if fnmatch.fnmatch(name, f"{os.path.basename(word)}*"):
                if os.path.isdir(full_path):
                    name += os.sep
                completions.append(os.path.join(dirname, name))
        return completions

    async def update_command_cache(self):
        loop = asyncio.get_event_loop()
        with self.cache_lock:
            self.command_cache = await loop.run_in_executor(self.executor, self._collect_system_commands)


class MSI:
    def __init__(self):
        self.dicts_commands_cli = dicts_commands_cli
        self.dicts_commands_web = dicts_commands_web
        self.dicts_commands_gui = dicts_commands_gui
        self.enter_color, self.exit_color, self.color_text_prompt = self.color_terminal()
        self.home_directory = os.path.expanduser("~")
        self.history_file = os.path.join(self.home_directory, '.MSI_history_command')
        self.line_number = 1
        self.history = FileHistory(self.history_file)
        self.session = None
        self.system_name = platform.system()
        self.key_bindings = KeyBindings()
        self.symbol, self.msi_style, self.symbol1, self.symbol2, self.symbols_cmd_choice, self.symbols_cmd_choice2, self.symbols_cmd_choice3, self.styl_choice = self.random_symbol()
        self.prompt_style = random.choice([self.msi_style_prompt, self.msi_style_prompt_2, self.msi_style_prompt_3, self.msi_style_prompt_4, self.msi_style_prompt_5, self.msi_style_prompt_6, self.msi_style_prompt7, self.msi_style_prompt8, self.msi_style_prompt9, self.msi_style_prompt10, self.msi_style_prompt11, self.msi_style_prompt12, self.msi_style_prompt13, self.msi_style_prompt14, self.kali_linux_style_prompt, self.kali_linux_style_prompt_2, self.kali_linux_style_prompt_3, self.kali_linux_style_prompt_4, self.kali_linux_style_prompt_5, self.kali_linux_style_prompt_6])
        self.user_input_style = Style.from_dict({'': self.exit_color})
        self.history = InMemoryHistory()
        self.key_bindings = KeyBindings()
        self.complete_while_typing = False
        self.is_ghost = False
        self.completer = SystemCommandCompleter(
    cli_commands=self.dicts_commands_cli,
    gui_commands=self.dicts_commands_gui,
    web_commands=self.dicts_commands_web
    )

        @Condition
        def is_active():
            return datetime.datetime.now().second > 3

        @self.key_bindings.add('c-t', filter=is_active)
        def custom_key_binding(event):
            print_formatted_text(HTML(f'<{self.exit_color}>vous avez declencher ctrl + t</{self.exit_color}>'))
    
    def color_terminal(self):
        color = ["blue", "cyan", "green", "red", "yellow", "white"]
        enter_color = random.choice(color)
        exit_color = random.choice(color)
        list_color_text_prompt = ["Tan", "gray", "Silver"]
        color_text_prompt = random.choice(list_color_text_prompt)
        return enter_color, exit_color, color_text_prompt
    
    def toggle_complete_while_typing(self):
        self.complete_while_typing = not self.complete_while_typing
    
    def ghost(self):
        self.is_ghost = not self.is_ghost    
    

    # deux commandes dictionnaire sur meme lignrs ne fo,ctionne pas, sauf si une commande systeme est en premier posistion.
    # es autres dictionnaires ne sont pas inclus.
    
    def execute_command(self, command):
        try:
            # Séparation des commandes avec les opérateurs logiques
            command_parts = re.split(r'(&&|\|\||;)', command)
            command_parts = [part.strip() for part in command_parts if part.strip()]
    
            # Variables pour suivre l'état des commandes
            last_command_success = True
    
            # Parcourir les commandes et leurs opérateurs
            for i in range(0, len(command_parts), 2):
                cmd = command_parts[i]
                operator = command_parts[i+1] if i+1 < len(command_parts) else None
    
                # Vérifier les conditions d'exécution basées sur l'opérateur précédent
                if operator == '&&' and not last_command_success:
                    break
                if operator == '||' and last_command_success:
                    continue
    
                try:
                    # Vérifier d'abord si c'est une commande de dictionnaire CLI
                    cmd_name = cmd.split()[0]
                    cmd_args = cmd.split()[1:] if len(cmd.split()) > 1 else []
    
                    def execute_command_thread(cmd_name, cmd_args):
                        if cmd_name in self.dicts_commands_cli:
                            # Exécuter la commande du dictionnaire CLI
                            func = self.dicts_commands_cli[cmd_name]
                            if callable(func):
                                try:
                                     # Passer les arguments tels quels à la fonction
                                    result = func(cmd_args) if cmd_args else func()
                                    last_command_success = result is not None
                                except Exception as e:
                                    print(f"Erreur lors de l'exécution de '{cmd_name}': {e}")
                                    return False
                        else:
                            # Exécuter comme commande système
                            try:
                                process = subprocess.Popen(cmd, shell=True, universal_newlines=True)
                                stdout, stderr = process.communicate()
    
                                if stderr:
                                    print(f"Erreur ({cmd}): {stderr.strip()}")
                                    return False
                                
                                if stdout:
                                    print(stdout.strip())
                                
                                return process.returncode == 0
                            except Exception as cmd_error:
                                print(f"Erreur lors de l'exécution de '{cmd}': {cmd_error}")
                                return False
    
                    # Exécuter la commande dans un thread séparé
                    thread = threading.Thread(target=execute_command_thread, args=(cmd_name, cmd_args))
                    thread.start()
                    thread.join()  # Attendre la fin du thread

                    # Mise à jour du statut de la dernière commande
                    last_command_success = last_command_success
    
                except Exception as e:
                    print(f"Erreur lors de l'exécution de '{cmd}': {e}")
                    last_command_success = False
    
                # Arrêter si nécessaire selon l'opérateur
                if operator == '&&' and not last_command_success:
                    break
                if operator == '||' and last_command_success:
                    break
    
        except subprocess.CalledProcessError as e:
            print_formatted_text(HTML(f"<red>Error: {e.returncode}</red>"))
        except UnicodeDecodeError as e:
            print_formatted_text(HTML(f"<red>Error!</red>"))
        except Exception as e:
            print_formatted_text(HTML(f"<red>An unexpected error occurred: {e}</red>"))


    def locals_command(self, command):
        commands = {
        #"msi --help": self.help_msi,
        "msi": self.msg_logo,
        "history": self.show_history,
        "history -c": self.clear_history,
        
    }

        current_dir = os.getcwd()
        if command in commands:
            commands[command]()
        else:
            self.execute_command(command)

    def get_username(self): # os.environ.get("USER") or os.getenv("USERNAME")
        return os.environ.get("USER") or os.environ.get("USERNAME") or os.getenv("USER") or os.getenv("USERNAME")

    def get_hostname(self):
        return os.uname().nodename
    
    def random_symbol(self):
        symbols_cmd = ["\u0024", "\u2140"]
        symbols_cmd_choice = random.choice(symbols_cmd)
        
        symbols_cmd2 = ["\u25CB", "\u0024"] # chaque demarage
        symbols_cmd_choice2 = random.choice(symbols_cmd)
        
        symbols_cmd3 = ["\u2B22", "\U0001F1FA\U0001F1F8"]
        symbols_cmd_choice3 = random.choice(symbols_cmd3)
        
        styl = ["bg:#44475a", "underline", "bold"]
        styl_choice = random.choice(styl)
        
        symbols = ["\u256C", "\u2591", "\u2302", "\u25BC", "\u2194", "\u25BA", "\u2663", "\u2660", "\u25D8", "\u263C", "@", "\u2620", "\u0F92", "\u2718", "\u32E1", "\u0645\u062D\u0645\u0645\u065D", "!", "...", "--", "/", "\\", "\u2020", "\U0001F480", "\u262C", "\u2671", "\u07F7", "\u327E", "\u32ED", "\u319D","\u2623", "\u262A"]
        symbol = random.choice(symbols)
        
        msi_styles = ["i", "u", "blue", "red", "Purple", "DarkGray", "Chocolate"]
        msi_style = random.choice(msi_styles)
        
        symbols_1 = ["\u327F", "\u2671",  "\u07F7", "\u2328", "\u2318", "\u327E", "\u32ED", "\u319D", "\u2623"]
        symbols_2 = ["\U0001F480", "\u26C1",  "\u07F7", "\u2328", "\u2620", "\u2623", "─"]
        
        symbol1 = random.choice(symbols_1)
        symbol2 = random.choice(symbols_2)
       
        if symbol2 == "─":
            symbol1 = "\u327F"
            
        return symbol, msi_style, symbol1, symbol2, symbols_cmd_choice, symbols_cmd_choice2, symbols_cmd_choice3, styl_choice

    def show_history(self):
        with open(self.history_file, 'r') as history_file:
            for line in history_file:
                line = line.strip()
                if line and not line.startswith("# "):
                    if line.startswith("+"):
                        line = line[1:]
                    print(f"{self.line_number}. {line}")
                    self.line_number += 1
    
    def clear_history(self):
        if os.path.exists(self.history_file):
            os.remove(self.history_file)
            self.line_number = 1

    def msi_style_prompt(self):
        prompt_text = (f'<{self.exit_color}>{self.get_username()}</{self.exit_color}>'
            f'<white> {self.symbol}</white> <{self.msi_style}>MSI</{self.msi_style}> {self.symbols_cmd_choice} ')
        user_input = self.session.prompt(HTML(prompt_text)
        )
        return user_input
    
    def msi_style_prompt_2(self):
        prompt_text = [
            ('class:username', f'{self.get_username()}'),
            ('class:at', '@'),
            ('class:host', 'MSI'),
            ('class:path', ':~'),
            ('class:prompt', '# ')
        ]
        
        style = Style.from_dict({
            '':          '#00FF00 bold',
            'username': '#00FF00 bold',
            'at': '#00FF00 bold',
            'host': '#00FF00 bold',
            'path': '#00FF00 bold',
            'prompt': '#00FF00 bold',
            'input': '#00FF00 bold',
        })
        
        user_input = self.session.prompt(prompt_text, style=style)
        return user_input
    
    def msi_style_prompt_3(self):
        current_path = os.getcwd()
        path_components = current_path.split(os.path.sep)[-2:]
        simplified_path = os.path.sep.join(path_components)
        
        prompt_text = [
            ('class:username', 'MSI '),
            ('class:at',       '@ '),
            ('class:host', f'{self.get_username()}'),
            ('class:colon',    ':'),
            ('class:path',     simplified_path),
            ('class:pound',    ' $ '),
        ]
        
        style = Style.from_dict({
            '':          '#abb2bf',
            'username': '#61afef bold',
            'at':       '#abb2bf',
            'colon':    '#abb2bf',
            'pound':    '#61afef',
            'host':     '#e06c75 bg:#282c34',
            'path':     '#98c379 underline',
        })
        
        user_input = self.session.prompt(prompt_text, style=style)
        return user_input
    
    def msi_style_prompt_4(self):
        current_path = os.getcwd()
        path_components = current_path.split(os.path.sep)[-2:]
        simplified_path = os.path.sep.join(path_components)
        prompt_text = [
            ('class:username', 'MSI '),
            ('class:at',       '@ '),
            ('class:host', f'{self.get_username()}'),
            ('class:colon',    ':'),
            ('class:path',     simplified_path),
            ('class:pound',    ' $ '),
        ]
        
        style = Style.from_dict({
            '':          '#d0d0d0',
            'username': '#00afff',
            'at':       '#d0d0d0',
            'colon':    '#d0d0d0',
            'pound':    '#00afff',
            'host':     '#ffffff bg:#44475a',
            'path':     '#00d7af underline',
        })
        
        user_input = self.session.prompt(prompt_text, style=style)
        return user_input
    
    def msi_style_prompt_5(self):
        prompt_text = [
            ('class:username', f'{self.get_username()}'),
            ('class:prompt', '$ ')
        ]
        
        style = Style.from_dict({
            '':          '#FF0000 bold',
            'username': '#FF0000 bold',
            'prompt': '#FF0000 bold',
        })
        
        user_input = self.session.prompt(prompt_text, style=style)
        return user_input
        
    def msi_style_prompt_6(self):
        symbol_kali = "\u327F"
        times = (f'{datetime.datetime.now().strftime("%H:%M ")}')
        prompt_text = [
            ('class:segment', f'{symbol_kali}'),
            ('class:username', f'{self.get_username()}'),
            ('class:path',     f'{times}'),
        ]
        
        style = Style.from_dict({
            '':          f'#61AFEF {self.styl_choice}',
            'username': '#4EC9B0 bold',
            'time':     '#4EC9B0 bold',
            'segment':   '#61AFEF bold',
        })
        
        user_input = self.session.prompt(prompt_text, style=style)
        return user_input
    
    def msi_style_prompt7(self):
        symbols_cmd = ["MSI", "k", "", self.get_username()]
        symbols_cmd_choice = random.choice(symbols_cmd)
        prompt_text = (f'<{self.exit_color}>❮{symbols_cmd_choice}❯</{self.exit_color}>'
            f' ')
        user_input = self.session.prompt(HTML(prompt_text)
        )
        return user_input
    
    def msi_style_prompt8(self):
        prompt_text = (f'<{self.exit_color}>࿕</{self.exit_color}> ')
        user_input = self.session.prompt(HTML(prompt_text)
        )
        return user_input
    
    def msi_style_prompt9(self):
        prompt_text = (f'{self.symbols_cmd_choice3} ')
        user_input = self.session.prompt(prompt_text)
        return user_input

    def msi_style_prompt10(self):
        symbols_cmd = "\u0024"
        symbols_cmd_choice = random.choice(symbols_cmd)
        prompt_text = (f'{datetime.datetime.now().strftime("%H:%M ")}{symbols_cmd} ')
        user_input = self.session.prompt(prompt_text)
        return user_input
    
    def msi_style_prompt11(self):
        if self.exit_color == "white":
            self.exit_color = "cyan"
            
        current_path = os.getcwd()
        path_components = current_path.split(os.path.sep)[-2:]
        simplified_path = os.path.sep.join(path_components)
        
        prompt_text = (
            f'<i><{self.exit_color}>{self.get_username()}</{self.exit_color}>'
            f'<white> {simplified_path}</white> <{self.exit_color}>MSI</{self.exit_color}></i> {self.symbols_cmd_choice} '
        )
        user_input = self.session.prompt(
            HTML(prompt_text),
            style=self.user_input_style
            )
        return user_input
        
    def msi_style_prompt12(self):
        prompt_text = (
            f'<i><{self.color_text_prompt }>{self.get_username()}'
            f'[msi</{self.color_text_prompt }><yellow>●</yellow><white>●</white><cyan>●</cyan><{self.color_text_prompt }>]</{self.color_text_prompt }></i> {self.symbols_cmd_choice} '
        )
    
        user_input = self.session.prompt(
            HTML(prompt_text),
            style=self.user_input_style
        )
        return user_input
    
    def msi_style_prompt13(self):
        times = (f'{datetime.datetime.now().strftime("%H:%M:%S ")}')
        prompt_text = (
            f'<i><{self.exit_color}>{times}</{self.exit_color}>'
            f'<white> ㉿ </white>MSI</i> {self.symbols_cmd_choice} '
        )
        
        user_input = self.session.prompt(
            HTML(prompt_text),
            style=self.user_input_style
        )
        return user_input
    
    def msi_style_prompt14(self):
        prompt_text = f'<yellow>●</yellow><white> ● </white><cyan>●</cyan> '
        user_input = self.session.prompt(
            HTML(prompt_text),
            style=self.user_input_style
        )
        return user_input
    
    def kali_linux_style_prompt(self):
        kali = (f"┌{self.symbol2}──({self.get_username()} {self.symbol1} MSI)-[~]\n└─{self.symbols_cmd_choice} ")
        user_input = self.session.prompt(kali)
        return user_input
    
    def kali_linux_style_prompt_2(self):
        current_path = os.getcwd()
        path_components = current_path.split(os.path.sep)[-2:]
        simplified_path = os.path.sep.join(path_components)
        prompt_text = [
            ('class:prompt_symbol', '┌─❯ '),
            ('class:username', f'({self.get_username()} MSI)'),
            ('class:delimiter', '-'),
            ('class:prompt_symbol', f'[~{simplified_path}]\n└─ '),
            ('class:cmd_symbol', '$ '),
        ]
        
        style = Style.from_dict({
            '': '#abb2bf',
            'prompt_symbol': '#61afef bold',
            'username': '#00FF00 bg:#282c34',
            'cmd_symbol': '#61afef bold',
            'delimiter': '#abb2bf',
        })
        
        user_input = self.session.prompt(prompt_text, style=style)
        return user_input
    
    def kali_linux_style_prompt_3(self):
        times = (f'{datetime.datetime.now().strftime("%H:%M:%S ")}')        
        prompt_text = [
                ('class:username', f'{self.get_username()}㉿msi'),
                ('class:path', f' '*60), #nnuméros
                ('class:at', f'{times}\n')
            ]
        
        style = Style.from_dict({
            '': '#808080',
            'username': '#808080 italic',
            'at':'#808080 italic'
        })
        
        user_input = self.session.prompt(prompt_text, style=style)
        return user_input
        
    def kali_linux_style_prompt_4(self):
        prompt_text = []
        style = Style.from_dict({
            '': '#808080 italic',
            
        })
        
        user_input = self.session.prompt(prompt_text, style=style)
        return user_input

    def kali_linux_style_prompt_5(self):
        current_path = os.getcwd()
        path_components = current_path.split(os.path.sep)[-2:]
        simplified_path = os.path.sep.join(path_components)
        symbols_cmd2 = ["モ","尺","匕","ㄗ","丹","ち","下"] # chaque commande
        symbols_cmd_choice2 = random.choice(symbols_cmd2)
        prompt_text = (f"┌─({self.get_username()} {symbols_cmd_choice2} ...{simplified_path}){'─'*10}(~)─┐\n"
                       f"└─({os.getpid()};{datetime.datetime.now().strftime('%H:%M')})──o ")
        user_input = self.session.prompt(prompt_text)
        return user_input

    def kali_linux_style_prompt_6(self):
        symbols_cmd2 = ["モ","尺","匕","ㄗ","丹","ち","下"] # chaque commande
        symbols_cmd_choice2 = random.choice(symbols_cmd2)
        prompt_text = (f"╭─{self.__class__.__name__} {symbols_cmd_choice2} {self.get_username()}  [{datetime.datetime.now().strftime('%H:%M')}]\n"
               f"╰─{self.symbols_cmd_choice} ")

        user_input = self.session.prompt(prompt_text)
        return user_input
    
    def configure_prompt(self):
        self.history = FileHistory(self.history_file)
        if self.is_ghost:
            self.session = PromptSession(
                is_password=True,
                key_bindings=self.key_bindings,
                style=self.user_input_style
            )
        else:
            if self.session:
                self.session.app.reset()
            self.session = PromptSession(
                history=self.history,
                auto_suggest=AutoSuggestFromHistory(),
                completer=self.completer,
                complete_while_typing=self.complete_while_typing,
                complete_in_thread=True,
                wrap_lines=True,
                key_bindings=self.key_bindings,
                style=self.user_input_style
            )

    async def background_task(self):
        while True:
            await self.completer.update_command_cache()
            await asyncio.sleep(300)  # Rafraîchir toutes les 5 minutes
    
    def run_command(self, command):
        # Analyser la commande et les arguments
        parts = shlex.split(command)
        if not parts:
            return
    
        cmd = parts[0]
        args = parts[1:]
    
        # Trouver les commandes avec des espaces dans le dictionnaire
        command_with_space = ' '.join(parts[:2])
        remaining_args = parts[2:]
    
        # Fonction pour exécuter des commandes et gérer les exceptions
        def execute_function(func, *args):
            try:
                if callable(func):
                    if args:
                        # Transmet les arguments en tant que liste à la fonction 'main'
                        func(list(args))
                    else:
                        func()
                else:
                    print_formatted_text(HTML(f"<red>Error: The function is not callable</red>"))
            except KeyboardInterrupt:
                print_formatted_text(HTML(f"<red>KeyboardInterrupt</red>"))
            except (EOFError, SystemExit):
                pass
            except Exception as e:
                print_formatted_text(HTML(f"<red>{e}</red>"))
                
        # Vérification des commandes
        function_name_web = getattr(WEB, cmd, None)
        function_name_gui = getattr(GUI, cmd, None)
        function_name_cli = getattr(CLI, cmd.split()[0], None)
    
        if function_name_web:
            threading.Thread(target=execute_function, args=(function_name_web,)).start()
        elif function_name_gui:
            threading.Thread(target=execute_function, args=(function_name_gui,)).start()
        elif command_with_space in self.dicts_commands_cli:
            execute_function(self.dicts_commands_cli[command_with_space], *remaining_args)
        elif command_with_space in self.dicts_commands_web:
            open_web(command_with_space)
        elif cmd in self.dicts_commands_web:
            open_web(cmd)
        elif cmd in self.dicts_commands_cli:
            execute_function(self.dicts_commands_cli[cmd], *args)
        elif cmd in self.dicts_commands_gui:
            execute_function(self.dicts_commands_gui[cmd], *args) #avec ou sans argument
        else:
            self.locals_command(command)
    
    def run(self):
        self.msg_logo()
        self.configure_prompt()
        try:
            loop = asyncio.get_running_loop()  # Vérifie s'il y a déjà une boucle en cours
        except RuntimeError:  # S'il n'y a pas de boucle, on en crée une nouvelle
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)        
        # Crée et lance la tâche asynchrone
        background_task = loop.create_task(self.background_task())
        running = True
        try:
            while running:
                try:
                    user_input = self.prompt_style()
                    if user_input == "complete_typing":
                        self.toggle_complete_while_typing()
                        self.configure_prompt()
                    elif user_input == "ghost":
                        self.ghost()
                        self.configure_prompt()
                    elif user_input.lower() in ("exit", "quit"):
                        print_formatted_text(HTML("<red>Exiting...</red>"))
                        running = False  # Arrête la boucle et termine le programme
                    else:
                        self.run_command(user_input)  # Appel de la fonction run_command()
                except KeyboardInterrupt:
                    print_formatted_text(HTML("<red>KeyboardInterrupt</red>"))
                    running = False
                except EOFError:
                    running = False
                except IndexError:
                    pass
                except Exception as e:
                    print_formatted_text(HTML(f"<red>{e}</red>"))
        finally:
            background_task.cancel()  # Annule la tâche de mise à jour en arrière-plan
            try:
                loop.run_until_complete(background_task)
            except asyncio.CancelledError:
                pass  # Ignore les erreurs d'annulation
        sys.exit()

    def msg_logo(self):
            self.color_terminal()
            self.enter_color, self.exit_color, self.color_text_prompt = self.color_terminal()
            self.user_input_style = Style.from_dict({
                '': self.exit_color,
            })
            self.symbol, self.msi_style, self.symbol1, self.symbol2, self.symbols_cmd_choice, self.symbols_cmd_choice2, self.symbols_cmd_choice3, self.styl_choice = self.random_symbol()
            self.prompt_style = random.choice([self.msi_style_prompt, self.msi_style_prompt_2, self.msi_style_prompt_3, self.msi_style_prompt_4, self.msi_style_prompt_5, self.msi_style_prompt_6, self.msi_style_prompt7, self.msi_style_prompt8, self.msi_style_prompt9, self.msi_style_prompt10, self.msi_style_prompt11, self.msi_style_prompt12, self.msi_style_prompt13, self.msi_style_prompt14, self.kali_linux_style_prompt, self.kali_linux_style_prompt_2, self.kali_linux_style_prompt_3, self.kali_linux_style_prompt_4, self.kali_linux_style_prompt_5, self.kali_linux_style_prompt_6])
            print("\n" *3, colored("{} M S I".format(32 * " "), self.exit_color, attrs=["blink", "bold"]), "\n"*16)
            getpass.getpass(colored("msi [--help] [--infos] ...", self.exit_color)); print("")


if __name__ == '__main__':
    msi = MSI()
    msi.run()
