#!/usr/bin/env python3
"""
CookieOS OOBE (Out-of-Box Experience) v2.0
Instalator dla CookieOS bazujący na Arch Linux
"""

import sys
import subprocess
from PyQt6.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout, 
                             QHBoxLayout, QPushButton, QLabel, QProgressBar,
                             QGridLayout, QScrollArea, QCheckBox, QRadioButton,
                             QButtonGroup, QFrame, QTextEdit, QComboBox)
from PyQt6.QtCore import Qt, QThread, pyqtSignal, QTimer
from PyQt6.QtGui import QFont, QPalette, QColor

# Konfiguracja pakietów - ROZSZERZONA
CONFIG = {
    "browsers": [
        {"id": "firefox", "name": "Firefox", "desc": "Najpopularniejsza otwartoźródłowa przeglądarka", "pkg": "firefox"},
        {"id": "chromium", "name": "Chromium", "desc": "Projekt open-source Chrome", "pkg": "chromium"},
        {"id": "brave", "name": "Brave", "desc": "Prywatność z wbudowanym blokerem reklam", "pkg": "brave-bin", "aur": True},
        {"id": "librewolf", "name": "LibreWolf", "desc": "Firefox bez telemetrii i śledzenia", "pkg": "librewolf-bin", "aur": True},
        {"id": "vivaldi", "name": "Vivaldi", "desc": "Zaawansowana przeglądarka z personalizacją", "pkg": "vivaldi", "aur": True},
        {"id": "opera", "name": "Opera", "desc": "Przeglądarka z VPN i narzędziami", "pkg": "opera", "aur": True},
        {"id": "waterfox", "name": "Waterfox", "desc": "Fork Firefoksa skupiony na prywatności", "pkg": "waterfox-bin", "aur": True},
        {"id": "floorp", "name": "Floorp", "desc": "Japońska, zmodyfikowana wersja Firefox", "pkg": "floorp-bin", "aur": True}
    ],
    "tools": [
        {"id": "git", "name": "Git", "desc": "Kontrola wersji", "pkg": "git"},
        {"id": "vim", "name": "Vim", "desc": "Zaawansowany edytor tekstowy", "pkg": "vim"},
        {"id": "neovim", "name": "Neovim", "desc": "Nowoczesny fork Vima", "pkg": "neovim"},
        {"id": "htop", "name": "htop", "desc": "Interaktywny monitor procesów", "pkg": "htop"},
        {"id": "btop", "name": "btop", "desc": "Nowoczesny monitor systemu", "pkg": "btop"},
        {"id": "tmux", "name": "tmux", "desc": "Multiplekser terminala", "pkg": "tmux"},
        {"id": "zsh", "name": "Zsh + Oh My Zsh", "desc": "Zaawansowana powłoka", "pkg": "zsh"},
        {"id": "docker", "name": "Docker", "desc": "Platforma kontenerowa", "pkg": "docker docker-compose"},
        {"id": "vscode", "name": "VS Code", "desc": "Popularny edytor kodu", "pkg": "code", "aur": True},
        {"id": "wget", "name": "wget", "desc": "Pobieranie plików", "pkg": "wget"},
        {"id": "curl", "name": "curl", "desc": "Transfer danych", "pkg": "curl"},
        {"id": "jq", "name": "jq", "desc": "Procesor JSON", "pkg": "jq"}
    ],
    "baskets": [
        {
            "id": "dev",
            "name": "Programowanie",
            "icon": "💻",
            "apps": [
                {"id": "nodejs", "name": "Node.js + npm", "pkg": "nodejs npm"},
                {"id": "python", "name": "Python + pip", "pkg": "python python-pip"},
                {"id": "jdk", "name": "Java JDK", "pkg": "jdk-openjdk"},
                {"id": "rust", "name": "Rust", "pkg": "rust"},
                {"id": "go", "name": "Go", "pkg": "go"},
                {"id": "php", "name": "PHP", "pkg": "php"},
                {"id": "ruby", "name": "Ruby", "pkg": "ruby"},
                {"id": "postgresql", "name": "PostgreSQL", "pkg": "postgresql"},
                {"id": "mysql", "name": "MySQL", "pkg": "mysql"},
                {"id": "mongodb", "name": "MongoDB", "pkg": "mongodb-bin", "aur": True},
                {"id": "redis", "name": "Redis", "pkg": "redis"},
                {"id": "dbeaver", "name": "DBeaver", "pkg": "dbeaver"}
            ]
        },
        {
            "id": "media",
            "name": "Multimedia",
            "icon": "🎬",
            "apps": [
                {"id": "vlc", "name": "VLC Media Player", "pkg": "vlc"},
                {"id": "mpv", "name": "MPV", "pkg": "mpv"},
                {"id": "gimp", "name": "GIMP", "pkg": "gimp"},
                {"id": "inkscape", "name": "Inkscape", "pkg": "inkscape"},
                {"id": "krita", "name": "Krita", "pkg": "krita"},
                {"id": "obs", "name": "OBS Studio", "pkg": "obs-studio"},
                {"id": "audacity", "name": "Audacity", "pkg": "audacity"},
                {"id": "kdenlive", "name": "Kdenlive", "pkg": "kdenlive"},
                {"id": "blender", "name": "Blender", "pkg": "blender"},
                {"id": "shotcut", "name": "Shotcut", "pkg": "shotcut"}
            ]
        },
        {
            "id": "office",
            "name": "Biuro",
            "icon": "📄",
            "apps": [
                {"id": "libreoffice", "name": "LibreOffice", "pkg": "libreoffice-fresh"},
                {"id": "onlyoffice", "name": "OnlyOffice", "pkg": "onlyoffice-bin", "aur": True},
                {"id": "okular", "name": "Okular", "pkg": "okular"},
                {"id": "evince", "name": "Evince", "pkg": "evince"},
                {"id": "thunderbird", "name": "Thunderbird", "pkg": "thunderbird"},
                {"id": "calibre", "name": "Calibre", "pkg": "calibre"},
                {"id": "notion", "name": "Notion", "pkg": "notion-app-enhanced", "aur": True},
                {"id": "obsidian", "name": "Obsidian", "pkg": "obsidian", "aur": True},
                {"id": "joplin", "name": "Joplin", "pkg": "joplin-desktop", "aur": True},
                {"id": "simplenote", "name": "Simplenote", "pkg": "simplenote-electron-bin", "aur": True}
            ]
        },
        {
            "id": "games",
            "name": "Gaming",
            "icon": "🎮",
            "apps": [
                {"id": "steam", "name": "Steam", "pkg": "steam"},
                {"id": "lutris", "name": "Lutris", "pkg": "lutris"},
                {"id": "heroic", "name": "Heroic Games Launcher", "pkg": "heroic-games-launcher-bin", "aur": True},
                {"id": "discord", "name": "Discord", "pkg": "discord"},
                {"id": "wine", "name": "Wine", "pkg": "wine"},
                {"id": "protonup", "name": "ProtonUp-Qt", "pkg": "protonup-qt"},
                {"id": "mangohud", "name": "MangoHud", "pkg": "mangohud"},
                {"id": "goverlay", "name": "GOverlay", "pkg": "goverlay"},
                {"id": "gamemode", "name": "GameMode", "pkg": "gamemode"},
                {"id": "minecraft", "name": "Minecraft Launcher", "pkg": "minecraft-launcher", "aur": True}
            ]
        },
        {
            "id": "internet",
            "name": "Internet i Komunikacja",
            "icon": "🌐",
            "apps": [
                {"id": "telegram", "name": "Telegram", "pkg": "telegram-desktop"},
                {"id": "slack", "name": "Slack", "pkg": "slack-desktop", "aur": True},
                {"id": "zoom", "name": "Zoom", "pkg": "zoom", "aur": True},
                {"id": "skype", "name": "Skype", "pkg": "skypeforlinux-stable-bin", "aur": True},
                {"id": "signal", "name": "Signal", "pkg": "signal-desktop"},
                {"id": "element", "name": "Element", "pkg": "element-desktop"},
                {"id": "qbittorrent", "name": "qBittorrent", "pkg": "qbittorrent"},
                {"id": "filezilla", "name": "FileZilla", "pkg": "filezilla"},
                {"id": "remmina", "name": "Remmina", "pkg": "remmina"},
                {"id": "anydesk", "name": "AnyDesk", "pkg": "anydesk-bin", "aur": True}
            ]
        },
        {
            "id": "security",
            "name": "Bezpieczeństwo",
            "icon": "🔒",
            "apps": [
                {"id": "keepassxc", "name": "KeePassXC", "pkg": "keepassxc"},
                {"id": "bitwarden", "name": "Bitwarden", "pkg": "bitwarden", "aur": True},
                {"id": "veracrypt", "name": "VeraCrypt", "pkg": "veracrypt"},
                {"id": "gnupg", "name": "GnuPG", "pkg": "gnupg"},
                {"id": "firejail", "name": "Firejail", "pkg": "firejail"},
                {"id": "gufw", "name": "GUFW", "pkg": "gufw"},
                {"id": "clamav", "name": "ClamAV", "pkg": "clamav"},
                {"id": "lynis", "name": "Lynis", "pkg": "lynis"},
                {"id": "aide", "name": "AIDE", "pkg": "aide"},
                {"id": "rkhunter", "name": "rkhunter", "pkg": "rkhunter"}
            ]
        },
        {
            "id": "graphics",
            "name": "Grafika 3D i CAD",
            "icon": "🎨",
            "apps": [
                {"id": "freecad", "name": "FreeCAD", "pkg": "freecad"},
                {"id": "openscad", "name": "OpenSCAD", "pkg": "openscad"},
                {"id": "librecad", "name": "LibreCAD", "pkg": "librecad"},
                {"id": "sweethome3d", "name": "Sweet Home 3D", "pkg": "sweethome3d"},
                {"id": "dust3d", "name": "Dust3D", "pkg": "dust3d", "aur": True},
                {"id": "wings3d", "name": "Wings 3D", "pkg": "wings3d"},
                {"id": "meshlab", "name": "MeshLab", "pkg": "meshlab"},
                {"id": "darktable", "name": "Darktable", "pkg": "darktable"},
                {"id": "rawtherapee", "name": "RawTherapee", "pkg": "rawtherapee"},
                {"id": "hugin", "name": "Hugin", "pkg": "hugin"}
            ]
        },
        {
            "id": "audio",
            "name": "Audio i Muzyka",
            "icon": "🎵",
            "apps": [
                {"id": "spotify", "name": "Spotify", "pkg": "spotify", "aur": True},
                {"id": "rhythmbox", "name": "Rhythmbox", "pkg": "rhythmbox"},
                {"id": "clementine", "name": "Clementine", "pkg": "clementine"},
                {"id": "lmms", "name": "LMMS", "pkg": "lmms"},
                {"id": "ardour", "name": "Ardour", "pkg": "ardour"},
                {"id": "hydrogen", "name": "Hydrogen", "pkg": "hydrogen"},
                {"id": "mixxx", "name": "Mixxx", "pkg": "mixxx"},
                {"id": "easytag", "name": "EasyTAG", "pkg": "easytag"},
                {"id": "soundconverter", "name": "Sound Converter", "pkg": "soundconverter"},
                {"id": "qjackctl", "name": "QjackCtl", "pkg": "qjackctl"}
            ]
        },
        {
            "id": "system",
            "name": "Narzędzia Systemowe",
            "icon": "⚙️",
            "apps": [
                {"id": "gparted", "name": "GParted", "pkg": "gparted"},
                {"id": "timeshift", "name": "Timeshift", "pkg": "timeshift"},
                {"id": "bleachbit", "name": "BleachBit", "pkg": "bleachbit"},
                {"id": "stacer", "name": "Stacer", "pkg": "stacer"},
                {"id": "baobab", "name": "Baobab", "pkg": "baobab"},
                {"id": "synaptic", "name": "Synaptic", "pkg": "synaptic"},
                {"id": "hardinfo", "name": "HardInfo", "pkg": "hardinfo"},
                {"id": "cpupower", "name": "cpupower-gui", "pkg": "cpupower-gui"},
                {"id": "nvtop", "name": "nvtop", "pkg": "nvtop"},
                {"id": "iotop", "name": "iotop", "pkg": "iotop"}
            ]
        },
        {
            "id": "utilities",
            "name": "Narzędzia Użytkowe",
            "icon": "🔧",
            "apps": [
                {"id": "flameshot", "name": "Flameshot", "pkg": "flameshot"},
                {"id": "spectacle", "name": "Spectacle", "pkg": "spectacle"},
                {"id": "kolourpaint", "name": "KolourPaint", "pkg": "kolourpaint"},
                {"id": "peek", "name": "Peek", "pkg": "peek"},
                {"id": "variety", "name": "Variety", "pkg": "variety"},
                {"id": "Albert", "name": "Albert", "pkg": "albert", "aur": True},
                {"id": "ulauncher", "name": "Ulauncher", "pkg": "ulauncher"},
                {"id": "copyq", "name": "CopyQ", "pkg": "copyq"},
                {"id": "zeal", "name": "Zeal", "pkg": "zeal"},
                {"id": "redshift", "name": "Redshift", "pkg": "redshift"}
            ]
        }
    ],
    "customization": {
        "cursors": [
            {"id": "default", "name": "Domyślny", "pkg": None},
            {"id": "breeze", "name": "Breeze", "pkg": "breeze"},
            {"id": "breeze-snow", "name": "Breeze Snow", "pkg": "breeze-snow-cursor-theme", "aur": True},
            {"id": "volantes", "name": "Volantes", "pkg": "volantes-cursors"},
            {"id": "bibata", "name": "Bibata", "pkg": "bibata-cursor-theme", "aur": True},
            {"id": "capitaine", "name": "Capitaine", "pkg": "capitaine-cursors"}
        ],
        "grub_themes": [
            {"id": "default", "name": "Domyślny", "pkg": None},
            {"id": "vimix", "name": "Vimix", "pkg": "grub-theme-vimix-git", "aur": True},
            {"id": "sleek", "name": "Sleek", "pkg": "grub-theme-sleek-git", "aur": True},
            {"id": "stylish", "name": "Stylish", "pkg": "grub-theme-stylish-git", "aur": True},
            {"id": "tela", "name": "Tela", "pkg": "grub2-theme-tela-git", "aur": True}
        ],
        "icons": [
            {"id": "default", "name": "Domyślne", "pkg": None},
            {"id": "papirus", "name": "Papirus", "pkg": "papirus-icon-theme"},
            {"id": "papirus-dark", "name": "Papirus Dark", "pkg": "papirus-icon-theme"},
            {"id": "tela", "name": "Tela", "pkg": "tela-icon-theme-git", "aur": True},
            {"id": "candy", "name": "Candy", "pkg": "candy-icons-git", "aur": True},
            {"id": "zafiro", "name": "Zafiro", "pkg": "zafiro-icon-theme", "aur": True}
        ],
        "fonts": [
            {"id": "noto", "name": "Noto Fonts", "pkg": "noto-fonts noto-fonts-emoji", "selected": True},
            {"id": "ttf-dejavu", "name": "DejaVu", "pkg": "ttf-dejavu"},
            {"id": "ttf-liberation", "name": "Liberation", "pkg": "ttf-liberation"},
            {"id": "ttf-fira", "name": "Fira Code", "pkg": "ttf-fira-code"},
            {"id": "ttf-jetbrains", "name": "JetBrains Mono", "pkg": "ttf-jetbrains-mono"},
            {"id": "ttf-cascadia", "name": "Cascadia Code", "pkg": "ttf-cascadia-code"}
        ]
    }
}

