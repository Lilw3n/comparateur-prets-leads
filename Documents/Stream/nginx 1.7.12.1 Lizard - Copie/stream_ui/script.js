// Détection automatique de l'URL de l'API
const API_URL = `${window.location.protocol}//${window.location.host}/api`;

let currentEditingId = null;
let selectedStreams = new Set(); // Set des IDs de streams sélectionnés

// Charger les streams au démarrage
document.addEventListener('DOMContentLoaded', () => {
    loadStreams();
    checkNginxStatus();
    checkStunnelStatus();
    checkConfigStatus();
    // Vérifier le statut toutes les 5 secondes
    setInterval(checkNginxStatus, 5000);
    setInterval(checkStunnelStatus, 5000);
    setInterval(checkConfigStatus, 10000); // Moins fréquent pour le mode
});

// Vérifier si le serveur est accessible
async function checkServerConnection() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(`${API_URL}/streams`, {
            method: 'GET',
            signal: controller.signal,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        // Vérifier que la réponse est bien JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            console.warn('Réponse non-JSON reçue:', contentType);
            // Ce n'est pas fatal, on continue
        }
        
        return true;
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error('Timeout: Le serveur ne répond pas dans les 3 secondes');
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            console.error('Erreur réseau: Impossible de se connecter au serveur. Vérifiez que start_stream_manager.bat est lancé.');
        } else {
            console.error('Erreur de connexion:', error.message || error);
        }
        return false;
    }
}

// Charger la liste des streams
async function loadStreams() {
    // Vérifier d'abord si le serveur est accessible
    const serverAvailable = await checkServerConnection();
    
    if (!serverAvailable) {
        showToast('Erreur: Le serveur n\'est pas accessible. Vérifiez que start_stream_manager.bat est lancé.', 'error');
        // Afficher un message dans l'interface
        const container = document.getElementById('streams-list');
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--danger);">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <h2 style="margin-bottom: 1rem;">Serveur non accessible</h2>
                <p>Le serveur Flask n'est pas démarré ou n'est pas accessible.</p>
                <p style="margin-top: 0.5rem; font-size: 0.9rem;">
                    <strong>1.</strong> Lancez <strong>start_stream_manager.bat</strong> pour démarrer le serveur.
                </p>
                <p style="margin-top: 0.5rem; font-size: 0.9rem;">
                    <strong>2.</strong> Rechargez cette page avec <kbd>Ctrl+F5</kbd> (rechargement forcé).
                </p>
                <p style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--text-secondary);">
                    URL attendue: ${API_URL.replace('/api', '')}
                </p>
                <button class="btn btn-primary" onclick="location.reload(true)" style="margin-top: 1rem;">
                    <i class="fas fa-sync-alt"></i> Recharger la page
                </button>
            </div>
        `;
        return;
    }
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`${API_URL}/streams`, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        // L'API retourne soit un tableau directement, soit un objet avec {streams: [...], total: ..., active: ...}
        let streams;
        if (Array.isArray(data)) {
            streams = data;
        } else if (data && typeof data === 'object') {
            streams = data.streams || [];
        } else {
            streams = [];
        }
        
        console.log('Streams chargés:', streams.length, streams);
        
        if (streams.length === 0) {
            console.warn('Aucun stream trouvé dans la réponse API');
        }
        
        displayStreams(streams);
        updateStats(streams);
        updateToggleAllState();
    } catch (error) {
        if (error.name === 'AbortError') {
            showToast('Timeout: Le serveur ne répond pas', 'error');
        } else {
            showToast('Erreur lors du chargement des streams: ' + error.message, 'error');
        }
        console.error('Erreur loadStreams:', error);
        
        // Afficher un message d'erreur dans l'interface
        const container = document.getElementById('streams-list');
        if (container) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--danger);">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <h2 style="margin-bottom: 1rem;">Erreur de chargement</h2>
                    <p>${error.message || 'Impossible de charger les streams'}</p>
                    <button class="btn btn-primary" onclick="loadStreams()" style="margin-top: 1rem;">
                        <i class="fas fa-sync-alt"></i> Réessayer
                    </button>
                </div>
            `;
        }
    }
}

