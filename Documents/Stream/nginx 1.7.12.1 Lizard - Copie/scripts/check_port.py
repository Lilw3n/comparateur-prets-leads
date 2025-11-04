#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script pour vérifier quel port est utilisé par le gestionnaire de streams
"""

import socket
import sys

def is_port_available(port):
    """Vérifie si un port est disponible"""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        sock.bind(('localhost', port))
        sock.close()
        return True
    except:
        return False

def check_port_in_use(port):
    """Vérifie si un port est en cours d'utilisation"""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        result = sock.connect_ex(('localhost', port))
        sock.close()
        return result == 0  # 0 signifie que la connexion a réussi
    except:
        return False

print("=" * 60)
print("Vérification des ports pour le Gestionnaire de Streams")
print("=" * 60)
print()

# Vérifier les ports 5000-5010
ports_to_check = list(range(5000, 5011))
print("Ports à vérifier:", ", ".join(map(str, ports_to_check)))
print()

for port in ports_to_check:
    available = is_port_available(port)
    in_use = check_port_in_use(port)
    
    if in_use:
        print(f"[OCCUPE] Port {port}: Le serveur tourne probablement ici!")
        print(f"  -> Essayez: http://localhost:{port}")
        print(f"  -> Ou: http://127.0.0.1:{port}")
    elif available:
        print(f"[OK] Port {port}: Disponible")
    else:
        print(f"[ERR] Port {port}: Non disponible")

print()
print("=" * 60)
print("Conseils:")
print("- Si un port est OCCUPÉ, c'est probablement votre serveur")
print("- Essayez d'accéder à http://localhost:XXXX où XXXX est le port occupé")
print("- Si aucun port n'est occupé, lancez start_stream_manager.bat")
print("=" * 60)

