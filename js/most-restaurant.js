// ==================================================
// SISTEMA MAIS POPULARES - DELIVERYHJ
// ==================================================

class PopularSystem {
    constructor() {
        this.restaurants = [];
        this.filteredRestaurants = [];
        this.currentView = 'grid';
        this.filters = {
            search: '',
            sortBy: 'rating',
            timeFilter: 'week',
            quickFilter: 'all',
            minRating: 4.0
        };
        this.currentPage = 1;
        this.restaurantsPerPage = 6;
        this.init();
    }

    init() {
        this.initializeEventListeners();
        this.loadPopularRestaurants();
        this.applyFilters();
        this.initializeAnimations();
        console.log('🔥 Sistema Mais Populares inicializado');
    }

    initializeEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('popularSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value;
                this.applyFilters();
            });
        }

        // Sort functionality
        const sortSelect = document.getElementById('sortPopular');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.filters.sortBy = e.target.value;
                this.applyFilters();
            });
        }

        // Time filter
        const timeFilter = document.getElementById('timeFilter');
        if (timeFilter) {
            timeFilter.addEventListener('change', (e) => {
                this.filters.timeFilter = e.target.value;
                this.applyFilters();
            });
        }

        // Quick filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.filters.quickFilter = filter;
                
                // Update active state
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                this.applyFilters();
            });
        });

        // View toggle
        const gridViewBtn = document.getElementById('gridView');
        const listViewBtn = document.getElementById('listView');

        if (gridViewBtn) {
            gridViewBtn.addEventListener('click', () => {
                this.switchView('grid');
            });
        }

        if (listViewBtn) {
            listViewBtn.addEventListener('click', () => {
                this.switchView('list');
            });
        }

        // Load more
        const loadMoreBtn = document.getElementById('loadMorePopular');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreRestaurants();
            });
        }

        // Restaurant card interactions
        document.addEventListener('click', (e) => {
            const restaurantCard = e.target.closest('.popular-card');
            if (restaurantCard) {
                this.handleRestaurantClick(restaurantCard);
            }
        });
    }

    initializeAnimations() {
        // Intersection Observer for animations
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

        // Observe all popular cards
        document.querySelectorAll('.popular-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
            observer.observe(card);
        });
    }

    loadPopularRestaurants() {
        // Dados de exemplo para restaurantes populares
        this.restaurants = [
            {
                id: 1,
                name: "Pizza Palace",
                category: "pizza",
                rating: 4.9,
                deliveryTime: "22-30 min",
                priceRange: 2,
                image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "As pizzas mais amadas de Luanda. Massa artesanal e ingredientes premium.",
                rank: 1,
                stats: {
                    weeklyOrders: 1250,
                    approvalRate: 98,
                    growth: 25,
                    totalReviews: 428
                },
                tags: ["top-1", "trending", "fast-delivery"],
                isTrending: true,
                hasDiscount: true
            },
            {
                id: 2,
                name: "Sushi Master",
                category: "sushi",
                rating: 4.8,
                deliveryTime: "35-45 min",
                priceRange: 3,
                image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Sushi autêntico com peixe fresco importado. Chef japonês especializado.",
                rank: 2,
                stats: {
                    weeklyOrders: 890,
                    approvalRate: 96,
                    growth: 18,
                    totalReviews: 312
                },
                tags: ["premium", "trending"],
                isTrending: true,
                hasDiscount: false
            },
            {
                id: 3,
                name: "Sabores de Angola",
                category: "tradicional",
                rating: 4.7,
                deliveryTime: "25-35 min",
                priceRange: 1,
                image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Comida tradicional com receitas de família. Muamba, funje e calulu autênticos.",
                rank: 3,
                stats: {
                    weeklyOrders: 1500,
                    approvalRate: 94,
                    growth: 22,
                    totalReviews: 567
                },
                tags: ["favorite", "local", "trending"],
                isTrending: true,
                hasDiscount: true
            },
            {
                id: 4,
                name: "Churrascaria Brasil",
                category: "churrascaria",
                rating: 4.6,
                deliveryTime: "40-50 min",
                priceRange: 3,
                image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Carnes nobres grelhadas no ponto perfeito. Rodízio delivery disponível.",
                rank: 4,
                stats: {
                    weeklyOrders: 720,
                    approvalRate: 92,
                    growth: 15,
                    totalReviews: 234
                },
                tags: ["rodizio", "premium"],
                isTrending: false,
                hasDiscount: true
            },
            {
                id: 5,
                name: "Burger House",
                category: "hamburguer",
                rating: 4.5,
                deliveryTime: "25-35 min",
                priceRange: 2,
                image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Hambúrgueres artesanais com ingredientes premium e combinações únicas.",
                rank: 5,
                stats: {
                    weeklyOrders: 1100,
                    approvalRate: 91,
                    growth: 12,
                    totalReviews: 389
                },
                tags: ["artesanal", "fast-delivery"],
                isTrending: false,
                hasDiscount: false
            },
            {
                id: 6,
                name: "Green Life",
                category: "vegetariano",
                rating: 4.4,
                deliveryTime: "30-40 min",
                priceRange: 2,
                image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Comida vegetariana e vegana saudável, saborosa e criativa.",
                rank: 6,
                stats: {
                    weeklyOrders: 480,
                    approvalRate: 93,
                    growth: 28,
                    totalReviews: 156
                },
                tags: ["vegan", "healthy", "new"],
                isTrending: true,
                hasDiscount: true
            },
            {
                id: 7,
                name: "Frutos do Mar Premium",
                category: "frutos-mar",
                rating: 4.7,
                deliveryTime: "35-45 min",
                priceRange: 3,
                image: "https://images.unsplash.com/photo-1563379091339-03246963d96f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Peixes e mariscos frescos da costa angolana. Pratos sofisticados do mar.",
                rank: 7,
                stats: {
                    weeklyOrders: 320,
                    approvalRate: 95,
                    growth: 20,
                    totalReviews: 128
                },
                tags: ["seafood", "premium", "new"],
                isTrending: true,
                hasDiscount: false
            },
            {
                id: 8,
                name: "Asia Express",
                category: "asiatica",
                rating: 4.6,
                deliveryTime: "30-40 min",
                priceRange: 2,
                image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Culinária asiática autêntica. Pratos chineses, tailandeses e japoneses.",
                rank: 8,
                stats: {
                    weeklyOrders: 680,
                    approvalRate: 90,
                    growth: 14,
                    totalReviews: 267
                },
                tags: ["asian", "express"],
                isTrending: false,
                hasDiscount: true
            }
        ];
    }

    applyFilters() {
        let filtered = [...this.restaurants];

        // Search filter
        if (this.filters.search) {
            const searchTerm = this.filters.search.toLowerCase();
            filtered = filtered.filter(restaurant =>
                restaurant.name.toLowerCase().includes(searchTerm) ||
                restaurant.description.toLowerCase().includes(searchTerm) ||
                restaurant.category.toLowerCase().includes(searchTerm)
            );
        }

        // Quick filters
        switch (this.filters.quickFilter) {
            case 'trending':
                filtered = filtered.filter(restaurant => restaurant.isTrending);
                break;
            case 'new':
                filtered = filtered.filter(restaurant => restaurant.tags.includes('new'));
                break;
            case 'fast':
                filtered = filtered.filter(restaurant => {
                    const minTime = parseInt(restaurant.deliveryTime.split('-')[0]);
                    return minTime <= 30;
                });
                break;
            case 'discount':
                filtered = filtered.filter(restaurant => restaurant.hasDiscount);
                break;
            case 'all':
            default:
                // No additional filtering
                break;
        }

        // Sort results
        filtered = this.sortRestaurants(filtered);

        this.filteredRestaurants = filtered;
        this.displayRestaurants();
        this.updateGlobalStats();
    }

    sortRestaurants(restaurants) {
        switch (this.filters.sortBy) {
            case 'reviews':
                return restaurants.sort((a, b) => b.stats.totalReviews - a.stats.totalReviews);
            case 'orders':
                return restaurants.sort((a, b) => b.stats.weeklyOrders - a.stats.weeklyOrders);
            case 'trending':
                return restaurants.sort((a, b) => b.stats.growth - a.stats.growth);
            case 'rating':
            default:
                return restaurants.sort((a, b) => b.rating - a.rating);
        }
    }

    displayRestaurants() {
        const otherContainer = document.getElementById('popularRestaurants');
        const loadMoreBtn = document.getElementById('loadMorePopular');

        if (!otherContainer) return;

        // Clear other restaurants container
        otherContainer.innerHTML = '';

        // Separate top 3 and others
        const others = this.filteredRestaurants.filter(rest => rest.rank > 3);

        // Display other restaurants (paginated)
        const startIndex = (this.currentPage - 1) * this.restaurantsPerPage;
        const endIndex = startIndex + this.restaurantsPerPage;
        const restaurantsToShow = others.slice(startIndex, endIndex);

        if (restaurantsToShow.length === 0 && this.currentPage === 1) {
            otherContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-search display-1 text-muted mb-3"></i>
                    <h4 class="text-muted">Nenhum restaurante encontrado</h4>
                    <p class="text-muted">Tente ajustar seus filtros de pesquisa</p>
                </div>
            `;
        } else {
            restaurantsToShow.forEach(restaurant => {
                const card = this.createRestaurantCard(restaurant);
                otherContainer.appendChild(card);
            });
        }

        // Show/hide load more button
        if (loadMoreBtn) {
            const hasMore = endIndex < others.length;
            loadMoreBtn.style.display = hasMore ? 'block' : 'none';
            
            if (!hasMore && others.length > 0) {
                loadMoreBtn.innerHTML = '<i class="bi bi-check-lg"></i> Todos os restaurantes carregados';
                loadMoreBtn.disabled = true;
                loadMoreBtn.classList.remove('btn-outline-danger');
                loadMoreBtn.classList.add('btn-success');
            }
        }

        // Re-initialize animations for new cards
        setTimeout(() => this.initializeAnimations(), 100);
    }

    createRestaurantCard(restaurant) {
        const col = document.createElement('div');
        
        // Definir classes baseado na visualização atual
        if (this.currentView === 'grid') {
            col.className = 'col-md-6 col-lg-4';
        } else {
            col.className = 'col-12 mb-4';
        }
        
        const rankClass = `rank-${restaurant.rank <= 3 ? restaurant.rank : 'other'}`;
        const priceSymbols = ['$', '$$', '$$$'];
        const growthIcon = restaurant.stats.growth > 20 ? 'bi-arrow-up-right' : 
                          restaurant.stats.growth > 10 ? 'bi-arrow-up' : 'bi-arrow-down';
        const growthColor = restaurant.stats.growth > 20 ? 'success' : 
                           restaurant.stats.growth > 10 ? 'warning' : 'danger';

        // Conteúdo diferente para visualização em lista
        const cardContent = this.currentView === 'list' ? 
            this.createListViewCard(restaurant, rankClass, priceSymbols, growthIcon, growthColor) : 
            this.createGridViewCard(restaurant, rankClass, priceSymbols, growthIcon, growthColor);

        col.innerHTML = cardContent;
        return col;
    }

    createGridViewCard(restaurant, rankClass, priceSymbols, growthIcon, growthColor) {
        return `
            <div class="card popular-card border-0 shadow-sm h-100"
                 data-restaurant-id="${restaurant.id}"
                 tabindex="0"
                 role="button"
                 aria-label="Ver cardápio de ${restaurant.name}">
                <div class="position-relative">
                    <img src="${restaurant.image}" 
                         class="card-img-top" 
                         alt="${restaurant.name}"
                         style="height: 200px; object-fit: cover;"
                         loading="lazy">
                    <div class="position-absolute top-0 start-0 m-3">
                        <span class="rank-badge ${rankClass}">${restaurant.rank}º</span>
                    </div>
                    
                    ${restaurant.isTrending ? `
                        <span class="position-absolute top-0 end-0 m-3 popular-badge badge">
                            <i class="bi bi-fire"></i> Em Alta
                        </span>
                    ` : ''}
                    
                    ${restaurant.hasDiscount ? `
                        <span class="position-absolute bottom-0 start-0 m-2 badge bg-success">
                            <i class="bi bi-percent"></i> OFF
                        </span>
                    ` : ''}
                </div>
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title fw-bold">${restaurant.name}</h5>
                        <span class="badge bg-light text-dark">
                            <i class="bi bi-star-fill text-warning"></i> ${restaurant.rating}
                        </span>
                    </div>
                    <p class="card-text text-muted small mb-3">${restaurant.description}</p>
                    
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <span class="badge bg-${growthColor}">
                            <i class="bi ${growthIcon}"></i> +${restaurant.stats.growth}% esta semana
                        </span>
                        <span class="price-range">${priceSymbols[restaurant.priceRange - 1]}</span>
                    </div>
                    
                    <div class="restaurant-stats">
                        <div class="row text-center small">
                            <div class="col-4">
                                <div class="fw-bold text-primary">${this.formatNumber(restaurant.stats.weeklyOrders)}</div>
                                <div class="text-muted">Pedidos</div>
                            </div>
                            <div class="col-4">
                                <div class="fw-bold text-success">${restaurant.stats.approvalRate}%</div>
                                <div class="text-muted">Aprovação</div>
                            </div>
                            <div class="col-4">
                                <div class="fw-bold text-info">${restaurant.deliveryTime.split('-')[0]}min</div>
                                <div class="text-muted">Entrega</div>
                            </div>
                        </div>
                    </div>
                    
                    <a href="../restaurante-detalhe.html?id=${restaurant.id}" 
                       class="btn btn-danger w-100 mt-3"
                       onclick="event.stopPropagation()">
                        <i class="bi bi-eye"></i> Ver Cardápio
                    </a>
                </div>
            </div>
        `;
    }

    createListViewCard(restaurant, rankClass, priceSymbols, growthIcon, growthColor) {
        return `
            <div class="card popular-card border-0 shadow-sm list-view-card"
                 data-restaurant-id="${restaurant.id}"
                 tabindex="0"
                 role="button"
                 aria-label="Ver cardápio de ${restaurant.name}">
                <div class="card-body">
                    <div class="row align-items-center">
                        <!-- Imagem -->
                        <div class="col-md-2 text-center">
                            <div class="position-relative d-inline-block">
                                <img src="${restaurant.image}" 
                                     class="rounded" 
                                     alt="${restaurant.name}"
                                     style="width: 100px; height: 100px; object-fit: cover;"
                                     loading="lazy">
                                <span class="position-absolute top-0 start-0 m-1 rank-badge ${rankClass}">
                                    ${restaurant.rank}º
                                </span>
                            </div>
                        </div>
                        
                        <!-- Informações principais -->
                        <div class="col-md-4">
                            <div class="d-flex align-items-center mb-2">
                                <h5 class="card-title fw-bold mb-0 me-3">${restaurant.name}</h5>
                                <span class="badge bg-light text-dark">
                                    <i class="bi bi-star-fill text-warning"></i> ${restaurant.rating}
                                </span>
                            </div>
                            <p class="card-text text-muted small mb-2">${restaurant.description}</p>
                            <div class="d-flex flex-wrap gap-2">
                                <span class="badge bg-${growthColor}">
                                    <i class="bi ${growthIcon}"></i> +${restaurant.stats.growth}%
                                </span>
                                <span class="badge bg-primary">
                                    <i class="bi bi-clock"></i> ${restaurant.deliveryTime}
                                </span>
                                ${restaurant.isTrending ? `
                                    <span class="badge bg-warning text-dark">
                                        <i class="bi bi-fire"></i> Em Alta
                                    </span>
                                ` : ''}
                                ${restaurant.hasDiscount ? `
                                    <span class="badge bg-success">
                                        <i class="bi bi-percent"></i> OFF
                                    </span>
                                ` : ''}
                            </div>
                        </div>
                        
                        <!-- Estatísticas -->
                        <div class="col-md-3">
                            <div class="row text-center">
                                <div class="col-4">
                                    <div class="fw-bold text-primary">${this.formatNumber(restaurant.stats.weeklyOrders)}</div>
                                    <small class="text-muted">Pedidos</small>
                                </div>
                                <div class="col-4">
                                    <div class="fw-bold text-success">${restaurant.stats.approvalRate}%</div>
                                    <small class="text-muted">Aprovação</small>
                                </div>
                                <div class="col-4">
                                    <div class="fw-bold text-info">${restaurant.deliveryTime.split('-')[0]}min</div>
                                    <small class="text-muted">Entrega</small>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Preço e Ação -->
                        <div class="col-md-3 text-center text-md-end">
                            <div class="mb-2">
                                <span class="h5 text-danger fw-bold">${priceSymbols[restaurant.priceRange - 1]}</span>
                            </div>
                            <a href="../restaurante-detalhe.html?id=${restaurant.id}" 
                               class="btn btn-danger btn-sm"
                               onclick="event.stopPropagation()">
                                <i class="bi bi-eye"></i> Ver Cardápio
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    switchView(view) {
        if (this.currentView === view) return;
        
        this.currentView = view;
        this.displayRestaurants();
        this.updateViewButtons();
        this.showNotification(`Visualização alterada para: ${view === 'grid' ? 'Grade' : 'Lista'}`, 'info');
    }

    updateViewButtons() {
        const gridViewBtn = document.getElementById('gridView');
        const listViewBtn = document.getElementById('listView');

        if (gridViewBtn && listViewBtn) {
            if (this.currentView === 'grid') {
                gridViewBtn.classList.add('active');
                gridViewBtn.classList.remove('btn-outline-danger');
                gridViewBtn.classList.add('btn-danger');
                
                listViewBtn.classList.remove('active');
                listViewBtn.classList.remove('btn-danger');
                listViewBtn.classList.add('btn-outline-danger');
            } else {
                listViewBtn.classList.add('active');
                listViewBtn.classList.remove('btn-outline-danger');
                listViewBtn.classList.add('btn-danger');
                
                gridViewBtn.classList.remove('active');
                gridViewBtn.classList.remove('btn-danger');
                gridViewBtn.classList.add('btn-outline-danger');
            }
        }
    }

    loadMoreRestaurants() {
        const button = document.getElementById('loadMorePopular');
        const originalText = button.innerHTML;
        
        button.innerHTML = '<i class="bi bi-arrow-repeat spinner-border spinner-border-sm"></i> A carregar...';
        button.disabled = true;

        // Simular carregamento de mais dados
        setTimeout(() => {
            this.currentPage++;
            this.displayRestaurants();
            
            button.innerHTML = originalText;
            button.disabled = false;
            
            this.showNotification('Mais restaurantes carregados!', 'success');
        }, 1500);
    }

    updateGlobalStats() {
        if (this.filteredRestaurants.length === 0) return;

        const totalOrders = this.filteredRestaurants.reduce((sum, rest) => sum + rest.stats.weeklyOrders, 0);
        const avgRating = this.filteredRestaurants.reduce((sum, rest) => sum + rest.rating, 0) / this.filteredRestaurants.length;
        
        console.log(`📊 Estatísticas globais atualizadas: 
        - ${this.filteredRestaurants.length} restaurantes
        - ${totalOrders} pedidos semanais
        - Rating médio: ${avgRating.toFixed(1)}`);
    }

    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    handleRestaurantClick(card) {
        const restaurantId = card.dataset.restaurantId;
        
        // Add click animation
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 150);

        // Navigate to restaurant page
        setTimeout(() => {
            window.location.href = `../restaurante-detalhe.html?id=${restaurantId}`;
        }, 300);

        // Track analytics
        this.trackRestaurantClick(restaurantId);
    }

    trackRestaurantClick(restaurantId) {
        const restaurant = this.restaurants.find(r => r.id === parseInt(restaurantId));
        if (restaurant) {
            console.log(`📈 Restaurante clicado: ${restaurant.name} (Rank: ${restaurant.rank})`);
        }
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
}

// ==================================================
// INICIALIZAÇÃO
// ==================================================

document.addEventListener('DOMContentLoaded', function() {
    window.popularSystem = new PopularSystem();
});

// ==================================================
// CSS DINÂMICO PARA MODO LISTA
// ==================================================

const style = document.createElement('style');
style.textContent = `
    .list-view-card {
        transition: all 0.3s ease;
    }
    
    .list-view-card:hover {
        transform: translateX(5px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    
    .list-view-card .card-body {
        padding: 1.5rem;
    }
    
    @media (max-width: 768px) {
        .list-view-card .row {
            flex-direction: column;
            text-align: center;
        }
        
        .list-view-card .col-md-2 {
            margin-bottom: 1rem;
        }
        
        .list-view-card .col-md-3 {
            margin-top: 1rem;
        }
        
        .list-view-card .col-md-3.text-center.text-md-end {
            text-align: center !important;
        }
    }
    
    .popular-card {
        transition: all 0.4s ease-in-out;
    }
`;
document.head.appendChild(style);