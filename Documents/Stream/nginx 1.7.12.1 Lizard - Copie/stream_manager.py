#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gestionnaire de streams RTMP pour Nginx
API backend pour gérer dynamiquement les streams
"""

import json
import os
import subprocess
import sys
import time
import shutil
from pathlib import Path
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from datetime import datetime

# Import OBS WebSocket (optionnel, utilisé seulement si configuré)
OBS_WEBSOCKET_AVAILABLE = False
try:
    import obsws_python as obs
    OBS_WEBSOCKET_AVAILABLE = True
except ImportError:
    try:
        # Alternative: utiliser websocket directement
        import websocket
        import json as json_lib
        OBS_WEBSOCKET_AVAILABLE = True
    except ImportError:
        pass

app = Flask(__name__)
CORS(app)

# Chemins
BASE_DIR = Path(__file__).parent
STREAMS_FILE = BASE_DIR / "streams.json"
RTMP_CONFIG_FILE = BASE_DIR / "conf" / "rtmp_streams.conf"
NGINX_CONF = BASE_DIR / "conf" / "nginx.conf"
NGINX_RELOAD_COMMAND = "nginx -s reload"

# Chemins Stunnel
STUNNEL_DIR = Path("C:/Users/Diddy/Documents/Stream/stunnel")
STUNNEL_EXE = STUNNEL_DIR / "bin" / "stunnel.exe"
STUNNEL_CONF = STUNNEL_DIR / "config" / "stunnel.conf"
STUNNEL_PID_FILE = STUNNEL_DIR / "stunnel.pid"

# Fichier de configuration
CONFIG_FILE = BASE_DIR / "config.json"

# Mode FFmpeg pour contrôle dynamique (sans couper les autres streams)
# Peut être modifié via l'interface web ou config.json
USE_FFMPEG_PROXY = True  # Valeur par défaut (sera chargée depuis config.json)
FFMPEG_PROCESSES = {}  # {stream_id: subprocess.Popen}
FFMPEG_EXE = None  # Sera détecté automatiquement

# Configuration OBS WebSocket (chargée depuis config.json)
OBS_WS_HOST = "localhost"
OBS_WS_PORT = 4455
OBS_WS_PASSWORD = ""
OBS_WS_ENABLED = False
OBS_WS_CLIENT = None


def load_config():
    """Charge la configuration depuis config.json"""
    global USE_FFMPEG_PROXY, OBS_WS_HOST, OBS_WS_PORT, OBS_WS_PASSWORD, OBS_WS_ENABLED
    if CONFIG_FILE.exists():
        try:
            with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                config = json.load(f)
                USE_FFMPEG_PROXY = config.get('use_ffmpeg_proxy', True)
                # Charger la config OBS WebSocket
                obs_config = config.get('obs_websocket', {})
                OBS_WS_ENABLED = obs_config.get('enabled', False)
                OBS_WS_HOST = obs_config.get('host', 'localhost')
                OBS_WS_PORT = obs_config.get('port', 4455)
                OBS_WS_PASSWORD = obs_config.get('password', '')
                return config
        except:
            pass
    # Créer le fichier de config par défaut
    default_config = {
        "use_ffmpeg_proxy": True,
        "auto_start_streams": True,
        "obs_websocket": {
            "enabled": False,
            "host": "localhost",
            "port": 4455,
            "password": ""
        }
    }
    save_config(default_config)
    return default_config


def save_config(config=None):
    """Sauvegarde la configuration dans config.json"""
    global USE_FFMPEG_PROXY, OBS_WS_HOST, OBS_WS_PORT, OBS_WS_PASSWORD, OBS_WS_ENABLED
    if config is None:
        config = {
            "use_ffmpeg_proxy": USE_FFMPEG_PROXY,
            "auto_start_streams": True,
            "obs_websocket": {
                "enabled": OBS_WS_ENABLED,
                "host": OBS_WS_HOST,
                "port": OBS_WS_PORT,
                "password": OBS_WS_PASSWORD
            }
        }
    with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=2, ensure_ascii=False)


def load_streams():
    """Charge la liste des streams depuis le fichier JSON"""
    if STREAMS_FILE.exists():
        with open(STREAMS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []


def save_streams(streams):
    """Sauvegarde la liste des streams dans le fichier JSON"""
    with open(STREAMS_FILE, 'w', encoding='utf-8') as f:
        json.dump(streams, f, indent=2, ensure_ascii=False)


def generate_rtmp_config():
    """Génère le fichier de configuration RTMP à partir des streams"""
    streams = load_streams()
    
    config_lines = []
    # FILTRER UNIQUEMENT les streams avec enabled=True (exclure explicitement les False)
    enabled_streams = [s for s in streams if s.get('enabled') is True]
    disabled_streams = [s for s in streams if s.get('enabled') is False]
    
    if USE_FFMPEG_PROXY:
        # Mode FFmpeg HYBRIDE : Nginx push vers OBS + FFmpeg gère dynamiquement les autres
        # Cela permet de contrôler dynamiquement les flux sans couper OBS
        
        # IMPORTANT : 
        # 1. OBS doit être configuré pour recevoir depuis un URL RTMP local
        # 2. Les streams avec platform="OBS" sont pushés si activés (commentés si désactivés)
        # 3. Les autres streams sont gérés par FFmpeg (démarrage/arrêt dynamique)
        
        # Chercher le stream OBS
        obs_streams = [s for s in streams if s.get('platform', '').upper() == 'OBS']
        other_enabled_streams = [s for s in enabled_streams if s.get('platform', '').upper() != 'OBS']
        other_disabled_streams = [s for s in disabled_streams if s.get('platform', '').upper() != 'OBS']
        
        # Pusher vers OBS seulement si activé (sinon commenter avec #)
        if obs_streams:
            obs_stream = obs_streams[0]  # Prendre le premier stream OBS
            obs_url = obs_stream.get('url', '')
            obs_enabled = obs_stream.get('enabled', True)
            if obs_url:
                if obs_enabled:
                    config_lines.append(f"\t\t# Push vers OBS (nécessaire pour qu'OBS continue)")
                    config_lines.append(f"\t\t# {obs_stream.get('name', 'OBS')}")
                    config_lines.append(f"\t\tpush {obs_url};")
                else:
                    config_lines.append(f"\t\t# Stream OBS DÉSACTIVÉ")
                    config_lines.append(f"\t\t# {obs_stream.get('name', 'OBS')}")
                    config_lines.append(f"\t\t# push {obs_url};")
                config_lines.append("")
        
        # Les autres streams sont gérés par FFmpeg (démarrage/arrêt dynamique)
        config_lines.append("\t\t# Les autres streams sont gérés par FFmpeg (contrôle dynamique)")
        config_lines.append("\t\t# Activation/désactivation sans couper OBS ni recharger Nginx")
        
        if other_disabled_streams:
            config_lines.append("")
            config_lines.append("\t\t# =========================================")
            config_lines.append("\t\t# Streams DÉSACTIVÉS (gérés par FFmpeg):")
            for stream in other_disabled_streams:
                config_lines.append(f"\t\t# - {stream.get('name', 'Stream')}")
            config_lines.append("\t\t# =========================================")
    else:
        # Mode classique : push direct depuis Nginx (vers les plateformes OU vers OBS)
        # IMPORTANT : Les streams activés sont pushés, les désactivés sont commentés avec #
        if not enabled_streams:
            config_lines.append("\t\t# Aucun stream actif")
        else:
            for stream in enabled_streams:
                name = stream.get('name', 'Stream')
                url = stream.get('url', '')
                if url:
                    config_lines.append(f"\t\t# {name}")
                    config_lines.append(f"\t\tpush {url};")
        
        # Ajouter les streams désactivés comme commentaires (avec # devant push)
        if disabled_streams:
            config_lines.append("")
            config_lines.append("\t\t# =========================================")
            config_lines.append("\t\t# Streams DÉSACTIVÉS (commentés):")
            for stream in disabled_streams:
                name = stream.get('name', 'Stream')
                url = stream.get('url', '')
                if url:
                    config_lines.append(f"\t\t# {name} (DÉSACTIVÉ)")
                    config_lines.append(f"\t\t# push {url};")
            config_lines.append("\t\t# =========================================")
    
    # Ajouter une ligne vide à la fin pour la lisibilité
    config_content = "\n".join(config_lines) + "\n"
    
    # Écrire avec flush pour s'assurer que le fichier est écrit immédiatement
    with open(RTMP_CONFIG_FILE, 'w', encoding='utf-8') as f:
        f.write(config_content)
        f.flush()
        try:
            os.fsync(f.fileno())  # Forcer l'écriture sur disque
        except:
            pass
    
    return len(enabled_streams)


def find_ffmpeg():
    """Trouve l'exécutable FFmpeg"""
    global FFMPEG_EXE
    if FFMPEG_EXE:
        return FFMPEG_EXE
    
    # 0. Vérifier d'abord le dossier local (priorité pour le zippage)
    local_ffmpeg = BASE_DIR / "ffmpeg" / "bin" / "ffmpeg.exe"
    if local_ffmpeg.exists():
        FFMPEG_EXE = local_ffmpeg
        return FFMPEG_EXE
    
    # 1. Vérifier le chemin spécifié dans config.json
    config = load_config()
    custom_path = config.get('ffmpeg_path', '').strip()
    if custom_path:
        # Si c'est un chemin relatif, le résoudre par rapport à BASE_DIR
        custom_ffmpeg = Path(custom_path)
        if not custom_ffmpeg.is_absolute():
            custom_ffmpeg = BASE_DIR / custom_path
        if custom_ffmpeg.exists():
            FFMPEG_EXE = custom_ffmpeg
            return FFMPEG_EXE
    
    # 2. Chercher ffmpeg dans PATH
    ffmpeg_path = shutil.which('ffmpeg')
    if ffmpeg_path:
        FFMPEG_EXE = Path(ffmpeg_path)
        return FFMPEG_EXE
    
    # 3. Chercher dans des chemins communs Windows
    common_paths = [
        # Chemin exact trouvé sur le système utilisateur
        Path("F:/Téléchargement/ffmpeg-2025-10-30-git-00c23bafb0-essentials_build/ffmpeg-2025-10-30-git-00c23bafb0-essentials_build/bin/ffmpeg.exe"),
        Path("F:/Téléchargement/ffmpeg-2025-10-30-git-00c23bafb0-essentials_build/bin/ffmpeg.exe"),  # Sans double dossier
        Path("F:/Téléchargement/ffmpeg-8.0-essentials_build/bin/ffmpeg.exe"),  # Alternative
        Path("F:/Téléchargement/ffmpeg-8.0/ffmpeg-8.0/bin/ffmpeg.exe"),  # Ancien chemin
        Path("F:/Téléchargement/ffmpeg-8.0/bin/ffmpeg.exe"),  # Chemin direct alternatif
        Path("C:/ffmpeg/bin/ffmpeg.exe"),
        Path("C:/Program Files/ffmpeg/bin/ffmpeg.exe"),
        BASE_DIR / "ffmpeg.exe",
        BASE_DIR / "ffmpeg" / "bin" / "ffmpeg.exe",  # Dossier local pour zippage
    ]
    
    for path in common_paths:
        if path.exists():
            FFMPEG_EXE = path
            return FFMPEG_EXE
    
    # 4. Recherche récursive dans les dossiers de téléchargement FFmpeg
    search_dirs = [
        Path("F:/Téléchargement/ffmpeg-2025-10-30-git-00c23bafb0-essentials_build"),
        Path("F:/Téléchargement/ffmpeg-8.0-essentials_build"),
        Path("F:/Téléchargement/ffmpeg-8.0"),
        Path("F:/Téléchargement"),
    ]
    
    for ffmpeg_dir in search_dirs:
        if not ffmpeg_dir.exists():
            continue
        try:
            # Chercher récursivement ffmpeg.exe (limite pour éviter les scans trop longs)
            found = list(ffmpeg_dir.rglob("ffmpeg.exe"))
            if found:
                FFMPEG_EXE = found[0]
                return FFMPEG_EXE
            # Si pas trouvé, chercher aussi "ffmpeg" dans le nom (pour les variantes)
            for exe_file in ffmpeg_dir.rglob("*.exe"):
                if "ffmpeg" in exe_file.name.lower() and exe_file.name.lower().startswith("ffmpeg"):
                    FFMPEG_EXE = exe_file
                    return FFMPEG_EXE
        except Exception as e:
            # En cas d'erreur (permissions, etc.), continuer
            pass
    
    return None


