import sys
import subprocess
import time
import pkg_resources
import paramiko
import json
import configparser
from threading import Thread

def install_package(package_name):
    try:
        pkg_resources.get_distribution(package_name)
        print(f'{package_name} is already installed.')
    except pkg_resources.DistributionNotFound:
        print(f'{package_name} is not installed. Installing...')
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', package_name])
        print(f'{package_name} installation completed.')

install_package('kivy')
install_package('paramiko')

from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.dropdown import DropDown
from kivy.uix.button import Button
from kivy.uix.textinput import TextInput
from kivy.uix.label import Label
from kivy.graphics import Color, Ellipse
from kivy.metrics import dp
from kivy.uix.popup import Popup
from kivy.uix.image import Image
from kivy.animation import Animation
from kivy.clock import Clock
from kivy.uix.widget import Widget

class StatusIndicator(Widget):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        with self.canvas:
            self.color = Color(1, 0, 0, 1)  
            self.ellipse = Ellipse(size=(dp(20), dp(20)), pos=self.pos)

    def update_color(self, color):
        self.color.rgba = color

class HyperCommandApp(App):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.ssh_connected = False
        self.ssh = None

    def build(self):
        layout = BoxLayout(orientation='vertical', spacing=dp(20), padding=dp(20))

        title_label = Label(text='Hyper Command', size_hint=(None, None), size=(dp(300), dp(40)),
                            color=(1, 1, 1, 1), bold=True, font_size=dp(24),
                            text_size=(dp(300), None), halign='center', pos_hint={'center_x': 0.5})
        layout.add_widget(title_label)

        status_layout = BoxLayout(orientation='horizontal', spacing=dp(10), size_hint_y=None, height=dp(40))
        self.status_label = Label(text='SSH Connection Status:', size_hint_x=0.8)
        self.status_indicator = StatusIndicator(size_hint=(None, None), size=(dp(20), dp(20)))
        status_layout.add_widget(self.status_label)
        status_layout.add_widget(self.status_indicator)
        layout.add_widget(status_layout)

        test_layout = BoxLayout(orientation='horizontal', spacing=dp(10), size_hint_y=None, height=dp(40))
        self.test_input = TextInput(multiline=False, size_hint_x=0.8)
        test_button = Button(text='Test', size_hint_x=0.2)
        test_button.bind(on_press=self.test_command)
        test_layout.add_widget(self.test_input)
        test_layout.add_widget(test_button)
        layout.add_widget(test_layout)

        self.language_dropdown = DropDown()
        languages = ['en', 'de', 'it']
        for language in languages:
            btn = Button(text=language, size_hint_y=None, height=dp(40), background_color=(0.5, 0.5, 0.5, 1),
                         text_size=(None, None), halign='center')
            btn.bind(on_release=lambda btn: self.select_language(btn.text))
            self.language_dropdown.add_widget(btn)

        self.selected_language = languages[0]
        language_button = Button(text='Choose Language', size_hint=(None, None), size=(dp(200), dp(40)),
                                 background_color=(0.5, 0.5, 0.5, 1), pos_hint={'center_x': 0.5})
        language_button.bind(on_release=self.language_dropdown.open)
        layout.add_widget(language_button)

        self.command_dropdown = DropDown()
        self.commands = {
            'en': [
                'Hyper seat move 3 centimeters forward',
                'Hyper backrest incline 5 degrees backward',
                'Hyper seat move 8 centimeters up',
                'Hyper seat move 8 degrees down',
                'Hyper vacust function 1 parking start',
                'Hyper vacust function 3 comfort start',
                'Hyper vacust function 6 large start',
                'Hyper vacust function 8 lumbar start',
            ],
            'de': [
                'Hyper sitz bewegen 3 Zentimeter vorwärts',
                'Hyper rückenlehne neigen 5 Grad rückwärts',
                'Hyper sitz bewegen 8 Zentimeter aufwärts',
                'Hyper sitz bewegen 8 Grad abwärts',
                'Hyper vacust funktion 1 parken starten',
                'Hyper vacust funktion 3 komfort starten',
                'Hyper vacust funktion 6 groß starten',
                'Hyper vacust funktion 8 lendenwirbel starten',
            ],
            'it': [
                'Hyper sedile muovi 3 centimetri avanti',
                'Hyper schienale inclina 5 gradi indietro',
                'Hyper sedile muovi 8 centimetri su',
                'Hyper sedile muovi 8 gradi giù',
                'Hyper vacust funzione 1 parcheggio avvia',
                'Hyper vacust funzione 3 comfort avvia',
                'Hyper vacust funzione 6 grande avvia',
                'Hyper vacust funzione 8 lombare avvia',
            ]
        }

        self.selected_command = ''
        command_button = Button(text='Select a command', size_hint=(None, None), size=(dp(300), dp(40)),
                                background_color=(0.5, 0.5, 0.5, 1), pos_hint={'center_x': 0.5})
        command_button.bind(on_release=self.command_dropdown.open)
        layout.add_widget(command_button)

        self.update_command_dropdown()

        self.command_input = TextInput(multiline=False, size_hint=(None, None), size=(dp(400), dp(40)),
                                       background_color=(0.2, 0.2, 0.2, 1), foreground_color=(1, 1, 1, 1),
                                       cursor_color=(1, 1, 1, 1), hint_text='Enter custom command',
                                       hint_text_color=(0.5, 0.5, 0.5, 1), padding=(dp(10), dp(10)),
                                       pos_hint={'center_x': 0.5})
        layout.add_widget(self.command_input)

        send_button = Button(text='Send Command', size_hint=(None, None), size=(dp(200), dp(40)),
                             background_color=(0, 0.7, 0, 1), pos_hint={'center_x': 0.5})
        send_button.bind(on_press=self.send_command_ssh)
        layout.add_widget(send_button)

        npm_button = Button(text='Start NPM', size_hint=(None, None), size=(dp(200), dp(40)),
                            background_color=(0, 0.7, 0, 1), pos_hint={'center_x': 0.5})
        npm_button.bind(on_press=self.start_npm)
        layout.add_widget(npm_button)

        wake_button = Button(text='Wake', size_hint=(None, None), size=(dp(200), dp(40)),
                             background_color=(0, 0.7, 0, 1), pos_hint={'center_x': 0.5})
        wake_button.bind(on_press=self.wake_command)
        layout.add_widget(wake_button)

        return layout

    def on_start(self):
        self.connect_ssh()
        Clock.schedule_interval(self.update_ssh_status, 1)

    def connect_ssh(self):

        config = configparser.ConfigParser()
        config.read('ssh_config.ini')
        ssh_host = config.get('SSH', 'host')
        ssh_user = config.get('SSH', 'user')
        ssh_password = config.get('SSH', 'password')

        try:
            self.ssh = paramiko.SSHClient()
            self.ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            self.ssh.connect(ssh_host, username=ssh_user, password=ssh_password)
            self.ssh_connected = True
            print(f"[DEBUG] Connected to SSH server: {ssh_host}")
        except paramiko.AuthenticationException:
            self.show_error_popup('SSH authentication failed')
        except paramiko.SSHException as e:
            self.show_error_popup(f'SSH connection failed:\n{str(e)}')
        except Exception as e:
            self.show_error_popup(f'Error connecting to SSH:\n{str(e)}')

    def update_ssh_status(self, dt):
        if self.ssh_connected:
            self.status_indicator.update_color((0, 1, 0, 1))  
        else:
            self.status_indicator.update_color((1, 0, 0, 1))  

    def test_command(self, instance):
        test_command = self.test_input.text
        print(f"[DEBUG] Testing command: {test_command}")

        if not self.ssh_connected:
            self.show_error_popup('SSH connection not established')
            return

        try:

            stdin, stdout, stderr = self.ssh.exec_command(test_command)

            exit_status = stdout.channel.recv_exit_status()
            output = stdout.read().decode('utf-8')
            error = stderr.read().decode('utf-8')

            if exit_status == 0:
                print(f"[DEBUG] Test command executed successfully")
                print(f"[DEBUG] Output: {output}")
                self.show_success_popup('Test command executed successfully')
            else:
                print(f"[DEBUG] Test command execution failed")
                print(f"[DEBUG] Error: {error}")
                self.show_error_popup('Failed to execute test command')
        except Exception as e:
            self.show_error_popup(f'Error executing test command:\n{str(e)}')

    def select_language(self, language):
        self.selected_language = language
        self.language_dropdown.select(language)  
        self.update_command_dropdown()
        print(f"[DEBUG] Selected language: {language}")

    def update_command_dropdown(self):
        self.command_dropdown.clear_widgets()
        for command in self.commands[self.selected_language]:
            btn = Button(text=command, size_hint_y=None, height=dp(40), background_color=(0.5, 0.5, 0.5, 1),
                         text_size=(None, None), halign='center')
            btn.bind(on_release=lambda btn: self.select_command(btn.text))
            self.command_dropdown.add_widget(btn)
        print(f"[DEBUG] Updated command dropdown for language: {self.selected_language}")

    def select_command(self, command):
        self.selected_command = command
        self.command_input.text = command
        self.command_dropdown.dismiss()  
        print(f"[DEBUG] Selected command: {command}")

    def send_command_ssh(self, instance):
        command = self.command_input.text
        print(f"[DEBUG] Sending command: {command}")

        if not self.ssh_connected:
            self.show_error_popup('SSH connection not established')
            return

        try:

            command_parts = command.split(' ')
            if len(command_parts) >= 4:
                trigger_word = command_parts[0]
                domain = command_parts[1]
                command_name = command_parts[2]
                value = int(command_parts[3])
                unit = command_parts[4] if len(command_parts) >= 5 else ''
                direction = command_parts[5] if len(command_parts) >= 6 else ''

                json_body = {
                    "triggerword": trigger_word,
                    "domain": domain,
                    "commandname": command_name,
                    "value": value,
                    "unit": unit,
                    "direction": direction,
                    "raw": command,
                    "origin": "driver",
                    "originlanguage": self.selected_language,
                    "status_indicator": 200
                }

                json_payload = json.dumps(json_body)

                curl_command = f'curl -X POST -H "Content-Type: application/json" -d \'{json_payload}\' http://10.30.51.150:8888/api/v5/hyper/commands'
                stdin, stdout, stderr = self.ssh.exec_command(curl_command)

                exit_status = stdout.channel.recv_exit_status()
                output = stdout.read().decode('utf-8')
                error = stderr.read().decode('utf-8')

                if exit_status == 0:
                    print(f"[DEBUG] Curl command executed successfully")
                    print(f"[DEBUG] Output: {output}")
                    self.show_success_popup('Command sent successfully')
                else:
                    print(f"[DEBUG] Curl command execution failed")
                    print(f"[DEBUG] Error: {error}")
                    self.show_error_popup('Failed to send command')
            else:
                self.show_error_popup('Invalid command format')
        except Exception as e:
            self.show_error_popup(f'Error sending command:\n{str(e)}')

    def start_npm(self, instance):
        if not self.ssh_connected:
            self.show_error_popup('SSH connection not established')
            return

        try:

            self.ssh.exec_command("kill $(lsof -t -i:3000)")

            npm_command = "cd /home/unibz/Documents/BMWSeat-VoiceAssistant && /home/unibz/.nvm/versions/node/v20.3.0/bin/npx npm start"
            stdin, stdout, stderr = self.ssh.exec_command(npm_command)

            stdout_thread = Thread(target=self.read_output_stream, args=(stdout,))
            stderr_thread = Thread(target=self.read_error_stream, args=(stderr,))
            stdout_thread.start()
            stderr_thread.start()

            self.show_success_popup('NPM started successfully')
        except Exception as e:
            self.show_error_popup(f'Error starting NPM:\n{str(e)}')

    def wake_command(self, instance):
        if not self.ssh_connected:
            self.show_error_popup('SSH connection not established')
            return

        try:

            wake_command = "curl http://localhost:3000/api/wake"
            stdin, stdout, stderr = self.ssh.exec_command(wake_command)

            exit_status = stdout.channel.recv_exit_status()
            output = stdout.read().decode('utf-8')
            error = stderr.read().decode('utf-8')

            if exit_status == 0:
                print(f"[DEBUG] Wake command executed successfully")
                print(f"[DEBUG] Output: {output}")
                self.show_success_popup('Wake command executed successfully')
            else:
                print(f"[DEBUG] Wake command execution failed")
                print(f"[DEBUG] Error: {error}")
                self.show_error_popup('Failed to execute wake command')
        except Exception as e:
            self.show_error_popup(f'Error executing wake command:\n{str(e)}')

    def read_output_stream(self, output_stream):
        for line in output_stream:
            print(f"[NPM OUTPUT] {line.strip()}")

    def read_error_stream(self, error_stream):
        for line in error_stream:
            print(f"[NPM ERROR] {line.strip()}")

    def show_success_popup(self, message):
        popup = Popup(title='Success', content=Label(text=message), size_hint=(None, None), size=(dp(300), dp(200)))
        popup.open()
        Animation(opacity=0, duration=5).start(popup)
        time.sleep(5)
        popup.dismiss()

    def show_error_popup(self, message):
        popup = Popup(title='Error', content=Label(text=message, text_size=(dp(280), None)), size_hint=(None, None), size=(dp(300), dp(200)))
        popup.open()
        Animation(opacity=0, duration=5).start(popup)
        time.sleep(5)
        popup.dismiss()

if __name__ == '__main__':
    HyperCommandApp().run()
