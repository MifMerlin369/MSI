import pygame
import sys
import random

pygame.init()
WIDTH, HEIGHT = 800, 600
FPS = 60

BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
GREEN = (0, 255, 0)
RED = (255, 0, 0)
BLUE = (0, 0, 255)
YELLOW = (255, 255, 0)

screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Space Invaders")

clock = pygame.time.Clock()

# Player
player_width = 30
player_height = 30
player_speed = 30
player = pygame.Rect(WIDTH // 2 - player_width // 2, HEIGHT - player_height, player_width, player_height)
player_shield = False

# Bullet
bullet_width = 10
bullet_height = 15
bullet_speed = 20
bullets = []

# Enemy bullet
enemy_bullet_width = 5
enemy_bullet_height = 10
enemy_bullet_speed = 10
enemy_bullets = []

# Alien
alien_width = 30
alien_height = 30
alien_speed = 1
aliens = []

# Level
current_level = 1

class Enemy:
    def __init__(self, x, y, width, height, color, health):
        self.rect = pygame.Rect(x, y, width, height)
        self.color = color
        self.health = health

    def draw(self, screen):
        pygame.draw.rect(screen, self.color, self.rect)

class ShooterEnemy(Enemy):
    def __init__(self, x, y, width, height, color, health):
        super().__init__(x, y, width, height, color, health)
        self.shoot_interval = random.randint(FPS * 1, FPS * 3)
        self.shoot_timer = 0

    def update(self):
        self.shoot_timer += 1
        if self.shoot_timer >= self.shoot_interval:
            self.shoot_timer = 0
            self.shoot_interval = random.randint(FPS * 1, FPS * 3)
            bullet = pygame.Rect(self.rect.centerx - enemy_bullet_width // 2, self.rect.bottom, enemy_bullet_width, enemy_bullet_height)
            enemy_bullets.append(bullet)

class StealthEnemy(Enemy):
    def __init__(self, x, y, width, height, color, health):
        super().__init__(x, y, width, height, color, health)
        self.invisible_interval = random.randint(FPS * 1, FPS * 3)
        self.visible_interval = random.randint(FPS * 1, FPS * 3)
        self.timer = 0
        self.visible = True

    def update(self):
        self.timer += 1
        if self.visible and self.timer >= self.visible_interval:
            self.visible = False
            self.timer = 0
            self.invisible_interval = random.randint(FPS * 1, FPS * 3)
        elif not self.visible and self.timer >= self.invisible_interval:
            self.visible = True
            self.timer = 0
            self.visible_interval = random.randint(FPS * 1, FPS * 3)

    def draw(self, screen):
        if self.visible:
            super().draw(screen)

class Boss(StealthEnemy, ShooterEnemy):
    def __init__(self, x, y, width, height, color, health):
        super().__init__(x, y, width, height, color, health)
        self.shoot_interval = random.randint(FPS * 1, FPS * 2)
        self.invisible_interval = random.randint(FPS * 1, FPS * 2)
        self.visible_interval = random.randint(FPS * 1, FPS * 2)
    
    def draw(self, screen):
        if self.visible:
            # Draw a yellow triangle
            points = [(self.rect.centerx, self.rect.top), 
                      (self.rect.left, self.rect.bottom), 
                      (self.rect.right, self.rect.bottom)]
            pygame.draw.polygon(screen, self.color, points)

    def update(self):
        super().update()
        self.shoot_timer += 1
        if self.shoot_timer >= self.shoot_interval:
            self.shoot_timer = 0
            self.shoot_interval = random.randint(FPS * 1, FPS * 2)
            # Tirer deux balles, une de chaque côté
            left_bullet = pygame.Rect(self.rect.left, self.rect.bottom, enemy_bullet_width, enemy_bullet_height)
            right_bullet = pygame.Rect(self.rect.right - enemy_bullet_width, self.rect.bottom, enemy_bullet_width, enemy_bullet_height)
            enemy_bullets.append(left_bullet)
            enemy_bullets.append(right_bullet)

def create_aliens(rows=5, cols=5, offset_x=10, offset_y=10, heavy_enemy=False, shooter_enemy=False, stealth_enemy=False):
    positions = []
    for row in range(rows):
        for col in range(cols):
            x = col * (alien_width + offset_x)
            y = row * (alien_height + offset_y)
            positions.append((x, y))

    random.shuffle(positions)

    for i, (x, y) in enumerate(positions):
        if heavy_enemy and i % 3 == 0:
            alien = Enemy(x, y, alien_width, alien_height, RED, 3)
        elif shooter_enemy and i % 2 == 0:
            alien = ShooterEnemy(x, y, alien_width, alien_height, GREEN, 1)
        elif stealth_enemy and i % 2 != 0:
            alien = StealthEnemy(x, y, alien_width, alien_height, BLUE, 1)
        else:
            alien = Enemy(x, y, alien_width, alien_height, WHITE, 1)
        aliens.append(alien)

def level1():
    global aliens, alien_speed
    aliens.clear()
    create_aliens()
    alien_speed = 1

def level2():
    global aliens, alien_speed
    aliens.clear()
    create_aliens(rows=8, cols=10)
    alien_speed = 2

def level3():
    global aliens, alien_speed
    aliens.clear()
    create_aliens(rows=8, cols=15)
    alien_speed = 2

def level4():
    global aliens, alien_speed
    aliens.clear()
    create_aliens(rows=10, cols=12, stealth_enemy=True)
    alien_speed = 2

def level5():
    global aliens, alien_speed
    aliens.clear()
    create_aliens(rows=6, cols=15, stealth_enemy=True) 
    alien_speed = 3

def level6():
    global aliens, alien_speed
    aliens.clear()
    create_aliens(rows=10, cols=12, heavy_enemy=True)
    alien_speed = 2
    
def level7():
    global aliens, alien_speed
    aliens.clear()
    create_aliens(rows=6, cols=10, heavy_enemy=True, stealth_enemy=True)
    alien_speed = 5

def level8():
    global aliens, alien_speed
    aliens.clear()
    create_aliens(rows=5, cols=5, shooter_enemy=True)
    alien_speed = 2

def level9():
    global aliens, alien_speed
    aliens.clear()
    create_aliens(rows=5, cols=5, heavy_enemy=True, shooter_enemy=True)
    alien_speed = 2

def level10():
    global aliens, alien_speed
    aliens.clear()
    create_aliens(rows=5, cols=5, shooter_enemy=True)
    alien_speed = 3

def level11():
    global aliens, alien_speed
    aliens.clear()
    create_aliens(rows=7, cols=10, heavy_enemy=True, stealth_enemy=True)
    alien_speed = 6

def level12():
    global aliens, alien_speed
    aliens.clear()
    create_aliens(rows=5, cols=8, heavy_enemy=True, shooter_enemy=True, stealth_enemy=True)
    alien_speed = 4

def level13():
    global aliens, alien_speed
    aliens.clear()
    create_aliens(rows=8, cols=8, heavy_enemy=True, shooter_enemy=True, stealth_enemy=True)
    alien_speed = 4

def level14():
    global aliens, alien_speed
    aliens.clear()
    create_aliens(rows=5, cols=8, heavy_enemy=True, shooter_enemy=True, stealth_enemy=True)
    alien_speed = 8

def level15():
    global aliens, alien_speed
    aliens.clear()
    boss = Boss(WIDTH // 2 - alien_width, HEIGHT // 4, 60, 60, YELLOW, 10)
    aliens.append(boss)
    alien_speed = 2

def level16():
    global aliens, alien_speed
    aliens.clear()
    boss = Boss(WIDTH // 2 - alien_width, HEIGHT // 4, 80, 60, RED, 15)
    aliens.append(boss)
    alien_speed = 4

def level17():
    global aliens, alien_speed
    aliens.clear()
    boss = Boss(WIDTH // 2 - alien_width, HEIGHT // 4, 180, 60, RED, 20)
    aliens.append(boss)
    alien_speed = 4

def level18():
    global aliens, alien_speed
    aliens.clear()
    boss = Boss(WIDTH // 2 - alien_width, HEIGHT // 4, 180, 1, RED, 20)
    aliens.append(boss)
    alien_speed = 5

def level19():
    global aliens, alien_speed
    aliens.clear()
    boss = Boss(WIDTH // 2 - alien_width, HEIGHT // 334, 18, 1, RED, 20)
    aliens.append(boss)
    alien_speed = 5

def level20():
    global aliens, alien_speed
    aliens.clear()
    boss = Boss(WIDTH // 2 - alien_width, HEIGHT // 500, 25, 1, YELLOW, 26)
    aliens.append(boss)
    alien_speed = 5

def level21():
    global aliens, alien_speed
    aliens.clear()
    boss = Boss(WIDTH // 2 - alien_width, HEIGHT // 160, 225, 221, BLACK, 25)
    aliens.append(boss)
    alien_speed = 6

def level22():
    global aliens, alien_speed
    aliens.clear()
    boss = Boss(WIDTH // 2 - alien_width, HEIGHT // 500, 225, 221, GREEN, 30)
    aliens.append(boss)
    alien_speed = 6

def level23():
    global aliens, alien_speed
    aliens.clear()
    boss = Boss(WIDTH // 2 - alien_width, HEIGHT // 4, 20, 60, RED, 6)
    create_aliens(rows=5, cols=5, heavy_enemy=True, stealth_enemy=True)
    aliens.append(boss)
    alien_speed = 6

def level24():
    global aliens, alien_speed
    aliens.clear()
    boss = Boss(WIDTH // 2 - alien_width, HEIGHT // 4, 60, 40, BLUE, 5)
    create_aliens(rows=4, cols=7, heavy_enemy=True, shooter_enemy=True)
    aliens.append(boss)
    alien_speed = 9

def level25():
    global aliens, alien_speed
    aliens.clear()
    bosse = boss = Boss(WIDTH // 2 - alien_width, HEIGHT // 4, 30, 60, BLACK, 3)
    create_aliens(rows=4, cols=7, heavy_enemy=True, shooter_enemy=True, stealth_enemy=True)
    aliens.append(boss)
    alien_speed = 9

def level26():
    global aliens, alien_speed
    aliens.clear()
    bosse = boss = Boss(WIDTH // 2 - alien_width, HEIGHT // 4, 15, 6, BLACK, 3)
    create_aliens(rows=3, cols=3, stealth_enemy=True)
    aliens.append(boss)
    alien_speed = 9

def level27():
    global aliens, alien_speed
    aliens.clear()
    bosse = boss = Boss(WIDTH // 2 - alien_width, HEIGHT // 4, 20, 6, BLACK, 4)
    create_aliens(rows=3, cols=3, shooter_enemy=True, heavy_enemy=True)
    aliens.append(boss)
    alien_speed = 9

def level28():
    global aliens, alien_speed
    aliens.clear()
    bosse = boss = Boss(WIDTH // 2 - alien_width, HEIGHT // 14, 100, 1, BLACK, 60)
    aliens.append(boss)
    alien_speed = 9

def next_level():
    global current_level
    current_level += 1
    if current_level == 2:
        level1()
        game_msg("Cosmic Defenders")
    elif current_level == 3:
        level2()
        game_msg(f"Level {current_level-2} Won!")
    elif current_level == 4:
        level3()
        game_msg(f"Level {current_level-2} Won!")
    elif current_level == 5:
        level4()
        game_msg(f"Level {current_level-2} Won!")
    elif current_level == 6:
        level5()
        game_msg(f"Level {current_level-2} Won!")
    elif current_level == 7:
        level6()
        game_msg(f"Level {current_level-2} Won!")
    elif current_level == 8:
        level7()
        game_msg(f"Level {current_level-2} Won!")
    elif current_level == 9:
        level8()
        game_msg(f"Level {current_level-2} Won!")
    elif current_level == 10:
        level9()
        game_msg(f"Level {current_level-2} Won!")
    elif current_level == 11:
        level10()
        game_msg(f"Level {current_level-2} Won!")
    elif current_level == 12:
        level11()
        game_msg(f"Level {current_level-2} Won!")
    elif current_level == 13:
        level12()
        game_msg(f"Level {current_level-2} Won!")
    elif current_level == 14:
        level12()
        game_msg(f"Level {current_level-2} Won!")
    elif current_level == 15:
        level13()
        game_msg(f"Level {current_level-2} Won!")
    elif current_level == 16:
        level14()
        game_msg(f"Level {current_level-2} Won!")
    elif current_level == 17:
        level15()
        game_msg(f"Level {current_level-2} Won!")
    elif current_level == 18:
        level16()
        game_msg(f"Level {current_level-2} Won!")
    elif current_level == 19:
        level17()
        game_msg(f"Level {current_level-2} Won!")
    elif current_level == 20:
        level18()
        game_msg(f"Level {current_level-2} Won!")
    elif current_level == 21:
        level19()
        game_msg(f"Level {current_level-2} Won!")
    elif current_level == 22:
        level20()
        game_msg(f"Level {current_level-2} Won!")
    elif current_level == 23:
        level21()
        game_msg(f"Level {current_level-2} Won!")
    elif current_level == 24:
        level22()
        game_msg(f"Level {current_level-2} Won!")
    elif current_level == 25:
        level23()
        game_msg(f"Level {current_level-2} Won!")
    elif current_level == 26:
        level24()
        game_msg(f"Level {current_level-2} Won!")
    elif current_level == 27:
        level25()
        game_msg(f"Level {current_level-2} Won!")
    elif current_level == 28:
        level26()
        game_msg(f"Level {current_level-2} Won!")
    elif current_level == 29:
        level27()
        game_msg(f"Level {current_level-2} Won!")
    elif current_level == 30:
        level28()
        game_msg(f"Level {current_level-2} Won!")
    else:
        game_msg2("Congratulations!", "You are the victorious defenders against the Space Invaders!")

def game_msg2(message1, message2, message3 = "", message4 = ""):
    font1 = pygame.font.Font(None, 60)
    font2 = pygame.font.Font(None, 39)
    font3 = pygame.font.Font(None, 39)
    font4 = pygame.font.Font(None, 39)
    
    game_over_text1 = font1.render(message1, True, GREEN)
    text_rect1 = game_over_text1.get_rect(center=(WIDTH // 2, HEIGHT // 2 - 20))
    screen.blit(game_over_text1, text_rect1)
    
    game_over_text2 = font2.render(message2, True, GREEN)
    text_rect2 = game_over_text2.get_rect(center=(WIDTH // 2, HEIGHT // 2 + 43))
    screen.blit(game_over_text2, text_rect2)
    
    game_over_text3 = font3.render(message3, True, GREEN)
    text_rect3 = game_over_text3.get_rect(center=(WIDTH // 2, HEIGHT // 2 + 101))
    screen.blit(game_over_text3, text_rect3)
    
    game_over_text4 = font4.render(message4, True, GREEN)
    text_rect4 = game_over_text4.get_rect(center=(WIDTH // 2, HEIGHT // 2 + 150))
    screen.blit(game_over_text4, text_rect4)
    
    pygame.display.update()

    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE:
                    return

def game_msg(message):
    font = pygame.font.Font(None, 64)
    game_over_text = font.render(message, True, GREEN)
    text_rect = game_over_text.get_rect(center=(WIDTH // 2, HEIGHT // 2))
    screen.blit(game_over_text, text_rect)
    pygame.display.update()

    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE:
                    return

def game_over(message):
    font = pygame.font.Font(None, 64)
    game_over_text = font.render(message, True, RED)
    text_rect = game_over_text.get_rect(center=(WIDTH // 2, HEIGHT // 2))
    screen.blit(game_over_text, text_rect)
    pygame.display.update()

    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE or event.key == pygame.K_r:
                    reset_game()
                    return

def reset_game():
    global current_level, player_shield
    current_level = 1
    bullets.clear()
    enemy_bullets.clear()
    player_shield = False
    level1()

def draw_level():
    font = pygame.font.Font(None, 36)
    text = font.render(f"Level: {current_level-1}", True, WHITE)
    screen.blit(text, (10, 1))

# Initialiser le premier niveau
next_level()

# Game loop
running = True
paused = False
score = 0

while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_LEFT:
                player.x -= player_speed
            elif event.key == pygame.K_RIGHT:
                player.x += player_speed
            elif event.key == pygame.K_RETURN or event.key == pygame.K_x:
                bullet = pygame.Rect(player.centerx - bullet_width // 2, player.top, bullet_width, bullet_height)
                bullets.append(bullet)
            elif event.key == pygame.K_q:
                running = False
            elif event.key == pygame.K_SPACE or event.key == pygame.K_p:
                paused = not paused
            elif event.key == pygame.K_h:
                    game_msg2("[ENTER or X] : tirer", "[SPACE] : paused or star next level", "[R]: Game Reset", "MSI")
            elif event.key == pygame.K_r:
                    reset_game()

    if paused:
        font = pygame.font.Font(None, 64)
        pause_text = font.render("Paused", True, WHITE)
        text_rect = pause_text.get_rect(center=(WIDTH // 2, HEIGHT // 2))
        screen.blit(pause_text, text_rect)
        pygame.display.update()
        clock.tick(FPS)
        continue
    
    # Update player position
    if player.left < 0:
        player.left = 0
    if player.right > WIDTH:
        player.right = WIDTH

    # Update bullet position
    for bullet in bullets[:]:
        bullet.y -= bullet_speed
        if bullet.bottom < 0:
            bullets.remove(bullet)

    # Update enemy bullet position
    for bullet in enemy_bullets[:]:
        bullet.y += enemy_bullet_speed
        if bullet.top > HEIGHT:
            enemy_bullets.remove(bullet)
        elif bullet.colliderect(player):
            if not player_shield:
                game_over("GAME OVER!")
            else:
                player_shield = False
                enemy_bullets.remove(bullet)

    # Update alien position
    for alien in aliens:
        alien.rect.x += alien_speed
        if isinstance(alien, ShooterEnemy):
            alien.update()
        if isinstance(alien, StealthEnemy):
            alien.update()
        if isinstance(alien, Boss):
            alien.update()

    for alien in aliens:
        if alien.rect.right > WIDTH or alien.rect.left < 0:
            alien_speed = -alien_speed
            for a in aliens:
                a.rect.y += alien_height
            break

    # Check for collisions
    for bullet in bullets[:]:
        for alien in aliens[:]:
            if bullet.colliderect(alien.rect):
                bullets.remove(bullet)
                alien.health -= 1
                if alien.health <= 0:
                    if isinstance(alien, Enemy) and alien.color == RED:
                        player_shield = True
                    aliens.remove(alien)
                break

    # Check for game over condition
    if not aliens:
        next_level()

    for alien in aliens:
        if alien.rect.bottom >= player.top:
            game_over("GAME OVER!")

    # Draw everything
    screen.fill(BLACK)
    pygame.draw.rect(screen, GREEN, player)
    if player_shield:
        pygame.draw.rect(screen, RED, player, 3)
    for bullet in bullets:
        pygame.draw.rect(screen, RED, bullet)
    for bullet in enemy_bullets:
        pygame.draw.rect(screen, RED, bullet)
    for alien in aliens:
        alien.draw(screen)

    draw_level()
    pygame.display.update()
    clock.tick(FPS)

pygame.quit()
#sys.exit()

