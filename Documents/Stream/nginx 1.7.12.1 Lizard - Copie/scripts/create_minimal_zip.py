#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script pour créer un ZIP minimal (< 10 Mo) avec seulement les fichiers essentiels
"""

import zipfile
import os
from pathlib import Path
import sys

# Dossier racine du projet
BASE_DIR = Path(__file__).parent

# Nom du fichier ZIP
ZIP_NAME = "Stream_Manager_Minimal.zip"
MAX_SIZE_MB = 10

# Option: inclure FFmpeg ou non (FFmpeg fait ~96 Mo, dépasse la limite)
INCLUDE_FFMPEG = False  # Mettre à True si vous voulez inclure FFmpeg (ZIP sera ~38 Mo)

def get_size_mb(path):
    """Calcule la taille d'un fichier ou dossier en Mo"""
    if path.is_file():
        return path.stat().st_size / (1024 * 1024)
    elif path.is_dir():
        total = 0
        try:
            for file in path.rglob('*'):
                if file.is_file():
                    total += file.stat().st_size
        except:
            pass
        return total / (1024 * 1024)
    return 0

def should_include(path):
    """Détermine si un fichier/dossier doit être inclus"""
    
    # Exclure certains fichiers/dossiers
    exclude_patterns = [
        # Documentation
        '*.md',
        '*.txt',
        # Python
        '__pycache__',
        '*.pyc',
        '*.pyo',
        '*.pyd',
        # Git
        '.git',
        # Anciens fichiers
        '*.zip',
        '*.reg',
        # Tests et scripts temporaires
        'test_*.py',
        'check_*.py',
        'create_*.py',
        'apply_*.bat',
        'demarrer_streams_ffmpeg.py',
        # Logs
        '*.log',
        '*.pid',
        # Dossiers optionnels
        'contrib',
        'docs',
        'vhts',
        'logs',  # Exclure le dossier logs complet
        # Fichiers de configuration Nginx non essentiels
        'nginx - Copie.conf',
        'nginx-org.conf',
        'nginx-simple-WAF.conf',
        'nginx-win.conf',
        'mysite.rules',
        'naxsi_core.rules',
    ]
    
    name = path.name
    
    # Exclure les fichiers de documentation
    if any(name.endswith(ext) for ext in ['.md', '.txt']):
        # Mais garder requirements.txt
        if name != 'requirements.txt':
            return False
    
    # Exclure les patterns
    for pattern in exclude_patterns:
        if pattern.startswith('*.'):
            if name.endswith(pattern[1:]):
                return False
        elif name == pattern or pattern in str(path):
            return False
    
    return True