def start_ffmpeg_relay(stream_id, destination_url):
    """Démarre un relais FFmpeg pour un stream"""
    try:
        # Vérifier d'abord si un processus existe déjà pour ce stream_id
        if stream_id in FFMPEG_PROCESSES:
            old_process = FFMPEG_PROCESSES[stream_id]
            try:
                # Vérifier si le processus est toujours actif
                if old_process.poll() is None:
                    # Le processus existe encore, l'arrêter d'abord
                    stop_ffmpeg_relay(stream_id)
                    # Attendre plus longtemps pour être sûr que le processus est bien arrêté
                    time.sleep(1.0)
                else:
                    # Le processus est déjà mort, le supprimer du dictionnaire
                    try:
                        del FFMPEG_PROCESSES[stream_id]
                    except:
                        pass
            except:
                pass
        
        ffmpeg_exe = find_ffmpeg()
        if not ffmpeg_exe:
            return None, "FFmpeg introuvable. Installez FFmpeg et ajoutez-le au PATH."
        
        # Source : le stream RTMP depuis Nginx
        source_url = "rtmp://localhost:1935/live"
        
        # Commande FFmpeg pour relayer RTMP sans transcoder (OPTIMISÉ FAIBLE LATENCE)
        # IMPORTANT: On ajoute un commentaire avec stream_id pour pouvoir retrouver le processus
        cmd = [
            str(ffmpeg_exe),
            # Options de faible latence (modifiées pour plus de compatibilité)
            '-fflags', '+genpts',            # Générer les PTS si manquants
            '-flags', 'low_delay',           # Mode faible latence
            '-strict', 'experimental',
            # '-avioflags', 'direct',        # Désactivé temporairement (peut causer des problèmes)
            # Entrée - utiliser listen pour RTMP en mode live
            '-i', source_url,
            # Option pour gérer les streams RTMP live
            '-analyzeduration', '1000000',   # Analyser les 10 premières secondes
            '-probesize', '1000000',         # Taille de la sonde
            # Codec copy (pas de transcodage = qualité parfaite)
            '-c', 'copy',
            # Format de sortie
            '-f', 'flv',
            # Metadata pour identifier le stream (visible dans la ligne de commande)
            '-metadata', f'comment=STREAM_ID:{stream_id}',  # Tag pour retrouver le processus
            # Destination
            destination_url,
            # Réseau optimisé
            '-rtmp_live', 'live',            # Mode live (pas de buffering)
            '-rtmp_buffer', '1000',          # Buffer RTMP réduit (1 seconde)
            # Logs
            '-loglevel', 'error',
            # Reconnexion automatique
            '-reconnect', '1',
            '-reconnect_at_eof', '1',
            '-reconnect_streamed', '1',
            '-reconnect_delay_max', '2',
            '-timeout', '5000000',
            '-y'
        ]
        
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == 'win32' else 0
        )
        
        # Attendre un peu pour vérifier que le processus démarre correctement
        # Délai augmenté pour permettre à FFmpeg de se connecter à la source ET à la destination
        time.sleep(2.0)
        if process.poll() is not None:
            # Le processus s'est arrêté = erreur
            try:
                stderr_output = ""
                if process.stderr:
                    # Lire les erreurs de manière asynchrone
                    try:
                        # Sur Windows, stderr est un buffer - essayer de lire
                        import threading
                        error_buffer = []
                        
                        def read_stderr():
                            try:
                                while True:
                                    line = process.stderr.readline()
                                    if not line:
                                        break
                                    error_buffer.append(line.decode('utf-8', errors='ignore'))
                            except:
                                pass
                        
                        stderr_thread = threading.Thread(target=read_stderr, daemon=True)
                        stderr_thread.start()
                        stderr_thread.join(timeout=0.5)
                        stderr_output = ''.join(error_buffer)
                    except:
                        # Fallback : essayer de lire directement
                        try:
                            stderr_output = process.stderr.read().decode('utf-8', errors='ignore')
                        except:
                            pass
                
                error_msg = stderr_output[:300] if stderr_output else "Processus terminé sans message d'erreur"
                return None, f"FFmpeg s'est arrêté: {error_msg}"
            except Exception as e:
                return None, f"FFmpeg s'est arrêté (erreur lecture: {str(e)})"
        
        # IMPORTANT: Enregistrer le processus dans FFMPEG_PROCESSES
        FFMPEG_PROCESSES[stream_id] = process
        
        return process, "Relais démarré"
        
    except Exception as e:
        return None, f"Erreur démarrage FFmpeg: {str(e)}"


def stop_ffmpeg_relay(stream_id):
    """Arrête un relais FFmpeg - VERSION AMÉLIORÉE"""
    if stream_id in FFMPEG_PROCESSES:
        process = FFMPEG_PROCESSES[stream_id]
        try:
            pid = process.pid
            
            # Méthode 1: Arrêt via Python subprocess
            try:
                process.terminate()
                time.sleep(0.3)
                if process.poll() is None:
                    # Forcer l'arrêt si toujours en vie
                    process.kill()
                    time.sleep(0.2)
            except:
                pass
            
            # Méthode 2: Vérifier et tuer via taskkill (Windows) si le processus existe encore
            if sys.platform == 'win32':
                try:
                    # Vérifier si le processus existe encore
                    result = subprocess.run(
                        ['tasklist', '/FI', f'PID eq {pid}'],
                        capture_output=True,
                        text=True,
                        timeout=2
                    )
                    if str(pid) in result.stdout:
                        # Le processus existe encore, le tuer avec taskkill
                        subprocess.run(
                            ['taskkill', '/F', '/PID', str(pid)],
                            capture_output=True,
                            timeout=2
                        )
                        time.sleep(0.2)
                except:
                    pass
            
            # Nettoyer le dictionnaire
            del FFMPEG_PROCESSES[stream_id]
            
            # Vérification finale
            try:
                if process.poll() is not None:
                    # Le processus est bien arrêté
                    return True, f"Relais arrêté (PID {pid})"
                else:
                    # Le processus semble toujours actif - essayer une dernière fois
                    if sys.platform == 'win32':
                        try:
                            subprocess.run(['taskkill', '/F', '/PID', str(pid)], 
                                         capture_output=True, timeout=2)
                        except:
                            pass
                    return True, f"Relais arrêté (forcé, PID {pid})"
            except:
                return True, f"Relais arrêté (PID {pid})"
                
        except Exception as e:
            # Même en cas d'erreur, supprimer du dictionnaire
            try:
                del FFMPEG_PROCESSES[stream_id]
            except:
                pass
            return False, f"Erreur arrêt relais: {str(e)}"
    
    # IMPORTANT: Chercher les processus FFmpeg orphelins par leur ligne de commande
    # (processus qui tournent mais qui ne sont plus dans FFMPEG_PROCESSES)
    if sys.platform == 'win32':
        try:
            # Utiliser PowerShell pour trouver les processus FFmpeg avec le stream_id dans la commande
            ps_cmd = [
                'powershell', '-Command',
                f'''
                $streamId = "{stream_id}";
                Get-CimInstance Win32_Process -Filter "Name='ffmpeg.exe'" | 
                Where-Object {{ $_.CommandLine -like "*STREAM_ID:$streamId*" }} | 
                Select-Object ProcessId, CommandLine | 
                ConvertTo-Json -Compress
                '''
            ]
            
            ps_result = subprocess.run(
                ps_cmd,
                capture_output=True,
                text=True,
                timeout=5,
                encoding='utf-8',
                errors='ignore'
            )
            
            if ps_result.returncode == 0 and ps_result.stdout.strip():
                try:
                    import json
                    output = ps_result.stdout.strip()
                    
                    # PowerShell peut retourner un objet unique ou un tableau
                    if output.startswith('['):
                        processes = json.loads(output)
                    elif output.startswith('{'):
                        processes = [json.loads(output)]
                    else:
                        processes = []
                    
                    # Tuer tous les processus trouvés
                    killed_count = 0
                    for proc_info in processes:
                        pid = proc_info.get('ProcessId')
                        if pid:
                            try:
                                subprocess.run(
                                    ['taskkill', '/F', '/PID', str(pid)],
                                    capture_output=True,
                                    timeout=2
                                )
                                killed_count += 1
                                time.sleep(0.1)
                            except Exception as e:
                                pass  # Continuer même si un processus ne peut pas être tué
                    
                    if killed_count > 0:
                        return True, f"Relais FFmpeg orphelin trouvé et arrêté ({killed_count} processus, stream_id:{stream_id})"
                    
                except json.JSONDecodeError:
                    pass  # Erreur de parsing JSON, continuer
                except Exception as e:
                    pass  # Autre erreur, continuer
            
            # Si PowerShell a échoué, essayer wmic en fallback
            try:
                wmic_result = subprocess.run(
                    ['wmic', 'process', 'where', "name='ffmpeg.exe'", 'get', 'ProcessId,CommandLine'],
                    capture_output=True,
                    text=True,
                    timeout=3,
                    encoding='utf-8',
                    errors='ignore'
                )
                
                if wmic_result.returncode == 0:
                    # Parser la sortie wmic (format tabulaire)
                    lines = wmic_result.stdout.split('\n')
                    for line in lines:
                        if f'STREAM_ID:{stream_id}' in line:
                            # Extraire le PID (première colonne numérique)
                            parts = line.strip().split()
                            if parts:
                                try:
                                    pid = int(parts[0])
                                    subprocess.run(
                                        ['taskkill', '/F', '/PID', str(pid)],
                                        capture_output=True,
                                        timeout=2
                                    )
                                    return True, f"Relais FFmpeg orphelin trouvé et arrêté (PID {pid}, stream_id:{stream_id})"
                                except (ValueError, IndexError):
                                    pass
            except:
                pass
        except:
            pass  # En cas d'erreur générale dans la recherche de processus orphelins
    
    return False, "Relais non trouvé dans FFMPEG_PROCESSES et aucun processus FFmpeg correspondant trouvé"


