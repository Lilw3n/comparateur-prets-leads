@echo off
chcp 65001 >nul
echo ========================================
echo Application de l'icone au fichier .bat
echo ========================================
echo.

set "BAT_FILE=start_stream_manager.bat"
set "ICO_FILE=stream_ui\logo.ico"

if not exist "%ICO_FILE%" (
    echo ERREUR: Le fichier icone n'existe pas: %ICO_FILE%
    echo Executez d'abord: python create_icon.py
    pause
    exit /b 1
)

if not exist "%BAT_FILE%" (
    echo ERREUR: Le fichier .bat n'existe pas: %BAT_FILE%
    pause
    exit /b 1
)

echo Creation d'un raccourci avec l'icone...
echo.

set "SHORTCUT=Gestionnaire de Streams.lnk"
set "SCRIPT_DIR=%~dp0"

powershell -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%SCRIPT_DIR%%SHORTCUT%'); $s.TargetPath = '%SCRIPT_DIR%%BAT_FILE%'; $s.WorkingDirectory = '%SCRIPT_DIR%'; $s.IconLocation = '%SCRIPT_DIR%%ICO_FILE%'; $s.Description = 'Gestionnaire de Streams RTMP'; $s.Save(); Write-Host 'Raccourci cree avec l''icone personnalisee !'"

if exist "%SHORTCUT%" (
    echo.
    echo [OK] Raccourci cree : %SHORTCUT%
    echo      L'icone a ete appliquee au raccourci.
    echo.
    echo Note: Pour appliquer l'icone au fichier .bat lui-meme:
    echo 1. Clic droit sur %BAT_FILE%
    echo 2. Proprietes ^> Changer l'icone
    echo 3. Selectionnez %ICO_FILE%
    echo.
) else (
    echo.
    echo [ATTENTION] Impossible de creer le raccourci automatiquement.
    echo.
    echo Methode manuelle:
    echo 1. Clic droit sur %BAT_FILE%
    echo 2. Proprietes ^> Changer l'icone
    echo 3. Selectionnez %ICO_FILE%
    echo.
)

pause