// Afficher les streams
function displayStreams(streams) {
    const container = document.getElementById('streams-list');
    if (!container) {
        console.error('Container streams-list introuvable');
        return;
    }
    
    container.innerHTML = '';

    if (!streams || streams.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-secondary);">
                <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>Aucun stream configuré</p>
                <p style="margin-top: 0.5rem; font-size: 0.9rem;">Cliquez sur "Ajouter un Stream" pour commencer</p>
            </div>
        `;
        return;
    }

    console.log('Affichage de', streams.length, 'streams');
    
    streams.forEach((stream, index) => {
        if (!stream || !stream.id) {
            console.warn('Stream invalide à l\'index', index, stream);
            return;
        }
        try {
            const card = createStreamCard(stream);
            container.appendChild(card);
        } catch (error) {
            console.error('Erreur création carte stream', stream, error);
        }
    });
    
    // Appliquer la grille optimale selon le nombre de streams
    optimizeGridLayout(streams.length);
}

// Optimiser la disposition de la grille selon le nombre de streams
function optimizeGridLayout(count) {
    const container = document.getElementById('streams-list');
    if (!container) return;
    
    // Retirer toutes les classes de layout précédentes
    container.classList.remove('grid-2x2', 'grid-3x3', 'grid-4x4');
    
    if (count <= 4) {
        // 2x2 pour 1-4 streams (2 colonnes)
        container.classList.add('grid-2x2');
    } else if (count <= 8) {
        // 4 colonnes pour 5-8 streams (4x2 ou 4x1)
        container.classList.add('grid-4x4');
    } else if (count <= 12) {
        // 4 colonnes pour 9-12 streams (4x3)
        container.classList.add('grid-4x4');
    } else {
        // 4 colonnes pour 13+ streams (4x4+)
        container.classList.add('grid-4x4');
    }
}

// Créer une carte de stream
function createStreamCard(stream) {
    const card = document.createElement('div');
    card.className = `stream-card ${stream.enabled ? '' : 'disabled'}`;
    card.dataset.streamId = stream.id;
    
    // Vérifier si ce stream est sélectionné
    const isSelected = selectedStreams.has(stream.id);
    if (isSelected) {
        card.classList.add('selected');
    }
    
    const platformColors = {
        'Facebook': '#1877f2',
        'TikTok': '#000000',
        'Restream': '#ff6600',
        'Twitch': '#9146ff',
        'YouTube': '#ff0000',
        'Eklipse': '#6366f1',
        'OneStream': '#8b5cf6',
        'Instagram': '#e4405f'
    };

    const platformColor = platformColors[stream.platform] || '#6366f1';

    card.innerHTML = `
        <div class="stream-header">
            <div class="stream-checkbox-wrapper" style="position: absolute; top: 1rem; right: 1rem; z-index: 10;">
                <input type="checkbox" class="stream-select-checkbox" 
                       data-stream-id="${stream.id}" 
                       ${isSelected ? 'checked' : ''}
                       onchange="toggleStreamSelection('${stream.id}', this.checked)"
                       id="checkbox-${stream.id}">
                <label for="checkbox-${stream.id}" class="stream-checkbox-label"></label>
            </div>
            <div>
                <div class="stream-title">${escapeHtml(stream.name)}</div>
                <span class="stream-platform" style="background: ${platformColor}">
                    ${escapeHtml(stream.platform)}
                </span>
            </div>
            <div class="stream-status">
                <span class="status-badge ${stream.enabled ? 'active' : 'inactive'}">
                    <i class="fas ${stream.enabled ? 'fa-check-circle' : 'fa-pause-circle'}"></i>
                    ${stream.enabled ? 'Actif' : 'Inactif'}
                </span>
            </div>
        </div>
        <div class="stream-url" title="${escapeHtml(stream.url || 'URL non définie')}">
            <i class="fas fa-link" style="margin-right: 0.5rem; opacity: 0.7;"></i>
            ${escapeHtml(truncateUrl(stream.url || 'URL non définie', 60))}
        </div>
        <div class="stream-actions">
            <button class="btn btn-secondary" onclick="editStream('${stream.id}')">
                <i class="fas fa-edit"></i> Modifier
            </button>
            <button class="btn ${stream.enabled ? 'btn-secondary' : 'btn-success'}" 
                    onclick="toggleStream('${stream.id}', ${!stream.enabled})">
                <i class="fas ${stream.enabled ? 'fa-pause' : 'fa-play'}"></i>
                ${stream.enabled ? 'Désactiver' : 'Activer'}
            </button>
            <button class="btn btn-danger" onclick="deleteStream('${stream.id}')">
                <i class="fas fa-trash"></i> Supprimer
            </button>
        </div>
    `;

    return card;
}

// Mettre à jour les statistiques
function updateStats(streams) {
    const activeCount = streams.filter(s => s.enabled).length;
    const totalCount = streams.length;

    document.getElementById('active-count').textContent = activeCount;
    document.getElementById('total-count').textContent = totalCount;
}

// Afficher le modal d'ajout
function showAddModal() {
    currentEditingId = null;
    document.getElementById('modal-title').textContent = 'Ajouter un Stream';
    document.getElementById('stream-form').reset();
    document.getElementById('stream-enabled').checked = true;
    document.getElementById('modal').classList.add('show');
}

// Fermer le modal
function closeModal() {
    document.getElementById('modal').classList.remove('show');
    currentEditingId = null;
    document.getElementById('stream-form').reset();
}

// Éditer un stream
async function editStream(id) {
    try {
        const response = await fetch(`${API_URL}/streams`);
        const streams = await response.json();
        const stream = streams.find(s => s.id === id);

        if (!stream) {
            showToast('Stream introuvable', 'error');
            return;
        }

        currentEditingId = id;
        document.getElementById('modal-title').textContent = 'Modifier le Stream';
        document.getElementById('stream-name').value = stream.name;
        document.getElementById('stream-platform').value = stream.platform;
        document.getElementById('stream-url').value = stream.url;
        document.getElementById('stream-enabled').checked = stream.enabled;
        
        document.getElementById('modal').classList.add('show');
    } catch (error) {
        showToast('Erreur lors du chargement du stream', 'error');
        console.error(error);
    }
}

// Sauvegarder un stream
async function saveStream(event) {
    event.preventDefault();

    const formData = {
        name: document.getElementById('stream-name').value,
        platform: document.getElementById('stream-platform').value,
        url: document.getElementById('stream-url').value,
        enabled: document.getElementById('stream-enabled').checked
    };

    try {
        let response;
        if (currentEditingId) {
            // Mise à jour
            response = await fetch(`${API_URL}/streams/${currentEditingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
        } else {
            // Ajout
            response = await fetch(`${API_URL}/streams`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
        }

        const result = await response.json();

        if (result.success) {
            showToast(result.message || 'Stream sauvegardé avec succès', 'success');
            closeModal();
            loadStreams();
        } else {
            showToast(result.message || 'Erreur lors de la sauvegarde', 'error');
        }
    } catch (error) {
        showToast('Erreur de connexion au serveur', 'error');
        console.error(error);
    }
}

// Supprimer un stream
async function deleteStream(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce stream ?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/streams/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            showToast('Stream supprimé avec succès', 'success');
            loadStreams();
        } else {
            showToast(result.message || 'Erreur lors de la suppression', 'error');
        }
    } catch (error) {
        showToast('Erreur de connexion au serveur', 'error');
        console.error(error);
    }
}

