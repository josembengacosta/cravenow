// ==================================================
// SISTEMA DE LOGIN DE PARCEIROS
// ==================================================

class PartnerLoginSystem {
    constructor() {
        this.init();
    }

    init() {
        this.initializeEventListeners();
        this.initializeFormValidation();
        console.log('✅ Sistema de login de parceiros inicializado');
    }

    initializeEventListeners() {
        // Toggle password visibility
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('partnerPassword');
        
        if (togglePassword && passwordInput) {
            togglePassword.addEventListener('click', () => {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                
                // Toggle icon
                const icon = togglePassword.querySelector('i');
                icon.classList.toggle('bi-eye');
                icon.classList.toggle('bi-eye-slash');
            });
        }

        // Form submission
        const loginForm = document.getElementById('partnerLoginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(e);
            });
        }

        // Social login buttons
        document.querySelectorAll('.btn-outline-primary, .btn-outline-dark').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleSocialLogin(e.target);
            });
        });
    }

    initializeFormValidation() {
        // Bootstrap form validation
        const forms = document.querySelectorAll('.needs-validation');
        
        Array.from(forms).forEach(form => {
            form.addEventListener('submit', event => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                
                form.classList.add('was-validated');
            }, false);
        });
    }

    handleLogin(event) {
        const form = event.target;
        
        if (!form.checkValidity()) {
            return;
        }

        const formData = {
            email: document.getElementById('partnerEmail').value,
            password: document.getElementById('partnerPassword').value,
            rememberMe: document.getElementById('rememberMe').checked
        };

        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="bi bi-arrow-repeat spinner-border spinner-border-sm"></i> A entrar...';
        submitButton.disabled = true;

        // Simulate API call
        setTimeout(() => {
            this.simulateLogin(formData, submitButton, originalText);
        }, 2000);
    }

    simulateLogin(formData, submitButton, originalText) {
        // In a real application, this would be an API call
        console.log('Tentativa de login:', formData);

        // Simulate different scenarios
        const scenarios = [
            { success: true, message: 'Login realizado com sucesso!' },
            { success: false, message: 'Email ou palavra-passe incorretos.' },
            { success: false, message: 'Conta de restaurante não verificada.' }
        ];

        const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];

        if (randomScenario.success) {
            this.showToast(randomScenario.message, 'success');
            
            // Redirect to partner dashboard
            setTimeout(() => {
                window.location.href = 'partner-dashboard.html';
            }, 1500);
        } else {
            this.showToast(randomScenario.message, 'error');
            
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            
            // Show specific error handling
            this.handleLoginError(randomScenario.message);
        }
    }

    handleLoginError(errorMessage) {
        // Add error styling to inputs
        const emailInput = document.getElementById('partnerEmail');
        const passwordInput = document.getElementById('partnerPassword');
        
        if (errorMessage.includes('Email')) {
            emailInput.classList.add('is-invalid');
            this.showCustomError('Email não encontrado ou conta não verificada.');
        }
        
        if (errorMessage.includes('palavra-passe')) {
            passwordInput.classList.add('is-invalid');
            this.showCustomError('Palavra-passe incorreta. Tente novamente.');
        }
    }

    showCustomError(message) {
        // Create custom error alert
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger alert-dismissible fade show mt-3';
        alertDiv.innerHTML = `
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const form = document.getElementById('partnerLoginForm');
        form.appendChild(alertDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }

    handleSocialLogin(button) {
        const buttonText = button.textContent.trim();
        const originalText = button.innerHTML;
        
        // Show loading state
        button.innerHTML = '<i class="bi bi-arrow-repeat spinner-border spinner-border-sm"></i> A conectar...';
        button.disabled = true;

        // Simulate social login process
        setTimeout(() => {
            this.showToast(`Redirecionando para ${buttonText}...`, 'info');
            
            // Reset button after delay
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
                
                // In real app, this would redirect to OAuth
                this.showToast('Funcionalidade em desenvolvimento', 'warning');
            }, 2000);
        }, 1000);
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

    // Security features
    enableSecurityFeatures() {
        // Add timeout for inactivity
        this.setupInactivityTimer();
        
        // Prevent form resubmission
        if (window.history.replaceState) {
            window.history.replaceState(null, null, window.location.href);
        }
    }

    setupInactivityTimer() {
        let timeout;
        const logoutTime = 30 * 60 * 1000; // 30 minutes
        
        const resetTimer = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                this.showToast('Sessão expirada por inatividade', 'warning');
                // In real app, would redirect to login
            }, logoutTime);
        };

        // Reset timer on user activity
        ['click', 'mousemove', 'keypress', 'scroll'].forEach(event => {
            document.addEventListener(event, resetTimer);
        });

        resetTimer();
    }
}

// ==================================================
// INICIALIZAÇÃO
// ==================================================

document.addEventListener('DOMContentLoaded', function() {
    window.partnerLoginSystem = new PartnerLoginSystem();
    
    // Enable security features
    window.partnerLoginSystem.enableSecurityFeatures();
});

// ==================================================
// FUNÇÕES AUXILIARES
// ==================================================

// Auto-fill for demo purposes (remove in production)
function demoLogin(role = 'admin') {
    const demoSettings = {
        admin: { email: 'admin@restaurant.com', password: 'demo123' },
        manager: { email: 'gerente@restaurant.com', password: 'demo123' },
        staff: { email: 'funcionario@restaurant.com', password: 'demo123' }
    };
    
    const demo = demoSettings[role];
    if (demo) {
        document.getElementById('partnerEmail').value = demo.email;
        document.getElementById('partnerPassword').value = demo.password;
        document.getElementById('rememberMe').checked = true;
        
        window.partnerLoginSystem.showToast(`Credenciais de ${role} preenchidas`, 'info');
    }
}