class InstallThread(QThread):
    """Wątek do instalacji pakietów"""
    progress = pyqtSignal(int, str)
    log = pyqtSignal(str)
    finished = pyqtSignal(bool, str)
    
    def __init__(self, packages, aur_packages):
        super().__init__()
        self.packages = packages
        self.aur_packages = aur_packages
        self.use_pkexec = self.check_pkexec()
        self.authenticated = False
        
    def check_pkexec(self):
        """Sprawdź czy pkexec jest dostępny"""
        result = subprocess.run(["which", "pkexec"], capture_output=True)
        return result.returncode == 0
    
    def authenticate_once(self):
        """Uwierzytelnij raz na początku - tylko dla pacman"""
        if self.authenticated:
            return True
            
        try:
            self.log.emit("[AUTH] Uwierzytelnianie dla pacman...")
            
            if self.use_pkexec:
                # Dla pkexec
                result = subprocess.run(
                    ["pkexec", "true"],
                    capture_output=True,
                    text=True,
                    check=True,
                    timeout=120
                )
                self.log.emit("[AUTH] ✓ Uwierzytelniono pomyślnie (polkit)")
            else:
                # Dla sudo
                self.log.emit("[AUTH] Proszę wpisać hasło sudo...")
                result = subprocess.run(
                    ["sudo", "true"],
                    check=True,
                    timeout=120
                )
                # Uruchom keepalive
                self.start_sudo_keepalive()
                self.log.emit("[AUTH] ✓ Uwierzytelniono pomyślnie (sudo)")
            
            self.authenticated = True
            return True
            
        except subprocess.TimeoutExpired:
            self.log.emit("[AUTH] ✗ Przekroczono czas na uwierzytelnienie")
            return False
        except subprocess.CalledProcessError as e:
            self.log.emit(f"[AUTH] ✗ Błąd uwierzytelniania: {e}")
            return False
        except Exception as e:
            self.log.emit(f"[AUTH] ✗ Nieoczekiwany błąd: {e}")
            return False
    
    def start_sudo_keepalive(self):
        """Utrzymuj aktywną sesję sudo w tle"""
        import threading
        def keepalive():
            while self.authenticated and not self.isFinished():
                try:
                    subprocess.run(["sudo", "-v"], capture_output=True, check=True)
                except:
                    pass
                import time
                time.sleep(25)  # Odśwież co 25 sekund
        
        thread = threading.Thread(target=keepalive, daemon=True)
        thread.start()
        
    def run_with_auth(self, cmd):
        """Uruchom komendę z uprawnieniami root (tylko dla pacman)"""
        if self.use_pkexec:
            return subprocess.run(["pkexec"] + cmd, capture_output=True, text=True, check=True)
        else:
            return subprocess.run(["sudo"] + cmd, capture_output=True, text=True, check=True)
        
    def run(self):
        try:
            # UWIERZYTELNIENIE NA POCZĄTKU - TYLKO RAZ!
            self.progress.emit(0, "Uwierzytelnianie...")
            if not self.authenticate_once():
                self.finished.emit(False, "Anulowano uwierzytelnienie")
                return
            
            total_steps = len(self.packages) + len(self.aur_packages) + 2
            current_step = 0
            
            self.progress.emit(int(current_step/total_steps*100), "Aktualizacja bazy pakietów...")
            self.log.emit("\n[INFO] Aktualizacja bazy danych pacman...")
            self.log.emit(f"[INFO] Używam: {'pkexec' if self.use_pkexec else 'sudo'}")
            result = self.run_with_auth(["pacman", "-Sy", "--noconfirm"])
            self.log.emit(result.stdout if result.stdout else "[OK] Baza zaktualizowana")
            if result.stderr:
                self.log.emit(result.stderr)
            current_step += 1
            
            if self.packages:
                for pkg in self.packages:
                    self.progress.emit(int(current_step/total_steps*100), f"Instalacja: {pkg}")
                    self.log.emit(f"\n[PACMAN] Instalacja pakietu: {pkg}")
                    result = self.run_with_auth(["pacman", "-S", "--noconfirm", "--needed", pkg])
                    if result.stdout:
                        for line in result.stdout.split('\n'):
                            if line.strip():
                                self.log.emit(line)
                    if result.stderr:
                        for line in result.stderr.split('\n'):
                            if line.strip():
                                self.log.emit(line)
                    self.log.emit(f"[OK] {pkg} zainstalowany pomyślnie")
                    current_step += 1
            
            if self.aur_packages:
                yay_check = subprocess.run(["which", "yay"], capture_output=True)
                if yay_check.returncode == 0:
                    self.log.emit("\n[AUR] Znaleziono yay - instalacja pakietów z AUR")
                    self.log.emit("[INFO] yay będzie uruchomiony w osobnym oknie terminala")
                    self.log.emit("[INFO] Zostaniesz poproszony o przejrzenie PKGBUILD i potwierdzenie")
                    
                    # Znajdź dostępny emulator terminala
                    terminals = [
                        "konsole", "gnome-terminal", "xfce4-terminal", 
                        "mate-terminal", "lxterminal", "xterm"
                    ]
                    terminal_cmd = None
                    for term in terminals:
                        if subprocess.run(["which", term], capture_output=True).returncode == 0:
                            terminal_cmd = term
                            break
                    
                    if not terminal_cmd:
                        self.log.emit("[ERROR] Nie znaleziono emulatora terminala!")
                        self.log.emit("[ERROR] Zainstaluj jeden z: konsole, gnome-terminal, xterm")
                        self.log.emit("[INFO] Pomijam pakiety AUR")
                        current_step += len(self.aur_packages)
                    else:
                        self.log.emit(f"[INFO] Używam terminala: {terminal_cmd}")
                        
                        for pkg in self.aur_packages:
                            self.progress.emit(int(current_step/total_steps*100), f"Instalacja z AUR: {pkg}")
                            self.log.emit(f"\n[YAY] Instalacja pakietu AUR: {pkg}")
                            self.log.emit(f"[INFO] Otwieranie terminala dla instalacji {pkg}...")
                            self.log.emit("[INFO] PRZECZYTAJ PKGBUILD I POTWIERDŹ INSTALACJĘ!")
                            
                            # Uruchom yay w osobnym terminalu
                            # yay jako zwykły użytkownik (automatycznie użyje sudo gdy potrzebuje)
                            if terminal_cmd == "konsole":
                                term_args = ["konsole", "--hold", "-e", "yay", "-S", "--needed", pkg]
                            elif terminal_cmd == "gnome-terminal":
                                term_args = ["gnome-terminal", "--", "bash", "-c", f"yay -S --needed {pkg}; echo 'Naciśnij Enter aby zamknąć...'; read"]
                            elif terminal_cmd == "xfce4-terminal":
                                term_args = ["xfce4-terminal", "--hold", "-e", f"yay -S --needed {pkg}"]
                            elif terminal_cmd == "mate-terminal":
                                term_args = ["mate-terminal", "-e", f"bash -c 'yay -S --needed {pkg}; echo Naciśnij Enter...; read'"]
                            elif terminal_cmd == "lxterminal":
                                term_args = ["lxterminal", "--command", f"bash -c 'yay -S --needed {pkg}; echo Naciśnij Enter...; read'"]
                            else:  # xterm
                                term_args = ["xterm", "-hold", "-e", "yay", "-S", "--needed", pkg]
                            
                            # Uruchom i czekaj na zakończenie
                            result = subprocess.run(term_args, check=True)
                            
                            self.log.emit(f"[OK] Terminal zamknięty - sprawdzanie instalacji {pkg}...")
                            
                            # Sprawdź czy pakiet został zainstalowany
                            check = subprocess.run(["pacman", "-Q", pkg.split()[0]], capture_output=True)
                            if check.returncode == 0:
                                self.log.emit(f"[OK] ✓ {pkg} zainstalowany pomyślnie")
                            else:
                                self.log.emit(f"[WARNING] ⚠ {pkg} może nie być zainstalowany (pominięto lub błąd)")
                            
                            current_step += 1
                else:
                    self.log.emit("\n[OSTRZEŻENIE] yay nie jest zainstalowany - pomijam pakiety AUR")
                    self.progress.emit(int(current_step/total_steps*100), "Pomijam pakiety AUR (brak yay)")
                    current_step += len(self.aur_packages)
            
            self.progress.emit(95, "Czyszczenie cache...")
            self.log.emit("\n[CLEANUP] Czyszczenie cache pacmana...")
            result = self.run_with_auth(["pacman", "-Sc", "--noconfirm"])
            if result.stdout:
                self.log.emit(result.stdout)
            
            self.progress.emit(100, "Instalacja zakończona!")
            self.log.emit("\n" + "=" * 60)
            self.log.emit("✅ INSTALACJA ZAKOŃCZONA POMYŚLNIE!")
            self.log.emit("=" * 60)
            self.authenticated = False  # Zakończ sesję
            self.finished.emit(True, "Wszystkie pakiety zostały zainstalowane pomyślnie!")
            
        except subprocess.CalledProcessError as e:
            error_msg = f"Błąd instalacji: {e}"
            self.log.emit(f"\n❌ BŁĄD: {error_msg}")
            if e.stdout:
                self.log.emit(f"STDOUT: {e.stdout}")
            if e.stderr:
                self.log.emit(f"STDERR: {e.stderr}")
            self.authenticated = False
            self.finished.emit(False, error_msg)
        except Exception as e:
            error_msg = f"Nieoczekiwany błąd: {e}"
            self.log.emit(f"\n❌ BŁĄD: {error_msg}")
            self.authenticated = False
            self.finished.emit(False, error_msg)

