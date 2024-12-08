# Web files

import http.server
import socketserver
import threading
import webbrowser
import os

class QuietHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass  # Supprime les messages de log

class HTMLServer:
    def __init__(self, port):
        self.port = port
        self.handler = QuietHTTPRequestHandler
        self.httpd = None

    def start_server(self, file_path):
        try:
            with socketserver.TCPServer(("", self.port), self.handler) as httpd:
                self.httpd = httpd
                print(f"Serving at port: {self.port}")
                webbrowser.open(f'http://localhost:{self.port}/{file_path}')
                httpd.serve_forever()
        except OSError as e:
            if e.errno == 98:  # Address already in use
                self.port = self.find_free_port()
                self.start_server(file_path)
            else:
                raise e

    def stop_server(self):
        if self.httpd:
            self.httpd.shutdown()
            self.httpd.server_close()

    def find_free_port(self):
        with socketserver.TCPServer(("", 0), self.handler) as s:
            return s.server_address[1]

servers = {}

def open_html_file(file_path, command):
    if not os.path.isfile(file_path):
        print(f"File {file_path} does not exist.") # md or su
        return

    if file_path in servers:
        print(f"Server for '{command}' is already running.") # md or su
        pass # return pour ne pas lancer meme programme deux fois

    port = HTMLServer(8000).find_free_port()
    server = HTMLServer(port)

    server_thread = threading.Thread(target=server.start_server, args=(file_path,))
    server_thread.daemon = True
    server_thread.start()

    servers[file_path] = server
    print(f"Opening '{command}' in browser...") # md or su

# importer des programme !

# Dictionnaire de commandes pour le programme web
dicts_commands_web = {
    # Games/WEB
    'snake': 'Games/WEB/snake/index.html',
    'tetris': 'Games/WEB/tetris/index.html',
    'alien_invasion_master': 'Games/WEB/AlienInvasion_master/index.html',

    # Display/WEB
    'ball': 'Display/WEB/Ball/index.html',
    'fish_flocking_simulation': 'Display/WEB/Fish_Flocking_Simulation/index.html',
    'particle_effect': 'Display/WEB/Particle_Effect/index.html',
    
}


def Collector():
    open_html_file('Games/WEB/Collector/index.html')

# lancer des programmes
def open_web(command):
    file_path = dicts_commands_web.get(command)
    if file_path:

        try:
            open_html_file(file_path, command)  # Appelle la fonction définie en haut
        except Exception as e:
            print(f"Error: {e}")
    else:
        print(f"Error: '{command}' invalid")


