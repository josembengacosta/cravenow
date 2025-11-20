// ==================================================
// SISTEMA DE HISTÓRIAS DE SUCESSO
// ==================================================

class SuccessStoriesSystem {
    constructor() {
        this.stories = [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.initializeEventListeners();
        this.initializeFilterSystem();
        this.loadSuccessStoriesData();
        this.initializeModals();
        console.log('✅ Sistema de histórias de sucesso inicializado');
    }

    initializeEventListeners() {
        // Filter buttons
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilter(e.target);
            });
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Track story views
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-bs-toggle="modal"]')) {
                const button = e.target.closest('[data-bs-toggle="modal"]');
                const targetModal = button.getAttribute('data-bs-target');
                this.trackStoryView(targetModal);
            }
        });

        // Initialize animations
        this.initializeAnimations();
    }

    initializeFilterSystem() {
        this.filters = {
            all: () => true,
            restaurante: (story) => story.category.includes('restaurante'),
            entregador: (story) => story.category.includes('entregador'),
            crescimento: (story) => story.category.includes('crescimento')
        };
    }

    loadSuccessStoriesData() {
        // Simulated success stories data
        this.stories = [
            {
                id: 'pizza-palace',
                title: 'Pizza Palace: De Pequeno Negócio a Referência em Luanda',
                category: ['restaurante', 'crescimento'],
                growth: 350,
                type: 'restaurante',
                stats: {
                    revenue: '+350%',
                    orders: '1.2K',
                    rating: '4.9★'
                },
                description: 'Em apenas 12 meses, o Pizza Palace transformou seu faturamento e se tornou um dos restaurantes mais populares da capital.',
                image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                featured: true
            },
            {
                id: 'sushi-master',
                title: 'Sushi Master: Qualidade que Conquista',
                category: ['restaurante', 'crescimento'],
                growth: 280,
                type: 'restaurante',
                stats: {
                    revenue: '+280%',
                    rating: '4.9★',
                    retention: '89%'
                },
                description: 'Especializado em culinária japonesa, o Sushi Master viu suas vendas online crescerem 280%.',
                image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
            },
            {
                id: 'joao-entregador',
                title: 'João Silva: Do Desemprego ao Top 1%',
                category: ['entregador'],
                growth: 0,
                type: 'entregador',
                stats: {
                    deliveries: '1.2K',
                    rating: '4.95★',
                    onTime: '98%'
                },
                description: 'João transformou sua vida através do delivery, tornando-se um dos entregadores mais bem avaliados.',
                image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
            },
            {
                id: 'sabores-angola',
                title: 'Sabores de Angola: Tradição Digital',
                category: ['restaurante', 'crescimento'],
                growth: 320,
                type: 'restaurante',
                stats: {
                    reach: '+320%',
                    rating: '4.8★',
                    customers: '2.5K'
                },
                description: 'Restaurante familiar que digitalizou suas receitas tradicionais e aumentou em 320% seu alcance.',
                image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
            }
        ];
    }

    initializeModals() {
        // Initialize Bootstrap modals with custom functionality
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('show.bs.modal', (e) => {
                this.onModalShow(e);
            });
            
            modal.addEventListener('hidden.bs.modal', (e) => {
                this.onModalHide(e);
            });
        });
    }

    initializeAnimations() {
        // Initialize scroll animations
        this.initializeScrollAnimations();
        
        // Initialize counter animations
        this.initializeCounters();
    }

    initializeScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe success cards and stats
        document.querySelectorAll('.success-card, .impact-number').forEach(el => {
            observer.observe(el);
        });
    }

    initializeCounters() {
        const counters = document.querySelectorAll('.impact-number');
        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    animateCounter(element) {
        const target = element.textContent;
        const isPercentage = target.includes('%');
        const isDecimal = target.includes('.');
        const numericValue = parseFloat(target.replace(/[^\d.]/g, ''));
        
        let current = 0;
        const increment = numericValue / 50;
        const duration = 2000;
        const stepTime = duration / 50;

        const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
                current = numericValue;
                clearInterval(timer);
            }
            
            if (isPercentage) {
                element.textContent = `+${Math.round(current)}%`;
            } else if (isDecimal) {
                element.textContent = current.toFixed(1);
            } else {
                element.textContent = Math.round(current).toLocaleString();
            }
        }, stepTime);
    }

    handleFilter(button) {
        const filter = button.getAttribute('data-filter');
        
        // Update active button
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.classList.remove('active', 'btn-danger');
            btn.classList.add('btn-outline-danger');
        });
        
        button.classList.remove('btn-outline-danger');
        button.classList.add('active', 'btn-danger');
        
        this.currentFilter = filter;
        this.applyFilters();
        
        this.showToast(`Filtro: ${this.getFilterName(filter)}`, 'info');
    }

    applyFilters() {
        const storyCards = document.querySelectorAll('#successStories .col-lg-4');
        let visibleCount = 0;
        
        storyCards.forEach(card => {
            const categories = card.getAttribute('data-category').split(' ');
            const shouldShow = this.filters[this.currentFilter]({ category: categories });
            
            if (shouldShow) {
                card.style.display = 'block';
                visibleCount++;
                
                // Add animation
                card.classList.add('animate__animated', 'animate__fadeIn');
            } else {
                card.style.display = 'none';
            }
        });
        
        this.updateResultsCount(visibleCount);
    }

    updateResultsCount(count) {
        // You can add a results counter if needed
        console.log(`${count} histórias encontradas`);
    }

    trackStoryView(modalId) {
        const storyId = modalId.replace('Modal', '').replace('#', '');
        console.log(`Visualizando história: ${storyId}`);
        
        // Track analytics event
        this.trackEvent('success_story_view', { storyId });
    }

    // Modal Methods
    onModalShow(event) {
        const modal = event.target;
        const modalTitle = modal.querySelector('.modal-title');
        
        // Add loading animation
        modal.classList.add('modal-loading');
        
        // Simulate content loading
        setTimeout(() => {
            modal.classList.remove('modal-loading');
            this.loadModalContent(modal);
        }, 500);
    }

    onModalHide(event) {
        const modal = event.target;
        console.log('Modal fechado:', modal.id);
    }

    loadModalContent(modal) {
        const modalId = modal.id;
        const storyId = modalId.replace('Modal', '');
        const story = this.stories.find(s => s.id === storyId.toLowerCase());
        
        if (story) {
            this.populateModalContent(modal, story);
        }
    }

    populateModalContent(modal, story) {
        // This would be populated with actual content from your data
        console.log('Populando modal com história:', story.title);
        
        // You can dynamically populate modal content here
        // For now, we'll just show a success message
        this.showToast(`Carregando história: ${story.title}`, 'success');
    }

    // Utility Methods
    getFilterName(filter) {
        const names = {
            'all': 'Todos',
            'restaurante': 'Restaurantes',
            'entregador': 'Entregadores',
            'crescimento': 'Alto Crescimento'
        };
        return names[filter] || filter;
    }

    trackEvent(eventName, properties) {
        // In real app, send to analytics
        console.log(`Success Story Event: ${eventName}`, properties);
        
        // Example: Send to Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }
    }

    showToast(message, type = 'info') {
        // Reuse the toast system from resources.js or create a simple one
        this.showSimpleNotification(message, type);
    }

    showSimpleNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
        `;
        
        notification.innerHTML = `
            <strong>${type.toUpperCase()}:</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 4000);
    }

    // Demo functions for testing
    testFilter(filter) {
        const button = document.querySelector(`[data-filter="${filter}"]`);
        if (button) {
            button.click();
        }
    }

    showRandomStory() {
        const randomIndex = Math.floor(Math.random() * this.stories.length);
        const randomStory = this.stories[randomIndex];
        const modalId = `#${randomStory.id}Modal`;
        
        const modalElement = document.querySelector(modalId);
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
    }
}