def get_ffmpeg_relay_status(stream_id):
    """Vérifie si un relais FFmpeg est en cours d'exécution"""
    if stream_id not in FFMPEG_PROCESSES:
        return False, "Relais non démarré"
    
    process = FFMPEG_PROCESSES[stream_id]
    if process.poll() is None:
        return True, "Relais actif"
    else:
        # Le processus est mort, le nettoyer
        del FFMPEG_PROCESSES[stream_id]
        return False, "Relais arrêté"


def connect_obs_websocket():
    """Se connecte à OBS WebSocket"""
    global OBS_WS_CLIENT
    if not OBS_WS_ENABLED or not OBS_WEBSOCKET_AVAILABLE:
        return None
    
    try:
        if 'obsws_python' in sys.modules:
            # Utiliser obsws_python (recommandé)
            from obsws_python import ReqClient
            client = ReqClient(
                host=OBS_WS_HOST,
                port=OBS_WS_PORT,
                password=OBS_WS_PASSWORD if OBS_WS_PASSWORD else None
            )
            # Tester la connexion
            client.get_version()
            OBS_WS_CLIENT = client
            return client
    except Exception as e:
        print(f"Erreur connexion OBS WebSocket: {e}")
        return None
    
    return None


def control_obs_stream(stream_name, enabled):
    """Contrôle un stream OBS via WebSocket - Active/désactive une source Media Source"""
    global OBS_WS_CLIENT
    
    if not OBS_WS_ENABLED:
        return False, "OBS WebSocket désactivé"
    
    if not OBS_WS_CLIENT:
        OBS_WS_CLIENT = connect_obs_websocket()
        if not OBS_WS_CLIENT:
            return False, "Impossible de se connecter à OBS WebSocket"
    
    try:
        if 'obsws_python' in sys.modules:
            from obsws_python import ReqClient
            client = OBS_WS_CLIENT
            
            # Stratégie : Chercher et activer/désactiver une source Media Source dans OBS
            # qui correspond au nom du stream (ou utiliser le nom du stream comme identifiant)
            
            try:
                # Récupérer toutes les scènes
                scenes = client.get_scene_list()
                scene_names = [s['sceneName'] for s in scenes.scenes]
                
                source_found = False
                # Parcourir toutes les scènes pour trouver une source avec le nom correspondant
                for scene_name in scene_names:
                    try:
                        scene_items = client.get_scene_item_list(scene_name)
                        items = scene_items.scene_items
                        
                        for item in items:
                            source_name = item.get('sourceName', '')
                            # Chercher une source qui correspond au nom du stream
                            # Format attendu : "Media Source" ou "FFmpeg Source" avec le nom dans les paramètres
                            if stream_name.lower() in source_name.lower() or source_name.lower() in stream_name.lower():
                                # Activer/désactiver la source
                                item_id = item['sceneItemId']
                                client.set_scene_item_enabled(scene_name, item_id, enabled)
                                source_found = True
                                action = "activé" if enabled else "désactivé"
                                return True, f"Source OBS '{source_name}' {action} dans scène '{scene_name}'"
                    except Exception as e:
                        # Continuer avec la scène suivante si erreur
                        continue
                
                if not source_found:
                    # Si aucune source trouvée, essayer de contrôler les outputs OBS
                    # (mais cela nécessite que les streams soient configurés comme outputs)
                    action = "activé" if enabled else "désactivé"
                    return False, f"Aucune source OBS trouvée pour '{stream_name}' (configurez une Media Source avec ce nom)"
                
            except Exception as e:
                return False, f"Erreur contrôle OBS: {str(e)}"
        else:
            return False, "Bibliothèque OBS WebSocket non disponible (installez: pip install obs-websocket-py)"
    except Exception as e:
        return False, f"Erreur contrôle OBS WebSocket: {str(e)}"


def get_nginx_exe():
    """Trouve l'exécutable nginx"""
    nginx_exe = BASE_DIR / "nginx.exe"
    if not nginx_exe.exists():
        nginx_exe = BASE_DIR / "nginx_basic.exe"
    return nginx_exe


def get_nginx_status():
    """Vérifie si Nginx est en cours d'exécution"""
    try:
        # Sur Windows, vérifier DIRECTEMENT dans le gestionnaire de tâches (source de vérité)
        if sys.platform == 'win32':
            try:
                # MÉTHODE PRINCIPALE : Utiliser PowerShell Get-Process (plus fiable et direct)
                # C'est la même méthode que le gestionnaire des tâches utilise
                # Timeout réduit pour éviter de bloquer l'API
                try:
                    ps_cmd = ['powershell', '-Command', 'Get-Process -Name nginx -ErrorAction SilentlyContinue | Measure-Object | Select-Object -ExpandProperty Count']
                    ps_result = subprocess.run(
                        ps_cmd,
                        capture_output=True,
                        text=True,
                        timeout=2  # Timeout réduit à 2 secondes
                    )
                    if ps_result.returncode == 0:
                        count_str = ps_result.stdout.strip()
                        try:
                            count = int(count_str)
                            if count > 0:
                                pid_file = BASE_DIR / "logs" / "nginx.pid"
                                return True, f"Nginx est en cours d'exécution ({count} processus détectés)"
                        except ValueError:
                            pass
                except subprocess.TimeoutExpired:
                    # Si PowerShell est trop lent, utiliser tasklist en fallback rapide
                    pass
                
                # Méthode de secours : Utiliser tasklist (format CSV, plus rapide)
                try:
                    result = subprocess.run(
                        ['tasklist', '/FI', 'IMAGENAME eq nginx.exe', '/FO', 'CSV'],
                        capture_output=True,
                        text=True,
                        timeout=2  # Timeout réduit pour éviter de bloquer
                    )
                except subprocess.TimeoutExpired:
                    # Si tout est trop lent, supposer que Nginx n'est pas démarré
                    return False, "Vérification du statut Nginx en timeout"
                
                # Analyser le résultat - essayer plusieurs méthodes
                import csv
                import io
                
                stdout_text = result.stdout.strip()
                stdout_upper = stdout_text.upper()
                
                # Vérification simple d'abord : si nginx.exe est présent ET pas dans un message d'erreur
                if 'nginx.exe' in stdout_upper:
                    # Vérifier qu'on n'est pas dans un message d'erreur
                    if 'INFORMATION' not in stdout_upper and 'AUCUNE' not in stdout_upper:
                        # Compter les lignes contenant nginx.exe
                        lines_with_nginx = [l for l in stdout_text.split('\n') if 'nginx.exe' in l.upper() and l.strip()]
                        # Exclure l'en-tête
                        process_lines = [l for l in lines_with_nginx if not l.upper().startswith('"NOM') and not l.upper().startswith('"IMAGE')]
                        
                        if len(process_lines) > 0:
                            count = len(process_lines)
                            pid_file = BASE_DIR / "logs" / "nginx.pid"
                            return True, f"Nginx est en cours d'exécution ({count} processus)"
                
                # Si la méthode simple n'a pas fonctionné, essayer le parsing CSV
                try:
                    # Utiliser le parser CSV natif de Python
                    csv_reader = csv.reader(io.StringIO(stdout_text), delimiter=',')
                    nginx_processes = []
                    
                    for row in csv_reader:
                        if not row or len(row) == 0:
                            continue
                        
                        # La première colonne est le nom du processus
                        process_name = row[0].strip().strip('"').upper()
                        
                        # Ignorer l'en-tête
                        if process_name in ('IMAGE NAME', 'NOM DE L\'IMAGE', 'IMAGE', 'NOM'):
                            continue
                        
                        # Chercher nginx.exe
                        if 'nginx.exe' in process_name or process_name == 'NGINX.EXE':
                            # Vérifier qu'il y a un PID (colonne 1)
                            if len(row) >= 2:
                                try:
                                    pid_str = row[1].strip().strip('"')
                                    pid = int(pid_str)
                                    nginx_processes.append(row)
                                except (ValueError, IndexError):
                                    continue
                    
                    if nginx_processes:
                        count = len(nginx_processes)
                        pid_file = BASE_DIR / "logs" / "nginx.pid"
                        return True, f"Nginx est en cours d'exécution ({count} processus)"
                except Exception as e:
                    # En cas d'erreur de parsing CSV, on a déjà tenté la méthode simple
                    pass
                
                # AUCUN processus nginx trouvé = Nginx n'est PAS démarré
                # Nettoyer le fichier PID s'il existe (il est obsolète)
                pid_file = BASE_DIR / "logs" / "nginx.pid"
                if pid_file.exists():
                    try:
                        # Vérifier une dernière fois si le PID existe
                        with open(pid_file, 'r') as f:
                            pid = int(f.read().strip())
                        
                        result_pid = subprocess.run(
                            ['tasklist', '/FI', f'PID eq {pid}'],
                            capture_output=True,
                            text=True,
                            timeout=5
                        )
                        
                        # Si le PID n'existe pas, supprimer le fichier
                        if str(pid) not in result_pid.stdout.upper():
                            try:
                                pid_file.unlink()
                            except:
                                pass
                    except:
                        # Erreur lecture PID, le supprimer quand même
                        try:
                            pid_file.unlink()
                        except:
                            pass
                
                return False, "Nginx n'est pas démarré (aucun processus trouvé dans le gestionnaire de tâches)"
                
            except Exception as e:
                # En cas d'erreur avec tasklist, ne PAS faire confiance au fichier PID
                # Supprimer le PID pour éviter les faux positifs
                pid_file = BASE_DIR / "logs" / "nginx.pid"
                if pid_file.exists():
                    try:
                        pid_file.unlink()
                    except:
                        pass
                return False, f"Erreur vérification (tasklist échoué): {str(e)}. Nginx considéré comme arrêté."
        else:
            # Sur Linux/Unix, utiliser le fichier PID
            pid_file = BASE_DIR / "logs" / "nginx.pid"
            if pid_file.exists():
                with open(pid_file, 'r') as f:
                    pid = int(f.read().strip())
                
                # Vérifier si le processus existe
                try:
                    os.kill(pid, 0)  # Signal 0 = vérification seulement
                    return True, "Nginx est en cours d'exécution"
                except OSError:
                    # Le processus n'existe pas, supprimer le PID
                    try:
                        pid_file.unlink()
                    except:
                        pass
                    return False, "Nginx n'est pas démarré (fichier PID obsolète)"
            
            return False, "Nginx n'est pas démarré"
    except Exception as e:
        return False, f"Erreur lors de la vérification: {str(e)}"


