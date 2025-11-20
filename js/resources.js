// ==================================================
// SISTEMA DE RECURSOS PARA PARCEIROS
// ==================================================

class PartnerResourcesSystem {
    constructor() {
        this.resources = [];
        this.filters = {
            category: 'all',
            access: 'all',
            search: ''
        };
        this.init();
    }

    init() {
        this.initializeEventListeners();
        this.initializeSearch();
        this.loadPartnerResourcesData();
        console.log('✅ Sistema de recursos para parceiros inicializado');
    }

    initializeEventListeners() {
        // Category filter
        document.querySelectorAll('[data-category]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleCategoryFilter(e.target);
            });
        });

        // Access level filter
        document.querySelectorAll('[data-access]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleAccessFilter(e.target);
            });
        });

        // Search functionality
        const searchInput = document.getElementById('partnerResourcesSearch');
        const searchButton = document.getElementById('partnerSearchButton');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch(e.target.value);
                }
            });
        }

        if (searchButton) {
            searchButton.addEventListener('click', () => {
                const searchValue = document.getElementById('partnerResourcesSearch').value;
                this.handleSearch(searchValue);
            });
        }

        // Resource actions tracking
        document.addEventListener('click', (e) => {
            if (e.target.closest('[onclick*="partnerResourcesSystem"]')) {
                this.trackPartnerResourceAction(e.target);
            }
        });
    }

    initializeSearch() {
        this.debouncedSearch = this.debounce(this.handleSearch.bind(this), 300);
    }

    loadPartnerResourcesData() {
        // Simulated partner resources data
        this.resources = [
            {
                id: 'guia-painel',
                title: 'Guia do Painel do Parceiro',
                category: 'painel',
                access: 'basic',
                type: 'guide',
                duration: 25,
                downloads: 1200,
                description: 'Aprenda a usar todas as funcionalidades do seu painel de controle.'
            },
            {
                id: 'kit-marketing',
                title: 'Kit Marketing Digital',
                category: 'marketing',
                access: 'premium',
                type: 'kit',
                duration: 35,
                downloads: 450,
                description: 'Materiais prontos para redes sociais e estratégias de fidelização.'
            }
            // Add more partner resources...
        ];
    }

    handleCategoryFilter(button) {
        const category = button.getAttribute('data-category');
        
        // Update active button
        document.querySelectorAll('[data-category]').forEach(btn => {
            btn.classList.remove('active', 'btn-danger');
            btn.classList.add('btn-outline-secondary');
        });
        
        button.classList.remove('btn-outline-secondary');
        button.classList.add('active', 'btn-danger');
        
        this.filters.category = category;
        this.applyFilters();
        
        this.showToast(`Categoria: ${this.getCategoryName(category)}`, 'info');
    }

    handleAccessFilter(button) {
        const access = button.getAttribute('data-access');
        
        // Update active button
        document.querySelectorAll('[data-access]').forEach(btn => {
            btn.classList.remove('active');
            btn.classList.remove('btn-primary', 'btn-warning', 'btn-info');
            btn.classList.add('btn-outline-secondary');
        });
        
        button.classList.remove('btn-outline-secondary');
        
        // Add appropriate color class based on access level
        const colorClass = this.getAccessColorClass(access);
        button.classList.add('active', colorClass);
        
        this.filters.access = access;
        this.applyFilters();
        
        this.showToast(`Nível: ${this.getAccessLevelName(access)}`, 'info');
    }

    handleSearch(searchTerm) {
        this.filters.search = searchTerm.toLowerCase();
        this.applyFilters();
        
        if (searchTerm) {
            this.showToast(`Pesquisando por: "${searchTerm}"`, 'info');
        }
    }

    applyFilters() {
        const resourceCards = document.querySelectorAll('#partnerResourcesGrid .col-lg-4');
        let visibleCount = 0;
        
        resourceCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const access = card.getAttribute('data-access');
            const title = card.querySelector('h5').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            const categoryMatch = this.filters.category === 'all' || category === this.filters.category;
            const accessMatch = this.filters.access === 'all' || access === this.filters.access;
            const searchMatch = !this.filters.search || 
                               title.includes(this.filters.search) || 
                               description.includes(this.filters.search);
            
            if (categoryMatch && accessMatch && searchMatch) {
                card.style.display = 'block';
                visibleCount++;
                
                // Highlight search terms
                if (this.filters.search) {
                    this.highlightSearchTerms(card, this.filters.search);
                } else {
                    this.removeHighlights(card);
                }
            } else {
                card.style.display = 'none';
            }
        });
        
        this.updateResultsCount(visibleCount);
    }

    highlightSearchTerms(card, searchTerm) {
        const title = card.querySelector('h5');
        const description = card.querySelector('p');
        
        const highlight = (element) => {
            const text = element.textContent;
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            const highlighted = text.replace(regex, '<mark class="bg-warning">$1</mark>');
            element.innerHTML = highlighted;
        };
        
        highlight(title);
        highlight(description);
    }

    removeHighlights(card) {
        const title = card.querySelector('h5');
        const description = card.querySelector('p');
        
        title.innerHTML = title.textContent;
        description.innerHTML = description.textContent;
    }

    updateResultsCount(count) {
        let countElement = document.getElementById('partnerResultsCount');
        if (!countElement) {
            countElement = document.createElement('div');
            countElement.id = 'partnerResultsCount';
            countElement.className = 'alert alert-info mt-3';
            document.querySelector('.partners-resources-section').appendChild(countElement);
        }
        
        if (count === 0) {
            countElement.innerHTML = `
                <i class="bi bi-search"></i>
                <strong>Nenhum recurso encontrado</strong> 
                <p class="mb-0 mt-1">Tente ajustar os filtros ou entre em contacto com o suporte para parceiros.</p>
            `;
            countElement.style.display = 'block';
        } else {
            countElement.innerHTML = `
                <i class="bi bi-check-circle"></i>
                <strong>${count} recurso(s) encontrado(s)</strong>
                ${this.filters.search ? ` para "${this.filters.search}"` : ''}
            `;
            countElement.style.display = 'block';
        }
    }

    // Resource Actions
    viewResource(resourceId) {
        console.log(`Abrindo recurso: ${resourceId}`);
        
        this.showToast('Abrindo recurso...', 'info');
        
        // Check access level
        const resource = this.resources.find(r => r.id === resourceId);
        if (resource && resource.access !== 'basic') {
            this.showAccessRequiredModal(resource);
            return;
        }
        
        // Show resource modal
        this.showResourceModal(resourceId);
        
        this.trackEvent('partner_resource_view', { resourceId });
    }

    playVideo(videoId) {
        console.log(`Reproduzindo vídeo: ${videoId}`);
        
        this.showToast('Preparando vídeo...', 'info');
        
        // Show video modal
        this.showVideoModal(videoId);
        
        this.trackEvent('partner_video_play', { videoId });
    }

    downloadTool(toolId) {
        console.log(`Baixando ferramenta: ${toolId}`);
        
        this.showToast('Iniciando download...', 'info');
        
        // Show download progress
        this.showDownloadProgress(toolId);
        
        this.trackEvent('partner_tool_download', { toolId });
    }

    useTool(toolId) {
        console.log(`Usando ferramenta: ${toolId}`);
        
        this.showToast('Abrindo ferramenta...', 'info');
        
        // Show tool interface
        this.showToolInterface(toolId);
        
        this.trackEvent('partner_tool_use', { toolId });
    }

    startTraining(trainingId) {
        console.log(`Iniciando treinamento: ${trainingId}`);
        
        this.showToast('Agendando treinamento...', 'info');
        
        // Show training scheduling modal
        this.showTrainingModal(trainingId);
        
        this.trackEvent('partner_training_start', { trainingId });
    }

    // Modal Methods
    showAccessRequiredModal(resource) {
        const modalHTML = `
            <div class="modal fade" id="accessRequiredModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header bg-warning text-dark">
                            <h5 class="modal-title">
                                <i class="bi bi-shield-lock me-2"></i>
                                Acesso Premium Requerido
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body text-center py-4">
                            <i class="bi bi-star display-1 text-warning mb-3"></i>
                            <h4 class="fw-bold text-warning">Recurso Exclusivo</h4>
                            <p class="text-muted">
                                Este recurso está disponível apenas para parceiros com plano <strong>${this.getAccessLevelName(resource.access)}</strong>.
                            </p>
                            <div class="alert alert-info">
                                <i class="bi bi-info-circle"></i>
                                <strong>Benefícios do plano ${this.getAccessLevelName(resource.access)}:</strong>
                                <ul class="mb-0 mt-2 text-start">
                                    <li>Relatórios avançados</li>
                                    <li>Ferramentas exclusivas</li>
                                    <li>Suporte prioritário</li>
                                    <li>Treinamentos especializados</li>
                                </ul>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                Fechar
                            </button>
                            <a href="../partner/upgrade.html" class="btn btn-warning">
                                <i class="bi bi-arrow-up"></i> Fazer Upgrade
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        if (!document.getElementById('accessRequiredModal')) {
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }

        const modal = new bootstrap.Modal(document.getElementById('accessRequiredModal'));
        modal.show();
    }

    showResourceModal(resourceId) {
        // Similar to previous resource modal implementation
        // Customized for partner resources
        this.showToast('Recurso carregado com sucesso!', 'success');
    }

    showVideoModal(videoId) {
        // Similar to previous video modal implementation
        // Customized for partner videos
        this.showToast('Vídeo preparado para reprodução!', 'success');
    }

    showDownloadProgress(toolId) {
        this.showToast('Preparando download...', 'info');
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            this.showToast(`Download: ${progress}%`, 'info');
            
            if (progress >= 100) {
                clearInterval(interval);
                this.showToast('Ferramenta baixada com sucesso!', 'success');
                
                setTimeout(() => {
                    this.showDownloadCompleteModal(toolId);
                }, 1000);
            }
        }, 200);
    }

    showDownloadCompleteModal(toolId) {
        const modalHTML = `
            <div class="modal fade" id="partnerDownloadCompleteModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-check-circle me-2"></i>
                                Download Concluído
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body text-center py-4">
                            <i class="bi bi-tools display-1 text-success mb-3"></i>
                            <h4 class="fw-bold text-success">Ferramenta Baixada!</h4>
                            <p class="text-muted">
                                A ferramenta foi salva na sua pasta de downloads.
                            </p>
                            <div class="alert alert-info mt-3">
                                <i class="bi bi-lightbulb"></i>
                                <strong>Dica:</strong> Consulte nosso guia de uso para aproveitar ao máximo esta ferramenta.
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-success w-100" data-bs-dismiss="modal">
                                <i class="bi bi-check-lg me-2"></i>
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        if (!document.getElementById('partnerDownloadCompleteModal')) {
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }

        const modal = new bootstrap.Modal(document.getElementById('partnerDownloadCompleteModal'));
        modal.show();
    }

    showToolInterface(toolId) {
        this.showToast('Ferramenta carregada!', 'success');
        // In real implementation, this would open the tool interface
    }

    showTrainingModal(trainingId) {
        const modalHTML = `
            <div class="modal fade" id="trainingModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-calendar-check me-2"></i>
                                Agendar Treinamento
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="trainingForm">
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="trainingDate" class="form-label">Data Preferida</label>
                                        <input type="date" class="form-control" id="trainingDate" required>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="trainingTime" class="form-label">Horário Preferido</label>
                                        <select class="form-select" id="trainingTime" required>
                                            <option value="">Selecionar horário</option>
                                            <option value="09:00">09:00 - 10:00</option>
                                            <option value="11:00">11:00 - 12:00</option>
                                            <option value="14:00">14:00 - 15:00</option>
                                            <option value="16:00">16:00 - 17:00</option>
                                        </select>
                                    </div>
                                    <div class="col-12 mb-3">
                                        <label for="trainingNotes" class="form-label">Observações</label>
                                        <textarea class="form-control" id="trainingNotes" rows="3" 
                                                  placeholder="Algum tópico específico que gostaria de abordar?"></textarea>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" onclick="partnerResourcesSystem.submitTrainingRequest('${trainingId}')">
                                <i class="bi bi-send"></i> Solicitar Agendamento
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        if (!document.getElementById('trainingModal')) {
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }

        const modal = new bootstrap.Modal(document.getElementById('trainingModal'));
        modal.show();
    }

    submitTrainingRequest(trainingId) {
        const form = document.getElementById('trainingForm');
        if (!form.checkValidity()) {
            this.showToast('Preencha todos os campos obrigatórios.', 'warning');
            return;
        }

        this.showToast('Solicitação de treinamento enviada!', 'success');
        bootstrap.Modal.getInstance(document.getElementById('trainingModal')).hide();
        
        this.trackEvent('partner_training_request', { trainingId });
    }

    // Utility Methods
    getCategoryName(category) {
        const categories = {
            'all': 'Todas as Categorias',
            'painel': 'Painel do Parceiro',
            'pedidos': 'Gestão de Pedidos',
            'marketing': 'Marketing',
            'financeiro': 'Financeiro',
            'videos': 'Vídeos',
            'ferramentas': 'Ferramentas'
        };
        return categories[category] || category;
    }

    getAccessLevelName(access) {
        const levels = {
            'all': 'Todos os Níveis',
            'basic': 'Básico',
            'premium': 'Premium', 
            'vip': 'VIP'
        };
        return levels[access] || access;
    }

    getAccessColorClass(access) {
        const colors = {
            'all': 'btn-primary',
            'basic': 'btn-outline-secondary',
            'premium': 'btn-warning',
            'vip': 'btn-info'
        };
        return colors[access] || 'btn-outline-secondary';
    }

    trackPartnerResourceAction(element) {
        const resourceCard = element.closest('.partner-resource-card');
        const resourceTitle = resourceCard ? resourceCard.querySelector('h5').textContent : 'Unknown';
        const action = element.textContent.trim();
        
        console.log(`Ação de parceiro: ${action} em ${resourceTitle}`);
        this.trackEvent('partner_resource_action', { resourceTitle, action });
    }

    trackEvent(eventName, properties) {
        // In real app, send to analytics
        console.log(`Partner Event: ${eventName}`, properties);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    showToast(message, type = 'info') {
        let toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
            toastContainer.style.zIndex = '1090';
            document.body.appendChild(toastContainer);
        }

        const toastId = 'toast-' + Date.now();
        const typeClass = type === 'error' ? 'danger' : type;
        const icon = this.getToastIcon(type);

        const toastHTML = `
            <div id="${toastId}" class="toast align-items-center text-bg-${typeClass} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="bi ${icon} me-2"></i>
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;

        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, {
            autohide: true,
            delay: 4000
        });

        toast.show();

        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }

    getToastIcon(type) {
        const icons = {
            success: 'bi-check-circle-fill',
            error: 'bi-x-circle-fill',
            warning: 'bi-exclamation-triangle-fill',
            info: 'bi-info-circle-fill'
        };
        return icons[type] || 'bi-info-circle-fill';
    }

    // Demo functions
    testPartnerSearch(term) {
        document.getElementById('partnerResourcesSearch').value = term;
        this.handleSearch(term);
    }

    filterByPartnerCategory(category) {
        const button = document.querySelector(`[data-category="${category}"]`);
        if (button) {
            button.click();
        }
    }
}

// ==================================================
// INICIALIZAÇÃO
// ==================================================

document.addEventListener('DOMContentLoaded', function() {
    window.partnerResourcesSystem = new PartnerResourcesSystem();
});

// ==================================================
// FUNÇÕES GLOBAIS PARA DEMONSTRAÇÃO
// ==================================================

// Testar pesquisa para parceiros
function testPartnerSearch(term = 'marketing') {
    if (window.partnerResourcesSystem) {
        window.partnerResourcesSystem.testPartnerSearch(term);
    }
}

// Filtrar por categoria específica para parceiros
function filterPartnerByCategory(category) {
    const button = document.querySelector(`[data-category="${category}"]`);
    if (button && window.partnerResourcesSystem) {
        button.click();
    }
}

// Filtrar por nível de acesso
function filterPartnerByAccess(access) {
    const button = document.querySelector(`[data-access="${access}"]`);
    if (button && window.partnerResourcesSystem) {
        button.click();
    }
}