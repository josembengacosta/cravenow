// ==================================================
// SISTEMA DE CATEGORIAS - DELIVERYHJ
// ==================================================

class CategorySystem {
    constructor() {
        this.categories = [];
        this.filteredCategories = [];
        this.currentView = 'grid';
        this.filters = {
            search: '',
            sortBy: 'popularity',
            minRestaurants: 0,
            minRating: 0
        };
        this.init();
    }

    init() {
        this.initializeEventListeners();
        this.loadSampleCategories();
        this.applyFilters();
        this.initializeAnimations();
        console.log('✅ Sistema de categorias inicializado');
    }

    initializeEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('categorySearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value;
                this.applyFilters();
            });
        }

        // Sort functionality
        const sortSelect = document.getElementById('sortCategories');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.filters.sortBy = e.target.value;
                this.applyFilters();
            });
        }

        // Load more categories
        const loadMoreBtn = document.getElementById('loadMoreCategories');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreCategories();
            });
        }

        // Category card clicks
        document.addEventListener('click', (e) => {
            const categoryCard = e.target.closest('.category-card');
            if (categoryCard) {
                this.handleCategoryClick(categoryCard);
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });
    }

    initializeAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all category cards
        document.querySelectorAll('.category-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
            observer.observe(card);
        });
    }

    loadSampleCategories() {
        // Dados de exemplo para categorias
        this.categories = [
            {
                id: 1,
                name: "Pizza",
                slug: "pizza",
                description: "As melhores pizzas da cidade, desde margherita clássica até sabores criativos.",
                image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                icon: "bi-egg-fried",
                color: "danger",
                restaurantCount: 18,
                avgRating: 4.8,
                deliveryTime: "25-35 min",
                isFeatured: true,
                tags: ["popular", "italiana", "família"],
                stats: {
                    totalOrders: 12500,
                    monthlyGrowth: 15,
                    customerSatisfaction: 95
                }
            },
            {
                id: 2,
                name: "Tradicional",
                slug: "tradicional",
                description: "Sabores autênticos de Angola. Muamba, funje, calulu e outras delícias locais.",
                image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                icon: "bi-house-heart",
                color: "success",
                restaurantCount: 25,
                avgRating: 4.7,
                deliveryTime: "20-30 min",
                isFeatured: true,
                tags: ["angolana", "local", "cultural"],
                stats: {
                    totalOrders: 18700,
                    monthlyGrowth: 22,
                    customerSatisfaction: 92
                }
            },
            {
                id: 3,
                name: "Sushi",
                slug: "sushi",
                description: "Sushi fresco e autêntico preparado por chefs especializados. Qualidade premium.",
                image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                icon: "bi-droplet",
                color: "info",
                restaurantCount: 12,
                avgRating: 4.9,
                deliveryTime: "35-45 min",
                isFeatured: true,
                tags: ["japonesa", "premium", "saudável"],
                stats: {
                    totalOrders: 8900,
                    monthlyGrowth: 18,
                    customerSatisfaction: 96
                }
            },
            {
                id: 4,
                name: "Churrascaria",
                slug: "churrascaria",
                description: "Carnes selecionadas grelhadas na perfeição. Rodízio e porções generosas.",
                image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                icon: "bi-fire",
                color: "warning",
                restaurantCount: 8,
                avgRating: 4.6,
                deliveryTime: "40-50 min",
                isFeatured: false,
                tags: ["carnes", "brasileira", "rodízio"],
                stats: {
                    totalOrders: 6700,
                    monthlyGrowth: 12,
                    customerSatisfaction: 89
                }
            },
            {
                id: 5,
                name: "Hambúrguer",
                slug: "hamburguer",
                description: "Hamburgueres artesanais com blends especiais. Do clássico ao gourmet.",
                image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                icon: "bi-bread-slice",
                color: "primary",
                restaurantCount: 15,
                avgRating: 4.5,
                deliveryTime: "25-35 min",
                isFeatured: false,
                tags: ["americano", "fastfood", "gourmet"],
                stats: {
                    totalOrders: 14300,
                    monthlyGrowth: 20,
                    customerSatisfaction: 91
                }
            },
            {
                id: 6,
                name: "Vegetariano",
                slug: "vegetariano",
                description: "Opções saudáveis e saborosas sem carne. Pratos criativos e nutritivos.",
                image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                icon: "bi-flower1",
                color: "success",
                restaurantCount: 10,
                avgRating: 4.4,
                deliveryTime: "30-40 min",
                isFeatured: false,
                tags: ["saudável", "vegano", "natural"],
                stats: {
                    totalOrders: 5600,
                    monthlyGrowth: 25,
                    customerSatisfaction: 94
                }
            },
            {
                id: 7,
                name: "Frutos do Mar",
                slug: "frutos-mar",
                description: "Peixes frescos, mariscos e pratos do mar. Da costa angolana para sua mesa.",
                image: "https://images.unsplash.com/photo-1563379091339-03246963d96f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                icon: "bi-water",
                color: "info",
                restaurantCount: 7,
                avgRating: 4.7,
                deliveryTime: "35-45 min",
                isFeatured: false,
                tags: ["marisco", "português", "fresco"],
                stats: {
                    totalOrders: 4200,
                    monthlyGrowth: 14,
                    customerSatisfaction: 93
                }
            },
            {
                id: 8,
                name: "Asiática",
                slug: "asiatica",
                description: "Culinária chinesa, tailandesa, japonesa e vietnamita. Sabores orientais autênticos.",
                image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                icon: "bi-bowl",
                color: "danger",
                restaurantCount: 14,
                avgRating: 4.6,
                deliveryTime: "30-40 min",
                isFeatured: false,
                tags: ["oriental", "exótico", "picante"],
                stats: {
                    totalOrders: 9800,
                    monthlyGrowth: 16,
                    customerSatisfaction: 90
                }
            },
            {
                id: 9,
                name: "Café & Sobremesas",
                slug: "cafe-sobremesas",
                description: "Cafés especiais, bolos, sobremesas e doces. Perfeito para um momento doce.",
                image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                icon: "bi-cup-straw",
                color: "warning",
                restaurantCount: 9,
                avgRating: 4.8,
                deliveryTime: "20-30 min",
                isFeatured: false,
                tags: ["doce", "café", "sobremesa"],
                stats: {
                    totalOrders: 7200,
                    monthlyGrowth: 28,
                    customerSatisfaction: 97
                }
            }
        ];
    }

    applyFilters() {
        let filtered = [...this.categories];

        // Search filter
        if (this.filters.search) {
            const searchTerm = this.filters.search.toLowerCase();
            filtered = filtered.filter(category =>
                category.name.toLowerCase().includes(searchTerm) ||
                category.description.toLowerCase().includes(searchTerm) ||
                category.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }

        // Sort results
        filtered = this.sortCategories(filtered);

        this.filteredCategories = filtered;
        this.displayCategories();
        this.updateStats();
    }

    sortCategories(categories) {
        switch (this.filters.sortBy) {
            case 'name':
                return categories.sort((a, b) => a.name.localeCompare(b.name));
            case 'restaurants':
                return categories.sort((a, b) => b.restaurantCount - a.restaurantCount);
            case 'rating':
                return categories.sort((a, b) => b.avgRating - a.avgRating);
            case 'popularity':
            default:
                return categories.sort((a, b) => b.stats.totalOrders - a.stats.totalOrders);
        }
    }

    displayCategories() {
        const featuredContainer = document.querySelector('.category-grid');
        const allContainer = document.getElementById('allCategories');
        const noResults = document.createElement('div');

        if (!featuredContainer || !allContainer) return;

        // Clear containers
        featuredContainer.innerHTML = '';
        allContainer.innerHTML = '';

        // Separate featured and regular categories
        const featured = this.filteredCategories.filter(cat => cat.isFeatured);
        const regular = this.filteredCategories.filter(cat => !cat.isFeatured);

        // Display featured categories
        featured.forEach(category => {
            const card = this.createCategoryCard(category, true);
            featuredContainer.appendChild(card);
        });

        // Display regular categories
        if (regular.length === 0 && this.filteredCategories.length === 0) {
            noResults.className = 'col-12 text-center py-5';
            noResults.innerHTML = `
                <i class="bi bi-search display-1 text-muted mb-3"></i>
                <h4 class="text-muted">Nenhuma categoria encontrada</h4>
                <p class="text-muted">Tente ajustar sua pesquisa</p>
            `;
            allContainer.appendChild(noResults);
        } else {
            regular.forEach(category => {
                const card = this.createCategoryCard(category, false);
                allContainer.appendChild(card);
            });
        }

        // Re-initialize animations for new cards
        setTimeout(() => this.initializeAnimations(), 100);
    }

    createCategoryCard(category, isFeatured) {
        const col = document.createElement('div');
        col.className = isFeatured ? '' : 'col-md-6 col-lg-4';
        
        const badgeText = this.getCategoryBadge(category);
        const growthIcon = category.stats.monthlyGrowth > 15 ? 'bi-arrow-up-right' : 
                          category.stats.monthlyGrowth > 5 ? 'bi-arrow-up' : 'bi-arrow-down';
        const growthColor = category.stats.monthlyGrowth > 15 ? 'success' : 
                           category.stats.monthlyGrowth > 5 ? 'warning' : 'danger';

        col.innerHTML = `
            <div class="category-card card border-0 shadow-sm h-100 ${isFeatured ? 'featured-category' : ''}"
                 data-category-id="${category.id}" 
                 data-category-slug="${category.slug}"
                 tabindex="0"
                 role="button"
                 aria-label="Explorar categoria ${category.name}">
                <div class="position-relative">
                    <img src="${category.image}" 
                         class="card-img-top category-image" 
                         alt="${category.name}"
                         loading="lazy">
                    ${badgeText ? `
                        <span class="category-badge badge">${badgeText}</span>
                    ` : ''}
                </div>
                <div class="card-body text-center">
                    <div class="category-icon text-${category.color}">
                        <i class="bi ${category.icon}"></i>
                    </div>
                    <h5 class="card-title fw-bold">${category.name}</h5>
                    <p class="card-text text-muted small mb-3">
                        ${category.description}
                    </p>
                    
                    <!-- Stats -->
                    <div class="category-stats mb-3">
                        <div class="row text-center small">
                            <div class="col-4">
                                <div class="fw-bold text-danger">${category.restaurantCount}</div>
                                <div class="text-muted">Lojas</div>
                            </div>
                            <div class="col-4">
                                <div class="fw-bold text-warning">
                                    <i class="bi bi-star-fill"></i> ${category.avgRating}
                                </div>
                                <div class="text-muted">Avaliação</div>
                            </div>
                            <div class="col-4">
                                <div class="fw-bold text-${growthColor}">
                                    <i class="bi ${growthIcon}"></i> ${category.stats.monthlyGrowth}%
                                </div>
                                <div class="text-muted">Crescimento</div>
                            </div>
                        </div>
                    </div>

                    <!-- Tags -->
                    <div class="category-tags mb-3">
                        ${category.tags.map(tag => `
                            <span class="badge bg-light text-dark me-1 mb-1">#${tag}</span>
                        `).join('')}
                    </div>

                    <!-- Action Button -->
                    <a href="${category.slug}.html" 
                       class="btn btn-${isFeatured ? 'danger' : 'outline-danger'} w-100"
                       onclick="event.stopPropagation()">
                        <i class="bi bi-arrow-right"></i> 
                        ${isFeatured ? 'Explorar' : 'Ver Restaurantes'}
                    </a>
                </div>
            </div>
        `;

        return col;
    }

    getCategoryBadge(category) {
        if (category.avgRating >= 4.8) return '⭐ Premium';
        if (category.stats.monthlyGrowth > 20) return '🚀 Em Alta';
        if (category.restaurantCount > 20) return '❤️ Popular';
        return '';
    }

    handleCategoryClick(card) {
        const categoryId = card.dataset.categoryId;
        const categorySlug = card.dataset.categorySlug;
        
        // Add click animation
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 150);

        // Navigate to category page
        setTimeout(() => {
            window.location.href = `${categorySlug}.html`;
        }, 300);

        // Track analytics
        this.trackCategoryView(categoryId, categorySlug);
    }

    handleKeyboardNavigation(e) {
        const cards = document.querySelectorAll('.category-card');
        const currentCard = document.activeElement;
        
        if (!currentCard.classList.contains('category-card')) return;

        let currentIndex = Array.from(cards).indexOf(currentCard);

        switch (e.key) {
            case 'ArrowRight':
                e.preventDefault();
                if (currentIndex < cards.length - 1) {
                    cards[currentIndex + 1].focus();
                }
                break;
            case 'ArrowLeft':
                e.preventDefault();
                if (currentIndex > 0) {
                    cards[currentIndex - 1].focus();
                }
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                currentCard.click();
                break;
        }
    }

    loadMoreCategories() {
        const button = document.getElementById('loadMoreCategories');
        const originalText = button.innerHTML;
        
        button.innerHTML = '<i class="bi bi-arrow-repeat spinner-border spinner-border-sm"></i> A carregar...';
        button.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // In real implementation, this would fetch more categories
            this.showNotification('Mais categorias carregadas com sucesso!', 'success');
            
            button.innerHTML = '<i class="bi bi-check-lg"></i> Todas as categorias carregadas';
            button.disabled = true;
            button.classList.remove('btn-outline-danger');
            button.classList.add('btn-success');
        }, 2000);
    }

    updateStats() {
        const totalRestaurants = this.filteredCategories.reduce((sum, cat) => sum + cat.restaurantCount, 0);
        const avgRating = this.filteredCategories.reduce((sum, cat) => sum + cat.avgRating, 0) / this.filteredCategories.length;
        
        // Update stats in UI if needed
        console.log(`📊 Estatísticas atualizadas: ${this.filteredCategories.length} categorias, ${totalRestaurants} restaurantes, rating médio: ${avgRating.toFixed(1)}`);
    }

    trackCategoryView(categoryId, categorySlug) {
        // Em produção, integrar com Google Analytics ou sistema similar
        console.log(`📈 Categoria visualizada: ${categorySlug} (ID: ${categoryId})`);
        
        const analyticsData = {
            event: 'category_view',
            category_id: categoryId,
            category_name: categorySlug,
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent
        };
        
        // Simular envio para analytics
        setTimeout(() => {
            console.log('📊 Dados enviados para analytics:', analyticsData);
        }, 100);
    }

    showNotification(message, type = 'info') {
        // Criar notificação toast
        const toast = document.createElement('div');
        toast.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        toast.style.cssText = 'top: 20px; right: 20px; z-index: 1060; min-width: 300px;';
        toast.innerHTML = `
            <strong>${type === 'success' ? '✅' : 'ℹ️'} ${message}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(toast);
        
        // Auto-remove após 3 segundos
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 3000);
    }

    // Métodos utilitários para reutilização
    getCategoryById(id) {
        return this.categories.find(cat => cat.id === parseInt(id));
    }

    getCategoryBySlug(slug) {
        return this.categories.find(cat => cat.slug === slug);
    }

    getFeaturedCategories() {
        return this.categories.filter(cat => cat.isFeatured);
    }

    getTopRatedCategories(limit = 5) {
        return this.categories
            .sort((a, b) => b.avgRating - a.avgRating)
            .slice(0, limit);
    }

    getFastestDeliveryCategories() {
        return this.categories
            .sort((a, b) => {
                const aTime = parseInt(a.deliveryTime.split('-')[0]);
                const bTime = parseInt(b.deliveryTime.split('-')[0]);
                return aTime - bTime;
            });
    }
}

// ==================================================
// SISTEMA ESPECÍFICO PARA PÁGINA TRADICIONAL
// ==================================================

class TradicionalSystem extends CategorySystem {
    constructor() {
        super();
        this.categoryType = 'tradicional';
    }

    init() {
        this.loadTradicionalRestaurants();
        this.initializeTradicionalEvents();
        super.init();
    }

    loadTradicionalRestaurants() {
        // Sobrescrever com dados específicos de comida tradicional
        this.categories = this.categories.filter(cat => cat.slug === 'tradicional');
        
        // Adicionar restaurantes tradicionais específicos
        this.tradicionalRestaurants = [
            {
                id: 101,
                name: "Muamba da Dona Maria",
                rating: 4.8,
                deliveryTime: "25-35 min",
                priceRange: 1,
                image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Muamba tradicional feita com receita de família há mais de 50 anos.",
                specialty: "Muamba de Galinha"
            },
            {
                id: 102,
                name: "Funje & Calulu",
                rating: 4.7,
                deliveryTime: "20-30 min",
                priceRange: 1,
                image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Funje macio e calulu de peixe fresco da costa angolana.",
                specialty: "Calulu de Peixe"
            }
        ];
    }

    initializeTradicionalEvents() {
        // Eventos específicos para página tradicional
        console.log('🎯 Sistema tradicional inicializado');
    }
}

// ==================================================
// SISTEMA ESPECÍFICO PARA PÁGINA MAIS POPULARES
// ==================================================

class MaisPopularesSystem extends CategorySystem {
    constructor() {
        super();
        this.categoryType = 'popular';
    }

    init() {
        this.loadPopularCategories();
        this.initializePopularEvents();
        super.init();
    }

    loadPopularCategories() {
        // Filtrar e ordenar por popularidade
        this.categories = this.categories
            .sort((a, b) => b.stats.totalOrders - a.stats.totalOrders)
            .slice(0, 6) // Top 6 mais populares
            .map((cat, index) => ({
                ...cat,
                rank: index + 1,
                isPopular: true
            }));
    }

    initializePopularEvents() {
        // Eventos específicos para página mais populares
        console.log('🔥 Sistema mais populares inicializado');
    }
}

// ==================================================
// INICIALIZAÇÃO DINÂMICA
// ==================================================

document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('tradicional')) {
        window.categorySystem = new TradicionalSystem();
    } else if (currentPage.includes('popular')) {
        window.categorySystem = new MaisPopularesSystem();
    } else {
        window.categorySystem = new CategorySystem();
    }
});

// ==================================================
// FUNÇÕES GLOBAIS PARA REUTILIZAÇÃO
// ==================================================

function getCategoryStats() {
    return window.categorySystem ? window.categorySystem.getCategoryStats() : null;
}

function searchCategories(term) {
    if (window.categorySystem) {
        window.categorySystem.filters.search = term;
        window.categorySystem.applyFilters();
    }
}

function sortCategoriesBy(criteria) {
    if (window.categorySystem) {
        window.categorySystem.filters.sortBy = criteria;
        window.categorySystem.applyFilters();
    }
}