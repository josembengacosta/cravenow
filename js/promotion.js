// ==================================================
// SISTEMA COMPLETO DE PROMOÇÕES DELIVERYHJ
// ==================================================

class PromocoesSystem {
    constructor() {
        this.currentCategory = 'all';
        this.currentSort = 'relevance';
        this.searchTerm = '';
        this.currentView = 'grid';
        this.visibleCount = 6;
        this.allPromotions = [];
        this.init();
    }

    init() {
        this.initializeEventListeners();
        this.startCountdown();
        this.initializePromotions();
        this.filterPromotions();
        console.log('✅ Sistema de Promoções inicializado');
    }

    initializeEventListeners() {
        // Category filters (quick buttons)
        document.querySelectorAll('.category-filter').forEach(filter => {
            filter.addEventListener('click', () => {
                this.setActiveCategory(filter.getAttribute('data-category'));
            });
        });

        // Category cards
        document.querySelectorAll('.promo-category-card').forEach(card => {
            card.addEventListener('click', () => {
                const category = card.getAttribute('data-category');
                this.setActiveCategory(category);
            });
        });

        // Search input
        document.getElementById('promoSearch').addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.filterPromotions();
        });

        // Sort select
        document.getElementById('sortBy').addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.filterPromotions();
        });

        // Apply filters button
        document.getElementById('applyFilters').addEventListener('click', () => {
            this.applyAdvancedFilters();
        });

        // Clear filters button
        document.getElementById('clearFilters').addEventListener('click', () => {
            this.clearFilters();
        });

        // View toggle
        document.getElementById('gridView').addEventListener('click', () => {
            this.setActiveView('grid');
        });
        document.getElementById('listView').addEventListener('click', () => {
            this.setActiveView('list');
        });

        // Load more button
        document.getElementById('loadMore').addEventListener('click', () => {
            this.loadMore();
        });

        // Reset search button
        document.getElementById('resetSearch').addEventListener('click', () => {
            this.resetSearch();
        });

        // FAQ accordions
        this.initializeFAQ();
    }

    initializePromotions() {
        // Sample promotions data - in a real app, this would come from an API
        this.allPromotions = [
            {
                id: 1,
                title: "Fim de Semana da Pizza",
                description: "25% de desconto em todas as pizzas aos sábados e domingos",
                category: "desconto",
                discount: 25,
                validity: "2024-12-30",
                popularity: "high",
                code: "PIZZA25",
                usage: 85,
                restaurant: "PizzaExpress",
                image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                savings: 0,
                badge: "Mais Usado"
            },
            {
                id: 2,
                title: "Combo Família + Brinde",
                description: "Combo para 4 pessoas + sobremesa grátis",
                category: "combo brinde",
                discount: 0,
                validity: "2025-01-15",
                popularity: "medium",
                code: "FAMILIAG",
                usage: 45,
                restaurant: "BurgerHouse",
                image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                savings: 3500,
                badge: "Novo"
            },
            {
                id: 3,
                title: "Entrega Grátis Todo Dia",
                description: "Entrega gratuita em pedidos acima de 8.000 Kz",
                category: "frete",
                discount: 0,
                validity: "permanent",
                popularity: "high",
                code: "",
                usage: 0,
                restaurant: "Todos Restaurantes",
                image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                savings: 800,
                badge: "Popular"
            },
            {
                id: 4,
                title: "Noite Asiática",
                description: "15% de desconto em comida chinesa e japonesa às quartas-feiras",
                category: "desconto",
                discount: 15,
                validity: "2025-02-28",
                popularity: "low",
                code: "ASIATICA15",
                usage: 30,
                restaurant: "DragonFood",
                image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                savings: 0,
                badge: ""
            },
            {
                id: 5,
                title: "Combo Pequeno-Almoço",
                description: "Pequeno-almoço completo por apenas 2.500 Kz (válido até 10h)",
                category: "combo",
                discount: 0,
                validity: "2025-03-31",
                popularity: "medium",
                code: "",
                usage: 0,
                restaurant: "CaféManhã",
                image: "https://images.unsplash.com/photo-1551782450-17144efb9c50?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                savings: 1200,
                badge: "Limitado"
            },
            {
                id: 6,
                title: "Jantar Romântico",
                description: "20% de desconto + sobremesa grátis em pedidos acima de 12.000 Kz",
                category: "desconto brinde",
                discount: 20,
                validity: "2025-02-14",
                popularity: "high",
                code: "ROMANTICO20",
                usage: 60,
                restaurant: "RomanticDinner",
                image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                savings: 0,
                badge: "+ Brinde"
            }
        ];
    }

    setActiveCategory(category) {
        this.currentCategory = category;
        
        // Update UI for quick category filters
        document.querySelectorAll('.category-filter').forEach(filter => {
            filter.classList.remove('active', 'btn-danger');
            filter.classList.add('btn-outline-danger');
        });
        
        const activeFilter = document.querySelector(`.category-filter[data-category="${category}"]`);
        if (activeFilter) {
            activeFilter.classList.remove('btn-outline-danger');
            activeFilter.classList.add('active', 'btn-danger');
        }
        
        // Update category cards
        document.querySelectorAll('.promo-category-card').forEach(card => {
            card.style.borderColor = '';
            card.style.transform = '';
        });
        
        const activeCard = document.querySelector(`.promo-category-card[data-category="${category}"]`);
        if (activeCard && category !== 'all') {
            activeCard.style.borderColor = '#dc3545';
            activeCard.style.transform = 'translateY(-5px)';
        }

        this.filterPromotions();
    }

    setActiveView(view) {
        this.currentView = view;
        
        // Update view toggle buttons
        document.getElementById('gridView').classList.toggle('active', view === 'grid');
        document.getElementById('listView').classList.toggle('active', view === 'list');
        
        // Update promotions grid
        const grid = document.getElementById('promotionsGrid');
        if (view === 'list') {
            grid.classList.add('promo-list-view');
            grid.querySelectorAll('.col-md-6').forEach(col => {
                col.className = 'col-12 mb-4';
            });
        } else {
            grid.classList.remove('promo-list-view');
            grid.querySelectorAll('.col-12').forEach(col => {
                col.className = 'col-md-6 col-xl-4';
            });
        }
    }

    applyAdvancedFilters() {
        // Get advanced filter values
        const discountRange = document.querySelector('input[name="discountRange"]:checked')?.id;
        const validity = document.querySelector('input[name="validity"]:checked')?.id;
        
        // Apply filters (this would be more comprehensive in a real app)
        this.filterPromotions();
        
        this.showToast('Filtros aplicados com sucesso!', 'success');
    }

    clearFilters() {
        // Reset all filters
        document.getElementById('discountAll').checked = true;
        document.getElementById('validityAll').checked = true;
        document.getElementById('typeAll').checked = true;
        document.getElementById('typePremium').checked = false;
        document.getElementById('typeLocal').checked = false;

        // Reset main filters
        this.setActiveCategory('all');
        document.getElementById('promoSearch').value = '';
        this.searchTerm = '';
        document.getElementById('categoryFilter').value = '';
        document.getElementById('sortBy').value = 'relevance';
        this.currentSort = 'relevance';

        this.filterPromotions();
        this.showToast('Filtros limpos!', 'info');
    }

    filterPromotions() {
        const filteredPromotions = this.allPromotions.filter(promo => {
            // Category filter
            const categoryMatch = this.currentCategory === 'all' || 
                                promo.category.includes(this.currentCategory);
            
            // Search filter
            const searchMatch = this.searchTerm === '' ||
                              promo.title.toLowerCase().includes(this.searchTerm) ||
                              promo.description.toLowerCase().includes(this.searchTerm) ||
                              promo.restaurant.toLowerCase().includes(this.searchTerm);
            
            // Advanced filters would go here in a real implementation
            
            return categoryMatch && searchMatch;
        });

        // Sort promotions
        const sortedPromotions = this.sortPromotions(filteredPromotions);
        
        // Display promotions
        this.displayPromotions(sortedPromotions);
    }

    sortPromotions(promotions) {
        return promotions.sort((a, b) => {
            switch (this.currentSort) {
                case 'popular':
                    const popularityOrder = { high: 3, medium: 2, low: 1 };
                    return popularityOrder[b.popularity] - popularityOrder[a.popularity];
                
                case 'discount':
                    return b.discount - a.discount;
                
                case 'ending':
                    // Simple date comparison - in real app would use actual dates
                    return new Date(a.validity) - new Date(b.validity);
                
                case 'relevance':
                default:
                    return b.popularity.localeCompare(a.popularity);
            }
        });
    }

    displayPromotions(promotions) {
        const grid = document.getElementById('promotionsGrid');
        const noResults = document.getElementById('noResults');
        const loadMore = document.getElementById('loadMore');
        
        // Clear existing content
        grid.innerHTML = '';
        
        if (promotions.length === 0) {
            noResults.classList.remove('d-none');
            loadMore.classList.add('d-none');
            this.updatePromoCount(0);
            return;
        }
        
        noResults.classList.add('d-none');
        
        // Show only limited number initially
        const promotionsToShow = promotions.slice(0, this.visibleCount);
        
        promotionsToShow.forEach(promo => {
            const promoCard = this.createPromoCard(promo);
            grid.appendChild(promoCard);
        });
        
        // Show/hide load more button
        if (promotions.length > this.visibleCount) {
            loadMore.classList.remove('d-none');
        } else {
            loadMore.classList.add('d-none');
        }
        
        this.updatePromoCount(promotions.length);
    }

    createPromoCard(promo) {
        const col = document.createElement('div');
        col.className = this.currentView === 'list' ? 'col-12 mb-4' : 'col-md-6 col-xl-4';
        
        col.innerHTML = `
            <div class="card promo-card border-0 shadow-sm h-100" 
                 data-category="${promo.category}" 
                 data-discount="${promo.discount}" 
                 data-validity="${promo.validity}" 
                 data-popular="${promo.popularity}">
                <div class="position-relative">
                    <img src="${promo.image}" 
                         class="card-img-top promo-image" 
                         alt="${promo.title}" 
                         style="height: 200px; object-fit: cover;">
                    ${promo.discount > 0 ? `<div class="discount-badge">-${promo.discount}%</div>` : ''}
                    ${promo.badge ? `<span class="promo-badge badge bg-${this.getBadgeColor(promo.badge)}">${promo.badge}</span>` : ''}
                </div>
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title fw-bold">${promo.title}</h5>
                        <span class="badge bg-light text-black">
                            <i class="bi ${this.getPopularityIcon(promo.popularity)} text-danger"></i> 
                            ${this.getPopularityText(promo.popularity)}
                        </span>
                    </div>
                    <p class="card-text text-muted small mb-2">${promo.description}</p>
                    
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <span class="badge bg-danger">${promo.restaurant}</span>
                        <small class="text-muted">${this.getValidityText(promo.validity)}</small>
                    </div>
                    
                    ${promo.code ? `
                    <div class="coupon-code small mb-3 text-black" onclick="copyCouponCode('${promo.code}')">
                        ${promo.code}
                    </div>
                    ` : '<div class="bg-light p-2 rounded text-center mb-3"><small class="text-muted">Aplicado automaticamente</small></div>'}
                    
                    ${promo.usage > 0 ? `
                    <div class="mt-3">
                        <div class="progress mb-2" style="height: 8px;">
                            <div class="progress-bar bg-warning" style="width: ${promo.usage}%"></div>
                        </div>
                        <small class="text-muted">${promo.usage}% dos cupons usados</small>
                    </div>
                    ` : ''}
                    
                    ${promo.savings > 0 ? `
                    <div class="mt-3">
                        <span class="text-success fw-bold">
                            <i class="bi bi-coin"></i> Economize ${this.formatCurrency(promo.savings)}
                        </span>
                    </div>
                    ` : ''}
                </div>
                <div class="card-footer bg-transparent border-0 pt-0">
                    <a href="restaurant.html" class="btn btn-danger w-100">
                        <i class="bi bi-bag-check"></i> Usar Oferta
                    </a>
                </div>
            </div>
        `;
        
        return col;
    }

    getBadgeColor(badge) {
        const colors = {
            'Mais Usado': 'success',
            'Novo': 'info',
            'Popular': 'warning',
            'Limitado': 'danger',
            '+ Brinde': 'success'
        };
        return colors[badge] || 'primary';
    }

    getPopularityIcon(popularity) {
        const icons = {
            'high': 'bi-fire',
            'medium': 'bi-star',
            'low': 'bi-arrow-up'
        };
        return icons[popularity] || 'bi-star';
    }

    getPopularityText(popularity) {
        const texts = {
            'high': 'Quente',
            'medium': 'Popular',
            'low': 'Emergente'
        };
        return texts[popularity] || 'Popular';
    }

    getValidityText(validity) {
        if (validity === 'permanent') return 'Permanentemente';
        if (validity === 'today') return 'Termina hoje';
        return `Até: ${new Date(validity).toLocaleDateString('pt-AO')}`;
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('pt-AO', {
            style: 'currency',
            currency: 'AOA'
        }).format(amount);
    }

    updatePromoCount(count) {
        const countElement = document.getElementById('promoCount');
        if (countElement) {
            countElement.textContent = count;
        }
    }

    loadMore() {
        this.visibleCount += 6;
        this.filterPromotions();
        this.showToast('Mais promoções carregadas!', 'success');
    }

    resetSearch() {
        this.clearFilters();
    }

    startCountdown() {
        const countdownElement = document.getElementById('countdown');
        if (!countdownElement) return;

        let timeLeft = 24 * 60 * 60; // 24 hours

        const updateCountdown = () => {
            const hours = Math.floor(timeLeft / 3600);
            const minutes = Math.floor((timeLeft % 3600) / 60);
            const seconds = timeLeft % 60;

            countdownElement.textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            if (timeLeft > 0) {
                timeLeft--;
                setTimeout(updateCountdown, 1000);
            } else {
                countdownElement.textContent = 'Expirado';
                countdownElement.classList.add('text-danger');
            }
        };

        updateCountdown();
    }

    initializeFAQ() {
        // FAQ functionality would go here
        console.log('FAQ system initialized');
    }

    showToast(message, type = 'info') {
        // Create toast container if it doesn't exist
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
}

