import pyautogui
from datetime import datetime
import time
import threading

def screenshot():
    try:
        while True:
            current_time = datetime.now().strftime("%d-%m-%G_%H-%M-%S.png")
            image = pyautogui.screenshot()
            image.save(current_time)
            print(f"Capture d'écran enregistrée: {current_time}")

            # Attendre 5 secondes avant la prochaine capture
            time.sleep(5)

    except KeyboardInterrupt:
        print("Interruption par l'utilisateur.")
    except Exception as e:
        print(f"Une erreur s'est produite : {e}")

def run_screenshot():
    try:
        screenshot()
    except KeyboardInterrupt:
        print("Interruption par l'utilisateur.")
    except Exception as e:
        print(f"Une erreur s'est produite : {e}")

if __name__ == '__main__':
    try:
        screenshot_thread = threading.Thread(target=run_screenshot)
        screenshot_thread.daemon = True  # Le thread se terminera lorsque le programme principal se termine
        screenshot_thread.start()

        # Le programme principal peut continuer à s'exécuter sans être bloqué
        while True:
            pass
    except KeyboardInterrupt:
        print("Interruption par l'utilisateur.")
    except Exception as e:
        print(f"Une erreur s'est produite : {e}")
