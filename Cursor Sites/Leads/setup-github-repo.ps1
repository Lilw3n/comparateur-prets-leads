# Script pour créer et connecter le repository GitHub
# Usage: .\setup-github-repo.ps1

Write-Host "=== Configuration Repository GitHub ===" -ForegroundColor Cyan
Write-Host ""

# Vérifier si GitHub CLI est installé
if (Get-Command gh -ErrorAction SilentlyContinue) {
    Write-Host "✓ GitHub CLI détecté" -ForegroundColor Green
    
    # Vérifier l'authentification
    $authStatus = gh auth status 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠ GitHub CLI n'est pas authentifié" -ForegroundColor Yellow
        Write-Host "Authentification requise..." -ForegroundColor Yellow
        gh auth login
    } else {
        Write-Host "✓ GitHub CLI authentifié" -ForegroundColor Green
    }
} else {
    Write-Host "⚠ GitHub CLI non installé" -ForegroundColor Yellow
    Write-Host "Installez-le depuis: https://cli.github.com/" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Ou créez le repo manuellement sur https://github.com/new" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Création du repository GitHub..." -ForegroundColor Cyan

# Créer le repository
$repoName = "comparateur-prets"
$repoDescription = "Plateforme de comparaison de prêts immobiliers et crédits"

Write-Host "Nom du repo: $repoName" -ForegroundColor White
Write-Host "Description: $repoDescription" -ForegroundColor White
Write-Host ""

# Demander confirmation
$confirm = Read-Host "Créer le repository public '$repoName' ? (O/N)"
if ($confirm -ne "O" -and $confirm -ne "o" -and $confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host "Annulé" -ForegroundColor Yellow
    exit 0
}

# Créer le repo
Write-Host "Création en cours..." -ForegroundColor Cyan
gh repo create $repoName --public --description $repoDescription --source=. --remote=origin-new --push

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Repository créé avec succès!" -ForegroundColor Green
    
    # Changer le remote origin
    Write-Host "Configuration du remote origin..." -ForegroundColor Cyan
    git remote remove origin 2>$null
    git remote add origin "https://github.com/Lilw3n/$repoName.git"
    
    Write-Host ""
    Write-Host "=== Configuration terminée ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "Repository GitHub: https://github.com/Lilw3n/$repoName" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Pour push vos commits:" -ForegroundColor Yellow
    Write-Host "  git add ." -ForegroundColor White
    Write-Host "  git commit -m 'votre message'" -ForegroundColor White
    Write-Host "  git push -u origin main" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "⚠ Erreur lors de la création" -ForegroundColor Red
    Write-Host ""
    Write-Host "Créez le repo manuellement:" -ForegroundColor Yellow
    Write-Host "1. Allez sur https://github.com/new" -ForegroundColor White
    Write-Host "2. Nom: comparateur-prets" -ForegroundColor White
    Write-Host "3. Public" -ForegroundColor White
    Write-Host "4. Puis exécutez:" -ForegroundColor White
    Write-Host "   git remote set-url origin https://github.com/Lilw3n/comparateur-prets.git" -ForegroundColor Cyan
    Write-Host "   git push -u origin main" -ForegroundColor Cyan
}