def check_nginx_config():
    """Vérifie la configuration Nginx avant démarrage"""
    try:
        nginx_exe = get_nginx_exe()
        if not nginx_exe.exists():
            return False, "nginx.exe introuvable"
        
        nginx_path = str(nginx_exe.absolute())
        os.chdir(BASE_DIR)
        
        result = subprocess.run(
            [nginx_path, "-t"],
            capture_output=True,
            text=True,
            timeout=10
        )
        
        if result.returncode == 0:
            return True, "Configuration OK"
        else:
            error_msg = result.stderr.strip() if result.stderr else result.stdout.strip()
            return False, error_msg
    except Exception as e:
        return False, f"Erreur lors de la vérification: {str(e)}"


def get_last_nginx_error():
    """Récupère la dernière erreur du fichier error.log"""
    try:
        error_log = BASE_DIR / "logs" / "error.log"
        if not error_log.exists():
            return "Aucun fichier de log"
        
        # Lire les 20 dernières lignes
        with open(error_log, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
            last_lines = lines[-20:] if len(lines) > 20 else lines
            
        # Chercher les erreurs récentes (emerg, error, alert)
        for line in reversed(last_lines):
            if any(keyword in line.lower() for keyword in ['[emerg]', '[error]', '[alert]']):
                return line.strip()
        
        return "Aucune erreur récente trouvée dans les logs"
    except Exception as e:
        return f"Erreur lecture log: {str(e)}"


def start_nginx():
    """Démarre Nginx"""
    try:
        nginx_exe = get_nginx_exe()
        
        if not nginx_exe.exists():
            return False, "nginx.exe introuvable"
        
        # Changer vers le répertoire de base
        os.chdir(BASE_DIR)
        
        # Vérifier la configuration AVANT de démarrer
        config_ok, config_msg = check_nginx_config()
        if not config_ok:
            return False, f"Erreur de configuration Nginx: {config_msg}"
        
        # Vérifier si déjà démarré
        status, _ = get_nginx_status()
        
        # Vérifier aussi s'il y a des processus même si le statut dit non
        if not status and sys.platform == 'win32':
            try:
                result = subprocess.run(
                    ['tasklist', '/FI', 'IMAGENAME eq nginx.exe'],
                    capture_output=True,
                    text=True,
                    timeout=5
                )
                if 'nginx.exe' in result.stdout:
                    # Il y a des processus mais le statut est faux, nettoyer d'abord
                    kill_nginx_processes()
                    import time
                    time.sleep(0.5)
            except:
                pass
        
        if status:
            return False, "Nginx est déjà démarré"
        
        # Nettoyer le fichier PID s'il existe (peut être corrompu)
        pid_file = BASE_DIR / "logs" / "nginx.pid"
        if pid_file.exists():
            try:
                # Vérifier que le PID n'existe plus
                with open(pid_file, 'r') as f:
                    old_pid = f.read().strip()
                if sys.platform == 'win32':
                    result = subprocess.run(
                        ['tasklist', '/FI', f'PID eq {old_pid}'],
                        capture_output=True,
                        text=True,
                        timeout=5
                    )
                    if old_pid not in result.stdout:
                        # Le processus n'existe plus, supprimer le fichier PID
                        pid_file.unlink()
            except:
                pass
        
        # Démarrer Nginx
        nginx_path = str(nginx_exe.absolute())
        process = subprocess.Popen(
            [nginx_path],
            cwd=str(BASE_DIR),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == 'win32' else 0
        )
        
        # Attendre un peu pour voir si ça démarre
        import time
        time.sleep(2)  # Augmenté à 2 secondes
        
        # Vérifier si le processus est toujours en vie
        if process.poll() is not None:
            # Le processus s'est terminé immédiatement = erreur
            stderr_output = process.stderr.read().decode('utf-8', errors='ignore') if process.stderr else ""
            error_log_msg = get_last_nginx_error()
            return False, f"Nginx s'est arrêté immédiatement. Erreur: {stderr_output[:200] if stderr_output else error_log_msg}"
        
        # Vérifier le statut
        status, msg = get_nginx_status()
        if status:
            # Double vérification : voir si le processus est dans tasklist
            if sys.platform == 'win32':
                try:
                    result = subprocess.run(
                        ['tasklist', '/FI', 'IMAGENAME eq nginx.exe'],
                        capture_output=True,
                        text=True,
                        timeout=5
                    )
                    if 'nginx.exe' in result.stdout:
                        return True, "Nginx démarré avec succès"
                    else:
                        return False, "Nginx semble démarré mais processus non trouvé"
                except:
                    pass
            return True, "Nginx démarré avec succès"
        else:
            # Le processus tourne mais le statut dit non
            if sys.platform == 'win32':
                try:
                    result = subprocess.run(
                        ['tasklist', '/FI', 'IMAGENAME eq nginx.exe'],
                        capture_output=True,
                        text=True,
                        timeout=5
                    )
                    if 'nginx.exe' in result.stdout:
                        # Le processus existe, peut-être un problème avec le fichier PID
                        return True, "Nginx démarré (processus détecté)"
                except:
                    pass
            
            error_log_msg = get_last_nginx_error()
            return False, f"Nginx n'a pas démarré correctement. Dernière erreur log: {error_log_msg}"
            
    except Exception as e:
        return False, f"Erreur lors du démarrage: {str(e)}"


def kill_nginx_processes():
    """Force l'arrêt de tous les processus nginx"""
    if sys.platform != 'win32':
        return False
    
    try:
        # Tuer tous les processus nginx.exe
        result = subprocess.run(
            ['taskkill', '/F', '/IM', 'nginx.exe'],
            capture_output=True,
            text=True,
            timeout=10
        )
        
        import time
        time.sleep(1)
        
        # Vérifier qu'ils sont bien arrêtés
        result_check = subprocess.run(
            ['tasklist', '/FI', 'IMAGENAME eq nginx.exe'],
            capture_output=True,
            text=True,
            timeout=5
        )
        
        if 'nginx.exe' not in result_check.stdout:
            return True
        return False
    except:
        return False


def stop_nginx():
    """Arrête Nginx"""
    try:
        nginx_exe = get_nginx_exe()
        
        if not nginx_exe.exists():
            return False, "nginx.exe introuvable"
        
        # Vérifier si démarré
        status, _ = get_nginx_status()
        if not status:
            # Même si le statut dit qu'il n'est pas démarré, vérifier s'il y a des processus
            if sys.platform == 'win32':
                try:
                    result = subprocess.run(
                        ['tasklist', '/FI', 'IMAGENAME eq nginx.exe'],
                        capture_output=True,
                        text=True,
                        timeout=5
                    )
                    if 'nginx.exe' in result.stdout:
                        # Il y a des processus mais le statut est faux, les tuer
                        if kill_nginx_processes():
                            return True, "Processus Nginx arrêtés (nettoyage)"
                except:
                    pass
            return False, "Nginx n'est pas démarré"
        
        # Essayer d'arrêter Nginx proprement d'abord
        nginx_path = str(nginx_exe.absolute())
        os.chdir(BASE_DIR)
        
        try:
            result = subprocess.run(
                [nginx_path, "-s", "stop"],
                capture_output=True,
                text=True,
                timeout=10
            )
        except subprocess.TimeoutExpired:
            pass  # Continue avec le forçage
        
        # Attendre un peu
        import time
        time.sleep(1)
        
        # Vérifier si arrêté
        status, _ = get_nginx_status()
        if not status:
            return True, "Nginx arrêté avec succès"
        
        # Si toujours démarré, forcer l'arrêt
        if sys.platform == 'win32':
            if kill_nginx_processes():
                # Supprimer le fichier PID s'il existe
                pid_file = BASE_DIR / "logs" / "nginx.pid"
                if pid_file.exists():
                    try:
                        pid_file.unlink()
                    except:
                        pass
                return True, "Nginx arrêté de force (processus tués)"
            else:
                return False, "Impossible d'arrêter les processus Nginx"
        else:
            return False, "Nginx n'a pas été arrêté correctement"
            
    except Exception as e:
        # En cas d'erreur, essayer de tuer les processus
        if sys.platform == 'win32':
            if kill_nginx_processes():
                return True, "Nginx arrêté de force après erreur"
        return False, f"Erreur lors de l'arrêt: {str(e)}"


def reload_nginx():
    """Recharge la configuration nginx"""
    try:
        nginx_exe = get_nginx_exe()
        
        if not nginx_exe.exists():
            return False, "nginx.exe introuvable"
        
        # Vérifier si démarré avec la vraie méthode (tasklist)
        status, status_msg = get_nginx_status()
        
        # Double vérification : vérifier aussi directement avec tasklist
        if sys.platform == 'win32':
            try:
                result_check = subprocess.run(
                    ['tasklist', '/FI', 'IMAGENAME eq nginx.exe'],
                    capture_output=True,
                    text=True,
                    timeout=5
                )
                nginx_running = 'nginx.exe' in result_check.stdout
                
                if not nginx_running:
                    return False, "Nginx n'est pas démarré. Cliquez sur 'Démarrer' pour le lancer."
                
                # Nginx est dans tasklist, mais vérifier que le master process existe
                # Le master process est nécessaire pour le reload
                if status and not nginx_running:
                    # Incohérence détectée
                    kill_nginx_processes()
                    return False, "Nginx était dans un état incohérent. Redémarrez-le."
            except:
                pass
        
        if not status:
            return False, "Nginx n'est pas démarré. Cliquez sur 'Démarrer' pour le lancer."
        
        # Vérifier la configuration avant de recharger
        config_ok, config_msg = check_nginx_config()
        if not config_ok:
            return False, f"Erreur de configuration détectée. Corrigez avant de recharger: {config_msg}"
        
        # Utiliser le chemin absolu
        nginx_path = str(nginx_exe.absolute())
        # Changer vers le répertoire de base pour que nginx trouve ses fichiers
        os.chdir(BASE_DIR)
        
        try:
            result = subprocess.run(
                [nginx_path, "-s", "reload"],
                capture_output=True,
                text=True,
                timeout=10
            )
            
            if result.returncode == 0:
                # Vérifier que Nginx est toujours en vie après le reload
                import time
                time.sleep(1.0)  # Attendre un peu plus pour que le reload se propage
                status_after, status_msg_after = get_nginx_status()
                if status_after:
                    # IMPORTANT: Le module RTMP de Nginx a un problème connu :
                    # Il ne recharge PAS toujours correctement les push directives.
                    # La solution recommandée est d'utiliser le mode FFmpeg Proxy.
                    return True, "Configuration rechargée (⚠ RTMP peut nécessiter un redémarrage complet)"
                else:
                    return False, "Erreur: Nginx s'est arrêté après le reload"
            else:
                # Analyser l'erreur
                error_msg = result.stderr.strip() if result.stderr else result.stdout.strip() if result.stdout else "Erreur inconnue"
                
                # Erreurs courantes et leurs solutions
                error_lower = error_msg.lower()
                
                if "cannot find the file specified" in error_lower or "openevent" in error_lower or "ngx_reload" in error_lower:
                    # Le processus master n'existe plus mais les workers peuvent tourner
                    # Ou le fichier PID est obsolète
                    kill_nginx_processes()
                    # Nettoyer le PID
                    pid_file = BASE_DIR / "logs" / "nginx.pid"
                    if pid_file.exists():
                        try:
                            pid_file.unlink()
                        except:
                            pass
                    return False, "Le processus master Nginx n'existe plus. Nginx a été nettoyé. Redémarrez-le avec le bouton 'Démarrer'."
                
                if "failed" in error_lower and "reload" in error_lower:
                    return False, f"Nginx ne peut pas être rechargé. Arrêtez-le puis redémarrez-le. Erreur: {error_msg[:150]}"
                
                return False, f"Erreur lors du rechargement: {error_msg[:200]}"
        except subprocess.TimeoutExpired:
            return False, "Timeout lors du rechargement de Nginx"
        except Exception as e:
            return False, f"Erreur lors de l'exécution du reload: {str(e)}"
            
    except Exception as e:
        return False, f"Erreur lors du rechargement: {str(e)}"


@app.route('/api/streams', methods=['GET'])
def get_streams():
    """Récupère la liste de tous les streams - VERSION RAPIDE (ne démarre pas FFmpeg)"""
    try:
        # Charger les streams rapidement
        streams = load_streams()
        # Générer la config RTMP rapidement
        count = generate_rtmp_config()
        
        # Ajouter le statut pour chaque stream SANS démarrer FFmpeg (c'est rapide)
        for stream in streams:
            stream['active'] = stream.get('enabled', True)
            stream_id = stream.get('id')
            
            # Si FFmpeg est activé, vérifier SEULEMENT le statut (sans démarrer)
            if USE_FFMPEG_PROXY:
                # Vérification rapide : juste regarder si le processus existe et est en vie
                if stream_id in FFMPEG_PROCESSES:
                    process = FFMPEG_PROCESSES[stream_id]
                    # Vérifier rapidement sans bloquer
                    try:
                        # poll() retourne None si le processus est en vie, sinon le code de retour
                        stream['ffmpeg_running'] = (process.poll() is None)
                        # Si le processus est mort, le nettoyer
                        if not stream['ffmpeg_running']:
                            try:
                                del FFMPEG_PROCESSES[stream_id]
                            except:
                                pass
                    except:
                        stream['ffmpeg_running'] = False
                else:
                    stream['ffmpeg_running'] = False
                # IMPORTANT: On NE démarre PAS FFmpeg ici pour éviter de bloquer
                # FFmpeg sera démarré via toggleStream() quand l'utilisateur active un stream
            else:
                stream['ffmpeg_running'] = None
        
        # Retourner un tableau directement pour compatibilité avec l'interface
        return jsonify(streams)
    except Exception as e:
        return jsonify({
            "error": str(e),
            "streams": []
        }), 500


@app.route('/api/streams', methods=['POST'])
def add_stream():
    """Ajoute un nouveau stream"""
    data = request.json
    streams = load_streams()
    
    # Génère un nouvel ID
    if streams:
        new_id = str(max([int(s.get('id', '0')) for s in streams], default=0) + 1)
    else:
        new_id = "1"
    
    new_stream = {
        "id": new_id,
        "name": data.get('name', 'Nouveau Stream'),
        "url": data.get('url', ''),
        "enabled": data.get('enabled', True),
        "platform": data.get('platform', 'Autre')
    }
    
    streams.append(new_stream)
    save_streams(streams)
    
    # Régénère la config RTMP
    count = generate_rtmp_config()
    
    # Vérifier si Nginx est démarré avant d'essayer de recharger
    nginx_running, _ = get_nginx_status()
    if nginx_running:
        # Si Nginx est démarré, recharger la configuration
        success, message = reload_nginx()
        if not success:
            message = f"Stream ajouté mais erreur lors du rechargement Nginx: {message}"
    else:
        # Si Nginx n'est pas démarré, on peut quand même ajouter le stream
        success = True
        message = f"Stream ajouté avec succès. Démarrez Nginx pour l'activer."
    
    return jsonify({
        "success": success,
        "message": message,
        "stream": new_stream,
        "active_streams": count
    })


@app.route('/api/streams/<stream_id>', methods=['PUT'])
def update_stream(stream_id):
    """Met à jour un stream"""
    data = request.json
    streams = load_streams()
    
    for i, stream in enumerate(streams):
        if stream.get('id') == stream_id:
            old_enabled = stream.get('enabled', True)
            streams[i].update(data)
            new_enabled = streams[i].get('enabled', True)
            save_streams(streams)
            
            # Régénère la config
            count = generate_rtmp_config()
            
            # Si FFmpeg est activé, gérer dynamiquement sans recharger Nginx
            if USE_FFMPEG_PROXY:
                # Si c'est un stream OBS, ne pas utiliser FFmpeg (c'est toujours pushé par Nginx)
                platform = streams[i].get('platform', '').upper()
                if platform == 'OBS':
                    # Les streams OBS sont toujours pushés, pas besoin de FFmpeg
                    return jsonify({
                        "success": True,
                        "message": "Stream OBS mis à jour (toujours actif pour qu'OBS continue)",
                        "stream": streams[i],
                        "active_streams": count,
                        "reload_required": False
                    })
                
                if old_enabled != new_enabled:
                    if new_enabled:
                        # Activer le stream via FFmpeg
                        destination_url = streams[i].get('url', '')
                        if destination_url:
                            process, msg = start_ffmpeg_relay(stream_id, destination_url)
                            if process:
                                FFMPEG_PROCESSES[stream_id] = process
                                
                                # Contrôler OBS si configuré
                                stream_name = streams[i].get('name', 'Stream')
                                obs_success, obs_msg = control_obs_stream(stream_name, True)
                                
                                message = f"Stream activé via FFmpeg (sans couper les autres)"
                                if obs_success:
                                    message += f" | OBS: {obs_msg}"
                                elif OBS_WS_ENABLED:
                                    message += f" | OBS: {obs_msg}"
                                
                                return jsonify({
                                    "success": True,
                                    "message": message,
                                    "stream": streams[i],
                                    "active_streams": count,
                                    "reload_required": False
                                })
                            else:
                                return jsonify({
                                    "success": False,
                                    "message": f"Erreur activation FFmpeg: {msg}",
                                    "stream": streams[i],
                                    "active_streams": count
                                })
                        else:
                            return jsonify({
                                "success": False,
                                "message": "URL de destination manquante",
                                "stream": streams[i]
                            })
                    else:
                        # Désactiver le stream via FFmpeg
                        # Toujours appeler stop_ffmpeg_relay même si le stream_id n'est pas dans FFMPEG_PROCESSES
                        # car il peut y avoir des processus orphelins
                        success, msg = stop_ffmpeg_relay(stream_id)
                        
                        # Double vérification : s'assurer que le processus est bien arrêté
                        # Vérifier s'il reste des processus FFmpeg pour ce stream_id
                        if sys.platform == 'win32':
                            try:
                                ps_cmd = [
                                    'powershell', '-Command',
                                    f'''
                                    Get-CimInstance Win32_Process -Filter "Name='ffmpeg.exe'" | 
                                    Where-Object {{ $_.CommandLine -like "*STREAM_ID:{stream_id}*" }} | 
                                    Select-Object ProcessId | 
                                    Measure-Object | 
                                    Select-Object -ExpandProperty Count
                                    '''
                                ]
                                ps_check = subprocess.run(
                                    ps_cmd,
                                    capture_output=True,
                                    text=True,
                                    timeout=3,
                                    encoding='utf-8',
                                    errors='ignore'
                                )
                                if ps_check.returncode == 0:
                                    count_str = ps_check.stdout.strip()
                                    if count_str.isdigit() and int(count_str) > 0:
                                        # Il reste des processus, les tuer
                                        stop_ffmpeg_relay(stream_id)  # Réessayer
                            except:
                                pass
                        
                        # Contrôler OBS si configuré (désactiver le stream dans OBS)
                        stream_name = streams[i].get('name', 'Stream')
                        obs_success, obs_msg = control_obs_stream(stream_name, False)
                        
                        if success:
                            message = f"Stream désactivé via FFmpeg (sans couper les autres): {msg}"
                            if obs_success:
                                message += f" | OBS: {obs_msg}"
                            elif OBS_WS_ENABLED:
                                message += f" | OBS: {obs_msg}"
                            
                            # Attendre un peu et vérifier à nouveau
                            time.sleep(0.3)
                            # Vérifier si un processus existe encore pour ce stream_id
                            if stream_id in FFMPEG_PROCESSES:
                                # Le processus existe encore dans le dictionnaire, forcer l'arrêt
                                try:
                                    old_process = FFMPEG_PROCESSES[stream_id]
                                    pid = old_process.pid if hasattr(old_process, 'pid') else None
                                    if pid and sys.platform == 'win32':
                                        # Tuer avec taskkill en dernier recours
                                        subprocess.run(
                                            ['taskkill', '/F', '/PID', str(pid)],
                                            capture_output=True,
                                            timeout=2
                                        )
                                    del FFMPEG_PROCESSES[stream_id]
                                except:
                                    try:
                                        del FFMPEG_PROCESSES[stream_id]
                                    except:
                                        pass
                            
                            return jsonify({
                                "success": True,
                                "message": message,
                                "stream": streams[i],
                                "active_streams": count,
                                "reload_required": False
                            })
                        else:
                            # Même si stop_ffmpeg_relay a échoué, nettoyer le dictionnaire
                            try:
                                if stream_id in FFMPEG_PROCESSES:
                                    del FFMPEG_PROCESSES[stream_id]
                            except:
                                pass
                            
                            return jsonify({
                                "success": False,
                                "message": f"Erreur désactivation FFmpeg: {msg}",
                                "stream": streams[i],
                                "active_streams": count,
                                "reload_required": False
                            })
                else:
                    # Pas de changement d'état
                    return jsonify({
                        "success": True,
                        "message": "Stream mis à jour",
                        "stream": streams[i],
                        "active_streams": count,
                        "reload_required": False
                    })
            else:
                # Mode classique : rechargement Nginx nécessaire
                # ATTENTION: Le module RTMP de Nginx ne recharge PAS toujours correctement les push directives
                # Le reload peut sembler réussir mais ne pas appliquer les changements.
                # SOLUTION RECOMMANDÉE: Utiliser le mode FFmpeg Proxy (pas de rechargement nécessaire)
                if old_enabled != new_enabled:
                    # Générer la config d'abord
                    count = generate_rtmp_config()
                    
                    # Essayer de recharger
                    success, message = reload_nginx()
                    
                    # Avertir l'utilisateur si en mode Nginx Direct
                    warning = ""
                    if success:
                        warning = " ⚠️ Si le changement n'est pas appliqué, utilisez 'Redémarrer' ou activez le mode FFmpeg Proxy"
                    
                    return jsonify({
                        "success": success,
                        "message": message + f" ({'Activé' if new_enabled else 'Désactivé'})" + warning,
                        "stream": streams[i],
                        "active_streams": count,
                        "reload_required": True,
                        "may_require_restart": True  # Nouveau flag pour le frontend
                    })
                else:
                    return jsonify({
                        "success": True,
                        "message": "Stream mis à jour (aucun rechargement nécessaire)",
                        "stream": streams[i],
                        "active_streams": count,
                        "reload_required": False
                    })
    
    return jsonify({"success": False, "message": "Stream introuvable"}), 404


@app.route('/api/streams/<stream_id>', methods=['DELETE'])
def delete_stream(stream_id):
    """Supprime un stream"""
    streams = load_streams()
    
    streams = [s for s in streams if s.get('id') != stream_id]
    save_streams(streams)
    
    # Régénère la config et recharge nginx
    count = generate_rtmp_config()
    success, message = reload_nginx()
    
    return jsonify({
        "success": success,
        "message": message,
        "active_streams": count
    })


@app.route('/api/reload', methods=['POST'])
def reload_config():
    """Force la régénération et le rechargement (ou synchronisation FFmpeg)"""
    count = generate_rtmp_config()
    
    if USE_FFMPEG_PROXY:
        # En mode FFmpeg, synchroniser les processus avec les streams activés
        streams = load_streams()
        enabled_streams = {s['id']: s for s in streams if s.get('enabled') is True}
        
        # Arrêter les processus pour les streams désactivés
        to_stop = [sid for sid in FFMPEG_PROCESSES.keys() if sid not in enabled_streams]
        for sid in to_stop:
            stop_ffmpeg_relay(sid)
        
        # Démarrer les processus pour les streams activés qui ne sont pas encore démarrés
        started = 0
        errors = []
        for sid, stream in enabled_streams.items():
            if sid not in FFMPEG_PROCESSES:
                url = stream.get('url', '')
                if url:
                    process, msg = start_ffmpeg_relay(sid, url)
                    if process:
                        FFMPEG_PROCESSES[sid] = process
                        started += 1
                    else:
                        errors.append(f"{stream.get('name', sid)}: {msg}")
        
        message = f"Synchronisation FFmpeg: {started} stream(s) démarré(s)"
        if errors:
            message += f", {len(errors)} erreur(s)"
        
        return jsonify({
            "success": len(errors) == 0,
            "message": message,
            "active_streams": count,
            "errors": errors if errors else None
        })
    else:
        # Mode classique : rechargement Nginx
        success, message = reload_nginx()
        return jsonify({
            "success": success,
            "message": message,
            "active_streams": count
        })


@app.route('/api/nginx/status', methods=['GET'])
def nginx_status():
    """Récupère le statut de Nginx et l'URL RTMP pour OBS"""
    is_running, message = get_nginx_status()
    
    # Détecter l'IP locale et générer l'URL RTMP
    local_ip = get_local_ip()
    rtmp_url = get_rtmp_url()
    
    return jsonify({
        "running": is_running,
        "message": message,
        "rtmp_url": rtmp_url,
        "local_ip": local_ip,
        "rtmp_port": 1935
    })


@app.route('/api/nginx/start', methods=['POST'])
def nginx_start():
    """Démarre Nginx et synchronise les streams FFmpeg si nécessaire"""
    success, message = start_nginx()
    
    # Si Nginx démarre avec succès et qu'on est en mode FFmpeg Proxy, démarrer les streams activés
    if success and USE_FFMPEG_PROXY:
        # Attendre un peu que Nginx soit prêt
        import time
        time.sleep(1)
        
        # Synchroniser les streams FFmpeg
        streams = load_streams()
        enabled_streams = {s['id']: s for s in streams if s.get('enabled') is True}
        
        started = 0
        errors = []
        for sid, stream in enabled_streams.items():
            if sid not in FFMPEG_PROCESSES:
                url = stream.get('url', '')
                if url:
                    process, msg = start_ffmpeg_relay(sid, url)
                    if process:
                        FFMPEG_PROCESSES[sid] = process
                        started += 1
                    else:
                        errors.append(f"{stream.get('name', sid)}: {msg}")
        
        if started > 0:
            message += f" | {started} stream(s) FFmpeg démarré(s)"
        if errors:
            message += f" | {len(errors)} erreur(s) de démarrage"
    
    return jsonify({
        "success": success,
        "message": message
    })


@app.route('/api/nginx/stop', methods=['POST'])
def nginx_stop():
    """Arrête Nginx"""
    success, message = stop_nginx()
    return jsonify({
        "success": success,
        "message": message
    })


@app.route('/api/nginx/reload', methods=['POST'])
def nginx_reload():
    """Recharge la configuration Nginx sans couper les connexions actives (graceful reload)"""
    success, message = reload_nginx()
    return jsonify({
        "success": success,
        "message": message
    })


@app.route('/api/nginx/restart', methods=['POST'])
def nginx_restart():
    """Redémarre Nginx (arrête puis démarre)"""
    try:
        # Arrêter d'abord
        print("Redémarrage Nginx: Arrêt en cours...", file=sys.stderr)
        stop_success, stop_message = stop_nginx()
        
        if not stop_success:
            # Si l'arrêt a échoué, essayer de forcer l'arrêt
            print(f"Arrêt normal échoué ({stop_message}), tentative d'arrêt forcé...", file=sys.stderr)
            kill_nginx_processes()
            import time
            time.sleep(1)
        else:
            # Attendre un peu pour être sûr que les processus sont terminés
            import time
            time.sleep(1.5)
        
        # Vérifier que Nginx est bien arrêté
        status_after_stop, _ = get_nginx_status()
        if status_after_stop:
            # Nginx est toujours en vie, forcer l'arrêt
            print("Nginx toujours actif après arrêt, arrêt forcé...", file=sys.stderr)
            kill_nginx_processes()
            import time
            time.sleep(1)
        
        # Démarrer ensuite
        print("Redémarrage Nginx: Démarrage en cours...", file=sys.stderr)
        start_success, start_message = start_nginx()
        
        if start_success:
            # Vérifier que Nginx est bien démarré
            import time
            time.sleep(0.5)
            status_after_start, status_msg = get_nginx_status()
            
            if status_after_start:
                # Si on est en mode FFmpeg Proxy, synchroniser les streams après redémarrage
                sync_msg = f"Nginx redémarré avec succès: {status_msg}"
                if USE_FFMPEG_PROXY:
                    streams = load_streams()
                    enabled_streams = {s['id']: s for s in streams if s.get('enabled') is True}
                    
                    started = 0
                    errors = []
                    for sid, stream in enabled_streams.items():
                        if sid not in FFMPEG_PROCESSES:
                            url = stream.get('url', '')
                            if url:
                                process, msg = start_ffmpeg_relay(sid, url)
                                if process:
                                    FFMPEG_PROCESSES[sid] = process
                                    started += 1
                                else:
                                    errors.append(f"{stream.get('name', sid)}: {msg}")
                    
                    if started > 0:
                        sync_msg += f" | {started} stream(s) FFmpeg démarré(s)"
                    if errors:
                        sync_msg += f" | {len(errors)} erreur(s)"
                
                return jsonify({
                    "success": True,
                    "message": sync_msg
                })
            else:
                return jsonify({
                    "success": False,
                    "message": f"Nginx a démarré mais n'est pas détecté comme actif. Vérifiez manuellement."
                })
        else:
            return jsonify({
                "success": False,
                "message": f"Nginx arrêté mais erreur au démarrage: {start_message}"
            })
    except Exception as e:
        print(f"Erreur lors du redémarrage Nginx: {e}", file=sys.stderr)
        return jsonify({
            "success": False,
            "message": f"Erreur lors du redémarrage: {str(e)}"
        })


# ==================== FONCTIONS STUNNEL ====================

def get_stunnel_status():
    """Vérifie si Stunnel est en cours d'exécution"""
    try:
        # Sur Windows, vérifier directement dans le gestionnaire de tâches
        if sys.platform == 'win32':
            try:
                # Vérifier si stunnel.exe est dans les processus
                result = subprocess.run(
                    ['tasklist', '/FI', 'IMAGENAME eq stunnel.exe', '/FO', 'CSV'],
                    capture_output=True,
                    text=True,
                    timeout=5
                )
                
                # Compter les processus stunnel
                if 'stunnel.exe' in result.stdout:
                    lines = result.stdout.strip().split('\n')
                    # Ignorer la ligne d'en-tête
                    stunnel_processes = [l for l in lines if 'stunnel.exe' in l and l.strip()]
                    
                    if stunnel_processes:
                        count = len(stunnel_processes)
                        return True, f"Stunnel est en cours d'exécution ({count} processus)"
                
                # Si aucun processus stunnel trouvé, vérifier quand même le fichier PID
                # au cas où le processus aurait été tué sans supprimer le PID
                if STUNNEL_PID_FILE.exists():
                    try:
                        with open(STUNNEL_PID_FILE, 'r') as f:
                            pid = int(f.read().strip())
                        
                        # Vérifier si ce PID spécifique existe
                        result_pid = subprocess.run(
                            ['tasklist', '/FI', f'PID eq {pid}'],
                            capture_output=True,
                            text=True,
                            timeout=5
                        )
                        if str(pid) not in result_pid.stdout:
                            # Le PID existe mais le processus est mort
                            # Supprimer le fichier PID obsolète
                            try:
                                STUNNEL_PID_FILE.unlink()
                            except:
                                pass
                    except:
                        pass
                
                return False, "Stunnel n'est pas démarré (aucun processus trouvé)"
            except Exception as e:
                # En cas d'erreur avec tasklist, utiliser la méthode du fichier PID
                if STUNNEL_PID_FILE.exists():
                    try:
                        with open(STUNNEL_PID_FILE, 'r') as f:
                            pid = int(f.read().strip())
                        return True, f"Stunnel semble démarré (PID {pid} - vérification tasklist échouée)"
                    except:
                        return False, f"Erreur vérification: {str(e)}"
                return False, f"Erreur vérification: {str(e)}"
        else:
            # Sur Linux/Unix, utiliser le fichier PID
            if STUNNEL_PID_FILE.exists():
                try:
                    with open(STUNNEL_PID_FILE, 'r') as f:
                        pid = int(f.read().strip())
                    
                    # Vérifier si le processus existe
                    try:
                        os.kill(pid, 0)  # Signal 0 = vérification seulement
                        return True, "Stunnel est en cours d'exécution"
                    except OSError:
                        # Le processus n'existe pas, supprimer le PID
                        try:
                            STUNNEL_PID_FILE.unlink()
                        except:
                            pass
                        return False, "Stunnel n'est pas démarré (fichier PID obsolète)"
                except:
                    return False, "Stunnel n'est pas démarré"
            
            return False, "Stunnel n'est pas démarré"
    except Exception as e:
        return False, f"Erreur lors de la vérification: {str(e)}"


def start_stunnel():
    """Démarre Stunnel"""
    try:
        if not STUNNEL_EXE.exists():
            return False, f"stunnel.exe introuvable dans {STUNNEL_EXE}"
        
        if not STUNNEL_CONF.exists():
            return False, f"stunnel.conf introuvable dans {STUNNEL_CONF}"
        
        # Vérifier si déjà démarré
        status, _ = get_stunnel_status()
        if status:
            return False, "Stunnel est déjà démarré"
        
        # Démarrer Stunnel
        os.chdir(STUNNEL_DIR)
        result = subprocess.Popen(
            [str(STUNNEL_EXE.absolute()), str(STUNNEL_CONF.absolute())],
            cwd=str(STUNNEL_DIR),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == 'win32' else 0
        )
        
        # Attendre un peu pour voir si ça démarre
        import time
        time.sleep(1.5)
        
        status, msg = get_stunnel_status()
        if status:
            return True, "Stunnel démarré avec succès"
        else:
            return False, "Stunnel n'a pas démarré correctement"
            
    except Exception as e:
        return False, f"Erreur lors du démarrage: {str(e)}"


def stop_stunnel():
    """Arrête Stunnel"""
    try:
        # Vérifier si démarré
        status, _ = get_stunnel_status()
        if not status:
            return False, "Stunnel n'est pas démarré"
        
        if sys.platform == 'win32':
            # Sur Windows, on utilise taskkill
            try:
                result = subprocess.run(
                    ['taskkill', '/F', '/IM', 'stunnel.exe'],
                    capture_output=True,
                    text=True,
                    timeout=10
                )
                
                # Attendre un peu
                import time
                time.sleep(0.5)
                
                status, _ = get_stunnel_status()
                if not status:
                    return True, "Stunnel arrêté avec succès"
                else:
                    return False, "Stunnel n'a pas été arrêté correctement"
            except Exception as e:
                return False, f"Erreur lors de l'arrêt: {str(e)}"
        else:
            return False, "Arrêt de Stunnel non supporté sur cette plateforme"
            
    except Exception as e:
        return False, f"Erreur lors de l'arrêt: {str(e)}"


@app.route('/api/stunnel/status', methods=['GET'])
def stunnel_status():
    """Récupère le statut de Stunnel"""
    is_running, message = get_stunnel_status()
    return jsonify({
        "running": is_running,
        "message": message
    })


@app.route('/api/stunnel/start', methods=['POST'])
def stunnel_start():
    """Démarre Stunnel"""
    success, message = start_stunnel()
    return jsonify({
        "success": success,
        "message": message
    })


@app.route('/api/stunnel/stop', methods=['POST'])
def stunnel_stop():
    """Arrête Stunnel"""
    success, message = stop_stunnel()
    return jsonify({
        "success": success,
        "message": message
    })


@app.route('/api/stunnel/restart', methods=['POST'])
def stunnel_restart():
    """Redémarre Stunnel (arrête puis démarre)"""
    # Arrêter d'abord
    stop_success, stop_message = stop_stunnel()
    if not stop_success:
        return jsonify({
            "success": False,
            "message": f"Erreur lors de l'arrêt: {stop_message}"
        })
    
    # Attendre un peu pour être sûr que les processus sont terminés
    import time
    time.sleep(1)
    
    # Démarrer ensuite
    start_success, start_message = start_stunnel()
    if start_success:
        return jsonify({
            "success": True,
            "message": f"Stunnel redémarré avec succès: {start_message}"
        })
    else:
        return jsonify({
            "success": False,
            "message": f"Stunnel arrêté mais erreur au démarrage: {start_message}"
        })


@app.route('/api/open-folder', methods=['POST'])
def open_folder():
    """Ouvre le dossier du projet dans l'explorateur de fichiers"""
    try:
        # Ouvrir le dossier du projet (BASE_DIR)
        folder_path = str(BASE_DIR.absolute())
        print(f"[API] Ouverture du dossier: {folder_path}")
        
        # Vérifier que le dossier existe
        if not os.path.exists(folder_path):
            return jsonify({
                "success": False,
                "message": f"Le dossier n'existe pas: {folder_path}",
                "path": folder_path
            }), 404
        
        if sys.platform == 'win32':
            # Windows : utiliser explorer avec le chemin absolu
            # Utiliser shell=True pour que Windows résolve correctement explorer
            try:
                # Méthode 1: explorer avec le chemin (le plus fiable)
                subprocess.Popen(f'explorer "{folder_path}"', shell=True)
            except Exception as e1:
                try:
                    # Méthode 2: os.startfile (fallback)
                    os.startfile(folder_path)
                except Exception as e2:
                    try:
                        # Méthode 3: cmd start (dernier recours)
                        subprocess.Popen(f'cmd /c start "" "{folder_path}"', shell=True)
                    except Exception as e3:
                        return jsonify({
                            "success": False,
                            "message": f"Impossible d'ouvrir le dossier: {str(e3)}",
                            "path": folder_path
                        }), 500
            
            return jsonify({
                "success": True,
                "message": "Dossier ouvert dans l'explorateur",
                "path": folder_path
            })
        elif sys.platform == 'darwin':
            # macOS : utiliser open
            subprocess.Popen(['open', folder_path])
            return jsonify({
                "success": True,
                "message": "Dossier ouvert dans le Finder",
                "path": folder_path
            })
        else:
            # Linux : utiliser xdg-open
            subprocess.Popen(['xdg-open', folder_path])
            return jsonify({
                "success": True,
                "message": "Dossier ouvert dans le gestionnaire de fichiers",
                "path": folder_path
            })
    except Exception as e:
        error_msg = str(e)
        print(f"[API] Erreur ouverture dossier: {error_msg}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "success": False,
            "message": f"Erreur lors de l'ouverture du dossier: {error_msg}",
            "path": str(BASE_DIR.absolute())
        }), 500


