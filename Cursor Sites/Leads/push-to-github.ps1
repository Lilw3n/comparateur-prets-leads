# Script PowerShell pour push vers GitHub et déploiement Vercel

Write-Host "🚀 Configuration Git et Push vers GitHub" -ForegroundColor Cyan

# Vérifier le remote actuel
Write-Host "`n📋 Remote actuel:" -ForegroundColor Yellow
git remote -v

Write-Host "`n⚠️  IMPORTANT: Le remote actuel pointe vers un autre repository." -ForegroundColor Red
Write-Host "Vous devez créer un nouveau repository GitHub pour ce projet." -ForegroundColor Yellow

$createNew = Read-Host "`nVoulez-vous créer un nouveau remote? (o/n)"

if ($createNew -eq "o" -or $createNew -eq "O") {
    $repoUrl = Read-Host "Entrez l'URL de votre nouveau repository GitHub (ex: https://github.com/username/comparateur-prets.git)"
    
    if ($repoUrl) {
        Write-Host "`n🔄 Configuration du nouveau remote..." -ForegroundColor Cyan
        git remote set-url origin $repoUrl
        Write-Host "✅ Remote configuré: $repoUrl" -ForegroundColor Green
        
        Write-Host "`n📤 Push vers GitHub..." -ForegroundColor Cyan
        git push -u origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n✅ Push réussi!" -ForegroundColor Green
            Write-Host "`n🌐 Prochaines étapes:" -ForegroundColor Yellow
            Write-Host "1. Allez sur https://vercel.com" -ForegroundColor White
            Write-Host "2. Cliquez sur 'Add New Project'" -ForegroundColor White
            Write-Host "3. Importez votre repository: $repoUrl" -ForegroundColor White
            Write-Host "4. Configurez les variables d'environnement" -ForegroundColor White
            Write-Host "5. Déployez!" -ForegroundColor White
        } else {
            Write-Host "`n❌ Erreur lors du push. Vérifiez votre repository GitHub." -ForegroundColor Red
        }
    }
} else {
    Write-Host "`n📝 Pour push manuellement:" -ForegroundColor Yellow
    Write-Host "git remote set-url origin https://github.com/VOTRE_USERNAME/comparateur-prets.git" -ForegroundColor White
    Write-Host "git push -u origin main" -ForegroundColor White
}

Write-Host "`n✅ Terminé!" -ForegroundColor Green
