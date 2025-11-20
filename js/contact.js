// ==================================================
// SISTEMA DE CONTACTO
// ==================================================

class ContactSystem {
    constructor() {
        this.init();
    }

    init() {
        this.initializeEventListeners();
        this.initializeFormValidation();
        console.log('✅ Sistema de contacto inicializado');
    }

    initializeEventListeners() {
        // Form submission
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(e);
            });
        }

        // Quick contact buttons
        document.querySelectorAll('.btn-success, .btn-primary, .btn-warning').forEach(btn => {
            if (btn.getAttribute('href') && !btn.getAttribute('href').startsWith('#')) {
                btn.addEventListener('click', (e) => {
                    this.trackContactMethod(e.target);
                });
            }
        });

        // Department email clicks
        document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
            link.addEventListener('click', (e) => {
                this.trackEmailClick(e.target.href);
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

        // Real-time validation for phone number
        const phoneInput = document.getElementById('contactPhone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                this.validatePhoneNumber(e.target);
            });
        }
    }

    validatePhoneNumber(input) {
        const phone = input.value.replace(/\D/g, '');
        
        // Basic Angolan phone number validation
        if (phone.length > 0 && !phone.startsWith('244')) {
            // Add +244 prefix if not present
            if (!phone.startsWith('244') && phone.length >= 9) {
                input.value = '+244 ' + phone.slice(-9);
            }
        }
        
        // Validate length
        if (phone.length > 0 && phone.length < 12) {
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
        }
    }

    handleContactForm(event) {
        const form = event.target;
        
        if (!form.checkValidity()) {
            return;
        }

        const formData = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            phone: document.getElementById('contactPhone').value,
            subject: document.getElementById('contactSubject').value,
            message: document.getElementById('contactMessage').value,
            privacy: document.getElementById('contactPrivacy').checked,
            timestamp: new Date().toISOString()
        };

        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="bi bi-arrow-repeat spinner-border spinner-border-sm"></i> A enviar...';
        submitButton.disabled = true;

        // Simulate API call
        setTimeout(() => {
            this.simulateFormSubmission(formData, submitButton, originalText);
        }, 2000);
    }

    simulateFormSubmission(formData, submitButton, originalText) {
        // In a real application, this would be an API call
        console.log('Dados do formulário:', formData);

        // Simulate different scenarios
        const successRate = 0.9; // 90% success rate
        const isSuccess = Math.random() < successRate;

        if (isSuccess) {
            this.showSuccessMessage(formData);
            this.resetForm();
        } else {
            this.showErrorMessage();
        }

        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }

    showSuccessMessage(formData) {
        this.showToast('Mensagem enviada com sucesso! Entraremos em contacto em breve.', 'success');
        
        // Show confirmation modal
        const modalHTML = `
            <div class="modal fade" id="successModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-check-circle-fill me-2"></i>
                                Mensagem Enviada!
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body text-center py-4">
                            <i class="bi bi-envelope-check display-1 text-success mb-3"></i>
                            <h4 class="fw-bold text-success">Obrigado, ${formData.name}!</h4>
                            <p class="text-muted">
                                Sua mensagem foi recebida com sucesso. 
                                Entraremos em contacto através do email <strong>${formData.email}</strong> 
                                em até 4 horas.
                            </p>
                            <div class="alert alert-info mt-3">
                                <i class="bi bi-info-circle"></i>
                                <strong>Número do protocolo:</strong> DHJ-${Date.now().toString().slice(-6)}
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

        // Add modal to DOM if not exists
        if (!document.getElementById('successModal')) {
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }

        const modal = new bootstrap.Modal(document.getElementById('successModal'));
        modal.show();
    }

    showErrorMessage() {
        this.showToast('Erro ao enviar mensagem. Tente novamente ou use outro método de contacto.', 'error');
        
        // Show error suggestions
        const errorHTML = `
            <div class="alert alert-danger alert-dismissible fade show mt-3" role="alert">
                <h6 class="alert-heading">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                    Erro no envio
                </h6>
                <p class="mb-2">Sugestões:</p>
                <ul class="mb-2">
                    <li>Verifique sua conexão com a internet</li>
                    <li>Tente enviar novamente em alguns minutos</li>
                    <li>Entre em contacto diretamente por WhatsApp ou telefone</li>
                </ul>
                <div class="d-flex gap-2">
                    <a href="https://wa.me/244923456789" class="btn btn-sm btn-success" target="_blank">
                        <i class="bi bi-whatsapp me-1"></i> WhatsApp
                    </a>
                    <a href="tel:+244222123456" class="btn btn-sm btn-primary">
                        <i class="bi bi-telephone me-1"></i> Telefone
                    </a>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;

        const form = document.getElementById('contactForm');
        form.insertAdjacentHTML('beforeend', errorHTML);
    }

    resetForm() {
        const form = document.getElementById('contactForm');
        form.reset();
        form.classList.remove('was-validated');
    }

    trackContactMethod(button) {
        const method = button.textContent.trim();
        console.log(`Método de contacto utilizado: ${method}`);
        
        // In real app, send to analytics
        this.showToast(`Redirecionando para ${method}...`, 'info');
    }

    trackEmailClick(email) {
        console.log(`Email clicado: ${email}`);
        
        // In real app, send to analytics
        this.showToast('Abrindo cliente de email...', 'info');
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

    // Utility function to pre-fill form for demo
    fillDemoForm() {
        document.getElementById('contactName').value = 'João Silva';
        document.getElementById('contactEmail').value = 'joao.silva@email.com';
        document.getElementById('contactPhone').value = '+244 923 456 789';
        document.getElementById('contactSubject').value = 'sugestao';
        document.getElementById('contactMessage').value = 'Gostaria de sugerir a adição de mais restaurantes de comida tradicional na minha área. Obrigado!';
        document.getElementById('contactPrivacy').checked = true;
        
        this.showToast('Formulário preenchido com dados de demonstração', 'info');
    }
}

// ==================================================
// INICIALIZAÇÃO
// ==================================================

document.addEventListener('DOMContentLoaded', function() {
    window.contactSystem = new ContactSystem();
});

// ==================================================
// FUNÇÕES GLOBAIS PARA DEMONSTRAÇÃO
// ==================================================

// Função para preencher formulário com dados de demo
function fillContactForm() {
    if (window.contactSystem) {
        window.contactSystem.fillDemoForm();
    }
}

// Função para testar diferentes tipos de mensagem
function testContactForm(type = 'suporte') {
    const testData = {
        suporte: {
            name: 'Maria Santos',
            email: 'maria.santos@email.com',
            subject: 'suporte',
            message: 'Preciso de ajuda com um pedido que não chegou. Número do pedido: #DHJ12345'
        },
        reclamacao: {
            name: 'Carlos Mendes',
            email: 'carlos.mendes@email.com',
            subject: 'reclamacao',
            message: 'O entregador chegou atrasado e a comida estava fria. Espero uma solução para esta situação.'
        },
        sugestao: {
            name: 'Ana Pereira',
            email: 'ana.pereira@email.com',
            subject: 'sugestao',
            message: 'Sugiro a implementação de opções de pagamento com MB Net para maior segurança nas transações.'
        }
    };

    const data = testData[type];
    if (data && window.contactSystem) {
        document.getElementById('contactName').value = data.name;
        document.getElementById('contactEmail').value = data.email;
        document.getElementById('contactSubject').value = data.subject;
        document.getElementById('contactMessage').value = data.message;
        document.getElementById('contactPrivacy').checked = true;
        
        window.contactSystem.showToast(`Formulário preenchido para: ${type}`, 'info');
    }
}