@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================
echo Gestionnaire de Streams RTMP
echo ========================================
echo.
echo Répertoire de travail: %CD%
echo.
echo Vérification de Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Python n'est pas installé ou n'est pas dans le PATH
    echo Veuillez installer Python 3.7 ou supérieur
    pause
    exit /b 1
)

echo Installation des dépendances...
pip install -r requirements.txt --quiet

echo.
echo Démarrage du serveur...
echo.
python stream_manager.py
if errorlevel 1 (
    echo.
    echo ERREUR lors du démarrage du serveur
    echo Vérifiez les messages d'erreur ci-dessus
    pause
    exit /b 1
)
pause