// ==================================================
// ANIMAÇÕES E EFEITOS ESPECIAIS
// ==================================================

class SuccessAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.initializeParallax();
        this.initializeHoverEffects();
        this.initializeProgressBars();
    }

    initializeParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.success-image');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px) scale(1.1)`;
            });
        });
    }

    initializeHoverEffects() {
        const cards = document.querySelectorAll('.success-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateCardHover(card, true);
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateCardHover(card, false);
            });
        });
    }

    animateCardHover(card, isHovering) {
        if (isHovering) {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
        } else {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    }

    initializeProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateProgressBar(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        progressBars.forEach(bar => {
            observer.observe(bar);
        });
    }

    animateProgressBar(progressBar) {
        const targetWidth = progressBar.style.width;
        progressBar.style.width = '0%';
        
        setTimeout(() => {
            progressBar.style.transition = 'width 2s ease-in-out';
            progressBar.style.width = targetWidth;
        }, 100);
    }
}

// ==================================================
// INICIALIZAÇÃO
// ==================================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Success Stories System
    window.successStoriesSystem = new SuccessStoriesSystem();
    
    // Initialize Animations
    window.successAnimations = new SuccessAnimations();
    
    // Initialize theme toggle (reuse from main delivery.js)
    initializeThemeToggle();
});

// ==================================================
// FUNÇÕES GLOBAIS PARA DEMONSTRAÇÃO
// ==================================================

function initializeThemeToggle() {
    const toggleButton = document.getElementById('toggleDark');
    if (toggleButton) {
        toggleButton.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-bs-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-bs-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update button icon
            const icon = this.querySelector('i');
            if (newTheme === 'dark') {
                icon.className = 'bi bi-sun-fill';
            } else {
                icon.className = 'bi bi-moon-stars-fill';
            }
            
            // Show notification
            if (window.successStoriesSystem) {
                window.successStoriesSystem.showToast(`Tema ${newTheme === 'dark' ? 'escuro' : 'claro'} ativado`, 'info');
            }
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-bs-theme', savedTheme);
        
        // Set initial icon
        const icon = toggleButton.querySelector('i');
        if (savedTheme === 'dark') {
            icon.className = 'bi bi-sun-fill';
        }
    }
}

// Test filter function
function testFilter(filter = 'restaurante') {
    if (window.successStoriesSystem) {
        window.successStoriesSystem.testFilter(filter);
    }
}

// Show random story
function showRandomStory() {
    if (window.successStoriesSystem) {
        window.successStoriesSystem.showRandomStory();
    }
}

// Share success story
function shareSuccessStory(storyId, platform = 'whatsapp') {
    const story = window.successStoriesSystem.stories.find(s => s.id === storyId);
    if (!story) return;

    const text = `Confira esta história de sucesso na DeliveryHJ: ${story.title}`;
    const url = window.location.href;
    
    let shareUrl;
    switch (platform) {
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            break;
        default:
            shareUrl = url;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    
    if (window.successStoriesSystem) {
        window.successStoriesSystem.trackEvent('story_share', { storyId, platform });
    }
}

// Export functions for global access
window.testFilter = testFilter;
window.showRandomStory = showRandomStory;
window.shareSuccessStory = shareSuccessStory;

console.log('🚀 Sistema de Histórias de Sucesso carregado com sucesso!');