def create_minimal_zip():
    """Crée le ZIP minimal"""
    
    zip_path = BASE_DIR / ZIP_NAME
    
    # Supprimer l'ancien ZIP si existe
    if zip_path.exists():
        zip_path.unlink()
    
    print("=" * 60)
    print("CREATION DU ZIP MINIMAL")
    print("=" * 60)
    if not INCLUDE_FFMPEG:
        print("[INFO] FFmpeg sera exclu (trop volumineux ~96 Mo)")
        print("       L'utilisateur devra installer FFmpeg separément")
        print()
    else:
        print("[INFO] FFmpeg sera inclus (ZIP sera ~38 Mo)")
        print()
    
    print()
    
    # Fichiers/dossiers essentiels à inclure
    essential_items = [
        # Python
        'stream_manager.py',
        'config.json',
        'streams.json',
        'requirements.txt',
        # Batch
        'start_stream_manager.bat',
        # Interface
        'stream_ui',
        # Configuration Nginx
        'conf/nginx.conf',
        'conf/rtmp_streams.conf',
        # FFmpeg (optionnel, voir INCLUDE_FFMPEG)
        # 'ffmpeg',  # Exclu par défaut car trop volumineux
        # Nginx exécutables
        'nginx.exe',
        'nginx_basic.exe',
        # DLL nécessaire
        'lua51.dll',
        # Dossiers nécessaires (structure seulement, pas les fichiers)
        'temp',  # Structure seulement
        'html',
    ]
    
    total_size = 0
    files_added = []
    files_excluded = []
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as zipf:
        
        for item in essential_items:
            item_path = BASE_DIR / item
            
            if not item_path.exists():
                print(f"[SKIP] {item} (non trouve)")
                continue
            
            if item_path.is_file():
                # Vérifier la taille
                size_mb = get_size_mb(item_path)
                
                if should_include(item_path):
                    zipf.write(item_path, item)
                    total_size += size_mb
                    files_added.append((item, size_mb))
                    print(f"[OK] {item} ({size_mb:.2f} Mo)")
                else:
                    files_excluded.append((item, size_mb))
                    print(f"[EXCLU] {item}")
            
            elif item_path.is_dir():
                # Parcourir récursivement
                for file_path in item_path.rglob('*'):
                    if file_path.is_file() and should_include(file_path):
                        # FFmpeg est exclu par défaut (trop volumineux)
                        if 'ffmpeg' in str(file_path).lower() and not INCLUDE_FFMPEG:
                            print(f"[EXCLU] {file_path.relative_to(BASE_DIR)} (FFmpeg exclu pour taille)")
                            continue
                        
                        # Si FFmpeg est inclus, ne garder que ffmpeg.exe
                        if 'ffmpeg' in str(file_path).lower() and INCLUDE_FFMPEG:
                            if file_path.name.lower() not in ['ffmpeg.exe']:
                                print(f"[EXCLU] {file_path.relative_to(BASE_DIR)} (non essentiel)")
                                continue
                        
                        # Chemin relatif dans le ZIP
                        arcname = file_path.relative_to(BASE_DIR)
                        
                        size_mb = get_size_mb(file_path)
                        
                        zipf.write(file_path, arcname)
                        total_size += size_mb
                        files_added.append((str(arcname), size_mb))
        
        # Vérifier aussi les fichiers de conf essentiels
        conf_essentiels = [
            'conf/fastcgi_params',
            'conf/fastcgi.conf',
            'conf/scgi_params',
            'conf/uwsgi_params',
            'conf/mime.types',
        ]
        
        for conf_file in conf_essentiels:
            conf_path = BASE_DIR / conf_file
            if conf_path.exists() and should_include(conf_path):
                size_mb = get_size_mb(conf_path)
                zipf.write(conf_path, conf_file)
                total_size += size_mb
                files_added.append((conf_file, size_mb))
        
        # Ajouter le fichier d'instructions pour FFmpeg si exclu
        if not INCLUDE_FFMPEG:
            ffmpeg_instructions = BASE_DIR / "INSTALLATION_FFMPEG.txt"
            if ffmpeg_instructions.exists():
                zipf.write(ffmpeg_instructions, "INSTALLATION_FFMPEG.txt")
                files_added.append(("INSTALLATION_FFMPEG.txt", 0))
                print(f"[OK] Instructions FFmpeg ajoutees")
    
    # Taille finale
    final_size_mb = zip_path.stat().st_size / (1024 * 1024)
    
    print()
    print("=" * 60)
    print("RESUME")
    print("=" * 60)
    print(f"Fichiers ajoutes: {len(files_added)}")
    print(f"Taille totale: {total_size:.2f} Mo")
    print(f"Taille ZIP finale: {final_size_mb:.2f} Mo")
    print()
    
    if final_size_mb > MAX_SIZE_MB:
        print(f"[ATTENTION] La taille depasse {MAX_SIZE_MB} Mo !")
        print("Considerations:")
        print("- Exclure des fichiers de conf non essentiels")
        print("- Optimiser les binaires FFmpeg")
    else:
        print(f"[OK] ZIP cree avec succes: {ZIP_NAME}")
        print(f"     Taille: {final_size_mb:.2f} Mo (limite: {MAX_SIZE_MB} Mo)")
    
    print()
    print("Fichiers inclus dans le ZIP:")
    for file, size in sorted(files_added, key=lambda x: x[1], reverse=True)[:10]:
        print(f"  - {file} ({size:.2f} Mo)")
    
    return final_size_mb <= MAX_SIZE_MB

if __name__ == "__main__":
    try:
        success = create_minimal_zip()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n[ERREUR] {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

