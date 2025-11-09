# Script de surveillance et synchronisation automatique
# Surveille les changements de fichiers et synchronise automatiquement

param(
    [string]$WatchPath = "wp-content/themes/lilwen54-child",
    [int]$IntervalSeconds = 5
)

Write-Host "=== Surveillance et synchronisation automatique ===" -ForegroundColor Cyan
Write-Host "Dossier surveillé: $WatchPath" -ForegroundColor Yellow
Write-Host "Intervalle: $IntervalSeconds secondes" -ForegroundColor Yellow
Write-Host "Appuyez sur Ctrl+C pour arrêter" -ForegroundColor Yellow
Write-Host ""

$lastSync = Get-Date
$lastHash = ""

while ($true) {
    try {
        if (Test-Path $WatchPath) {
            # Calculer un hash des fichiers pour détecter les changements
            $files = Get-ChildItem -Path $WatchPath -Recurse -File | 
                     Where-Object { $_.Name -notlike "*.log" -and $_.Name -notlike "*.tmp" }
            
            $currentHash = ($files | Get-FileHash -Algorithm MD5 | Select-Object -ExpandProperty Hash) -join ""
            
            if ($currentHash -ne $lastHash) {
                $timeSinceLastSync = (Get-Date) - $lastSync
                
                if ($timeSinceLastSync.TotalSeconds -ge $IntervalSeconds) {
                    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Changements détectés, synchronisation..." -ForegroundColor Green
                    
                    # Exécuter le script de synchronisation
                    & ".\sync-to-ftp.ps1" -Path $WatchPath
                    
                    $lastSync = Get-Date
                    $lastHash = $currentHash
                    
                    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Synchronisation terminée" -ForegroundColor Green
                    Write-Host ""
                }
            }
        }
        
        Start-Sleep -Seconds 2
    } catch {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Erreur: $_" -ForegroundColor Red
        Start-Sleep -Seconds 5
    }
}