// ==================================================
// FUNÇÕES GLOBAIS
// ==================================================

function copyCouponCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        showToast(`Cupom ${code} copiado!`, 'success');
        
        // Visual feedback
        const couponElement = event.target.closest('.coupon-code');
        if (couponElement) {
            couponElement.style.backgroundColor = '#d4edda';
            couponElement.style.borderColor = '#28a745';
            couponElement.style.transform = 'scale(1.02)';
            
            setTimeout(() => {
                couponElement.style.backgroundColor = '';
                couponElement.style.borderColor = '#ffc107';
                couponElement.style.transform = '';
            }, 2000);
        }
    }).catch(err => {
        console.error('Erro ao copiar cupom:', err);
        showToast('Erro ao copiar cupom', 'error');
    });
}

function showToast(message, type = 'info') {
    if (window.promocoesSystem) {
        window.promocoesSystem.showToast(message, type);
    } else {
        // Fallback
        console.log(`${type}: ${message}`);
    }
}

// ==================================================
// INICIALIZAÇÃO
// ==================================================

document.addEventListener('DOMContentLoaded', function() {
    window.promocoesSystem = new PromocoesSystem();
});

// ==================================================
// FUNÇÕES DE UTILIDADE ADICIONAIS
// ==================================================

function subscribeNewsletter() {
    const emailInput = document.getElementById('newsletterEmail');
    const email = emailInput.value.trim();

    if (!validateEmail(email)) {
        showToast('Por favor, insira um email válido', 'error');
        emailInput.focus();
        return;
    }

    // Simulate subscription
    showToast('Inscrição realizada com sucesso!', 'success');
    emailInput.value = '';
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Share promotion
function sharePromotion(promoId) {
    if (navigator.share) {
        navigator.share({
            title: 'Promoção DeliveryHJ',
            text: 'Confira esta promoção incrível no DeliveryHJ!',
            url: window.location.href + '?promo=' + promoId
        });
    } else {
        // Fallback
        copyCouponCode('COMPARTILHE');
    }
}

// Toggle favorite
function toggleFavorite(promoId) {
    const favorites = JSON.parse(localStorage.getItem('promoFavorites') || '[]');
    const index = favorites.indexOf(promoId);
    
    if (index > -1) {
        favorites.splice(index, 1);
        showToast('Promoção removida dos favoritos', 'info');
    } else {
        favorites.push(promoId);
        showToast('Promoção adicionada aos favoritos', 'success');
    }
    
    localStorage.setItem('promoFavorites', JSON.stringify(favorites));
}