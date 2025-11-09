# Script de démarrage de la synchronisation automatique
# Lance la surveillance en continu

Write-Host "=== Démarrage de la synchronisation automatique ===" -ForegroundColor Cyan
Write-Host ""

# Vérifier que le script existe
if (-not (Test-Path "watch-and-sync.ps1")) {
    Write-Host "Erreur: watch-and-sync.ps1 introuvable" -ForegroundColor Red
    exit 1
}

# Vérifier la politique d'exécution
$executionPolicy = Get-ExecutionPolicy
if ($executionPolicy -eq "Restricted") {
    Write-Host "Attention: La politique d'exécution est Restricted" -ForegroundColor Yellow
    Write-Host "Exécutez: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor Yellow
}

Write-Host "Lancement de la surveillance..." -ForegroundColor Green
Write-Host "Appuyez sur Ctrl+C pour arrêter" -ForegroundColor Yellow
Write-Host ""

# Lancer le script de surveillance
& ".\watch-and-sync.ps1"