@app.route('/api/config', methods=['GET'])
def get_config():
    """Récupère la configuration actuelle"""
    config = load_config()
    global USE_FFMPEG_PROXY
    USE_FFMPEG_PROXY = config.get('use_ffmpeg_proxy', True)
    
    # Vérifier FFmpeg si mode activé
    ffmpeg_available = False
    if USE_FFMPEG_PROXY:
        ffmpeg_exe = find_ffmpeg()
        ffmpeg_available = ffmpeg_exe is not None
    
    return jsonify({
        "use_ffmpeg_proxy": USE_FFMPEG_PROXY,
        "ffmpeg_available": ffmpeg_available,
        "ffmpeg_path": str(FFMPEG_EXE) if FFMPEG_EXE else None,
        "ffmpeg_custom_path": config.get('ffmpeg_path', ''),
        "auto_start_streams": config.get('auto_start_streams', True)
    })


@app.route('/api/config', methods=['PUT'])
def update_config():
    """Met à jour la configuration (peut être changé même si Nginx est démarré)"""
    global USE_FFMPEG_PROXY
    
    # Vérifier que la requête contient du JSON
    if not request.is_json:
        return jsonify({
            "success": False,
            "message": "Content-Type doit être application/json"
        }), 400
    
    try:
        data = request.get_json()
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Erreur parsing JSON: {str(e)}"
        }), 400
    
    # Charger la config actuelle
    config = load_config()
    old_mode = config.get('use_ffmpeg_proxy', True)
    
    # Mettre à jour
    if 'use_ffmpeg_proxy' in data:
        new_mode = data['use_ffmpeg_proxy']
        
        # Si le mode change
        if old_mode != new_mode:
            # Si on active FFmpeg, vérifier qu'il est disponible
            if new_mode and not find_ffmpeg():
                return jsonify({
                    "success": False,
                    "message": "FFmpeg non trouvé. Installez FFmpeg avant d'activer ce mode, ou ajoutez-le au PATH."
                }), 400
            
            # Vérifier si Nginx est démarré (pour info seulement)
            nginx_status, _ = get_nginx_status()
            if nginx_status:
                # Si on passe de FFmpeg à Nginx Direct
                if old_mode and not new_mode:
                    # Arrêter tous les processus FFmpeg actifs
                    for stream_id in list(FFMPEG_PROCESSES.keys()):
                        stop_ffmpeg_relay(stream_id)
                    warning = " Nginx est démarré: rechargez-le pour appliquer le nouveau mode (Nginx Direct)."
                # Si on passe de Nginx Direct à FFmpeg
                elif not old_mode and new_mode:
                    warning = " Nginx est démarré: rechargez-le pour appliquer le nouveau mode (FFmpeg Proxy)."
                else:
                    warning = ""
            else:
                warning = ""
            
            config['use_ffmpeg_proxy'] = new_mode
            USE_FFMPEG_PROXY = new_mode
        else:
            warning = ""
    
    if 'auto_start_streams' in data:
        config['auto_start_streams'] = data['auto_start_streams']
    
    if 'ffmpeg_path' in data:
        # Mettre à jour le chemin personnalisé FFmpeg
        custom_path = data.get('ffmpeg_path', '').strip()
        config['ffmpeg_path'] = custom_path
        
        # Si un chemin personnalisé est fourni, réinitialiser FFMPEG_EXE pour forcer la recherche
        if custom_path:
            global FFMPEG_EXE
            FFMPEG_EXE = None
            # Tester le chemin
            test_path = Path(custom_path)
            if not test_path.exists():
                return jsonify({
                    "success": False,
                    "message": f"Le chemin FFmpeg spécifié n'existe pas: {custom_path}"
                }), 400
    
    if 'obs_websocket' in data:
        # Mettre à jour la configuration OBS WebSocket
        obs_config = data.get('obs_websocket', {})
        if 'obs_websocket' not in config:
            config['obs_websocket'] = {}
        
        config['obs_websocket'].update(obs_config)
        
        # Mettre à jour les variables globales
        global OBS_WS_ENABLED, OBS_WS_HOST, OBS_WS_PORT, OBS_WS_PASSWORD, OBS_WS_CLIENT
        OBS_WS_ENABLED = obs_config.get('enabled', False)
        OBS_WS_HOST = obs_config.get('host', 'localhost')
        OBS_WS_PORT = obs_config.get('port', 4455)
        OBS_WS_PASSWORD = obs_config.get('password', '')
        
        # Se reconnecter si activé
        if OBS_WS_ENABLED:
            OBS_WS_CLIENT = connect_obs_websocket()
            if not OBS_WS_CLIENT:
                warning = " (OBS WebSocket non connecté - vérifiez que OBS est démarré)"
            else:
                warning = ""
        else:
            OBS_WS_CLIENT = None
            warning = ""
    
    try:
        # Sauvegarder
        save_config(config)
        
        # Régénérer la config RTMP avec le nouveau mode
        generate_rtmp_config()
        
        mode_str = "FFmpeg Proxy" if USE_FFMPEG_PROXY else "Nginx Direct"
        message = f"Configuration mise à jour. Mode: {mode_str}."
        if 'obs_websocket' in data:
            if OBS_WS_ENABLED:
                obs_msg = "OBS WebSocket activé"
                if OBS_WS_CLIENT:
                    obs_msg += " et connecté"
                else:
                    obs_msg += " mais non connecté (redémarrez le serveur si OBS est démarré)"
                message += f" {obs_msg}."
        message += warning
        
        return jsonify({
            "success": True,
            "message": message,
            "config": config,
            "nginx_running": nginx_status if 'use_ffmpeg_proxy' in data and old_mode != new_mode else False,
            "needs_reload": nginx_status if 'use_ffmpeg_proxy' in data and old_mode != new_mode else False
        })
    except Exception as e:
        # Toujours retourner du JSON, jamais du HTML
        return jsonify({
            "success": False,
            "message": f"Erreur lors de la mise à jour de la configuration: {str(e)}"
        }), 500


