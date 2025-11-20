// ==================================================
// SISTEMA DE NAVEGAÇÃO DELIVERYHJ
// ==================================================

class NavigationSystem {
    constructor() {
        this.currentLocation = 'Luanda';
        this.cartCount = 0;
        this.init();
    }

    init() {
        this.initializeEventListeners();
        this.loadCartCount();
        this.loadUserLocation();
        console.log('✅ Sistema de Navegação inicializado');
    }

    initializeEventListeners() {
        // Location Modal
        document.getElementById('saveLocation')?.addEventListener('click', () => {
            this.saveUserLocation();
        });

        // Detect location checkbox
        document.getElementById('detectLocation')?.addEventListener('change', (e) => {
            if (e.target.checked) {
                this.detectUserLocation();
            }
        });

        // Province change
        document.getElementById('provinceSelect')?.addEventListener('change', (e) => {
            this.updateMunicipalities(e.target.value);
        });

        // Mobile menu enhancements
        this.enhanceMobileMenu();
    }

    loadCartCount() {
        // Load cart count from localStorage or API
        const savedCart = localStorage.getItem('deliveryhj_cart');
        if (savedCart) {
            const cart = JSON.parse(savedCart);
            this.cartCount = cart.items?.length || 0;
        }
        
        this.updateCartDisplay();
    }

    updateCartDisplay() {
        const mobileCount = document.getElementById('cartCountMobile');
        const desktopCount = document.getElementById('cartCountDesktop');
        
        if (mobileCount) mobileCount.textContent = this.cartCount;
        if (desktopCount) desktopCount.textContent = this.cartCount;
    }

    loadUserLocation() {
        const savedLocation = localStorage.getItem('deliveryhj_location');
        if (savedLocation) {
            this.currentLocation = savedLocation;
            this.updateLocationDisplay();
        } else {
            this.detectUserLocation();
        }
    }

    detectUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // In a real app, you'd reverse geocode here
                    this.currentLocation = 'Luanda (Automático)';
                    this.updateLocationDisplay();
                    this.saveToLocalStorage();
                },
                (error) => {
                    console.log('Location detection failed:', error);
                    this.fallbackLocation();
                }
            );
        } else {
            this.fallbackLocation();
        }
    }

    fallbackLocation() {
        this.currentLocation = 'Luanda';
        this.updateLocationDisplay();
    }

    updateLocationDisplay() {
        const locationElement = document.getElementById('currentLocation');
        if (locationElement) {
            locationElement.textContent = this.currentLocation;
        }
    }

    saveUserLocation() {
        const provinceSelect = document.getElementById('provinceSelect');
        const municipalitySelect = document.getElementById('municipalitySelect');
        
        if (provinceSelect && municipalitySelect) {
            this.currentLocation = `${municipalitySelect.value}, ${provinceSelect.value}`;
            this.updateLocationDisplay();
            this.saveToLocalStorage();
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('locationModal'));
            if (modal) modal.hide();
            
            this.showToast('Localização atualizada com sucesso!', 'success');
        }
    }

    updateMunicipalities(province) {
        const municipalitySelect = document.getElementById('municipalitySelect');
        if (!municipalitySelect) return;

        // Clear existing options
        municipalitySelect.innerHTML = '';

        // Add municipalities based on province
        const municipalities = this.getMunicipalities(province);
        municipalities.forEach(municipio => {
            const option = document.createElement('option');
            option.value = municipio;
            option.textContent = municipio;
            municipalitySelect.appendChild(option);
        });
    }

    getMunicipalities(province) {
        const municipalities = {
            'luanda': ['Luanda', 'Viana', 'Cacuaco', 'Cazenga', 'Belas', 'Kilamba Kiaxi', 'Talatona'],
            'benguela': ['Benguela', 'Baía Farta', 'Balombo', 'Bocoio', 'Caimbambo', 'Catumbela', 'Chongoroi', 'Cubal', 'Ganda', 'Lobito'],
            'huila': ['Lubango', 'Caconda', 'Caluquembe', 'Chiange', 'Chibia', 'Chicomba', 'Chipindo', 'Gambos', 'Humpata', 'Jamba', 'Kuvango', 'Matala', 'Quilengues', 'Quipungo'],
            'cabinda': ['Cabinda', 'Belize', 'Buco-Zau', 'Cacongo'],
            'huambo': ['Huambo', 'Bailundo', 'Caála', 'Cachiungo', 'Ecunha', 'Londuimbali', 'Longonjo', 'Mungo', 'Chicala-Cholohanga', 'Chinjenje', 'Ucuma'],
            'malanje': ['Malanje', 'Cacuso', 'Calandula', 'Cambundi-Catembo', 'Cangandala', 'Caombo', 'Cuaba Nzoji', 'Cunda-Dia-Baze', 'Luquembo', 'Marimba', 'Massango', 'Mucari', 'Quela', 'Quirima']
        };

        return municipalities[province] || ['Selecione...'];
    }

    saveToLocalStorage() {
        localStorage.setItem('deliveryhj_location', this.currentLocation);
    }

    enhanceMobileMenu() {
        // Add smooth transitions for mobile menu
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarNav = document.querySelector('#navbarNav');
        
        if (navbarToggler && navbarNav) {
            navbarToggler.addEventListener('click', () => {
                navbarNav.classList.toggle('showing');
            });
        }
    }

    showToast(message, type = 'info') {
        // Reuse the toast function from other systems
        if (window.deliverySystem && window.deliverySystem.showToast) {
            window.deliverySystem.showToast(message, type);
        } else {
            console.log(`${type}: ${message}`);
        }
    }

    // Public method to update cart
    updateCart(items) {
        this.cartCount = items.length;
        this.updateCartDisplay();
    }

    // Public method to update location
    setLocation(location) {
        this.currentLocation = location;
        this.updateLocationDisplay();
        this.saveToLocalStorage();
    }
}

// ==================================================
// INICIALIZAÇÃO
// ==================================================

document.addEventListener('DOMContentLoaded', function() {
    window.navigationSystem = new NavigationSystem();
});

// ==================================================
// FUNÇÕES GLOBAIS DE NAVEGAÇÃO
// ==================================================

// Quick navigation functions
function goToRestaurants() {
    window.location.href = 'pages/restaurant.html';
}

function goToPromotions() {
    window.location.href = 'pages/promocoes.html';
}

function goToCart() {
    window.location.href = 'pages/cart.html';
}

function goToProfile() {
    window.location.href = 'authentic/profile.html';
}

function goToOrders() {
    window.location.href = 'pages/pedidos.html';
}

// Search function
function quickSearch(query) {
    if (query && query.trim() !== '') {
        window.location.href = `pages/restaurant.html?search=${encodeURIComponent(query)}`;
    }
}

// Location quick set
function setQuickLocation(location) {
    if (window.navigationSystem) {
        window.navigationSystem.setLocation(location);
    }
}

// Cart management
function addToCart(item) {
    // This would integrate with the cart system
    if (window.navigationSystem) {
        // Update cart count
        const currentCount = window.navigationSystem.cartCount;
        window.navigationSystem.updateCart([...Array(currentCount + 1).keys()]);
    }
}