// traditional-system.js - Sistema de Culinária Tradicional DeliveryHJ

class TraditionalSystem {
    constructor() {
        this.dishes = [];
        this.filteredDishes = [];
        this.currentFilters = {
            type: 'type-all',
            region: 'region-all',
            spice: 'spice-all',
            time: 'time-all',
            special: null
        };
        this.init();
    }

    init() {
        this.initializeEventListeners();
        this.loadTraditionalDishes();
        console.log('✅ Sistema de culinária tradicional inicializado');
    }

    initializeEventListeners() {
        // Filter options
        document.querySelectorAll('.filter-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.handleFilterClick(e.target);
            });
        });

        // Search functionality
        const searchInput = document.getElementById('searchDishes');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
    }

    loadTraditionalDishes() {
        // Simulated traditional dishes data
        this.dishes = [
            {
                id: 1,
                name: "Muamba de Galinha",
                description: "Prato tradicional angolano com galinha, óleo de palma, quiabo e gindungo. Sabor único e aromático.",
                image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                price: 2500,
                preparationTime: 90,
                spiceLevel: 3,
                type: "main",
                region: "luanda",
                ingredients: ["Galinha", "Óleo de palma", "Quiabo", "Gindungo", "Alho", "Cebola"],
                isFeatured: true,
                isVegetarian: false,
                popularity: 95,
                culturalTip: "Tradicionalmente servido com funge ou arroz",
                restaurant: "Sabores de Angola",
                rating: 4.9
            },
            {
                id: 2,
                name: "Funge de Bombó",
                description: "Massa tradicional feita de farinha de mandioca, acompanhamento essencial da culinária angolana.",
                image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                price: 800,
                preparationTime: 30,
                spiceLevel: 1,
                type: "side",
                region: "huambo",
                ingredients: ["Farinha de mandioca", "Água", "Sal"],
                isFeatured: false,
                isVegetarian: true,
                popularity: 88,
                culturalTip: "Deve ser comido com as mãos, seguindo a tradição",
                restaurant: "Cantinho do Planalto",
                rating: 4.7
            },
            {
                id: 3,
                name: "Mufete",
                description: "Prato típico de Luanda com feijão de óleo de palma, peixe grelhado, banana e batata doce.",
                image: "https://images.unsplash.com/photo-1563379091339-03246963d96f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                price: 3000,
                preparationTime: 60,
                spiceLevel: 2,
                type: "main",
                region: "luanda",
                ingredients: ["Peixe fresco", "Feijão", "Óleo de palma", "Banana", "Batata doce"],
                isFeatured: true,
                isVegetarian: false,
                popularity: 92,
                culturalTip: "Prato tradicional das festas e celebrações",
                restaurant: "Mufete da Ilha",
                rating: 4.8
            },
            {
                id: 4,
                name: "Calulu de Peixe",
                description: "Peixe seco cozido com quiabo, óleo de palma e legumes, prato de origem brasileira com adaptação angolana.",
                image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                price: 2200,
                preparationTime: 75,
                spiceLevel: 2,
                type: "main",
                region: "benguela",
                ingredients: ["Peixe seco", "Quiabo", "Óleo de palma", "Tomate", "Cebola", "Alho"],
                isFeatured: false,
                isVegetarian: false,
                popularity: 85,
                culturalTip: "Melhor quando preparado com peixe seco tradicional",
                restaurant: "Mar & Sabor",
                rating: 4.6
            },
            {
                id: 5,
                name: "Cocada Angolana",
                description: "Doce tradicional feito com coco ralado e açúcar, herança da doçaria portuguesa com toque africano.",
                image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                price: 500,
                preparationTime: 45,
                spiceLevel: 1,
                type: "dessert",
                region: "all",
                ingredients: ["Coco ralado", "Açúcar", "Água", "Canela"],
                isFeatured: false,
                isVegetarian: true,
                popularity: 78,
                culturalTip: "Tradicionalmente servido em festas familiares",
                restaurant: "Doces Tradições",
                rating: 4.5
            },
            {
                id: 6,
                name: "Muxima de Galinha",
                description: "Prato tradicional do interior com galinha, amendoim e legumes, de sabor único e cremoso.",
                image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                price: 2700,
                preparationTime: 85,
                spiceLevel: 2,
                type: "main",
                region: "huila",
                ingredients: ["Galinha", "Amendoim", "Cebola", "Alho", "Tomate", "Pimento"],
                isFeatured: true,
                isVegetarian: false,
                popularity: 87,
                culturalTip: "O amendoim torrado dá o sabor característico",
                restaurant: "Sabor do Sul",
                rating: 4.7
            },
            {
                id: 7,
                name: "Pirão",
                description: "Massa feita com farinha de milho ou mandioca e caldo de peixe ou carne, acompanhamento tradicional.",
                image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                price: 600,
                preparationTime: 20,
                spiceLevel: 1,
                type: "side",
                region: "all",
                ingredients: ["Farinha de milho", "Caldo", "Cebola", "Alho"],
                isFeatured: false,
                isVegetarian: false,
                popularity: 82,
                culturalTip: "Deve ter consistência cremosa, nem muito mole nem muito duro",
                restaurant: "Casa Tradicional",
                rating: 4.4
            },
            {
                id: 8,
                name: "Ginguba Torrada",
                description: "Amendoim torrado com sal, snack tradicional e nutritivo muito popular em Angola.",
                image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                price: 300,
                preparationTime: 15,
                spiceLevel: 1,
                type: "side",
                region: "all",
                ingredients: ["Amendoim", "Sal"],
                isFeatured: false,
                isVegetarian: true,
                popularity: 90,
                culturalTip: "Acompanha bem cerveja e é popular em encontros sociais",
                restaurant: "Petiscos Tradicionais",
                rating: 4.6
            }
        ];

        this.applyFilters();
    }

    handleFilterClick(option) {
        const filterType = this.getFilterType(option.getAttribute('data-filter'));
        const filterValue = option.getAttribute('data-filter');

        // Update active state
        if (filterType === 'special') {
            // Toggle special filters
            if (option.classList.contains('active')) {
                option.classList.remove('active');
                this.currentFilters.special = null;
            } else {
                // Remove active from other special filters
                document.querySelectorAll('.filter-option[data-filter^="featured"], .filter-option[data-filter^="vegetarian"], .filter-option[data-filter^="popular"]').forEach(opt => {
                    opt.classList.remove('active');
                });
                option.classList.add('active');
                this.currentFilters.special = filterValue;
            }
        } else {
            // Single selection filters
            document.querySelectorAll(`.filter-option[data-filter^="${filterType}"]`).forEach(opt => {
                opt.classList.remove('active');
            });
            option.classList.add('active');
            this.currentFilters[filterType] = filterValue;
        }

        this.applyFilters();
    }

    getFilterType(filterValue) {
        if (filterValue.startsWith('type-')) return 'type';
        if (filterValue.startsWith('region-')) return 'region';
        if (filterValue.startsWith('spice-')) return 'spice';
        if (filterValue.startsWith('time-')) return 'time';
        if (filterValue === 'featured' || filterValue === 'vegetarian' || filterValue === 'popular') return 'special';
        return 'unknown';
    }

    handleSearch(searchTerm) {
        this.searchTerm = searchTerm.toLowerCase();
        this.applyFilters();
    }

    applyFilters() {
        this.showLoading();

        // Simulate API delay
        setTimeout(() => {
            this.filteredDishes = this.dishes.filter(dish => {
                // Type filter
                const matchesType = this.currentFilters.type === 'type-all' || 
                    (this.currentFilters.type === 'type-main' && dish.type === 'main') ||
                    (this.currentFilters.type === 'type-side' && dish.type === 'side') ||
                    (this.currentFilters.type === 'type-dessert' && dish.type === 'dessert');

                // Region filter
                const matchesRegion = this.currentFilters.region === 'region-all' || 
                    dish.region === this.currentFilters.region.replace('region-', '');

                // Spice filter
                const matchesSpice = this.currentFilters.spice === 'spice-all' ||
                    (this.currentFilters.spice === 'spice-mild' && dish.spiceLevel <= 1) ||
                    (this.currentFilters.spice === 'spice-medium' && dish.spiceLevel === 2) ||
                    (this.currentFilters.spice === 'spice-hot' && dish.spiceLevel >= 3);

                // Time filter
                const matchesTime = this.currentFilters.time === 'time-all' ||
                    (this.currentFilters.time === 'time-fast' && dish.preparationTime <= 30) ||
                    (this.currentFilters.time === 'time-medium' && dish.preparationTime > 30 && dish.preparationTime <= 60) ||
                    (this.currentFilters.time === 'time-slow' && dish.preparationTime > 60);

                // Special filters
                let matchesSpecial = true;
                if (this.currentFilters.special === 'featured') {
                    matchesSpecial = dish.isFeatured;
                } else if (this.currentFilters.special === 'vegetarian') {
                    matchesSpecial = dish.isVegetarian;
                } else if (this.currentFilters.special === 'popular') {
                    matchesSpecial = dish.popularity >= 85;
                }

                // Search filter
                const matchesSearch = !this.searchTerm ||
                    dish.name.toLowerCase().includes(this.searchTerm) ||
                    dish.description.toLowerCase().includes(this.searchTerm) ||
                    dish.ingredients.some(ingredient => ingredient.toLowerCase().includes(this.searchTerm));

                return matchesType && matchesRegion && matchesSpice && matchesTime && matchesSpecial && matchesSearch;
            });

            this.displayDishes();
            this.updateStats();
        }, 600);
    }

    displayDishes() {
        const grid = document.getElementById('traditionalDishesGrid');
        const loading = document.getElementById('dishesLoading');
        const noResults = document.getElementById('noDishes');

        loading.style.display = 'none';

        if (this.filteredDishes.length === 0) {
            grid.style.display = 'none';
            noResults.style.display = 'block';
            return;
        }

        noResults.style.display = 'none';
        grid.style.display = 'grid';

        let dishesHTML = '';

        this.filteredDishes.forEach((dish, index) => {
            dishesHTML += this.generateDishHTML(dish, index);
        });

        grid.innerHTML = dishesHTML;

        // Update count
        document.getElementById('dishesCount').textContent = this.filteredDishes.length;

        // Add click handlers
        this.initializeDishCards();
    }

    generateDishHTML(dish, index) {
        const animationDelay = index * 100;
        const spiceDots = this.generateSpiceDots(dish.spiceLevel);
        const preparationTime = this.formatPreparationTime(dish.preparationTime);

        return `
            <div class="fade-in-up ${dish.isFeatured ? 'traditional-featured' : ''}" style="animation-delay: ${animationDelay}ms">
                <div class="card traditional-card pattern-border" data-id="${dish.id}">
                    ${dish.isFeatured ? `
                        <div class="featured-badge">
                            <i class="bi bi-star-fill"></i> Destaque
                        </div>
                    ` : ''}
                    
                    <div class="position-relative">
                        <img src="${dish.image}" class="dish-image w-100" alt="${dish.name}">
                        <div class="position-absolute top-0 start-0 m-2">
                            <span class="traditional-badge">
                                <i class="bi bi-egg-fried"></i> Tradicional
                            </span>
                        </div>
                    </div>
                    
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title fw-bold text-traditional">${dish.name}</h5>
                            <span class="rating-badge">${dish.rating}★</span>
                        </div>
                        
                        <p class="card-text text-muted small mb-3">${dish.description}</p>
                        
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="region-badge">${this.getRegionName(dish.region)}</span>
                            <div class="spice-level">
                                <span class="text-muted small me-2">Picante:</span>
                                ${spiceDots}
                            </div>
                        </div>
                        
                        <div class="ingredients-list">
                            ${dish.ingredients.slice(0, 3).map(ingredient => 
                                `<span class="ingredient-tag">${ingredient}</span>`
                            ).join('')}
                            ${dish.ingredients.length > 3 ? 
                                `<span class="ingredient-tag">+${dish.ingredients.length - 3}</span>` : ''
                            }
                        </div>
                        
                        <div class="cultural-tip mt-2">
                            <i class="bi bi-lightbulb text-warning me-1"></i>
                            <small>${dish.culturalTip}</small>
                        </div>
                        
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <div class="recipe-time">
                                <i class="bi bi-clock"></i> ${preparationTime}
                            </div>
                            <div class="fw-bold text-traditional fs-5">
                                ${dish.price} Kz
                            </div>
                        </div>
                        
                        <div class="text-muted small mt-2">
                            <i class="bi bi-shop"></i> ${dish.restaurant}
                        </div>
                    </div>
                    
                    <div class="card-footer bg-transparent border-0 pt-0">
                        <button class="btn btn-traditional w-100" onclick="traditionalSystem.orderDish(${dish.id})">
                            <i class="bi bi-cart-plus"></i> Pedir Agora
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    generateSpiceDots(level) {
        let dots = '';
        for (let i = 1; i <= 3; i++) {
            dots += `<div class="spice-dot ${i <= level ? 'active' : ''}"></div>`;
        }
        return dots;
    }

    formatPreparationTime(minutes) {
        if (minutes <= 60) {
            return `${minutes}min`;
        } else {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            return `${hours}h${remainingMinutes > 0 ? `${remainingMinutes}min` : ''}`;
        }
    }

    getRegionName(region) {
        const regions = {
            'luanda': 'Luanda',
            'huila': 'Huíla',
            'benguela': 'Benguela',
            'huambo': 'Huambo',
            'all': 'Todas'
        };
        return regions[region] || region;
    }

    initializeDishCards() {
        document.querySelectorAll('.traditional-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    const dishId = card.getAttribute('data-id');
                    this.viewDishDetails(dishId);
                }
            });
        });
    }

    viewDishDetails(dishId) {
        const dish = this.dishes.find(d => d.id === dishId);
        if (dish) {
            // In production, this would show a modal or navigate to detail page
            console.log('Visualizando detalhes do prato:', dish.name);
            
            // For now, simulate navigation
            this.showToast(`Abrindo detalhes de ${dish.name}`, 'info');
            
            // Track view
            this.trackDishView(dishId);
        }
    }

    orderDish(dishId) {
        const dish = this.dishes.find(d => d.id === dishId);
        if (dish) {
            // In production, this would add to cart or navigate to restaurant
            console.log('Pedindo prato:', dish.name);
            
            this.showToast(`🛒 ${dish.name} adicionado ao carrinho!`, 'success');
            
            // Track order
            this.trackDishOrder(dishId);
        }
    }

    clearFilters() {
        // Reset all filters
        this.currentFilters = {
            type: 'type-all',
            region: 'region-all',
            spice: 'spice-all',
            time: 'time-all',
            special: null
        };

        // Reset UI
        document.querySelectorAll('.filter-option').forEach(option => {
            option.classList.remove('active');
        });
        
        document.querySelectorAll('.filter-option[data-filter$="-all"]').forEach(option => {
            option.classList.add('active');
        });

        // Clear search
        this.searchTerm = '';
        const searchInput = document.getElementById('searchDishes');
        if (searchInput) searchInput.value = '';

        this.applyFilters();
        this.showToast('Filtros limpos', 'success');
    }

    updateStats() {
        // Update statistics
        const totalDishes = this.dishes.length;
        const traditionalRestaurants = new Set(this.dishes.map(d => d.restaurant)).size;
        const regions = new Set(this.dishes.map(d => d.region)).size;
        const avgRating = (this.dishes.reduce((sum, d) => sum + d.rating, 0) / totalDishes).toFixed(1);

        document.getElementById('traditionalDishes').textContent = totalDishes;
        document.getElementById('traditionalRestaurants').textContent = traditionalRestaurants;
        document.getElementById('regionsCovered').textContent = regions;
        document.getElementById('avgRating').textContent = avgRating;
    }

    showLoading() {
        document.getElementById('dishesLoading').style.display = 'block';
        document.getElementById('traditionalDishesGrid').style.display = 'none';
        document.getElementById('noDishes').style.display = 'none';
    }

    trackDishView(dishId) {
        console.log('Prato visualizado:', dishId);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'dish_view', {
                dish_id: dishId,
                category: 'traditional'
            });
        }
    }

    trackDishOrder(dishId) {
        console.log('Prato pedido:', dishId);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'dish_order', {
                dish_id: dishId,
                category: 'traditional'
            });
        }
    }

    showToast(message, type = 'info') {
        // Create toast container if it doesn't exist
        let toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
            toastContainer.style.zIndex = '9999';
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

// Global functions for HTML onclick attributes
function clearFilters() {
    if (window.traditionalSystem) {
        window.traditionalSystem.clearFilters();
    }
}

function orderDish(dishId) {
    if (window.traditionalSystem) {
        window.traditionalSystem.orderDish(dishId);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.traditionalSystem = new TraditionalSystem();
    
    console.log('🚀 Sistema de Culinária Tradicional DeliveryHJ carregado com sucesso!');
});