class CookieOSOOBE(QMainWindow):
    def __init__(self):
        super().__init__()
        self.current_panel = 0
        self.selected_browser = None
        self.selected_tools = set()
        self.selected_apps = set()
        self.expanded_baskets = set()
        self.selected_cursor = "default"
        self.selected_grub = "default"
        self.selected_icons = "default"
        self.selected_fonts = set(["noto"])
        
        self.init_ui()
        
    def init_ui(self):
        self.setWindowTitle("CookieOS OOBE v2.0")
        self.setMinimumSize(1200, 800)
        self.showFullScreen()
        
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        main_layout = QVBoxLayout(central_widget)
        main_layout.setContentsMargins(30, 30, 30, 30)
        main_layout.setSpacing(20)
        
        # Header z logo
        header = QWidget()
        header_layout = QHBoxLayout(header)
        logo = QLabel("🍪")
        logo.setStyleSheet("font-size: 48px;")
        title = QLabel("CookieOS Setup")
        title.setStyleSheet("font-size: 28px; font-weight: bold; color: #2a82da;")
        header_layout.addWidget(logo)
        header_layout.addWidget(title)
        header_layout.addStretch()
        main_layout.addWidget(header)
        
        # Progress bar
        self.progress_widget = QWidget()
        self.progress_widget.setStyleSheet("""
            QWidget {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #1a1a1a, stop:1 #2a2a2a);
                border-radius: 15px;
                padding: 15px;
            }
        """)
        progress_layout = QHBoxLayout(self.progress_widget)
        self.progress_dots = []
        
        steps = ["Witaj", "Przeglądarka", "Narzędzia", "Aplikacje", "Customizacja", "Instalacja", "Koniec"]
        for i, step in enumerate(steps):
            dot = QPushButton(str(i + 1))
            dot.setFixedSize(50, 50)
            dot.setEnabled(False)
            dot.setStyleSheet(self.get_dot_style(False))
            progress_layout.addWidget(dot)
            self.progress_dots.append(dot)
            
            if i < len(steps) - 1:
                line = QFrame()
                line.setFrameShape(QFrame.Shape.HLine)
                line.setStyleSheet("background-color: #444; min-height: 3px;")
                progress_layout.addWidget(line)
        
        main_layout.addWidget(self.progress_widget)
        
        # Panel title
        self.panel_title = QLabel()
        self.panel_title.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.panel_title.setStyleSheet("""
            font-size: 32px;
            font-weight: bold;
            color: white;
            margin: 10px 0;
        """)
        main_layout.addWidget(self.panel_title)
        
        # Panel container
        self.panel_container = QWidget()
        self.panel_container.setStyleSheet("""
            QWidget {
                background: qlineargradient(x1:0, y1:0, x2:0, y2:1,
                    stop:0 #2a2a2a, stop:1 #1a1a1a);
                border-radius: 20px;
                padding: 20px;
            }
        """)
        self.panel_layout = QVBoxLayout(self.panel_container)
        main_layout.addWidget(self.panel_container, 1)
        
        # Navigation
        nav_layout = QHBoxLayout()
        self.btn_back = QPushButton("◀ Wstecz")
        self.btn_back.setFixedSize(150, 50)
        self.btn_back.clicked.connect(self.go_back)
        self.btn_next = QPushButton("Dalej ▶")
        self.btn_next.setFixedSize(150, 50)
        self.btn_next.clicked.connect(self.go_next)
        
        nav_layout.addWidget(self.btn_back)
        nav_layout.addStretch()
        nav_layout.addWidget(self.btn_next)
        main_layout.addLayout(nav_layout)
        
        self.set_dark_theme()
        self.show_panel(0)
        
    def set_dark_theme(self):
        palette = QPalette()
        palette.setColor(QPalette.ColorRole.Window, QColor(20, 20, 20))
        palette.setColor(QPalette.ColorRole.WindowText, QColor(255, 255, 255))
        palette.setColor(QPalette.ColorRole.Base, QColor(30, 30, 30))
        palette.setColor(QPalette.ColorRole.AlternateBase, QColor(40, 40, 40))
        palette.setColor(QPalette.ColorRole.Button, QColor(40, 40, 40))
        palette.setColor(QPalette.ColorRole.ButtonText, QColor(255, 255, 255))
        palette.setColor(QPalette.ColorRole.Highlight, QColor(42, 130, 218))
        self.setPalette(palette)
        
        self.setStyleSheet("""
            QPushButton {
                background: qlineargradient(x1:0, y1:0, x2:0, y2:1,
                    stop:0 #3a3a3a, stop:1 #2a2a2a);
                border: 2px solid #555;
                border-radius: 10px;
                padding: 12px;
                color: white;
                font-weight: bold;
                font-size: 14px;
            }
            QPushButton:hover {
                background: qlineargradient(x1:0, y1:0, x2:0, y2:1,
                    stop:0 #4a4a4a, stop:1 #3a3a3a);
                border-color: #2a82da;
            }
            QPushButton:pressed {
                background-color: #2a2a2a;
            }
            QPushButton:disabled {
                background-color: #2a2a2a;
                color: #666;
                border-color: #333;
            }
            QRadioButton, QCheckBox {
                color: white;
                spacing: 10px;
                font-size: 14px;
            }
            QComboBox {
                background-color: #3a3a3a;
                border: 2px solid #555;
                border-radius: 8px;
                padding: 8px;
                color: white;
                font-size: 14px;
            }
            QComboBox:hover {
                border-color: #2a82da;
            }
            QComboBox::drop-down {
                border: none;
            }
            QComboBox QAbstractItemView {
                background-color: #2a2a2a;
                border: 2px solid #555;
                selection-background-color: #2a82da;
                color: white;
            }
        """)
        
    def get_dot_style(self, active):
        if active:
            return """
                QPushButton {
                    background: qlineargradient(x1:0, y1:0, x2:1, y2:1,
                        stop:0 #2a82da, stop:1 #1a5faa);
                    border: none;
                    border-radius: 25px;
                    color: white;
                    font-weight: bold;
                    font-size: 18px;
                }
            """
        return """
            QPushButton {
                background-color: #3a3a3a;
                border: 2px solid #555;
                border-radius: 25px;
                color: #888;
                font-size: 16px;
            }
        """
    
    def clear_panel(self):
        while self.panel_layout.count():
            child = self.panel_layout.takeAt(0)
            if child.widget():
                child.widget().deleteLater()
    
    def show_panel(self, panel_id):
        self.current_panel = panel_id
        self.clear_panel()
        
        for i, dot in enumerate(self.progress_dots):
            dot.setStyleSheet(self.get_dot_style(i == panel_id))
        
        self.btn_back.setEnabled(panel_id > 0 and panel_id < 6)
        
        if panel_id == 0:
            self.show_welcome_panel()
        elif panel_id == 1:
            self.show_browser_panel()
        elif panel_id == 2:
            self.show_tools_panel()
        elif panel_id == 3:
            self.show_apps_panel()
        elif panel_id == 4:
            self.show_customization_panel()
        elif panel_id == 5:
            self.show_install_panel()
        elif panel_id == 6:
            self.show_finish_panel()
    
    def show_welcome_panel(self):
        self.panel_title.setText("Witaj w CookieOS")
        
        label = QLabel("🍪")
        label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        label.setStyleSheet("font-size: 120px;")
        self.panel_layout.addWidget(label)
        
        desc = QLabel("System oparty na Arch Linux\nstworzony z myślą o prostocie, wydajności i customizacji")
        desc.setAlignment(Qt.AlignmentFlag.AlignCenter)
        desc.setStyleSheet("color: #aaa; font-size: 18px; margin: 20px;")
        self.panel_layout.addWidget(desc)
        
        version = QLabel("v2.0 - Rozszerzona edycja")
        version.setAlignment(Qt.AlignmentFlag.AlignCenter)
        version.setStyleSheet("color: #666; font-size: 14px;")
        self.panel_layout.addWidget(version)
        
        self.btn_next.setText("Rozpocznij ▶")
    
    def show_browser_panel(self):
        self.panel_title.setText("Wybór Przeglądarki")
        
        desc = QLabel("Która przeglądarka będzie domyślna?")
        desc.setAlignment(Qt.AlignmentFlag.AlignCenter)
        desc.setStyleSheet("color: #aaa; margin-bottom: 20px; font-size: 16px;")
        self.panel_layout.addWidget(desc)
        
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setStyleSheet("QScrollArea { border: none; background: transparent; }")
        scroll_content = QWidget()
        grid = QGridLayout(scroll_content)
        grid.setSpacing(15)
        
        self.browser_group = QButtonGroup()
        
        for i, browser in enumerate(CONFIG["browsers"]):
            container = QWidget()
            container.setFixedHeight(120)
            container_layout = QVBoxLayout(container)
            container.setStyleSheet("""
                QWidget {
                    background: qlineargradient(x1:0, y1:0, x2:0, y2:1,
                        stop:0 #3a3a3a, stop:1 #2a2a2a);
                    border: 2px solid #555;
                    border-radius: 15px;
                    padding: 15px;
                }
                QWidget:hover {
                    border-color: #2a82da;
                    background: qlineargradient(x1:0, y1:0, x2:0, y2:1,
                        stop:0 #4a4a4a, stop:1 #3a3a3a);
                }
            """)
            
            btn = QRadioButton(browser["name"])
            btn.setProperty("browser_id", browser["id"])
            btn.toggled.connect(self.on_browser_selected)
            btn.setStyleSheet("font-size: 16px; font-weight: bold;")
            
            desc_label = QLabel(browser["desc"])
            desc_label.setStyleSheet("color: #888; font-size: 12px; margin-top: 5px;")
            desc_label.setWordWrap(True)
            
            container_layout.addWidget(btn)
            container_layout.addWidget(desc_label)
            container_layout.addStretch()
            
            self.browser_group.addButton(btn)
            grid.addWidget(container, i // 3, i % 3)
            
            if self.selected_browser == browser["id"]:
                btn.setChecked(True)
        
        scroll.setWidget(scroll_content)
        self.panel_layout.addWidget(scroll)
        
        self.btn_next.setText("Dalej ▶")
        self.btn_next.setEnabled(self.selected_browser is not None)
    
    def on_browser_selected(self):
        for btn in self.browser_group.buttons():
            if btn.isChecked():
                self.selected_browser = btn.property("browser_id")
                self.btn_next.setEnabled(True)
                break
    
    def show_tools_panel(self):
        self.panel_title.setText("Narzędzia Systemowe")
        
        desc = QLabel("Wybierz dodatkowe narzędzia dla programistów i użytkowników zaawansowanych")
        desc.setAlignment(Qt.AlignmentFlag.AlignCenter)
        desc.setStyleSheet("color: #aaa; margin-bottom: 20px; font-size: 16px;")
        self.panel_layout.addWidget(desc)
        
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setStyleSheet("QScrollArea { border: none; background: transparent; }")
        scroll_content = QWidget()
        grid = QGridLayout(scroll_content)
        grid.setSpacing(10)
        
        for i, tool in enumerate(CONFIG["tools"]):
            container = QWidget()
            container.setFixedHeight(90)
            container.setStyleSheet("""
                QWidget {
                    background-color: #2a2a2a;
                    border: 2px solid #444;
                    border-radius: 10px;
                    padding: 10px;
                }
                QWidget:hover {
                    border-color: #2a82da;
                }
            """)
            container_layout = QVBoxLayout(container)
            
            checkbox = QCheckBox(tool["name"])
            checkbox.setProperty("tool_id", tool["id"])
            checkbox.setChecked(tool["id"] in self.selected_tools)
            checkbox.setStyleSheet("font-size: 14px; font-weight: bold;")
            checkbox.toggled.connect(lambda checked, tid=tool["id"]: 
                                   self.selected_tools.add(tid) if checked 
                                   else self.selected_tools.discard(tid))
            
            desc_label = QLabel(tool["desc"])
            desc_label.setStyleSheet("color: #888; font-size: 11px;")
            
            container_layout.addWidget(checkbox)
            container_layout.addWidget(desc_label)
            
            grid.addWidget(container, i // 4, i % 4)
        
        scroll.setWidget(scroll_content)
        self.panel_layout.addWidget(scroll)
    
    def show_apps_panel(self):
        self.panel_title.setText("Wybór Aplikacji")
        
        desc = QLabel("Kliknij na kategorię aby zobaczyć dostępne aplikacje")
        desc.setAlignment(Qt.AlignmentFlag.AlignCenter)
        desc.setStyleSheet("color: #aaa; margin-bottom: 20px; font-size: 16px;")
        self.panel_layout.addWidget(desc)
        
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setStyleSheet("QScrollArea { border: none; background: transparent; }")
        scroll_content = QWidget()
        scroll_layout = QVBoxLayout(scroll_content)
        
        for basket in CONFIG["baskets"]:
            basket_widget = self.create_basket_widget(basket)
            scroll_layout.addWidget(basket_widget)
        
        scroll_layout.addStretch()
        scroll.setWidget(scroll_content)
        self.panel_layout.addWidget(scroll)
    
    def create_basket_widget(self, basket):
        widget = QWidget()
        layout = QVBoxLayout(widget)
        
        header = QPushButton(f"{basket['icon']} {basket['name']} ({len(basket['apps'])} aplikacji)")
        header.setFixedHeight(70)
        header.setStyleSheet("""
            QPushButton {
                font-size: 18px;
                font-weight: bold;
                text-align: left;
                padding-left: 25px;
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #2a82da, stop:1 #1a5faa);
                border: none;
                border-radius: 12px;
            }
            QPushButton:hover {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #3a92ea, stop:1 #2a6fba);
            }
        """)
        header.clicked.connect(lambda: self.toggle_basket(basket['id']))
        layout.addWidget(header)
        
        if basket['id'] in self.expanded_baskets:
            content = QWidget()
            content_layout = QVBoxLayout(content)
            content.setStyleSheet("""
                QWidget {
                    background-color: #2a2a2a;
                    border: 2px solid #444;
                    border-radius: 12px;
                    padding: 15px;
                }
            """)
            
            select_all = QPushButton("✓ Zaznacz/Odznacz wszystkie")
            select_all.setStyleSheet("""
                QPushButton {
                    background-color: #3a3a3a;
                    border: 2px solid #555;
                    border-radius: 8px;
                    padding: 10px;
                    font-size: 13px;
                }
                QPushButton:hover {
                    background-color: #4a4a4a;
                    border-color: #2a82da;
                }
            """)
            select_all.clicked.connect(lambda: self.toggle_all_in_basket(basket))
            content_layout.addWidget(select_all)
            
            app_grid = QGridLayout()
            app_grid.setSpacing(8)
            for i, app in enumerate(basket['apps']):
                checkbox = QCheckBox(app['name'])
                checkbox.setChecked(app['id'] in self.selected_apps)
                checkbox.setStyleSheet("font-size: 13px; padding: 5px;")
                checkbox.toggled.connect(lambda checked, aid=app['id']:
                                       self.selected_apps.add(aid) if checked
                                       else self.selected_apps.discard(aid))
                app_grid.addWidget(checkbox, i // 2, i % 2)
            
            content_layout.addLayout(app_grid)
            layout.addWidget(content)
        
        return widget
    
    def toggle_basket(self, basket_id):
        if basket_id in self.expanded_baskets:
            self.expanded_baskets.remove(basket_id)
        else:
            self.expanded_baskets.add(basket_id)
        self.show_panel(3)
    
    def toggle_all_in_basket(self, basket):
        app_ids = [app['id'] for app in basket['apps']]
        all_selected = all(aid in self.selected_apps for aid in app_ids)
        
        if all_selected:
            self.selected_apps -= set(app_ids)
        else:
            self.selected_apps |= set(app_ids)
        
        self.show_panel(3)
    
    def show_customization_panel(self):
        self.panel_title.setText("Customizacja Systemu")
        
        desc = QLabel("Personalizuj wygląd swojego systemu")
        desc.setAlignment(Qt.AlignmentFlag.AlignCenter)
        desc.setStyleSheet("color: #aaa; margin-bottom: 20px; font-size: 16px;")
        self.panel_layout.addWidget(desc)
        
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setStyleSheet("QScrollArea { border: none; background: transparent; }")
        scroll_content = QWidget()
        main_grid = QGridLayout(scroll_content)
        main_grid.setSpacing(20)
        
        # Cursors
        cursor_widget = QWidget()
        cursor_widget.setStyleSheet("""
            QWidget {
                background-color: #2a2a2a;
                border: 2px solid #444;
                border-radius: 15px;
                padding: 20px;
            }
        """)
        cursor_layout = QVBoxLayout(cursor_widget)
        cursor_label = QLabel("🖱️ Kursor myszy")
        cursor_label.setStyleSheet("font-size: 18px; font-weight: bold; margin-bottom: 10px;")
        cursor_layout.addWidget(cursor_label)
        
        self.cursor_combo = QComboBox()
        for cursor in CONFIG["customization"]["cursors"]:
            self.cursor_combo.addItem(cursor["name"], cursor["id"])
        self.cursor_combo.setCurrentText([c["name"] for c in CONFIG["customization"]["cursors"] if c["id"] == self.selected_cursor][0])
        self.cursor_combo.currentIndexChanged.connect(lambda: setattr(self, 'selected_cursor', self.cursor_combo.currentData()))
        cursor_layout.addWidget(self.cursor_combo)
        main_grid.addWidget(cursor_widget, 0, 0)
        
        # GRUB Theme
        grub_widget = QWidget()
        grub_widget.setStyleSheet("""
            QWidget {
                background-color: #2a2a2a;
                border: 2px solid #444;
                border-radius: 15px;
                padding: 20px;
            }
        """)
        grub_layout = QVBoxLayout(grub_widget)
        grub_label = QLabel("🎨 Motyw GRUB")
        grub_label.setStyleSheet("font-size: 18px; font-weight: bold; margin-bottom: 10px;")
        grub_layout.addWidget(grub_label)
        
        self.grub_combo = QComboBox()
        for grub in CONFIG["customization"]["grub_themes"]:
            self.grub_combo.addItem(grub["name"], grub["id"])
        self.grub_combo.setCurrentText([g["name"] for g in CONFIG["customization"]["grub_themes"] if g["id"] == self.selected_grub][0])
        self.grub_combo.currentIndexChanged.connect(lambda: setattr(self, 'selected_grub', self.grub_combo.currentData()))
        grub_layout.addWidget(self.grub_combo)
        main_grid.addWidget(grub_widget, 0, 1)
        
        # Icons
        icons_widget = QWidget()
        icons_widget.setStyleSheet("""
            QWidget {
                background-color: #2a2a2a;
                border: 2px solid #444;
                border-radius: 15px;
                padding: 20px;
            }
        """)
        icons_layout = QVBoxLayout(icons_widget)
        icons_label = QLabel("🎭 Ikony")
        icons_label.setStyleSheet("font-size: 18px; font-weight: bold; margin-bottom: 10px;")
        icons_layout.addWidget(icons_label)
        
        self.icons_combo = QComboBox()
        for icons in CONFIG["customization"]["icons"]:
            self.icons_combo.addItem(icons["name"], icons["id"])
        self.icons_combo.setCurrentText([i["name"] for i in CONFIG["customization"]["icons"] if i["id"] == self.selected_icons][0])
        self.icons_combo.currentIndexChanged.connect(lambda: setattr(self, 'selected_icons', self.icons_combo.currentData()))
        icons_layout.addWidget(self.icons_combo)
        main_grid.addWidget(icons_widget, 1, 0)
        
        # Fonts
        fonts_widget = QWidget()
        fonts_widget.setStyleSheet("""
            QWidget {
                background-color: #2a2a2a;
                border: 2px solid #444;
                border-radius: 15px;
                padding: 20px;
            }
        """)
        fonts_layout = QVBoxLayout(fonts_widget)
        fonts_label = QLabel("🔤 Czcionki")
        fonts_label.setStyleSheet("font-size: 18px; font-weight: bold; margin-bottom: 10px;")
        fonts_layout.addWidget(fonts_label)
        
        for font in CONFIG["customization"]["fonts"]:
            checkbox = QCheckBox(font["name"])
            checkbox.setProperty("font_id", font["id"])
            checkbox.setChecked(font.get("selected", False) or font["id"] in self.selected_fonts)
            checkbox.toggled.connect(lambda checked, fid=font["id"]:
                                   self.selected_fonts.add(fid) if checked
                                   else self.selected_fonts.discard(fid))
            fonts_layout.addWidget(checkbox)
        
        main_grid.addWidget(fonts_widget, 1, 1)
        
        scroll.setWidget(scroll_content)
        self.panel_layout.addWidget(scroll)
    
    def show_install_panel(self):
        self.panel_title.setText("Instalacja")
        self.btn_back.setEnabled(False)
        self.btn_next.setEnabled(False)
        
        self.install_status = QLabel("Przygotowanie do instalacji...")
        self.install_status.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.install_status.setStyleSheet("font-size: 18px; margin-bottom: 15px; color: #2a82da; font-weight: bold;")
        self.panel_layout.addWidget(self.install_status)
        
        self.install_progress = QProgressBar()
        self.install_progress.setMaximum(100)
        self.install_progress.setFixedHeight(40)
        self.install_progress.setStyleSheet("""
            QProgressBar {
                border: 2px solid #555;
                border-radius: 12px;
                text-align: center;
                font-size: 16px;
                font-weight: bold;
                background-color: #1a1a1a;
            }
            QProgressBar::chunk {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #2a82da, stop:1 #1a5faa);
                border-radius: 10px;
            }
        """)
        self.panel_layout.addWidget(self.install_progress)
        
        log_label = QLabel("📋 Log instalacji:")
        log_label.setStyleSheet("font-weight: bold; margin-top: 20px; margin-bottom: 10px; font-size: 16px;")
        self.panel_layout.addWidget(log_label)
        
        self.install_log = QTextEdit()
        self.install_log.setReadOnly(True)
        self.install_log.setStyleSheet("""
            QTextEdit {
                background-color: #0a0a0a;
                border: 2px solid #555;
                border-radius: 12px;
                padding: 15px;
                font-family: 'Courier New', monospace;
                font-size: 13px;
                color: #00ff00;
            }
        """)
        self.panel_layout.addWidget(self.install_log)
        
        packages = []
        aur_packages = []
        
        # Browser
        if self.selected_browser:
            for browser in CONFIG["browsers"]:
                if browser["id"] == self.selected_browser:
                    if browser.get("aur"):
                        aur_packages.append(browser["pkg"])
                    else:
                        packages.append(browser["pkg"])
        
        # Tools
        for tool in CONFIG["tools"]:
            if tool["id"] in self.selected_tools:
                if tool.get("aur"):
                    aur_packages.append(tool["pkg"])
                else:
                    packages.append(tool["pkg"])
        
        # Apps
        for basket in CONFIG["baskets"]:
            for app in basket["apps"]:
                if app["id"] in self.selected_apps:
                    if app.get("aur"):
                        aur_packages.append(app["pkg"])
                    else:
                        packages.extend(app["pkg"].split())
        
        # Customization
        for cursor in CONFIG["customization"]["cursors"]:
            if cursor["id"] == self.selected_cursor and cursor["pkg"]:
                if cursor.get("aur"):
                    aur_packages.append(cursor["pkg"])
                else:
                    packages.append(cursor["pkg"])
        
        for grub in CONFIG["customization"]["grub_themes"]:
            if grub["id"] == self.selected_grub and grub["pkg"]:
                if grub.get("aur"):
                    aur_packages.append(grub["pkg"])
                else:
                    packages.append(grub["pkg"])
        
        for icons in CONFIG["customization"]["icons"]:
            if icons["id"] == self.selected_icons and icons["pkg"]:
                if icons.get("aur"):
                    aur_packages.append(icons["pkg"])
                else:
                    packages.append(icons["pkg"])
        
        for font in CONFIG["customization"]["fonts"]:
            if font["id"] in self.selected_fonts:
                packages.extend(font["pkg"].split())
        
        self.install_log.append("=" * 70)
        self.install_log.append("   CookieOS OOBE v2.0 - SZCZEGÓŁOWY LOG INSTALACJI")
        self.install_log.append("=" * 70)
        self.install_log.append("")
        self.install_log.append(f"📦 Pakiety z oficjalnych repozytoriów (pacman): {len(packages)}")
        if packages:
            self.install_log.append(f"   {', '.join(packages)}")
        self.install_log.append("")
        if aur_packages:
            self.install_log.append(f"📦 Pakiety z AUR (yay): {len(aur_packages)}")
            self.install_log.append(f"   {', '.join(aur_packages)}")
            self.install_log.append("")
        self.install_log.append("=" * 70)
        self.install_log.append("")
        
        QTimer.singleShot(1500, lambda: self.start_installation(packages, aur_packages))
    
    def start_installation(self, packages, aur_packages):
        self.install_thread = InstallThread(packages, aur_packages)
        self.install_thread.progress.connect(self.on_install_progress)
        self.install_thread.log.connect(self.on_install_log)
        self.install_thread.finished.connect(self.on_install_finished)
        self.install_thread.start()
    
    def on_install_progress(self, progress, message):
        self.install_progress.setValue(progress)
        self.install_status.setText(message)
    
    def on_install_log(self, message):
        self.install_log.append(message)
        scrollbar = self.install_log.verticalScrollBar()
        scrollbar.setValue(scrollbar.maximum())
    
    def on_install_finished(self, success, message):
        if success:
            self.install_log.append(f"\n🎉 {message}")
            QTimer.singleShot(2500, lambda: self.show_panel(6))
        else:
            self.install_log.append(f"\n⚠️ {message}")
            self.install_log.append("\nMożesz wrócić i spróbować ponownie lub pominąć problematyczne pakiety.")
            self.btn_back.setEnabled(True)
    
    def show_finish_panel(self):
        self.panel_title.setText("CookieOS jest gotowy!")
        self.btn_back.setEnabled(False)
        self.btn_next.setVisible(False)
        
        label = QLabel("✨")
        label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        label.setStyleSheet("font-size: 150px;")
        self.panel_layout.addWidget(label)
        
        desc = QLabel("Twój system został skonfigurowany\ni jest gotowy do użycia!\n\nDziękujemy za wybór CookieOS")
        desc.setAlignment(Qt.AlignmentFlag.AlignCenter)
        desc.setStyleSheet("color: #aaa; font-size: 20px; margin: 30px; line-height: 1.6;")
        self.panel_layout.addWidget(desc)
        
        finish_btn = QPushButton("🍪 Zakończ i uruchom system")
        finish_btn.setFixedHeight(70)
        finish_btn.setStyleSheet("""
            QPushButton {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #2a82da, stop:1 #1a5faa);
                font-size: 20px;
                font-weight: bold;
                border: none;
                border-radius: 15px;
            }
            QPushButton:hover {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                    stop:0 #3a92ea, stop:1 #2a6fba);
            }
        """)
        finish_btn.clicked.connect(self.close)
        self.panel_layout.addWidget(finish_btn)
    
    def go_back(self):
        if self.current_panel > 0:
            self.show_panel(self.current_panel - 1)
    
    def go_next(self):
        if self.current_panel < 6:
            self.show_panel(self.current_panel + 1)
    
    def keyPressEvent(self, event):
        if event.key() == Qt.Key.Key_Escape:
            pass  # Zablokuj ESC w pełnym ekranie
        elif event.key() == Qt.Key.Key_F11:
            if self.isFullScreen():
                self.showNormal()
            else:
                self.showFullScreen()

def main():
    app = QApplication(sys.argv)
    window = CookieOSOOBE()
    window.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()