@app.route('/')
def index():
    """Page de démarrage - splash screen avec vérification du serveur"""
    ui_dir = BASE_DIR / "stream_ui"
    if not (ui_dir / "splash.html").exists():
        # Fallback vers index.html si splash.html n'existe pas
        if not (ui_dir / "index.html").exists():
            return f"<h1>Erreur</h1><p>Le dossier stream_ui est introuvable dans : {BASE_DIR}</p>", 500
        return send_from_directory(ui_dir, "index.html")
    return send_from_directory(ui_dir, "splash.html")


@app.route('/<path:path>')
def serve_static(path):
    """Serve les fichiers statiques"""
    # Ne pas servir les routes API (elles doivent être gérées avant cette route)
    if path.startswith('api/'):
        # Cette route ne devrait jamais être appelée pour /api/* car les routes API sont définies avant
        # Mais on la garde pour sécurité
        return jsonify({"error": "Route API non trouvée", "path": path}), 404
    
    ui_dir = BASE_DIR / "stream_ui"
    if not ui_dir.exists():
        return f"<h1>Erreur</h1><p>Le dossier stream_ui est introuvable</p>", 500
    
    try:
        return send_from_directory(ui_dir, path)
    except Exception as e:
        return f"<h1>Erreur</h1><p>Fichier non trouvé: {path}</p>", 404