// Activer/Désactiver un stream
async function toggleStream(id, enabled) {
    try {
        const response = await fetch(`${API_URL}/streams/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ enabled })
        });

        const result = await response.json();

        if (result.success) {
            let toastMessage = enabled ? 'Stream activé avec succès' : 'Stream désactivé avec succès';
            
            // Si en mode Nginx Direct et que le reload peut ne pas fonctionner
            if (result.may_require_restart) {
                toastMessage += ' (⚠️ Le rechargement RTMP peut nécessiter un redémarrage complet)';
                
                // Proposer un redémarrage après 2 secondes
                setTimeout(() => {
                    if (confirm('Le changement peut nécessiter un redémarrage complet de Nginx.\n\nVoulez-vous redémarrer Nginx maintenant ?\n\n⚠️ Cela coupera tous les streams actifs.')) {
                        restartNginx();
                    }
                }, 2000);
            }
            
            showToast(toastMessage, 'success');
            loadStreams();
            updateToggleAllState();
        } else {
            showToast(result.message || 'Erreur lors de la modification', 'error');
        }
    } catch (error) {
        showToast('Erreur de connexion au serveur', 'error');
        console.error(error);
    }
}

// Vérifier le statut de Nginx
async function checkNginxStatus() {
    const statusCard = document.getElementById('nginx-status-card');
    const statusIcon = document.getElementById('nginx-icon');
    const statusIconI = document.getElementById('nginx-icon-i');
        const startBtn = document.getElementById('nginx-start-btn');
        const stopBtn = document.getElementById('nginx-stop-btn');
        const reloadBtn = document.getElementById('nginx-reload-btn');
        const restartBtn = document.getElementById('nginx-restart-btn');
        const statusText = document.getElementById('nginx-status-text');
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`${API_URL}/nginx/status`, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const result = await response.json();
        
        // Afficher l'URL RTMP si disponible
        const rtmpUrlDiv = document.getElementById('nginx-rtmp-url');
        const rtmpUrlText = document.getElementById('rtmp-url-text');
        if (result.rtmp_url && rtmpUrlDiv && rtmpUrlText) {
            rtmpUrlText.textContent = result.rtmp_url;
            rtmpUrlDiv.style.display = 'block';
            rtmpUrlDiv.title = `URL RTMP pour OBS Media Source - IP détectée : ${result.local_ip || 'automatique'}`;
        } else if (rtmpUrlDiv) {
            rtmpUrlDiv.style.display = 'none';
        }
        
        if (result.running) {
            // Nginx est démarré
            statusIcon.className = 'stat-icon running';
            statusIconI.className = 'fas fa-server';
            startBtn.style.display = 'none';
            stopBtn.style.display = 'inline-flex';
            reloadBtn.style.display = 'inline-flex';
            restartBtn.style.display = 'inline-flex';
            statusText.textContent = 'Démarré';
            statusText.style.color = 'var(--success)';
        } else {
            // Nginx est arrêté
            statusIcon.className = 'stat-icon stopped';
            statusIconI.className = 'fas fa-server';
            startBtn.style.display = 'inline-flex';
            stopBtn.style.display = 'none';
            reloadBtn.style.display = 'none';
            restartBtn.style.display = 'none';
            statusText.textContent = 'Arrêté';
            statusText.style.color = 'var(--danger)';
        }
    } catch (error) {
        console.error('Erreur lors de la vérification du statut Nginx:', error);
        // En cas d'erreur, afficher les deux boutons pour permettre à l'utilisateur d'essayer
        statusIcon.className = 'stat-icon stopped';
        statusIconI.className = 'fas fa-server';
        startBtn.style.display = 'inline-flex';
        stopBtn.style.display = 'inline-flex';
        reloadBtn.style.display = 'none';
        statusText.textContent = 'Erreur de connexion';
        statusText.style.color = 'var(--danger)';
        statusText.title = 'Cliquez sur Démarrer ou Arrêter pour réessayer';
    }
}

// Démarrer Nginx
async function startNginx() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(`${API_URL}/nginx/start`, {
            method: 'POST',
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            showToast('Nginx démarré avec succès', 'success');
            setTimeout(checkNginxStatus, 1000);
        } else {
            showToast(result.message || 'Erreur lors du démarrage', 'error');
            setTimeout(checkNginxStatus, 1000);
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            showToast('Timeout: Le serveur ne répond pas. Vérifiez qu\'il est bien démarré.', 'error');
        } else {
            showToast('Erreur de connexion au serveur. Vérifiez que start_stream_manager.bat est lancé.', 'error');
        }
        console.error(error);
        // Réessayer de vérifier le statut après l'erreur
        setTimeout(checkNginxStatus, 2000);
    }
}

// Arrêter Nginx
async function stopNginx() {
    if (!confirm('Êtes-vous sûr de vouloir arrêter Nginx ?')) {
        return;
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(`${API_URL}/nginx/stop`, {
            method: 'POST',
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            showToast('Nginx arrêté avec succès', 'success');
            setTimeout(checkNginxStatus, 1000);
        } else {
            showToast(result.message || 'Erreur lors de l\'arrêt', 'error');
            setTimeout(checkNginxStatus, 1000);
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            showToast('Timeout: Le serveur ne répond pas. Vérifiez qu\'il est bien démarré.', 'error');
        } else {
            showToast('Erreur de connexion au serveur. Vérifiez que start_stream_manager.bat est lancé.', 'error');
        }
        console.error(error);
        // Réessayer de vérifier le statut après l'erreur
        setTimeout(checkNginxStatus, 2000);
    }
}

// Recharger Nginx (graceful reload - ne coupe pas les connexions actives)
async function reloadNginx() {
    const reloadBtn = document.getElementById('nginx-reload-btn');
    const reloadIcon = document.getElementById('nginx-reload-icon');
    const reloadText = document.getElementById('nginx-reload-text');
    const reloadIndicator = document.getElementById('nginx-reload-indicator');
    
    // Désactiver le bouton et afficher l'animation
    if (reloadBtn) {
        reloadBtn.disabled = true;
        reloadBtn.style.opacity = '0.6';
        reloadBtn.style.cursor = 'wait';
    }
    if (reloadIcon) {
        reloadIcon.classList.add('fa-spin');
    }
    if (reloadText) {
        reloadText.textContent = 'Rechargement...';
    }
    
    try {
        const response = await fetch(`${API_URL}/nginx/reload`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            }
        });

        const result = await response.json();

        if (result.success) {
            showToast('Nginx rechargé avec succès ✓ (configuration actualisée, connexions préservées)', 'success');
            
            // Afficher l'indicateur de succès
            if (reloadIndicator) {
                reloadIndicator.style.display = 'block';
                reloadIndicator.style.color = 'var(--success)';
                const now = new Date();
                const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                reloadIndicator.innerHTML = `<i class="fas fa-check-circle"></i> <span>Rechargé avec succès à ${timeStr}</span>`;
                
                // Masquer après 5 secondes
                setTimeout(() => {
                    if (reloadIndicator) {
                        reloadIndicator.style.display = 'none';
                    }
                }, 5000);
            }
            
            // Vérifier le statut après 1 seconde pour confirmer que Nginx est toujours actif
            setTimeout(() => {
                checkNginxStatus();
            }, 1000);
        } else {
            showToast(result.message || 'Erreur lors du rechargement', 'error');
            
            // Afficher l'indicateur d'erreur
            if (reloadIndicator) {
                reloadIndicator.style.display = 'block';
                reloadIndicator.style.color = 'var(--danger)';
                reloadIndicator.innerHTML = `<i class="fas fa-exclamation-circle"></i> <span>Erreur: ${result.message || 'Rechargement échoué'}</span>`;
                
                // Masquer après 10 secondes
                setTimeout(() => {
                    if (reloadIndicator) {
                        reloadIndicator.style.display = 'none';
                    }
                }, 10000);
            }
            
            console.error('Erreur reload:', result);
        }
    } catch (error) {
        showToast('Erreur de connexion au serveur', 'error');
        console.error(error);
        
        // Afficher l'indicateur d'erreur
        if (reloadIndicator) {
            reloadIndicator.style.display = 'block';
            reloadIndicator.style.color = 'var(--danger)';
            reloadIndicator.innerHTML = `<i class="fas fa-exclamation-circle"></i> <span>Erreur de connexion</span>`;
            
            setTimeout(() => {
                if (reloadIndicator) {
                    reloadIndicator.style.display = 'none';
                }
            }, 10000);
        }
    } finally {
        // Réactiver le bouton
        if (reloadBtn) {
            reloadBtn.disabled = false;
            reloadBtn.style.opacity = '1';
            reloadBtn.style.cursor = 'pointer';
        }
        if (reloadIcon) {
            reloadIcon.classList.remove('fa-spin');
        }
        if (reloadText) {
            reloadText.textContent = 'Recharger';
        }
    }
}

// Redémarrer Nginx (arrête puis redémarre - coupe toutes les connexions)
async function restartNginx() {
    if (!confirm('Voulez-vous vraiment redémarrer Nginx ?\n\n⚠ Attention: Cela arrêtera tous les streams actifs.')) {
        return;
    }
    
    const restartBtn = document.getElementById('nginx-restart-btn');
    
    // Désactiver le bouton pendant le redémarrage
    if (restartBtn) {
        restartBtn.disabled = true;
        restartBtn.style.opacity = '0.6';
        restartBtn.style.cursor = 'wait';
        const originalText = restartBtn.innerHTML;
        restartBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Redémarrage...';
    }
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 secondes pour redémarrer
        
        const response = await fetch(`${API_URL}/nginx/restart`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        const result = await response.json();
        
        if (result.success) {
            showToast('Nginx redémarré avec succès ✓', 'success');
        } else {
            showToast(result.message || 'Erreur lors du redémarrage', 'error');
        }
        
        // Attendre un peu puis mettre à jour le statut
        setTimeout(() => {
            checkNginxStatus();
        }, 2000);
    } catch (error) {
        if (error.name === 'AbortError') {
            showToast('Timeout: Le redémarrage de Nginx prend trop de temps', 'error');
        } else {
            showToast('Erreur de connexion au serveur', 'error');
            console.error(error);
        }
        // Vérifier quand même le statut
        setTimeout(() => {
            checkNginxStatus();
        }, 2000);
    } finally {
        // Réactiver le bouton
        if (restartBtn) {
            restartBtn.disabled = false;
            restartBtn.style.opacity = '1';
            restartBtn.style.cursor = 'pointer';
            restartBtn.innerHTML = '<i class="fas fa-redo"></i> Redémarrer';
        }
    }
}

// ==================== FONCTIONS STUNNEL ====================

// Vérifier le statut de Stunnel
async function checkStunnelStatus() {
    const statusCard = document.getElementById('stunnel-status-card');
    const statusIcon = document.getElementById('stunnel-icon');
    const statusIconI = document.getElementById('stunnel-icon-i');
    const startBtn = document.getElementById('stunnel-start-btn');
    const stopBtn = document.getElementById('stunnel-stop-btn');
    const restartBtn = document.getElementById('stunnel-restart-btn');
    const statusText = document.getElementById('stunnel-status-text');
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`${API_URL}/stunnel/status`, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const result = await response.json();
        
        if (result.running) {
            // Stunnel est démarré
            statusIcon.className = 'stat-icon running';
            statusIconI.className = 'fas fa-shield-alt';
            startBtn.style.display = 'none';
            stopBtn.style.display = 'inline-flex';
            restartBtn.style.display = 'inline-flex';
            statusText.textContent = 'Démarré';
            statusText.style.color = 'var(--success)';
        } else {
            // Stunnel est arrêté
            statusIcon.className = 'stat-icon stopped';
            statusIconI.className = 'fas fa-shield-alt';
            startBtn.style.display = 'inline-flex';
            stopBtn.style.display = 'none';
            restartBtn.style.display = 'none';
            statusText.textContent = 'Arrêté';
            statusText.style.color = 'var(--danger)';
        }
    } catch (error) {
        console.error('Erreur lors de la vérification du statut Stunnel:', error);
        // En cas d'erreur, afficher les deux boutons pour permettre à l'utilisateur d'essayer
        statusIcon.className = 'stat-icon stopped';
        statusIconI.className = 'fas fa-shield-alt';
        startBtn.style.display = 'inline-flex';
        stopBtn.style.display = 'inline-flex';
        statusText.textContent = 'Erreur de connexion';
        statusText.style.color = 'var(--danger)';
        statusText.title = 'Cliquez sur Démarrer ou Arrêter pour réessayer';
    }
}

// Démarrer Stunnel
async function startStunnel() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(`${API_URL}/stunnel/start`, {
            method: 'POST',
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            showToast('Stunnel démarré avec succès', 'success');
            setTimeout(checkStunnelStatus, 1000);
        } else {
            showToast(result.message || 'Erreur lors du démarrage', 'error');
            setTimeout(checkStunnelStatus, 1000);
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            showToast('Timeout: Le serveur ne répond pas. Vérifiez qu\'il est bien démarré.', 'error');
        } else {
            showToast('Erreur de connexion au serveur. Vérifiez que start_stream_manager.bat est lancé.', 'error');
        }
        console.error(error);
        // Réessayer de vérifier le statut après l'erreur
        setTimeout(checkStunnelStatus, 2000);
    }
}

// Arrêter Stunnel
async function stopStunnel() {
    if (!confirm('Êtes-vous sûr de vouloir arrêter Stunnel ? Les tunnels vers Facebook/Instagram seront fermés.')) {
        return;
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(`${API_URL}/stunnel/stop`, {
            method: 'POST',
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            showToast('Stunnel arrêté avec succès', 'success');
            setTimeout(checkStunnelStatus, 1000);
        } else {
            showToast(result.message || 'Erreur lors de l\'arrêt', 'error');
            setTimeout(checkStunnelStatus, 1000);
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            showToast('Timeout: Le serveur ne répond pas. Vérifiez qu\'il est bien démarré.', 'error');
        } else {
            showToast('Erreur de connexion au serveur. Vérifiez que start_stream_manager.bat est lancé.', 'error');
        }
        console.error(error);
        // Réessayer de vérifier le statut après l'erreur
        setTimeout(checkStunnelStatus, 2000);
    }
}

// Copier l'URL RTMP dans le presse-papier
async function copyRtmpUrl() {
    const rtmpUrlText = document.getElementById('rtmp-url-text');
    if (!rtmpUrlText) {
        showToast('URL RTMP non trouvée', 'error');
        return;
    }
    
    const url = rtmpUrlText.textContent.trim();
    if (!url) {
        showToast('URL RTMP vide', 'error');
        return;
    }
    
    try {
        // Utiliser l'API Clipboard moderne si disponible
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(url);
            showToast('URL RTMP copiée dans le presse-papier ✓', 'success');
        } else {
            // Fallback pour les navigateurs anciens
            const textArea = document.createElement('textarea');
            textArea.value = url;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showToast('URL RTMP copiée dans le presse-papier ✓', 'success');
        }
    } catch (error) {
        showToast('Erreur lors de la copie : ' + error.message, 'error');
        console.error(error);
    }
}

// Afficher une notification toast
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==================== FONCTIONS DE SÉLECTION ET ACTIONS EN MASSE ====================

// Toggle la sélection d'un stream
function toggleStreamSelection(streamId, checked) {
    if (checked) {
        selectedStreams.add(streamId);
    } else {
        selectedStreams.delete(streamId);
    }
    
    // Mettre à jour l'apparence de la carte
    const card = document.querySelector(`[data-stream-id="${streamId}"]`);
    if (card) {
        if (checked) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    }
    
    updateSelectionBar();
    updateToggleAllState();
}

// Mettre à jour la barre de sélection
function updateSelectionBar() {
    const selectionBar = document.getElementById('selection-bar');
    const selectedCount = document.getElementById('selected-count');
    const bulkActivateBtn = document.getElementById('bulk-activate-btn');
    const bulkDeactivateBtn = document.getElementById('bulk-deactivate-btn');
    
    if (selectedStreams.size > 0) {
        if (selectionBar) selectionBar.style.display = 'flex';
        if (selectedCount) selectedCount.textContent = selectedStreams.size;
        if (bulkActivateBtn) bulkActivateBtn.style.display = 'inline-flex';
        if (bulkDeactivateBtn) bulkDeactivateBtn.style.display = 'inline-flex';
    } else {
        if (selectionBar) selectionBar.style.display = 'none';
        if (bulkActivateBtn) bulkActivateBtn.style.display = 'none';
        if (bulkDeactivateBtn) bulkDeactivateBtn.style.display = 'none';
    }
}

// Mettre à jour l'état du toggle "Tout activer/désactiver"
function updateToggleAllState() {
    const toggleAll = document.getElementById('toggle-all-streams');
    const toggleAllText = document.getElementById('toggle-all-text');
    
    if (!toggleAll) return;
    
    // Charger tous les streams pour vérifier leur état
    fetch(`${API_URL}/streams`)
        .then(r => r.json())
        .then(streams => {
            const allEnabled = streams.length > 0 && streams.every(s => s.enabled);
            const allDisabled = streams.length > 0 && streams.every(s => !s.enabled);
            
            toggleAll.checked = allEnabled;
            toggleAll.indeterminate = !allEnabled && !allDisabled;
            
            if (toggleAllText) {
                if (allEnabled) {
                    toggleAllText.textContent = 'Tout désactiver';
                } else if (allDisabled) {
                    toggleAllText.textContent = 'Tout activer';
                } else {
                    toggleAllText.textContent = 'Tout activer';
                }
            }
        })
        .catch(err => console.error('Erreur lors de la vérification de l\'état des streams:', err));
}

// Toggle tous les streams
async function toggleAllStreams() {
    const toggleAll = document.getElementById('toggle-all-streams');
    const newState = toggleAll.checked;
    
    // Afficher un message de chargement
    showToast(`${newState ? 'Activation' : 'Désactivation'} de tous les flux en cours...`, 'info');
    
    try {
        // Charger tous les streams
        const response = await fetch(`${API_URL}/streams`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const streams = await response.json();
        
        if (!streams || streams.length === 0) {
            showToast('Aucun flux à modifier', 'warning');
            toggleAll.checked = !newState;
            return;
        }
        
        // Toggle tous les streams (même ceux déjà dans le bon état pour être sûr)
        const promises = streams.map(stream => {
            return fetch(`${API_URL}/streams/${stream.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ enabled: newState })
            }).then(r => r.json());
        });
        
        const results = await Promise.all(promises);
        
        // Compter les succès et échecs
        const successCount = results.filter(r => r && r.success).length;
        const failCount = results.length - successCount;
        
        if (failCount === 0) {
            showToast(`${successCount} flux ${newState ? 'activés' : 'désactivés'} avec succès`, 'success');
        } else {
            showToast(`${successCount}/${streams.length} flux ${newState ? 'activés' : 'désactivés'} (${failCount} erreur(s))`, 'warning');
        }
        
        // Recharger les streams après un court délai
        setTimeout(() => {
            loadStreams();
            clearSelection();
        }, 500);
        
    } catch (error) {
        showToast('Erreur lors de l\'activation/désactivation de tous les flux: ' + error.message, 'error');
        console.error('Erreur toggleAllStreams:', error);
        // Remettre le toggle à son état précédent
        toggleAll.checked = !newState;
    }
}

