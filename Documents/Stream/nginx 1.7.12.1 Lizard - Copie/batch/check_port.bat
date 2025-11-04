@echo off
chcp 65001 >nul
echo Vérification du port utilisé par le gestionnaire de streams...
echo.
python check_port.py
echo.
pause

