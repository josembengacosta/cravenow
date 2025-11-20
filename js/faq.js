// ==================================================
// SISTEMA DE FAQ (PERGUNTAS FREQUENTES)
// ==================================================

class FAQSystem {
    constructor() {
        this.faqData = [];
        this.searchResults = [];
        this.searchTimeout = null;
        this.currentCategory = 'pedidos';
        this.init();
    }

    init() {
        this.initializeEventListeners();
        this.loadFAQData();
        this.initializeScrollSpy();
        console.log('✅ Sistema de FAQ inicializado');
    }

    initializeEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('faqSearch');
        const searchButton = document.getElementById('searchButton');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                if (this.searchTimeout) {
                    clearTimeout(this.searchTimeout);
                }
                
                this.searchTimeout = setTimeout(() => {
                    this.handleSearch(e.target.value);
                }, 500);
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    if (this.searchTimeout) {
                        clearTimeout(this.searchTimeout);
                    }
                    this.performSearch();
                }
            });
        }
        
        if (searchButton) {
            searchButton.addEventListener('click', () => this.performSearch());
        }

        // Navigation
        document.querySelectorAll('.faq-nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.target.getAttribute('href');
                this.scrollToCategory(target);
            });
        });

        // Reset search
        document.getElementById('resetSearch')?.addEventListener('click', () => {
            this.clearSearch();
        });

        // Back to top
        document.getElementById('backToTop')?.addEventListener('click', () => {
            this.scrollToTop();
        });

        // Quick category cards
        document.querySelectorAll('.faq-category-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const category = e.currentTarget.querySelector('h5').textContent.toLowerCase();
                this.scrollToCategoryByTitle(category);
            });
        });
    }

    initializeScrollSpy() {
        const sections = document.querySelectorAll('.faq-category');
        const navItems = document.querySelectorAll('.faq-nav-item');

        const observerOptions = {
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    // Update navigation
                    navItems.forEach(item => {
                        item.classList.remove('active');
                        if (item.getAttribute('href') === `#${id}`) {
                            item.classList.add('active');
                        }
                    });

                    // Update current category
                    this.currentCategory = id;
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));

        // Show/hide back to top button
        window.addEventListener('scroll', () => {
            const backToTop = document.getElementById('backToTop');
            if (window.scrollY > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });
    }

    loadFAQData() {
        // Comprehensive FAQ data
        this.faqData = [
            // Pedidos
            {
                id: 'pedido1',
                question: 'Como faço para fazer um pedido?',
                answer: 'Fazer um pedido na DeliveryHJ é muito simples...',
                category: 'pedidos',
                tags: ['fazer pedido', 'como pedir', 'primeiro pedido']
            },
            {
                id: 'pedido2',
                question: 'Posso alterar meu pedido depois de confirmado?',
                answer: 'Alterações no pedido são possíveis apenas nos primeiros 5 minutos...',
                category: 'pedidos',
                tags: ['alterar pedido', 'mudar pedido', 'modificar']
            },
            {
                id: 'pedido3',
                question: 'Como cancelar um pedido?',
                answer: 'Você pode cancelar um pedido enquanto ele estiver com status...',
                category: 'pedidos',
                tags: ['cancelar', 'cancelamento', 'desistir']
            },
            // Entregas
            {
                id: 'entrega1',
                question: 'Qual o tempo médio de entrega?',
                answer: 'O tempo de entrega varia conforme vários fatores...',
                category: 'entregas',
                tags: ['tempo entrega', 'duração', 'quanto tempo']
            },
            {
                id: 'entrega2',
                question: 'Posso rastrear meu pedido em tempo real?',
                answer: 'Sim! Você pode acompanhar seu pedido em tempo real...',
                category: 'entregas',
                tags: ['rastrear', 'acompanhar', 'localização']
            },
            {
                id: 'entrega3',
                question: 'E se eu não estiver em casa quando o entregador chegar?',
                answer: 'Se você não estiver em casa no momento da entrega...',
                category: 'entregas',
                tags: ['ausente', 'não estar em casa', 'reentrega']
            },
            // Pagamentos
            {
                id: 'pagamento1',
                question: 'Quais métodos de pagamento são aceites?',
                answer: 'Aceitamos diversos métodos de pagamento...',
                category: 'pagamentos',
                tags: ['pagamento', 'métodos', 'cartão', 'dinheiro']
            },
            {
                id: 'pagamento2',
                question: 'Meu pagamento foi recusado. O que fazer?',
                answer: 'Se seu pagamento foi recusado, aqui estão as possíveis causas...',
                category: 'pagamentos',
                tags: ['pagamento recusado', 'problema pagamento', 'cartão negado']
            }
        ];
    }

    handleSearch(query) {
        if (!query || query.trim().length === 0) {
            this.clearSearch();
            return;
        }

        const searchTerm = query.trim();
        
        if (searchTerm.length < 2) {
            this.clearSearch();
            return;
        }

        if (searchTerm.length >= 2) {
            this.performSearch(searchTerm);
        }
    }

    performSearch(query = null) {
        const searchTerm = query || document.getElementById('faqSearch')?.value.trim();
        
        if (!searchTerm || searchTerm.length < 2) {
            this.showToast('Digite pelo menos 2 caracteres para pesquisar', 'warning');
            return;
        }

        console.log('Pesquisando por:', searchTerm);

        // Filter results
        this.searchResults = this.faqData.filter(faq => 
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        this.displaySearchResults(searchTerm);
    }

    displaySearchResults(searchTerm) {
        const faqSections = document.getElementById('faqSections');
        const noResults = document.getElementById('noResults');

        if (!faqSections) return;

        // Hide all categories first
        document.querySelectorAll('.faq-category').forEach(category => {
            category.style.display = 'none';
        });

        if (this.searchResults.length === 0) {
            // Show no results message
            if (noResults) {
                noResults.classList.remove('d-none');
                faqSections.classList.add('d-none');
            }
            return;
        }

        // Show categories with results
        const categoriesWithResults = [...new Set(this.searchResults.map(result => result.category))];
        
        categoriesWithResults.forEach(category => {
            const categoryElement = document.getElementById(category);
            if (categoryElement) {
                categoryElement.style.display = 'block';
                
                // Highlight search terms
                this.highlightSearchTerms(categoryElement, searchTerm);
                
                // Expand first result
                const firstResult = this.searchResults.find(result => result.category === category);
                if (firstResult) {
                    const collapseElement = document.getElementById(firstResult.id);
                    if (collapseElement) {
                        new bootstrap.Collapse(collapseElement, { toggle: true });
                    }
                }
            }
        });

        // Hide no results, show sections
        if (noResults) {
            noResults.classList.add('d-none');
        }
        faqSections.classList.remove('d-none');

        this.showToast(`Encontramos ${this.searchResults.length} resultado(s) para "${searchTerm}"`, 'success');
    }

    highlightSearchTerms(element, searchTerm) {
        const regex = new RegExp(searchTerm, 'gi');
        const questions = element.querySelectorAll('.accordion-button');
        
        questions.forEach(question => {
            const originalText = question.textContent;
            const highlightedText = originalText.replace(regex, match => 
                `<span class="search-highlight">${match}</span>`
            );
            question.innerHTML = highlightedText;
        });

        // Also highlight in answers
        const answers = element.querySelectorAll('.accordion-body');
        answers.forEach(answer => {
            const originalText = answer.textContent;
            const highlightedText = originalText.replace(regex, match => 
                `<span class="search-highlight">${match}</span>`
            );
            answer.innerHTML = highlightedText;
        });
    }

    clearSearch() {
        document.getElementById('faqSearch').value = '';
        
        // Show all categories
        document.querySelectorAll('.faq-category').forEach(category => {
            category.style.display = 'block';
        });
        
        // Remove highlights
        document.querySelectorAll('.search-highlight').forEach(highlight => {
            highlight.outerHTML = highlight.textContent;
        });
        
        // Show sections, hide no results
        const faqSections = document.getElementById('faqSections');
        const noResults = document.getElementById('noResults');
        
        if (faqSections) faqSections.classList.remove('d-none');
        if (noResults) noResults.classList.add('d-none');
        
        // Scroll to current category
        this.scrollToCategory(`#${this.currentCategory}`);
    }

    scrollToCategory(categoryId) {
        const target = document.querySelector(categoryId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    scrollToCategoryByTitle(categoryTitle) {
        let categoryId;
        
        switch(categoryTitle) {
            case 'fazer pedidos':
                categoryId = '#pedidos';
                break;
            case 'entregas':
                categoryId = '#entregas';
                break;
            case 'pagamentos':
                categoryId = '#pagamentos';
                break;
            default:
                categoryId = '#pedidos';
        }
        
        this.scrollToCategory(categoryId);
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
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

    // Utility function to expand all FAQs in a category
    expandAllInCategory(categoryId) {
        const category = document.getElementById(categoryId);
        if (category) {
            const accordionButtons = category.querySelectorAll('.accordion-button');
            accordionButtons.forEach(button => {
                if (button.classList.contains('collapsed')) {
                    button.click();
                }
            });
        }
    }

    // Utility function to collapse all FAQs in a category
    collapseAllInCategory(categoryId) {
        const category = document.getElementById(categoryId);
        if (category) {
            const accordionButtons = category.querySelectorAll('.accordion-button');
            accordionButtons.forEach(button => {
                if (!button.classList.contains('collapsed')) {
                    button.click();
                }
            });
        }
    }
}

// ==================================================
// INICIALIZAÇÃO
// ==================================================

document.addEventListener('DOMContentLoaded', function() {
    window.faqSystem = new FAQSystem();
});

// ==================================================
// FUNÇÕES AUXILIARES GLOBAIS
// ==================================================

// Expand all FAQs
function expandAllFAQs() {
    const accordionButtons = document.querySelectorAll('.accordion-button');
    accordionButtons.forEach(button => {
        if (button.classList.contains('collapsed')) {
            button.click();
        }
    });
}

// Collapse all FAQs
function collapseAllFAQs() {
    const accordionButtons = document.querySelectorAll('.accordion-button');
    accordionButtons.forEach(button => {
        if (!button.classList.contains('collapsed')) {
            button.click();
        }
    });
}

// Print FAQ page
function printFAQ() {
    window.print();
}

// Share FAQ
function shareFAQ() {
    if (navigator.share) {
        navigator.share({
            title: 'DeliveryHJ - Perguntas Frequentes',
            text: 'Confira as perguntas frequentes da DeliveryHJ',
            url: window.location.href
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(window.location.href).then(() => {
            if (window.faqSystem) {
                window.faqSystem.showToast('Link copiado para a área de transferência!', 'success');
            }
        });
    }
}