# Script de synchronisation automatique vers le serveur FTP
# Usage: .\sync-to-ftp.ps1 [chemin_relatif]

param(
    [string]$Path = "."
)

# Configuration FTP
$ftpServer = "chataigner.o2switch.net"
$ftpUser = "gopo4199"
$ftpPass = "73vj-xLMK-BMD$"
$remoteBasePath = "/lilwen54.fr"

# Couleurs pour les messages
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Error { Write-Host $args -ForegroundColor Red }
function Write-Info { Write-Host $args -ForegroundColor Cyan }

Write-Info "=== Synchronisation FTP - Lilwen54 ===" 
Write-Info "Démarrage: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

# Fonction pour téléverser un fichier
function Upload-File {
    param($localFile, $remoteFile)
    
    try {
        $fileRequest = [System.Net.FtpWebRequest]::Create("ftp://$ftpServer$remoteFile")
        $fileRequest.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
        $fileRequest.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
        $fileRequest.UseBinary = $true
        $fileRequest.UsePassive = $true
        
        $fileContent = [System.IO.File]::ReadAllBytes($localFile)
        $fileRequest.ContentLength = $fileContent.Length
        
        $requestStream = $fileRequest.GetRequestStream()
        $requestStream.Write($fileContent, 0, $fileContent.Length)
        $requestStream.Close()
        
        $response = $fileRequest.GetResponse()
        $response.Close()
        
        return $true
    } catch {
        Write-Error "  ✗ Erreur: $_"
        return $false
    }
}

# Fonction pour créer un dossier distant
function Create-RemoteDirectory {
    param($remoteDir)
    
    try {
        $request = [System.Net.FtpWebRequest]::Create("ftp://$ftpServer$remoteDir/")
        $request.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
        $request.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
        $request.UsePassive = $true
        $response = $request.GetResponse()
        $response.Close()
        return $true
    } catch {
        # Le dossier existe probablement déjà
        return $false
    }
}

# Fonction pour synchroniser un fichier ou dossier
function Sync-Item {
    param($item, $basePath)
    
    $relativePath = $item.FullName.Substring($basePath.Length + 1)
    $remotePath = "$remoteBasePath/$relativePath".Replace('\', '/')
    
    # Ignorer certains fichiers et extensions
    $ignorePatterns = @('.git', '.gitignore', 'node_modules', '.vscode', '.idea', '*.log', '*.tmp', '*.cache', '*.md', 'README', 'ACTIVATION')
    $ignoreExtensions = @('.md', '.gitignore', '.log', '.tmp', '.cache')
    
    foreach ($pattern in $ignorePatterns) {
        if ($relativePath -like "*$pattern*") {
            return
        }
    }
    
    foreach ($ext in $ignoreExtensions) {
        if ($relativePath -like "*$ext") {
            return
        }
    }
    
    if ($item.PSIsContainer) {
        # Créer le dossier distant
        Create-RemoteDirectory -remoteDir $remotePath | Out-Null
        
        # Synchroniser les fichiers du dossier
        $childItems = Get-ChildItem -Path $item.FullName -File
        foreach ($childItem in $childItems) {
            Sync-Item -item $childItem -basePath $basePath
        }
        
        # Synchroniser les sous-dossiers
        $childDirs = Get-ChildItem -Path $item.FullName -Directory
        foreach ($childDir in $childDirs) {
            Sync-Item -item $childDir -basePath $basePath
        }
    } else {
        # Téléverser le fichier
        if (Upload-File -localFile $item.FullName -remoteFile $remotePath) {
            Write-Success "  ✓ $relativePath"
        }
    }
}

# Déterminer le chemin de base
$basePath = Resolve-Path $Path
Write-Info "Chemin local: $basePath"
Write-Info "Chemin distant: $remoteBasePath"
Write-Info ""

# Obtenir la liste des fichiers modifiés depuis le dernier commit (si Git est disponible)
$filesToSync = @()

if (Get-Command git -ErrorAction SilentlyContinue) {
    try {
        $gitFiles = git diff --name-only HEAD
        $gitFiles += git ls-files --others --exclude-standard
        
        if ($gitFiles) {
            Write-Info "Fichiers modifiés détectés via Git:"
            foreach ($file in $gitFiles) {
                if (Test-Path $file) {
                    $filesToSync += Get-Item $file
                    Write-Info "  - $file"
                }
            }
        }
    } catch {
        Write-Info "Git non disponible ou erreur, synchronisation complète..."
    }
}

# Si aucun fichier Git, synchroniser tout le thème enfant
if ($filesToSync.Count -eq 0) {
    $themePath = Join-Path $basePath "wp-content\themes\lilwen54-child"
    if (Test-Path $themePath) {
        Write-Info "Synchronisation du thème enfant..."
        # Synchroniser uniquement les fichiers essentiels
        $essentialFiles = @("style.css", "functions.php")
        foreach ($fileName in $essentialFiles) {
            $filePath = Join-Path $themePath $fileName
            if (Test-Path $filePath) {
                $file = Get-Item $filePath
                Sync-Item -item $file -basePath $basePath
            }
        }
        # Synchroniser aussi les autres fichiers PHP et CSS
        $otherFiles = Get-ChildItem -Path $themePath -File | Where-Object {
            $_.Extension -in @('.php', '.css', '.js') -and 
            $_.Name -notlike "*.md" -and 
            $_.Name -notlike "*README*" -and
            $_.Name -notlike "*ACTIVATION*"
        }
        foreach ($file in $otherFiles) {
            Sync-Item -item $file -basePath $basePath
        }
    } else {
        Write-Info "Synchronisation de tous les fichiers..."
        $items = Get-ChildItem -Path $basePath -File | Where-Object {
            $_.Extension -in @('.php', '.css', '.js') -and 
            $_.Name -notlike "*.md"
        }
        foreach ($item in $items) {
            Sync-Item -item $item -basePath $basePath
        }
    }
} else {
    Write-Info "Synchronisation des fichiers modifiés..."
    foreach ($file in $filesToSync) {
        # Filtrer uniquement les fichiers essentiels
        if ($file.Extension -in @('.php', '.css', '.js') -and $file.Name -notlike "*.md") {
            Sync-Item -item $file -basePath $basePath
        }
    }
}

Write-Info ""
Write-Success "=== Synchronisation terminée ===" 
Write-Info "Fin: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

