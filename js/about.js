// ==================================================
// SISTEMA DA PÁGINA SOBRE DELIVERYHJ
// ==================================================

class SobreSystem {
    constructor() {
        this.init();
    }

    init() {
        this.initializeEventListeners();
        this.animateStats();
        this.initializeTimelineAnimation();
        console.log('✅ Sistema Sobre inicializado');
    }

    initializeEventListeners() {
        // Smooth scroll para âncoras
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

        // Efeitos de hover nas cards de valores
        document.querySelectorAll('.value-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });

        // Animação de contagem para stats
        this.initializeCounterAnimation();
    }

    animateStats() {
        const stats = document.querySelectorAll('.stat-card h3');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateValue(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => observer.observe(stat));
    }

    animateValue(element) {
        const value = element.textContent;
        const isPercentage = value.includes('%');
        const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
        
        let start = 0;
        const duration = 2000;
        const increment = numericValue / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= numericValue) {
                element.textContent = isPercentage ? `${numericValue}%` : this.formatNumber(numericValue);
                clearInterval(timer);
            } else {
                element.textContent = isPercentage ? 
                    `${Math.floor(start)}%` : 
                    this.formatNumber(Math.floor(start));
            }
        }, 16);
    }

    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'K+';
        }
        return num.toString();
    }

    initializeTimelineAnimation() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.3 });

        timelineItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'all 0.6s ease';
            observer.observe(item);
        });
    }

    initializeCounterAnimation() {
        // Contadores para números impactantes
        const counters = document.querySelectorAll('.counter');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.startCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    startCounter(element) {
        const target = parseInt(element.getAttribute('data-value') || element.textContent);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
}

// ==================================================
// FUNÇÕES GLOBAIS
// ==================================================

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function sharePage() {
    if (navigator.share) {
        navigator.share({
            title: 'DeliveryHJ - Conheça Nossa História',
            text: 'Descubra a jornada da DeliveryHJ, a plataforma que está revolucionando o delivery em Angola',
            url: window.location.href
        });
    } else {
        // Fallback - copiar URL
        navigator.clipboard.writeText(window.location.href).then(() => {
            showToast('Link copiado para a área de transferência!', 'success');
        });
    }
}

function showToast(message, type = 'info') {
    // Criar container de toast se não existir
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
    const icon = getToastIcon(type);

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

function getToastIcon(type) {
    const icons = {
        success: 'bi-check-circle-fill',
        error: 'bi-x-circle-fill',
        warning: 'bi-exclamation-triangle-fill',
        info: 'bi-info-circle-fill'
    };
    return icons[type] || 'bi-info-circle-fill';
}

// ==================================================
// INICIALIZAÇÃO
// ==================================================

document.addEventListener('DOMContentLoaded', function() {
    window.sobreSystem = new SobreSystem();
});

// ==================================================
// FUNÇÕES DE ACESSIBILIDADE
// ==================================================

// Navegação por teclado
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Fechar modais se abertos
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
                modalInstance.hide();
            }
        });
    }
});

// Foco em elementos interativos
function focusElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.focus();
    }
}