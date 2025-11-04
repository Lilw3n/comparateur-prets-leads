#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script pour créer une icône ICO à partir du logo SVG
"""

try:
    from PIL import Image
    import cairosvg
    from pathlib import Path
except ImportError:
    print("Installation des dependances...")
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow", "cairosvg", "--quiet"])
    from PIL import Image
    import cairosvg
    from pathlib import Path

def create_ico_from_svg():
    """Crée un fichier ICO à partir du logo SVG"""
    svg_path = Path("stream_ui/logo.svg")
    ico_path = Path("stream_ui/logo.ico")
    
    if not svg_path.exists():
        print(f"ERREUR: {svg_path} n'existe pas")
        return False
    
    try:
        # Convertir SVG en PNG (avec différentes tailles pour ICO)
        sizes = [16, 32, 48, 64, 128, 256]
        images = []
        
        for size in sizes:
            # Convertir SVG en PNG via CairoSVG
            png_data = cairosvg.svg2png(url=str(svg_path), output_width=size, output_height=size)
            
            # Charger le PNG dans PIL
            from io import BytesIO
            img = Image.open(BytesIO(png_data))
            
            # Convertir en RGBA si nécessaire
            if img.mode != 'RGBA':
                img = img.convert('RGBA')
            
            images.append(img)
        
        # Sauvegarder en ICO
        ico_path.parent.mkdir(parents=True, exist_ok=True)
        images[0].save(
            ico_path,
            format='ICO',
            sizes=[(img.width, img.height) for img in images]
        )
        
        print(f"[OK] Icône créée : {ico_path}")
        print(f"     Tailles : {', '.join(map(str, sizes))}px")
        return True
        
    except Exception as e:
        print(f"[ERREUR] Impossible de créer l'icône : {e}")
        print("\nSolution alternative : Utilisez un convertisseur en ligne ou créez l'ICO manuellement")
        return False

if __name__ == "__main__":
    print("Creation de l'icone ICO depuis le logo SVG...")
    print("=" * 50)
    success = create_ico_from_svg()
    
    if success:
        print("\n[OK] L'icône est prête !")
        print("\nPour l'utiliser :")
        print("1. Clic droit sur start_stream_manager.bat")
        print("2. Proprietes > Changer l'icone")
        print("3. Selectionnez stream_ui\\logo.ico")
    else:
        print("\n[INFO] Créez un fichier ICO manuellement si besoin")



