#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gestionnaire de proxy RTMP dynamique
Permet d'activer/désactiver des streams sans recharger Nginx
"""

import json
import subprocess
import os
import sys
import time
from pathlib import Path
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

BASE_DIR = Path(__file__).parent
STREAMS_FILE = BASE_DIR / "streams.json"
FFMPEG_PROCESSES = {}  # {stream_id: subprocess.Popen}

def load_streams():
    """Charge la liste des streams"""
    if STREAMS_FILE.exists():
        with open(STREAMS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_streams(streams):
    """Sauvegarde les streams"""
    with open(STREAMS_FILE, 'w', encoding='utf-8') as f:
        json.dump(streams, f, indent=2, ensure_ascii=False)

def start_ffmpeg_relay(stream_id, source_url, destination_url):
    """Démarre un relais ffmpeg pour un stream"""
    try:
        # Commande ffmpeg pour relayer RTMP
        cmd = [
            'ffmpeg',
            '-i', source_url,  # Source RTMP
            '-c', 'copy',      # Copier sans transcoder
            '-f', 'flv',       # Format de sortie
            destination_url,   # Destination RTMP
            '-loglevel', 'error',  # Moins de logs
            '-reconnect', '1',
            '-reconnect_at_eof', '1',
            '-reconnect_streamed', '1',
            '-reconnect_delay_max', '2'
        ]
        
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == 'win32' else 0
        )
        
        return process
    except Exception as e:
        print(f"Erreur démarrage ffmpeg: {e}")
        return None

def stop_ffmpeg_relay(stream_id):
    """Arrête un relais ffmpeg"""
    if stream_id in FFMPEG_PROCESSES:
        process = FFMPEG_PROCESSES[stream_id]
        try:
            process.terminate()
            time.sleep(0.5)
            if process.poll() is None:
                process.kill()
            del FFMPEG_PROCESSES[stream_id]
            return True
        except:
            return False
    return False

@app.route('/api/proxy/streams/<stream_id>/start', methods=['POST'])
def start_proxy_stream(stream_id):
    """Démarre le relais pour un stream"""
    streams = load_streams()
    stream = next((s for s in streams if s.get('id') == stream_id), None)
    
    if not stream:
        return jsonify({"success": False, "message": "Stream introuvable"}), 404
    
    if stream_id in FFMPEG_PROCESSES:
        return jsonify({"success": False, "message": "Le relais est déjà démarré"})
    
    # Source : localhost:1935 (nginx RTMP)
    source_url = f"rtmp://localhost:1935/live"
    destination_url = stream.get('url')
    
    process = start_ffmpeg_relay(stream_id, source_url, destination_url)
    
    if process:
        FFMPEG_PROCESSES[stream_id] = process
        return jsonify({"success": True, "message": "Relais démarré"})
    else:
        return jsonify({"success": False, "message": "Erreur démarrage relais"})

@app.route('/api/proxy/streams/<stream_id>/stop', methods=['POST'])
def stop_proxy_stream(stream_id):
    """Arrête le relais pour un stream"""
    if stop_ffmpeg_relay(stream_id):
        return jsonify({"success": True, "message": "Relais arrêté"})
    else:
        return jsonify({"success": False, "message": "Relais non trouvé"})

if __name__ == '__main__':
    app.run(port=5001)



