import requests, json, os, sys, subprocess, time
from termcolor import colored

class Colors:
    red = "\033[31;1m"

def clear_screen():
    os.system("clear")

def the_logo():
    logo = Colors.red + '''
                uu$$$$uu
             uu$:$:$:$:$:$uu
          uu$$$$$$$$$$$$$$$$$uu
         u$$$$$$$$$$$$$$$$$$$$$u
         u$$$$$$$$$$$$$$$$$$$$$$$u
       u$$$$$$$$$$$$$$$$$$$$$$$$$u
       u$$$$$$$$$$$$$$$$$$$$$$$$$u
       u$$$$$$*   *$$$*   *$$$$$$u
       *$$$$*      u$u       $$$$*
        $$$u       u$u       u$$$
        $$$u      u$$$u      u$$$
         *$$$$uu$$$   $$$uu$$$$*
          *$$$$$$$*   *$$$$$$$*
            u$$$$$$$u$$$$$$$u
             u$*$*$*$*$*$*$u
  uuu        $$u$ $ $ $ $u$$       uuu
 u$$$$        $$u$u$u$u$u$$       u$$$$
  $$$$$uu      *$$$$$$$$$*     uu$$$$$$
u$$$$$$$$$$$      *****    uuuu$$$$$$$$$
$$$$***$$$$$$$$$$uuu   uu$$$$$$$$$***$$$*
 ***      **$$$$$$$$$$$uu **$***
          uuuu **$$$$$$$$$$uuu
 u$$$uuu$$$$$$$$$uu **$$$$$$$$$$$uuu$$$
 $$$$$$$$$$****           **$$$$$$$$$$$*
   *$$$$$*                      **$$$$**
     $$$*    ___________________  $$$$*
            | Made by: MSI      |
            |___________________|
            | IP adress  info   |
            |___________________|
     
'''
    print(logo)

def get_ip_details(ip):
    try:
        api_url = f"http://ip-api.com/json/{ip}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query&lang=en"
        response = requests.get(api_url)
        data = response.json()

        if data['status'] == 'fail':
            print("[~] IP details not found.")
            return

        for key, value in data.items():
            print(f"[~] [{key}]: {value}")

    except requests.exceptions.RequestException:
        print("[~] Error! Please check your internet connection!")


def exit_p():
    print("Exiting... !")
    sys.exit()

def quit_p():
    print("Quiting... !")
    sys.exit()

def clear_p():
    subprocess.run('cls' if os.name == 'nt' else 'clear', shell=True)

def main():
    the_logo()
    while True:
        ip_address = input("[?] IP address: ")
        
        if ip_address == 'exit':
            exit_p()
        elif ip_address == 'quit':
            quit_p()
        elif ip_address == 'help':
            pass #help_p()
        elif ip_address in ['clear', 'cls']:
            clear_p(); the_logo()
        else:
            print("[~] Fetching IP details...")
            time.sleep(1)

        get_ip_details(ip_address)

        print("[~]")

if __name__ == '__main__':
    while True:
        try:
            main()
        except KeyboardInterrupt:
            print ("KeyboardInterrupt")
            sys.exit()
        except EOFError:
            sys.exit()
        except Exception as error:
            print("ERROR !", error)

