import pygame
import sys
import random
import math

# Initialize Pygame
pygame.init()

# Game parameters
width, height = 600, 400
tile_size = 10
speed = 15

# Colors
white = (255, 255, 255)
black = (0, 0, 0)
green = (0, 255, 0)
red = (255, 0, 0)
blue = (0, 0, 255)
yellow = (255, 255, 0)
cyan = (0, 255, 255)

# Define the Snake class
class Snake:
    def __init__(self):
        self.length = 1
        self.body = [(width // 2, height // 2)]
        self.direction = (1, 0)

    def move(self):
        x, y = self.body[0]
        dx, dy = self.direction
        new_x, new_y = x + dx * tile_size, y + dy * tile_size

        # Ensure the snake appears on the other side if it goes beyond the edges
        new_x = new_x % width
        new_y = new_y % height

        self.body.insert(0, (new_x, new_y))
        if len(self.body) > self.length:
            self.body.pop()

    def change_direction(self, new_direction):
        if (new_direction[0], new_direction[1]) != (-self.direction[0], -self.direction[1]):
            self.direction = new_direction

    def eat_apple(self, apple_position):
        return self.body[0] == apple_position

    def display(self, surface):
        for segment in self.body:
            pygame.draw.rect(surface, green, (segment[0], segment[1], tile_size, tile_size))

    def auto_collision(self):
        return self.body[0] in self.body[1:]

# Define the Apple class
class Apple:
    def __init__(self):
        self.position = (0, 0)
        self.generate()
        self.shape = 0  # Variable to track the current shape of the apple
        self.possible_shapes = [
            'circle',
            'triangle',
            'square',
            'diamond',
            'pentagon',
            'hexagon',
            'star',
            'cross',
            'anchor',
            'heart',
            'octagon',
            'lightning',
            'inverted_star',
            'checkerboard',
            'flower',
            'moon',
            'rainbow',
            'spark',
            'corn',
            'sword',
        ]

    def generate(self):
        self.position = (random.randint(0, (width - tile_size) // tile_size) * tile_size,
                         random.randint(0, (height - tile_size) // tile_size) * tile_size)

    def change_shape(self):
        self.shape = (self.shape + 1) % len(self.possible_shapes)
        if self.shape == 0:  # If shape loops back to 0, increment the level
            self.level += 1
            
    def display(self, surface):
        color = (255, 0, 0)  # Default color
        shape = self.possible_shapes[self.shape]

        if shape == 'circle':
            pygame.draw.circle(surface, blue, (self.position[0] + tile_size // 2, self.position[1] + tile_size // 2), tile_size // 2)
        elif shape == 'triangle':
            pygame.draw.polygon(surface, blue, [(self.position[0], self.position[1] + tile_size),
                                                   (self.position[0] + tile_size, self.position[1] + tile_size),
                                                   (self.position[0] + tile_size // 2, self.position[1])])
        elif shape == 'square':
            pygame.draw.rect(surface, blue, (self.position[0], self.position[1], tile_size, tile_size))
        elif forme == 'diamond':
            pygame.draw.polygon(surface, blue, [(self.position[0] + tile_size // 2, self.position[1]),
                                                   (self.position[0] + tile_size, self.position[1] + tile_size // 2),
                                                   (self.position[0] + tile_size // 2, self.position[1] + tile_size),
                                                   (self.position[0], self.position[1] + tile_size // 2)])
        elif shape == 'pentagon':
            angle = 360 / 5
            pentagon_points = [(self.position[0] + tile_size // 2 + int(tile_size / 2 * math.cos(math.radians(i * angle))),
                                self.position[1] + tile_size // 2 + int(tile_size / 2 * math.sin(math.radians(i * angle))))
                               for i in range(5)]
            pygame.draw.polygon(surface, blue, pentagon_points)
        elif shape == 'hexagon':
            angle = 360 / 6
            hexagon_points = [(self.position[0] + tile_size // 2 + int(tile_size / 2 * math.cos(math.radians(i * angle))),
                               self.position[1] + tile_size // 2 + int(tile_size / 2 * math.sin(math.radians(i * angle))))
                              for i in range(6)]
            pygame.draw.polygon(surface, yellow, hexagon_points)
        elif shape == 'star':
            star_points = [(self.position[0] + tile_size // 2, self.position[1]),
                           (self.position[0] + 2 * tile_size // 3, self.position[1] + tile_size),
                           (self.position[0], self.position[1] + 2 * tile_size // 3),
                           (self.position[0] + tile_size, self.position[1] + 2 * tile_size // 3),
                           (self.position[0] + 1 * tile_size // 3, self.position[1] + tile_size),
                           ]
            pygame.draw.polygon(surface, yellow, star_points)
        elif shape == 'cross':
            pygame.draw.line(surface, yellow, (self.position[0], self.position[1] + tile_size // 2),
                             (self.position[0] + tile_size, self.position[1] + tile_size // 2), 3)
            pygame.draw.line(surface, couleur, (self.position[0] + tile_size // 2, self.position[1]),
                             (self.position[0] + tile_size // 2, self.position[1] + tile_size), 3)
        elif shape == 'anchor':
            pygame.draw.line(surface, yellow, (self.position[0] + tile_size // 2, self.position[1]),
                             (self.position[0] + tile_size // 2, self.position[1] + tile_size), 5)
            pygame.draw.line(surface, couleur, (self.position[0], self.position[1] + tile_size // 2),
                             (self.position[0] + tile_size, self.position[1] + tile_size // 2), 5)
            pygame.draw.polygon(surface, yellow, [(self.position[0] + tile_size // 4, self.position[1] + 3 * tile_size // 4),
                                                   (self.position[0] + 3 * tile_size // 4, self.position[1] + 3 * tile_size // 4),
                                                   (self.position[0] + tile_size // 2, self.position[1] + tile_size)])
        elif shape == 'heart':
            pygame.draw.polygon(surface, yellow, [(self.position[0] + tile_size // 2, self.position[1]),
                                                   (self.position[0] + 3 * tile_size // 4, self.position[1] + tile_size // 4),
                                                   (self.position[0] + tile_size, self.position[1] + tile_size // 2),
                                                   (self.position[0] + 3 * tile_size // 4, self.position[1] + 3 * tile_size // 4),
                                                   (self.position[0] + tile_size // 2, self.position[1] + tile_size),
                                                   (self.position[0] + tile_size // 4, self.position[1] + 3 * tile_size // 4),
                                                   (self.position[0], self.position[1] + tile_size // 2)])
        elif shape == 'octagon':
            angle = 360 / 8
            octagon_points = [(self.position[0] + tile_size // 2 + int(tile_size / 2 * math.cos(math.radians(i * angle))),
                               self.position[1] + tile_size // 2 + int(tile_size / 2 * math.sin(math.radians(i * angle))))
                              for i in range(8)]
            pygame.draw.polygon(surface, cyan, octagon_points)
        elif shape == 'lightning':
            pygame.draw.polygon(surface, cyan, [(self.position[0] + tile_size // 2, self.position[1]),
                                                   (self.position[0] + tile_size, self.position[1] + tile_size),
                                                   (self.position[0] + tile_size // 4, self.position[1] + tile_size // 2)])
        elif shape == 'inverted_star':
            star_inverse_points = [(self.position[0] + tile_size // 2, self.position[1] + tile_size // 4),
                                   (self.position[0] + 2 * tile_size // 3, self.position[1] + 3 * tile_size // 4),
                                   (self.position[0], self.position[1] + 3 * tile_size // 4),
                                   (self.position[0] + tile_size // 3, self.position[1] + tile_size // 4),
                                   (self.position[0] + tile_size, self.position[1] + tile_size // 2),
                                   ]
            pygame.draw.polygon(surface, cyan, star_inverse_points)
        elif shape == 'checkerboard':
            tile_size_petit = tile_size // 4
            for i in range(4):
                for j in range(4):
                    couleur_case = blanc if (i + j) % 2 == 0 else noir
                    pygame.draw.rect(surface, couleur_case, (self.position[0] + i * tile_size_petit, self.position[1] + j * tile_size_petit, tile_size_petit, tile_size_petit))

        elif shape == 'flower':
            for i in range(6):
                angle_petale = math.radians(60 * i)
                x_petale = self.position[0] + tile_size // 2 + int(tile_size / 2 * math.cos(angle_petale))
                y_petale = self.position[1] + tile_size // 2 + int(tile_size / 2 * math.sin(angle_petale))
                pygame.draw.polygon(surface, cyan, [(self.position[0] + tile_size // 2, self.position[1] + tile_size // 2),
                                                       (x_petale, y_petale),
                                                       (x_petale - 5, y_petale + 10),
                                                       (x_petale + 5, y_petale + 10)])
        elif shape == 'moon':
            pygame.draw.arc(surface, red, (self.position[0], self.position[1], tile_size, tile_size), math.radians(0), math.radians(180), 5)
        elif shape == 'rainbow':
            couleurs_arc_en_ciel = [(255, 0, 0), (255, 165, 0), (255, 255, 0), (0, 128, 0), (0, 0, 255), (75, 0, 130), (148, 0, 211)]
            angle_arc_en_ciel = 360 / len(couleurs_arc_en_ciel)
            for i, couleur_arc in enumerate(couleurs_arc_en_ciel):
                pygame.draw.arc(surface, couleur_arc, (self.position[0], self.position[1], tile_size, tile_size),
                                math.radians(i * angle_arc_en_ciel), math.radians((i + 1) * angle_arc_en_ciel), 5)
        elif shape == 'spark':
            for i in range(8):
                angle_eclat = math.radians(45 * i)
                x_eclat = self.position[0] + tile_size // 2 + int(tile_size / 2 * math.cos(angle_eclat))
                y_eclat = self.position[1] + tile_size // 2 + int(tile_size / 2 * math.sin(angle_eclat))
                pygame.draw.line(surface, red, (self.position[0] + tile_size // 2, self.position[1] + tile_size // 2), (x_eclat, y_eclat), 5)
        elif shape == 'corn':
            for i in range(5):
                angle_epis = math.radians(72 * i)
                x_epi = self.position[0] + tile_size // 2 + int(tile_size / 2 * math.cos(angle_epis))
                y_epi = self.position[1] + tile_size // 2 + int(tile_size / 2 * math.sin(angle_epis))
                pygame.draw.line(surface, red, (self.position[0] + tile_size // 2, self.position[1] + tile_size // 2), (x_epi, y_epi), 5)
        elif shape == 'sword':
            pygame.draw.line(surface, red, (self.position[0], self.position[1] + tile_size // 2),
                             (self.position[0] + tile_size, self.position[1] + tile_size // 2), 5)
            pygame.draw.polygon(surface, couleur, [(self.position[0] + tile_size // 2, self.position[1] + tile_size // 2),
                                                   (self.position[0] + 5, self.position[1] + tile_size),
                                                   (self.position[0] - 5, self.position[1] + tile_size)])

def display_text(surface, text, size, color, position):
    font = pygame.font.Font(None, size)
    text_surface = font.render(text, True, color)
    surface.blit(text_surface, position)

# Initialize the window
window = pygame.display.set_mode((width, height))
pygame.display.set_caption("Snake Game")

# Initialize the game
snake = Snake()
apple = Apple()
clock = pygame.time.Clock()
max_levels = len(apple.possible_shapes)
apples_eaten = 0
level = 1
level_completed = False
game_won = False
paused = False
body_collision = False
running = True

while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_UP:
                snake.change_direction((0, -1))
            elif event.key == pygame.K_DOWN:
                snake.change_direction((0, 1))
            elif event.key == pygame.K_LEFT:
                snake.change_direction((-1, 0))
            elif event.key == pygame.K_RIGHT:
                snake.change_direction((1, 0))
            elif event.key == pygame.K_q:
                running = False
            elif event.key == pygame.K_r:
                    game_won = False
                    body_collision = False
                    snake = Snake()
                    apple = Apple()
                    apples_eaten = 0
                    level = 1
                    paused = False
            elif event.key == pygame.K_RETURN or event.key == pygame.K_SPACE:
                if game_won or body_collision:
                    game_won = False
                    body_collision = False
                    snake = Snake()
                    apple = Apple()
                    apples_eaten = 0
                    level = 1
                    paused = False
                elif level_completed:
                    level_completed = False
                else:
                    paused = not paused

    if not paused and not body_collision and not level_completed and not game_won:
        snake.move()

        if snake.eat_apple(apple.position):
            snake.length += 1
            apples_eaten += 1

            if apples_eaten % 5 == 0:
                apple.change_shape()
                level += 1
                if level > max_levels:
                    game_won = True
                else:
                    level_completed = True
                
            apple.generate()

        # Check collision with body
        if snake.auto_collision():
            body_collision = True

    window.fill(black)
    snake.display(window)
    apple.display(window)

    # Afficher le nombre de pommes mangées et le niveau
    display_text(window, f'Apples eaten: {apples_eaten}', 23, white, (10, 10))
    display_text(window, f'Level: {level}', 23, white, (10, 30))

    if body_collision:
        display_text(window, "GAME OVER!", 60, red, (width // 2 - 80, height // 2))
    elif level_completed:
        display_text(window, f"Level {level} won!", 40, green, (width // 2 - 80, height // 2))
    elif game_won:
        display_text(window, "YOU WON!", 60, cyan, (width // 2 - 80, height // 2))
    if paused:
        display_text(window, "PAUSED", 60, white, (width // 2 - 80, height // 2))

    pygame.display.flip()
    clock.tick(speed)

# message couverture

