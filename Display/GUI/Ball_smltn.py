import pygame
import random
import math

pygame.init()

# Setting screen size of pygame window to 800 by 600 pixels
screen = pygame.display.set_mode((800, 600))

# Adding title
pygame.display.set_caption('Shape Bounce Simulation')

def reset_game():
    global vitesses, ball_tailles, background_color, num_shapes, Shape_List, draw_function_index, shape_class
    
    vitesses = random.choice(vitesse)
    ball_tailles = random.choice(ball_taille)
    
    background_color = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))
    num_shapes = random.randint(1, 100)
    Shape_List = [shape_class() for _ in range(num_shapes)]
    draw_function_index = random.randint(0, len(gradient_backgrounds) - 1)

# Initial settings
vitesse = [random.uniform(0, 0), random.uniform(1, 0), random.uniform(1, 1), random.uniform(2, 2), random.uniform(0.3, 0.3), random.uniform(0.0, 0.0)]
vitesses = random.choice(vitesse)

ball_taille = [random.randint(5, 8), random.uniform(10, 15), random.randint(20, 25), random.uniform(1, 80), random.uniform(30, 80), random.uniform(1, 200)]
ball_tailles = random.choice(ball_taille)

class Shape:
    def __init__(self):
        self.velocityX = random.uniform(-5, 5)
        self.velocityY = random.uniform(-5, 5)
        self.size = ball_tailles
        self.X = random.randint(self.size // 2, 800 - self.size // 2)
        self.Y = random.randint(self.size // 2, 600 - self.size // 2)
        self.g = vitesses
        self.color = [random.randint(0, 255) for _ in range(3)]  # Generate a random color for each shape

    def move_shape(self):
        # Changing y component of velocity due to downward acceleration
        self.velocityY += self.g
        # Changing position based on velocity
        self.X += self.velocityX
        self.Y += self.velocityY
        # Collision with the walls lead to change in velocity
        if self.X < self.size // 2 or self.X > 800 - self.size // 2:
            self.velocityX *= -1
        if self.Y < self.size // 2 and self.velocityY < 0:
            self.velocityY *= -1
            self.Y = self.size // 2
        if self.Y > 600 - self.size // 2 and self.velocityY > 0:
            self.velocityY *= -1
            self.Y = 600 - self.size // 2

    def check_collision(self, other):
        # Simplified collision check for bounding boxes
        return (
            abs(self.X - other.X) < self.size and
            abs(self.Y - other.Y) < self.size
        )

    def resolve_collision(self, other):
        if self.check_collision(other):
            # Calculate the minimum translation vector to separate the shapes
            normal = pygame.Vector2(self.X - other.X, self.Y - other.Y).normalize()
            overlap = self.size - abs(self.X - other.X) if abs(self.X - other.X) < self.size else self.size - abs(self.Y - other.Y)
            separation = normal * overlap * 0.5

            # Move the shapes apart
            self.X += separation.x
            self.Y += separation.y
            other.X -= separation.x
            other.Y -= separation.y

            # Calculate the new velocities
            rel_velocity = pygame.Vector2(self.velocityX - other.velocityX, self.velocityY - other.velocityY)
            dot_product = rel_velocity.x * normal.x + rel_velocity.y * normal.y

            self.velocityX -= dot_product * normal.x
            self.velocityY -= dot_product * normal.y
            other.velocityX += dot_product * normal.x
            other.velocityY += dot_product * normal.y

class Circle(Shape):
    def render_shape(self):
        pygame.draw.circle(screen, self.color, (int(self.X), int(self.Y)), self.size // 2)

class Square(Shape):
    def render_shape(self):
        pygame.draw.rect(screen, self.color, (self.X - self.size // 2, self.Y - self.size // 2, self.size, self.size))

class Triangle(Shape):
    def render_shape(self):
        points = [
            (self.X, self.Y - self.size // 2),  # Top vertex
            (self.X - self.size // 2, self.Y + self.size // 2),  # Bottom-left vertex
            (self.X + self.size // 2, self.Y + self.size // 2)  # Bottom-right vertex
        ]
        pygame.draw.polygon(screen, self.color, points)

class Rhombus(Shape):
    def render_shape(self):
        points = [
            (self.X, self.Y - self.size // 2),  # Top vertex
            (self.X - self.size // 2, self.Y),  # Left vertex
            (self.X, self.Y + self.size // 2),  # Bottom vertex
            (self.X + self.size // 2, self.Y)   # Right vertex
        ]
        pygame.draw.polygon(screen, self.color, points)

class Pentagon(Shape):
    def render_shape(self):
        side_length = self.size // 2
        points = []
        for i in range(5):
            angle = i * (2 * math.pi / 5)  # Angle between consecutive vertices
            x = self.X + side_length * math.cos(angle)
            y = self.Y + side_length * math.sin(angle)
            points.append((x, y))
        pygame.draw.polygon(screen, self.color, points)

class Hexagon(Shape):
    def render_shape(self):
        side_length = self.size // 2
        points = []
        for i in range(6):
            angle = i * (2 * math.pi / 6)  # Angle between consecutive vertices
            x = self.X + side_length * math.cos(angle)
            y = self.Y + side_length * math.sin(angle)
            points.append((x, y))
        pygame.draw.polygon(screen, self.color, points)

class Star(Shape):
    def render_shape(self):
        outer_points = []
        inner_points = []
        num_points = 5  # Nombre de points dans l'étoile

        # Calcul des points pour l'étoile
        for i in range(num_points * 2):
            angle = i * math.pi / num_points
            radius = self.size // 2
            if i % 2 == 0:
                x = self.X + radius * math.cos(angle)
                y = self.Y + radius * math.sin(angle)
                outer_points.append((x, y))
            else:
                inner_radius = radius // 2
                x = self.X + inner_radius * math.cos(angle)
                y = self.Y + inner_radius * math.sin(angle)
                inner_points.append((x, y))

        # Tracer l'étoile
        pygame.draw.polygon(screen, self.color, outer_points)
        pygame.draw.polygon(screen, self.color, inner_points)


def choose_random_shape_class():
    shape_classes = [Circle, Square, Triangle, Rhombus, Pentagon, Hexagon, Star]
    return random.choice(shape_classes)

# Choisir la forme une fois au début du jeu
shape_class = choose_random_shape_class()

# Liste des fonctions de gradient d'arrière-plan

a = random.randint(1, 255)
d = random.randint(1, 255)
c = random.randint(1, 255)

def draw_gradient_background_1(color):
    for y in range(600):
        pygame.draw.line(screen, color, (0, y), (800, y))

def draw_gradient_background_2(color):
    for y in range(600):
        r = max(min(y // 2, a), 0)
        g = max(min(y // 2, d), 0)
        b = max(min(y, c), 0)
        color = (r, g, b)
        pygame.draw.line(screen, color, (0, y), (800, y))

def draw_gradient_background_3(color):
    for y in range(600):
        r = max(min(y, 0), 0)
        g = max(min(y, 0), 0)
        b = max(min(y // 2, 50), 10)
        color = (r, g, b)
        pygame.draw.line(screen, color, (0, y), (800, y))

def draw_gradient_background_4(color):
    for y in range(600):
        color = (0, 0, 0)
        pygame.draw.line(screen, color, (0, y), (800, y))

def draw_gradient_background_5(color):
    top_color = (135, 206, 235)  # Couleur bleu ciel clair
    bottom_color = (70, 130, 180)  # Couleur bleu acier
    for y in range(600):
        # Interpolation linéaire entre les deux couleurs
        ratio = y / 600
        r = int(top_color[0] * (1 - ratio) + bottom_color[0] * ratio)
        g = int(top_color[1] * (1 - ratio) + bottom_color[1] * ratio)
        b = int(top_color[2] * (1 - ratio) + bottom_color[2] * ratio)
        pygame.draw.line(screen, (r, g, b), (0, y), (800, y))


gradient_backgrounds = [draw_gradient_background_1, draw_gradient_background_2, draw_gradient_background_3, draw_gradient_background_4, draw_gradient_background_5]

# Initial game state
reset_game()

# La boucle principale du programme
running = True
clock = pygame.time.Clock()

while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            print("Key pressed:", event.key)
            if event.key == pygame.K_RETURN:  # Check if 'Enter' is pressed
                Shape_List.append(shape_class())  # Add a new shape to the list
            elif event.key == pygame.K_q:  # Check if 'Q' is pressed
                running = False  # Quit the game
            elif event.key == pygame.K_RIGHT:  # Change background gradient to the next one
                draw_function_index = (draw_function_index + 1) % len(gradient_backgrounds)
            elif event.key == pygame.K_LEFT:  # Change background gradient to the previous one
                draw_function_index = (draw_function_index - 1) % len(gradient_backgrounds)
            elif event.key == pygame.K_SPACE:  # Reset the game if 'Space' is pressed
                reset_game()

    # Draw the selected gradient background
    draw_function = gradient_backgrounds[draw_function_index]
    draw_function(background_color)

    for i, shape_item in enumerate(Shape_List):
        shape_item.render_shape()
        shape_item.move_shape()
        for other_shape in Shape_List[i + 1:]:
            shape_item.resolve_collision(other_shape)

    pygame.display.update()
    clock.tick(60)

if __name__ == "__main__":
    pygame.quit() == main()

# couleur du ciel