def get_local_ip():
    """Détecte l'IP locale de la machine automatiquement"""
    try:
        # Méthode 1 : Se connecter à un serveur externe pour obtenir l'IP locale
        # (sans réellement envoyer de données)
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        try:
            # Ne se connecte pas réellement, juste pour déterminer quelle interface utiliser
            s.connect(('8.8.8.8', 80))
            ip = s.getsockname()[0]
            s.close()
            return ip
        except Exception:
            s.close()
            raise
    except Exception:
        try:
            # Méthode 2 : Utiliser hostname
            hostname = socket.gethostname()
            ip = socket.gethostbyname(hostname)
            # Vérifier si c'est une IP valide (pas 127.0.0.1)
            if ip and ip != '127.0.0.1':
                return ip
        except Exception:
            pass
        
        # Méthode 3 : Parcourir toutes les interfaces réseau
        try:
            import socket
            import subprocess
            if sys.platform == 'win32':
                # Sur Windows, utiliser ipconfig
                result = subprocess.run(
                    ['ipconfig'],
                    capture_output=True,
                    text=True,
                    timeout=5
                )
                if result.returncode == 0:
                    # Chercher une adresse IPv4 qui n'est pas 127.0.0.1
                    for line in result.stdout.split('\n'):
                        if 'IPv4' in line or 'adresse IPv4' in line.lower():
                            parts = line.split(':')
                            if len(parts) > 1:
                                ip = parts[1].strip()
                                if ip and ip != '127.0.0.1' and ip.startswith('192.168.'):
                                    return ip
        except Exception:
            pass
        
        # Fallback : retourner localhost
        return '127.0.0.1'