// Activer/Désactiver les streams sélectionnés
async function bulkToggleStreams(enabled) {
    if (selectedStreams.size === 0) {
        showToast('Aucun flux sélectionné', 'warning');
        return;
    }
    
    const action = enabled ? 'activés' : 'désactivés';
    showToast(`Activation/désactivation de ${selectedStreams.size} flux(s)...`, 'info');
    
    try {
        const promises = Array.from(selectedStreams).map(streamId => {
            return fetch(`${API_URL}/streams/${streamId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ enabled })
            });
        });
        
        const results = await Promise.all(promises);
        const jsonResults = await Promise.all(results.map(r => r.json()));
        
        const successCount = jsonResults.filter(r => r.success).length;
        
        if (successCount === selectedStreams.size) {
            showToast(`${successCount} flux ${action} avec succès`, 'success');
        } else {
            showToast(`${successCount}/${selectedStreams.size} flux ${action}`, 'warning');
        }
        
        loadStreams();
        clearSelection();
    } catch (error) {
        showToast('Erreur lors de l\'activation/désactivation des flux sélectionnés', 'error');
        console.error(error);
    }
}

// Annuler la sélection
function clearSelection() {
    selectedStreams.clear();
    
    // Décocher toutes les cases
    document.querySelectorAll('.stream-select-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Retirer la classe selected de toutes les cartes
    document.querySelectorAll('.stream-card.selected').forEach(card => {
        card.classList.remove('selected');
    });
    
    updateSelectionBar();
    updateToggleAllState();
}

// Utilitaires
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function truncateUrl(url, maxLength) {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
}

// Fermer le modal en cliquant à l'extérieur
document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') {
        closeModal();
    }
});

// ==================== FONCTIONS CONFIGURATION MODE ====================

// Vérifier le statut de la configuration (mode FFmpeg/Nginx)
async function checkConfigStatus() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${API_URL}/config`, {
            headers: {
                'Accept': 'application/json'
            },
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        // Vérifier le content-type de la réponse AVANT de parser JSON
        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
            // Lire le texte pour voir ce qui a été retourné
            const text = await response.text();
            console.error('Réponse non-JSON reçue. Content-Type:', contentType);
            console.error('Premiers caractères:', text.substring(0, 300));
            throw new Error(`Le serveur a retourné du HTML au lieu de JSON. Le serveur Flask est peut-être arrêté.`);
        }

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const config = await response.json();
        const modeToggle = document.getElementById('mode-toggle');
        const modeText = document.getElementById('mode-text');
        const ffmpegPathInfo = document.getElementById('ffmpeg-path-info');
        
        if (modeToggle && modeText) {
            modeToggle.checked = config.use_ffmpeg_proxy;
            
            if (config.use_ffmpeg_proxy) {
                modeText.innerHTML = 'FFmpeg Proxy<br><span style="font-size: 0.75rem;">(contrôle dynamique)</span>';
                modeText.style.color = 'var(--success)';
                if (!config.ffmpeg_available) {
                    modeText.innerHTML = 'FFmpeg Proxy ⚠️<br><span style="font-size: 0.75rem;">FFmpeg non trouvé</span>';
                    modeText.style.color = 'var(--warning)';
                    // Afficher le bouton pour spécifier le chemin
                    if (ffmpegPathInfo) {
                        ffmpegPathInfo.style.display = 'block';
                    }
                } else {
                    if (ffmpegPathInfo) {
                        ffmpegPathInfo.style.display = 'none';
                    }
                }
            } else {
                modeText.innerHTML = 'Nginx Direct<br><span style="font-size: 0.75rem;">(latence minimale)</span>';
                modeText.style.color = 'var(--primary)';
                if (ffmpegPathInfo) {
                    ffmpegPathInfo.style.display = 'none';
                }
            }
        }
    } catch (error) {
        console.error('Erreur lors de la vérification de la configuration:', error);
    }
}

// Basculer entre les modes
async function toggleMode() {
    const modeToggle = document.getElementById('mode-toggle');
    const newMode = modeToggle.checked;
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`${API_URL}/config`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ use_ffmpeg_proxy: newMode }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        // Vérifier le content-type de la réponse AVANT de parser JSON
        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
            // Lire le texte pour voir ce qui a été retourné
            const text = await response.text();
            console.error('Réponse non-JSON reçue. Content-Type:', contentType);
            console.error('Premiers caractères:', text.substring(0, 300));
            throw new Error(`Le serveur a retourné du HTML au lieu de JSON. Le serveur Flask est peut-être arrêté ou l'URL est incorrecte.`);
        }

        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.message || `HTTP ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            showToast(result.message, result.needs_reload ? 'warning' : 'success');
            
            // Si Nginx est démarré et qu'un reload est nécessaire
            if (result.needs_reload) {
                const reload = confirm('Nginx est démarré. Voulez-vous le recharger maintenant pour appliquer le nouveau mode ?');
                if (reload) {
                    await reloadNginx();
                }
            }
            
            // Mettre à jour l'affichage
            setTimeout(checkConfigStatus, 500);
            setTimeout(checkNginxStatus, 500);
            
            // Recharger les streams pour mettre à jour le mode
            setTimeout(loadStreams, 1000);
        } else {
            showToast(result.message || 'Erreur lors du changement de mode', 'error');
            // Remettre le toggle à son état précédent
            modeToggle.checked = !newMode;
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            showToast('Timeout: Le serveur ne répond pas.', 'error');
        } else {
            showToast('Erreur lors du changement de mode: ' + error.message, 'error');
        }
        console.error(error);
        // Remettre le toggle à son état précédent
        modeToggle.checked = !newMode;
    }
}

// Afficher le dialog pour spécifier le chemin FFmpeg
function showFfmpegPathDialog() {
    const modal = document.getElementById('ffmpeg-path-modal');
    const input = document.getElementById('ffmpeg-path-input');
    
    // Charger le chemin actuel depuis la config
    fetch(`${API_URL}/config`)
        .then(r => r.json())
        .then(config => {
            if (input) {
                input.value = config.ffmpeg_custom_path || '';
            }
        })
        .catch(() => {});
    
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Fermer le dialog
function closeFfmpegPathDialog() {
    const modal = document.getElementById('ffmpeg-path-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Sauvegarder le chemin FFmpeg
async function saveFfmpegPath() {
    const input = document.getElementById('ffmpeg-path-input');
    const path = input ? input.value.trim() : '';
    
    if (!path) {
        showToast('Veuillez spécifier un chemin', 'error');
        return;
    }
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`${API_URL}/config`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ ffmpeg_path: path }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        
        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
            const text = await response.text();
            throw new Error(`Serveur a retourné du HTML: ${text.substring(0, 200)}`);
        }

        const result = await response.json();

        if (result.success) {
            showToast('Chemin FFmpeg enregistré. Vérification...', 'success');
            closeFfmpegPathDialog();
            // Recharger la config pour voir si FFmpeg est maintenant disponible
            setTimeout(checkConfigStatus, 1000);
        } else {
            showToast(result.message || 'Erreur lors de l\'enregistrement', 'error');
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            showToast('Timeout: Le serveur ne répond pas.', 'error');
        } else {
            showToast('Erreur: ' + error.message, 'error');
        }
        console.error(error);
    }
}

// Fermer le modal en cliquant à l'extérieur
document.addEventListener('DOMContentLoaded', () => {
    const ffmpegModal = document.getElementById('ffmpeg-path-modal');
    if (ffmpegModal) {
        ffmpegModal.addEventListener('click', (e) => {
            if (e.target.id === 'ffmpeg-path-modal') {
                closeFfmpegPathDialog();
            }
        });
    }
});

// Ouvrir le dossier du projet
async function openProjectFolder() {
    try {
        const response = await fetch(`${API_URL}/open-folder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        // Vérifier le content-type d'abord
        const contentType = response.headers.get('content-type') || '';
        
        if (!response.ok) {
            // Lire le texte pour voir l'erreur
            const errorText = await response.text();
            try {
                const errorResult = JSON.parse(errorText);
                showToast('Erreur: ' + (errorResult.message || `HTTP ${response.status}`), 'error');
            } catch {
                if (errorText.includes('404') || errorText.includes('Not Found')) {
                    showToast('Erreur: Route non trouvée. Redémarrez le serveur (start_stream_manager.bat) pour activer cette fonctionnalité.', 'error');
                } else {
                    showToast(`Erreur HTTP ${response.status}: Route peut-être non disponible. Redémarrez le serveur.`, 'error');
                }
            }
            return;
        }
        
        // Vérifier si c'est du JSON
        if (!contentType.includes('application/json')) {
            const text = await response.text();
            if (text.includes('404') || text.includes('Not Found')) {
                showToast('Erreur: Route non trouvée. Redémarrez le serveur (start_stream_manager.bat) pour activer cette fonctionnalité.', 'error');
            } else {
                console.error('Réponse non-JSON:', text.substring(0, 200));
                showToast('Erreur: Le serveur a retourné une réponse non-JSON. Redémarrez le serveur.', 'error');
            }
            return;
        }
        
        // Parser le JSON
        const result = await response.json();
        
        if (result.success) {
            showToast('Dossier ouvert dans l\'explorateur', 'success');
        } else {
            showToast('Erreur: ' + (result.message || 'Impossible d\'ouvrir le dossier'), 'error');
        }
    } catch (error) {
        console.error('Erreur ouverture dossier:', error);
        if (error.message && error.message.includes('fetch')) {
            showToast('Erreur: Impossible de se connecter au serveur. Vérifiez que start_stream_manager.bat est lancé.', 'error');
        } else {
            showToast('Erreur: ' + (error.message || 'Impossible d\'ouvrir le dossier'), 'error');
        }
    }
}

