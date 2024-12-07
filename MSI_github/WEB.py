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
    'tetris3': 'Games/WEB/Tetris3/tetris.html',
    'pingpong': 'Games/WEB/Pingpong/index.html',
    'trex': 'Games/WEB/Trex/index.html',
    'tic_tac_toe2': 'Games/WEB/Tic_Tac_Toe2/index.html',
    'tetris2': 'Games/WEB/tetris2/index.html',
    'tennis': 'Games/WEB/Tennis/TennisGame.html',
    'tic_tac_toe': 'Games/WEB/tic_tac_toe/index.html',
    'snake6': 'Games/WEB/snake6/snakegame.html',
    'snake_ladder': 'Games/WEB/snake_ladder/index.html',
    'snake5': 'Games/WEB/snake5/index.html',
    'snake2': 'Games/WEB/Snake2/index.html',
    'snake3': 'Games/WEB/snake3/index.html',
    'simon': 'Games/WEB/Simon/index.html',
    'shooter': 'Games/WEB/Shoter/index.html',
    'sandbox': 'Games/WEB/Sandbox/index.html',
    'rock_paper_scissor': 'Games/WEB/RockPaperScissor/index.html',
    'snake': 'Games/WEB/snake/index.html',
    'pipe': 'Games/WEB/Pipe/index.html',
    'pig': 'Games/WEB/pig/index.html',
    'pacman': 'Games/WEB/pacman/index.html',
    'memory': 'Games/WEB/Memory/index.html',
    'ludo4': 'Games/WEB/ludo4/Ludo-game.html',
    'ludo3': 'Games/WEB/ludo3/index.html',
    'ludo2': 'Games/WEB/ludo2/index.html',
    'ludo1': 'Games/WEB/ludo1/index.html',
    'jumper': 'Games/WEB/Jumper/index.html',
    'hangman': 'Games/WEB/hangman/index.html',
    'game_2012': 'Games/WEB/game_2012/index.html',
    'ping_pong': 'Games/WEB/ping_pong/index.html',
    'flappy_bird': 'Games/WEB/Flappy_Bird/index.html',
    'tetris': 'Games/WEB/tetris/index.html',
    'tilting_maze': 'Games/WEB/tilting_maze/index.html',
    'maze': 'Games/WEB/maze/index.html',
    'building_a_fruit_slicer': 'Games/WEB/building_a_fruit_slicer/index.html',
    'alien_invasion_master': 'Games/WEB/AlienInvasion_master/index.html',
    'create_a_crossy_road': 'Games/WEB/create_a_crossy_road/index.html',
    'collector': 'Games/WEB/Collector/index.html',

    # Display/WEB
    'render_basic': 'Display/WEB/Render_Basic/index.html',
    'render_basic2': 'Display/WEB/Render_Basic2/index.html',
    'analog_and_digital_clock': 'Display/WEB/Analog_and_Digital_clock/index.html',
    'animated_digital_clock': 'Display/WEB/Animated_Digital_Clock/index.html',
    'animated_polygon_animals': 'Display/WEB/Animated_Polygon_Animals/index.html',
    'animation': 'Display/WEB/Animation/index.html',
    'card': 'Display/WEB/Card/index.html',
    'ball': 'Display/WEB/Ball/index.html',
    'animation_hover_effect': 'Display/WEB/Animation_hover_effact/index.html',
    'fan': 'Display/WEB/Fan/index.html',
    'walking_dog': 'Display/WEB/Walking_Dog/index.html',
    'lego_minifigure_maker': 'Display/WEB/LEGO_Minifigure_Maker/index.html',
    'digital_analog_clock': 'Display/WEB/Digital_analog_Clock/index.html',
    'donut': 'Display/WEB/Donut/index.html',
    'draggable_voronoi_circle': 'Display/WEB/Draggable_Voronoi_Circle/index.html',
    'fish_flocking_simulation': 'Display/WEB/Fish_Flocking_Simulation/index.html',
    'matrix1': 'Display/WEB/Matrix1/index.html',
    'particle_effect': 'Display/WEB/Particle_Effect/index.html',
    'smiley_face_effect': 'Display/WEB/Smiley_Face_Effect/index.html',
    'solar_system': 'Display/WEB/Solar_System/index.html',
    'solar_system_master': 'Display/WEB/Solar_System_master/index.html',
    'time': 'Display/WEB/TIME/index.html',
    'player -video': "Player_video/Index.html"
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