def get_rtmp_url():
    """Retourne l'URL RTMP complète pour OBS (avec IP locale détectée)"""
    local_ip = get_local_ip()
    port = 1935  # Port RTMP standard
    return f"rtmp://{local_ip}:{port}/live"


if __name__ == '__main__':
    import socket
    
    # Charger la configuration au démarrage
    config = load_config()
    USE_FFMPEG_PROXY = config.get('use_ffmpeg_proxy', True)
    
    # Tenter de se connecter à OBS WebSocket si activé
    if OBS_WS_ENABLED:
        print("\nConnexion à OBS WebSocket...")
        obs_client = connect_obs_websocket()
        if obs_client:
            print(f"✓ OBS WebSocket connecté ({OBS_WS_HOST}:{OBS_WS_PORT})")
            print("  → Synchronisation automatique OBS activée")
        else:
            print("⚠ OBS WebSocket non connecté (vérifiez que OBS est démarré et que le plugin est installé)")
            print("  → Les flux fonctionneront mais sans synchronisation OBS automatique")
    
    # Vérifier que le dossier stream_ui existe
    ui_dir = BASE_DIR / "stream_ui"
    if not ui_dir.exists():
        print(f"ERREUR: Le dossier stream_ui n'existe pas dans {BASE_DIR}")
        print("Assurez-vous que tous les fichiers sont présents.")
        sys.exit(1)
    
    # Afficher le mode actuel
    print("=" * 50)
    print("Gestionnaire de Streams RTMP")
    print("=" * 50)
    mode_str = "FFmpeg Proxy (contrôle dynamique, latence +0.5-1s)" if USE_FFMPEG_PROXY else "Nginx Direct (latence minimale, reload requis)"
    print(f"\nMode: {mode_str}")
    
    if USE_FFMPEG_PROXY:
        # Vérifier FFmpeg si mode activé
        ffmpeg_exe = find_ffmpeg()
        if not ffmpeg_exe:
            print("\n⚠️  ATTENTION: FFmpeg non trouvé!")
            print("   Le mode FFmpeg est activé mais FFmpeg n'est pas disponible.")
            print("   Changez le mode dans l'interface web ou dans config.json")
            print("   OU installez FFmpeg pour utiliser ce mode.\n")
        else:
            print(f"✓ FFmpeg détecté: {ffmpeg_exe}")
    
    # Génère la config initiale
    print("\nGénération de la configuration RTMP...")
    try:
        count = generate_rtmp_config()
        print(f"✓ Configuration générée avec {count} stream(s) actif(s)")
    except Exception as e:
        print(f"✗ Erreur lors de la génération: {e}")
        sys.exit(1)
    
    # Trouver un port disponible
    port = 5000
    max_port = 5010
    
    def is_port_available(p):
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        try:
            sock.bind(('localhost', p))
            sock.close()
            return True
        except:
            return False
    
    while port <= max_port:
        if is_port_available(port):
            break
        print(f"Port {port} occupé, essai du port {port + 1}...")
        port += 1
    
    if port > max_port:
        print("ERREUR: Aucun port disponible entre 5000 et 5010")
        sys.exit(1)
    
    # Démarre le serveur
    print("\n" + "=" * 60)
    print("🚀 SERVEUR DÉMARRÉ !")
    print("=" * 60)
    print()
    print("📍 URL PRINCIPALE:")
    print(f"   → http://localhost:{port}")
    print()
    print("📍 AUTRES URLs POUR Y ACCÉDER:")
    print(f"   → http://127.0.0.1:{port}")
    try:
        host_ip = socket.gethostbyname(socket.gethostname())
        print(f"   → http://{host_ip}:{port} (depuis un autre ordinateur sur le réseau)")
    except:
        pass
    print()
    print("=" * 60)
    print("⚠️  IMPORTANT: Gardez cette fenêtre ouverte !")
    print("    Appuyez sur Ctrl+C pour arrêter le serveur")
    print("=" * 60)
    print()
    
    try:
        app.run(host='0.0.0.0', port=port, debug=False, threaded=True)
    except KeyboardInterrupt:
        print("\n\nArrêt du serveur...")
    except Exception as e:
        print(f"\nERREUR: {e}")
        print("Vérifiez que le port n'est pas utilisé par un autre programme")
        sys.exit(1)