// Fonction pour afficher la modal d'information
function showInfoModal(type) {
    const modal = document.getElementById('info-modal');
    const title = document.getElementById('info-modal-title');
    const content = document.getElementById('info-modal-content');
    
    if (!modal || !title || !content) return;
    
    const info = {
        nginx: {
            title: 'Qu\'est-ce que Nginx ?',
            content: `
                <div style="line-height: 1.6;">
                    <p><strong>Nginx</strong> est un serveur web puissant qui gère vos streams RTMP.</p>
                    
                    <h3 style="margin-top: 1.5rem; margin-bottom: 0.5rem; color: var(--primary);">Fonctionnalités :</h3>
                    <ul style="margin-left: 1.5rem; margin-bottom: 1rem;">
                        <li>Reçoit le stream RTMP depuis OBS ou votre source</li>
                        <li>Redirige vers plusieurs plateformes simultanément</li>
                        <li>Gère la configuration via <code>rtmp_streams.conf</code></li>
                        <li>Port par défaut : <strong>1935</strong></li>
                    </ul>
                    
                    <h3 style="margin-top: 1.5rem; margin-bottom: 0.5rem; color: var(--primary);">Commandes disponibles :</h3>
                    <ul style="margin-left: 1.5rem;">
                        <li><strong>Démarrer</strong> : Lance le serveur Nginx</li>
                        <li><strong>Arrêter</strong> : Arrête Nginx (coupe tous les streams)</li>
                        <li><strong>Recharger</strong> : Recharge la config sans couper les connexions actives</li>
                        <li><strong>Redémarrer</strong> : Arrête puis redémarre (coupe toutes les connexions)</li>
                    </ul>
                    
                    <p style="margin-top: 1rem; padding: 0.75rem; background: var(--bg); border-radius: 6px; border-left: 3px solid var(--info);">
                        <i class="fas fa-info-circle"></i> <strong>Astuce</strong> : Utilisez "Recharger" plutôt que "Redémarrer" pour éviter de couper les streams actifs.
                    </p>
                </div>
            `
        },
        stunnel: {
            title: 'Qu\'est-ce que Stunnel ?',
            content: `
                <div style="line-height: 1.6;">
                    <p><strong>Stunnel</strong> est un outil de tunneling SSL/TLS qui permet de sécuriser les connexions RTMP.</p>
                    
                    <h3 style="margin-top: 1.5rem; margin-bottom: 0.5rem; color: var(--primary);">Utilisation principale :</h3>
                    <ul style="margin-left: 1.5rem; margin-bottom: 1rem;">
                        <li><strong>Facebook Live</strong> : Nécessite une connexion sécurisée (TLS)</li>
                        <li><strong>Instagram Live</strong> : Nécessite également TLS</li>
                        <li>Crée un tunnel sécurisé entre votre serveur et les plateformes</li>
                        <li>Port par défaut : <strong>19350</strong></li>
                    </ul>
                    
                    <h3 style="margin-top: 1.5rem; margin-bottom: 0.5rem; color: var(--primary);">Fonctionnement :</h3>
                    <p style="margin-bottom: 1rem;">
                        Stunnel écoute sur le port 19350, reçoit les connexions RTMP de Nginx, 
                        les sécurise avec TLS, puis les envoie vers Facebook/Instagram.
                    </p>
                    
                    <p style="padding: 0.75rem; background: var(--bg); border-radius: 6px; border-left: 3px solid var(--warning);">
                        <i class="fas fa-exclamation-triangle"></i> <strong>Important</strong> : Stunnel est optionnel. 
                        Vous pouvez l'ignorer si vous n'utilisez pas Facebook ou Instagram.
                    </p>
                </div>
            `
        },
        mode: {
            title: 'Les modes de fonctionnement',
            content: `
                <div style="line-height: 1.6;">
                    <p>Le gestionnaire supporte <strong>deux modes</strong> de fonctionnement pour contrôler vos streams.</p>
                    
                    <h3 style="margin-top: 1.5rem; margin-bottom: 0.5rem; color: var(--success);">Mode FFmpeg Proxy (Recommandé)</h3>
                    <ul style="margin-left: 1.5rem; margin-bottom: 1.5rem;">
                        <li>✅ <strong>Contrôle dynamique</strong> : Activez/désactivez sans couper les autres streams</li>
                        <li>✅ <strong>Activation instantanée</strong> : Pas besoin de recharger Nginx</li>
                        <li>✅ <strong>Plus flexible</strong> : Gestion individuelle de chaque stream</li>
                        <li>⚠️ Latence légèrement plus élevée (+0.5 à 1 seconde)</li>
                        <li>⚠️ Nécessite FFmpeg installé</li>
                    </ul>
                    
                    <h3 style="margin-top: 1.5rem; margin-bottom: 0.5rem; color: var(--primary);">Mode Nginx Direct</h3>
                    <ul style="margin-left: 1.5rem; margin-bottom: 1.5rem;">
                        <li>✅ <strong>Latence minimale</strong> : Pas de proxy intermédiaire</li>
                        <li>✅ <strong>Performance optimale</strong> : Connexion directe Nginx → Plateformes</li>
                        <li>⚠️ Nécessite un <strong>rechargement Nginx</strong> pour activer/désactiver</li>
                        <li>⚠️ Le rechargement peut parfois nécessiter un redémarrage complet</li>
                    </ul>
                    
                    <p style="margin-top: 1.5rem; padding: 0.75rem; background: var(--bg); border-radius: 6px; border-left: 3px solid var(--info);">
                        <i class="fas fa-lightbulb"></i> <strong>Conseil</strong> : Pour la plupart des utilisateurs, 
                        le mode FFmpeg Proxy est recommandé car il offre plus de flexibilité et de contrôle.
                    </p>
                </div>
            `
        }
    };
    
    if (info[type]) {
        title.textContent = info[type].title;
        content.innerHTML = info[type].content;
        modal.classList.add('show');
    }
}

