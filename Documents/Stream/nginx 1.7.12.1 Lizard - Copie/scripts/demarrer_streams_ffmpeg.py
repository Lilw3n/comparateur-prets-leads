#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script pour démarrer manuellement tous les streams FFmpeg
"""

import sys
import json
from pathlib import Path

# Importer les fonctions depuis stream_manager
sys.path.insert(0, '.')
from stream_manager import (
    load_streams, 
    start_ffmpeg_relay, 
    FFMPEG_PROCESSES,
    find_ffmpeg,
    USE_FFMPEG_PROXY,
    load_config
)

def demarrer_tous_streams():
    """Démarre tous les streams activés"""
    print("=" * 60)
    print("DEMARRAGE DES STREAMS FFMPEG")
    print("=" * 60)
    
    # Vérifier le mode
    config = load_config()
    use_ffmpeg = config.get('use_ffmpeg_proxy', True)
    
    if not use_ffmpeg:
        print("[ATTENTION] Le mode FFmpeg Proxy n'est pas active dans config.json")
        print("Activez-le dans l'interface web ou modifiez config.json")
        return False
    
    # Vérifier FFmpeg
    ffmpeg_exe = find_ffmpeg()
    if not ffmpeg_exe:
        print("[ERREUR] FFmpeg non trouve !")
        print("Installez FFmpeg ou configurez le chemin dans config.json")
        return False
    
    print(f"[OK] FFmpeg trouve: {ffmpeg_exe}\n")
    
    # Charger les streams
    streams = load_streams()
    if not streams:
        print("[ERREUR] Aucun stream trouve dans streams.json")
        return False
    
    print(f"[OK] {len(streams)} stream(s) trouve(s)\n")
    
    # Filtrer les streams activés
    enabled_streams = [s for s in streams if s.get('enabled') is True]
    
    if not enabled_streams:
        print("[ATTENTION] Aucun stream active dans streams.json")
        print("Activez au moins un stream dans l'interface web ou streams.json")
        return False
    
    print(f"[OK] {len(enabled_streams)} stream(s) active(s)\n")
    print("-" * 60)
    
    # Démarrer chaque stream
    started = 0
    errors = []
    
    for stream in enabled_streams:
        stream_id = stream.get('id')
        stream_name = stream.get('name', f'Stream {stream_id}')
        stream_url = stream.get('url', '')
        
        if not stream_url:
            print(f"[ERREUR] {stream_name} (ID: {stream_id}): URL manquante")
            errors.append(f"{stream_name}: URL manquante")
            continue
        
        # Vérifier si déjà démarré
        if stream_id in FFMPEG_PROCESSES:
            process = FFMPEG_PROCESSES[stream_id]
            try:
                if process.poll() is None:
                    print(f"[INFO] {stream_name} (ID: {stream_id}): Deja demarre")
                    started += 1
                    continue
            except:
                pass
        
        # Démarrer le relay
        print(f"[DEBUT] Demarrage de {stream_name} (ID: {stream_id})...")
        process, message = start_ffmpeg_relay(stream_id, stream_url)
        
        if process:
            FFMPEG_PROCESSES[stream_id] = process
            print(f"[OK] {stream_name} (ID: {stream_id}): {message}")
            print(f"      URL: {stream_url[:80]}...")
            started += 1
        else:
            print(f"[ERREUR] {stream_name} (ID: {stream_id}): {message}")
            errors.append(f"{stream_name}: {message}")
    
    # Résumé
    print("\n" + "=" * 60)
    print("RESUME")
    print("=" * 60)
    print(f"[OK] {started}/{len(enabled_streams)} stream(s) demarre(s)")
    
    if errors:
        print(f"[ERREUR] {len(errors)} erreur(s):")
        for error in errors:
            print(f"  - {error}")
    
    # Vérifier les processus
    print("\n" + "-" * 60)
    print("VERIFICATION DES PROCESSUS FFMPEG")
    print("-" * 60)
    
    if sys.platform == 'win32':
        try:
            import subprocess
            result = subprocess.run(
                ['tasklist', '/FI', 'IMAGENAME eq ffmpeg.exe'],
                capture_output=True,
                text=True,
                timeout=5
            )
            if 'ffmpeg.exe' in result.stdout:
                count = result.stdout.count('ffmpeg.exe')
                print(f"[OK] {count} processus FFmpeg actif(s) dans le Gestionnaire des taches")
            else:
                print("[ATTENTION] Aucun processus FFmpeg visible dans le Gestionnaire des taches")
                print("          Cela peut prendre quelques secondes...")
        except:
            print("[INFO] Impossible de verifier les processus (utilisez le Gestionnaire des taches)")
    
    return started > 0


if __name__ == "__main__":
    try:
        success = demarrer_tous_streams()
        if success:
            print("\n[OK] Les streams devraient maintenant etre actifs sur les plateformes")
            print("     Verifiez dans le Gestionnaire des taches (Ctrl+Shift+Esc)")
            print("     Recherchez 'ffmpeg.exe'")
        else:
            print("\n[ERREUR] Aucun stream n'a pu etre demarre")
            print("         Verifiez:")
            print("         1. Que Nginx est demarre")
            print("         2. Que OBS stream vers rtmp://192.168.1.28:1935/live")
            print("         3. Que les URLs dans streams.json sont correctes")
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n[INFO] Arrete par l'utilisateur")
        sys.exit(1)
    except Exception as e:
        print(f"\n[ERREUR] Erreur: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)