// Fonction pour fermer la modal d'information
function closeInfoModal() {
    const modal = document.getElementById('info-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Fonction pour afficher la modal de configuration des chemins
async function showPathsConfigModal() {
    const modal = document.getElementById('paths-config-modal');
    if (!modal) return;
    
    try {
        // Charger la configuration actuelle
        const response = await fetch(`${API_URL}/config`);
        const config = await response.json();
        
        // Remplir les champs avec les chemins configurés
        const paths = config.paths || {};
        
        document.getElementById('nginx-exe-path').value = paths.nginx_exe || '';
        document.getElementById('ffmpeg-exe-path').value = paths.ffmpeg_exe || '';
        document.getElementById('stunnel-dir-path').value = paths.stunnel_dir || '';
        document.getElementById('stunnel-exe-path').value = paths.stunnel_exe || '';
        document.getElementById('stunnel-conf-path').value = paths.stunnel_conf || '';
        document.getElementById('python-exe-path').value = paths.python_exe || '';
        
        // Afficher les chemins détectés automatiquement
        if (paths.nginx_exe_detected) {
            document.getElementById('nginx-exe-detected').textContent = `Détecté: ${paths.nginx_exe_detected}`;
        } else {
            document.getElementById('nginx-exe-detected').textContent = '';
        }
        
        if (paths.ffmpeg_exe_detected || config.ffmpeg_path) {
            document.getElementById('ffmpeg-exe-detected').textContent = `Détecté: ${paths.ffmpeg_exe_detected || config.ffmpeg_path || 'Non trouvé'}`;
        } else {
            document.getElementById('ffmpeg-exe-detected').textContent = '';
        }
        
        if (paths.stunnel_exe_detected) {
            document.getElementById('stunnel-exe-detected').textContent = `Détecté: ${paths.stunnel_exe_detected}`;
        } else {
            document.getElementById('stunnel-exe-detected').textContent = '';
        }
        
        if (paths.stunnel_conf_detected) {
            document.getElementById('stunnel-conf-detected').textContent = `Détecté: ${paths.stunnel_conf_detected}`;
        } else {
            document.getElementById('stunnel-conf-detected').textContent = '';
        }
        
        if (paths.python_exe_detected) {
            document.getElementById('python-exe-detected').textContent = `Détecté: ${paths.python_exe_detected}`;
        } else {
            document.getElementById('python-exe-detected').textContent = '';
        }
        
        // Afficher la modal
        modal.classList.add('show');
    } catch (error) {
        console.error('Erreur lors du chargement de la configuration:', error);
        showToast('Erreur lors du chargement de la configuration', 'error');
    }
}

// Fonction pour fermer la modal de configuration des chemins
function closePathsConfigModal() {
    const modal = document.getElementById('paths-config-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Fonction pour sauvegarder la configuration des chemins
async function savePathsConfig() {
    try {
        const paths = {
            nginx_exe: document.getElementById('nginx-exe-path').value.trim(),
            ffmpeg_exe: document.getElementById('ffmpeg-exe-path').value.trim(),
            stunnel_dir: document.getElementById('stunnel-dir-path').value.trim(),
            stunnel_exe: document.getElementById('stunnel-exe-path').value.trim(),
            stunnel_conf: document.getElementById('stunnel-conf-path').value.trim(),
            python_exe: document.getElementById('python-exe-path').value.trim()
        };
        
        const response = await fetch(`${API_URL}/config`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ paths })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('Chemins sauvegardés avec succès', 'success');
            closePathsConfigModal();
            // Recharger la configuration pour mettre à jour les détections
            await checkConfigStatus();
        } else {
            showToast(result.message || 'Erreur lors de la sauvegarde', 'error');
        }
    } catch (error) {
        console.error('Erreur lors de la sauvegarde des chemins:', error);
        showToast('Erreur lors de la sauvegarde des chemins', 'error');
    }
}

// Fermer la modal en cliquant en dehors
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('info-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeInfoModal();
            }
        });
    }
    
    // Fermer la modal de configuration des chemins en cliquant en dehors
    const pathsModal = document.getElementById('paths-config-modal');
    if (pathsModal) {
        pathsModal.addEventListener('click', function(e) {
            if (e.target === pathsModal) {
                closePathsConfigModal();
            }
        });
    }
});

