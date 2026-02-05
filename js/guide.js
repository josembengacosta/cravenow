// ==================================================
// SISTEMA DE GUIA INTERATIVO - CraveNow
// ==================================================

class GuideSystem {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 4;
    this.completedSteps = new Set();
    this.init();
  }

  init() {
    // Aguardar o DOM estar completamente carregado antes de inicializar
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        this.initializeEventListeners();
        this.initializeStepSystem();
      });
    } else {
      this.initializeEventListeners();
      this.initializeStepSystem();
    }
    console.log(" Sistema de guia interativo inicializado");
  }

  initializeEventListeners() {
    // Configurar event listeners para os passos interativos
    const interactiveSteps = document.querySelectorAll(".interactive-step");
    if (interactiveSteps.length > 0) {
      interactiveSteps.forEach((step) => {
        step.addEventListener("click", (e) => {
          const stepNumber = parseInt(
            e.currentTarget.getAttribute("data-step")
          );
          this.goToStep(stepNumber);
        });
      });
    }

    // Configurar botões de navegação (Anterior/Próximo)
    const prevButton = document.getElementById("prevStep");
    const nextButton = document.getElementById("nextStep");

    if (prevButton) {
      prevButton.addEventListener("click", () => {
        this.previousStep();
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", () => {
        this.nextStep();
      });
    }

    // Detectar cliques nos botões de marcar passo como completo
    document.addEventListener("click", (e) => {
      const target = e.target.closest('[onclick*="markStepComplete"]');
      if (target) {
        const onclickContent = target.getAttribute("onclick");
        const stepMatch = onclickContent.match(/markStepComplete\((\d+)\)/);
        if (stepMatch) {
          const step = parseInt(stepMatch[1]);
          this.markStepComplete(step);
        }
      }
    });

    // Configurar botões de ação (Experimentar Busca, Simular Pedido, etc.)
    this.setupActionButtons();
  }

  setupActionButtons() {
    // Botão "Experimentar Busca" - Passo 1
    document.addEventListener("click", (e) => {
      if (e.target.closest("[onclick*=\"guideSystem.tryStep('search')\"]")) {
        this.showSearchDemoModal();
      }
    });

    // Botão "Simular Pedido" - Passo 2
    document.addEventListener("click", (e) => {
      if (e.target.closest("[onclick*=\"guideSystem.tryStep('customize')\"]")) {
        this.showOrderDemoModal();
      }
    });

    // Botão "Ver Métodos" - Passo 3
    document.addEventListener("click", (e) => {
      if (e.target.closest("[onclick*=\"guideSystem.tryStep('payment')\"]")) {
        this.showPaymentDemoModal();
      }
    });

    // Botão "Simular Rastreamento" - Passo 4
    document.addEventListener("click", (e) => {
      if (e.target.closest("[onclick*=\"guideSystem.tryStep('tracking')\"]")) {
        this.showTrackingDemoModal();
      }
    });
  }

  initializeStepSystem() {
    this.updateProgress();
    this.updateStepDisplay();
    this.updateNavigation();
    this.updateStepCounter();
  }

  updateStepDisplay() {
    // Garantir que apenas o passo atual esteja ativo nos cards detalhados
    document.querySelectorAll(".guide-step-card").forEach((step) => {
      step.classList.remove("active");
    });

    const currentStepElement = document.getElementById(
      `step${this.currentStep}`
    );
    if (currentStepElement) {
      currentStepElement.classList.add("active");
    }

    // Atualizar steps interativos (círculos no topo)
    document.querySelectorAll(".interactive-step").forEach((step) => {
      step.classList.remove("active");
      if (parseInt(step.getAttribute("data-step")) === this.currentStep) {
        step.classList.add("active");
      }
    });
  }

  goToStep(stepNumber) {
    // Validar se o passo existe
    if (stepNumber < 1 || stepNumber > this.totalSteps) {
      console.error(`Passo ${stepNumber} inválido`);
      return;
    }

    this.currentStep = stepNumber;
    this.updateStepDisplay();
    this.updateStepDemo(stepNumber);
    this.updateNavigation();
    this.updateStepCounter();

    this.trackEvent("step_view", { step: stepNumber });
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.goToStep(this.currentStep - 1);
    }
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.goToStep(this.currentStep + 1);
    } else {
      this.completeTutorial();
    }
  }

  updateStepDemo(stepNumber) {
    const demoElement = document.getElementById("stepDemo");
    if (!demoElement) return;

    // Conteúdo demonstrativo para cada passo
    const demos = {
      1: this.getStep1Demo(),
      2: this.getStep2Demo(),
      3: this.getStep3Demo(),
      4: this.getStep4Demo(),
    };

    demoElement.innerHTML =
      demos[stepNumber] || this.getDefaultDemo(stepNumber);
  }

  getStep1Demo() {
    return `
            <div class="text-center">
                <i class="bi bi-search display-1 text-primary mb-3"></i>
                <h5 class="fw-bold text-primary">Encontrar Restaurantes</h5>
                <p class="text-muted">Busque por nome, tipo de comida ou use nossa localização automática</p>
                <div class="mt-3">
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" placeholder="Buscar restaurantes..." readonly>
                        <button class="btn btn-primary" type="button">
                            <i class="bi bi-search"></i>
                        </button>
                    </div>
                    <div class="d-flex flex-wrap gap-2 justify-content-center">
                        <span class="badge bg-light text-dark">Pizza</span>
                        <span class="badge bg-light text-dark">Hambúrguer</span>
                        <span class="badge bg-light text-dark">Tradicional</span>
                        <span class="badge bg-light text-dark">Saudável</span>
                    </div>
                </div>
            </div>
        `;
  }

  getStep2Demo() {
    return `
            <div class="text-center">
                <i class="bi bi-basket display-1 text-success mb-3"></i>
                <h5 class="fw-bold text-success">Montar Seu Pedido</h5>
                <p class="text-muted">Adicione itens ao carrinho e personalize conforme preferir</p>
                <div class="mt-3">
                    <div class="card border-0 bg-light">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span>Pizza Margherita</span>
                                <span class="fw-bold">2.500 Kz</span>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span>Refrigerante</span>
                                <span class="fw-bold">500 Kz</span>
                            </div>
                            <div class="d-flex justify-content-between align-items-center">
                                <small class="text-muted">Taxa de entrega</small>
                                <span class="fw-bold">300 Kz</span>
                            </div>
                            <hr>
                            <div class="d-flex justify-content-between align-items-center fw-bold">
                                <span>Total</span>
                                <span>3.300 Kz</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
  }

  getStep3Demo() {
    return `
            <div class="text-center">
                <i class="bi bi-credit-card display-1 text-warning mb-3"></i>
                <h5 class="fw-bold text-warning">Escolher Pagamento</h5>
                <p class="text-muted">Selecione a forma de pagamento mais conveniente para você</p>
                <div class="mt-3">
                    <div class="row g-2">
                        <div class="col-6">
                            <div class="card border-primary text-center p-2">
                                <i class="bi bi-phone text-primary fs-4"></i>
                                <small>Multicaixa Express</small>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="card border-success text-center p-2">
                                <i class="bi bi-credit-card text-success fs-4"></i>
                                <small>Cartão</small>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="card border-info text-center p-2">
                                <i class="bi bi-cash text-info fs-4"></i>
                                <small>Dinheiro</small>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="card border-warning text-center p-2">
                                <i class="bi bi-wallet2 text-warning fs-4"></i>
                                <small>Carteira</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
  }

  getStep4Demo() {
    return `
            <div class="text-center">
                <i class="bi bi-truck display-1 text-info mb-3"></i>
                <h5 class="fw-bold text-info">Acompanhar Entrega</h5>
                <p class="text-muted">Acompanhe seu pedido em tempo real desde a saída até sua casa</p>
                <div class="mt-3">
                    <div class="progress mb-3" style="height: 8px;">
                        <div class="progress-bar bg-info" role="progressbar" style="width: 60%"></div>
                    </div>
                    <div class="d-flex justify-content-between small text-muted mb-4">
                        <span>Preparação</span>
                        <span>A caminho</span>
                        <span>Entregue</span>
                    </div>
                    <div class="mt-3">
                        <i class="bi bi-geo-alt text-danger me-2"></i>
                        <small class="text-muted">Entregador a 5min de distância</small>
                    </div>
                </div>
            </div>
        `;
  }

  getDefaultDemo(stepNumber) {
    return `
            <i class="bi bi-phone display-1 text-muted mb-3"></i>
            <h5 class="text-muted">Demonstração do Passo ${stepNumber}</h5>
            <p class="text-muted">Visualização interativa em desenvolvimento</p>
        `;
  }

  updateNavigation() {
    const prevButton = document.getElementById("prevStep");
    const nextButton = document.getElementById("nextStep");

    if (!prevButton || !nextButton) return;

    // Atualizar estado do botão Anterior
    prevButton.disabled = this.currentStep === 1;

    // Atualizar botão Próximo/Finalizar
    if (this.currentStep === this.totalSteps) {
      nextButton.innerHTML = 'Finalizar <i class="bi bi-check-lg"></i>';
      nextButton.classList.remove("btn-danger");
      nextButton.classList.add("btn-success");
    } else {
      nextButton.innerHTML = 'Próximo <i class="bi bi-arrow-right"></i>';
      nextButton.classList.remove("btn-success");
      nextButton.classList.add("btn-danger");
    }
  }

  updateStepCounter() {
    const stepCounter = document.getElementById("stepCounter");
    if (stepCounter) {
      stepCounter.textContent = `Passo ${this.currentStep} de ${this.totalSteps}`;
    }
  }

  updateProgress() {
    const progress = (this.completedSteps.size / this.totalSteps) * 100;
    const progressBar = document.getElementById("guideProgress");
    const progressText = document.getElementById("progressText");

    if (progressBar) {
      progressBar.style.width = `${progress}%`;

      // Mudar cor da barra de progresso quando completar 100%
      if (progress === 100) {
        progressBar.classList.remove("bg-white");
        progressBar.classList.add("bg-warning");
      } else {
        progressBar.classList.remove("bg-warning");
        progressBar.classList.add("bg-white");
      }
    }

    if (progressText) {
      progressText.textContent = `${Math.round(progress)}% Completo`;
    }
  }

  markStepComplete(stepNumber) {
    // Adicionar passo aos completos
    this.completedSteps.add(stepNumber);

    // Atualizar visual do passo interativo
    const stepElement = document.querySelector(
      `.interactive-step[data-step="${stepNumber}"]`
    );
    if (stepElement) {
      stepElement.style.borderColor = "#28a745";

      // Remover ícone de check existente se houver
      const existingIcon = stepElement.querySelector(".bi-check-circle-fill");
      if (existingIcon) {
        existingIcon.remove();
      }

      // Adicionar ícone de check
      const checkIcon = document.createElement("i");
      checkIcon.className =
        "bi bi-check-circle-fill text-success position-absolute";
      checkIcon.style.top = "10px";
      checkIcon.style.right = "10px";
      checkIcon.style.fontSize = "1.2rem";
      stepElement.style.position = "relative";
      stepElement.appendChild(checkIcon);
    }

    this.updateProgress();
    this.showToast(` Passo ${stepNumber} concluído!`, "success");

    // Avançar automaticamente se não for o último passo
    if (stepNumber < this.totalSteps) {
      setTimeout(() => {
        this.nextStep();
      }, 1000);
    } else {
      // Se for o último passo, mostrar modal de conclusão
      setTimeout(() => {
        this.completeTutorial();
      }, 1000);
    }

    this.trackEvent("step_complete", { step: stepNumber });
  }

  startInteractiveTutorial() {
    this.showToast("🎬 Iniciando tutorial interativo...", "info");
    this.goToStep(1);

    // Scroll suave para a seção do tutorial
    const guideContainer = document.querySelector(
      ".interactive-guide-container"
    );
    if (guideContainer) {
      guideContainer.scrollIntoView({
        behavior: "smooth",
      });
    }

    this.trackEvent("tutorial_start", {});
  }

  completeTutorial() {
    // Garantir que o último passo seja marcado como completo
    this.completedSteps.add(this.totalSteps);
    this.updateProgress();

    // Mostrar modal de conclusão
    this.showCompletionModal();
    this.trackEvent("tutorial_complete", {});
  }

  showCompletionModal() {
    // Verificar se Bootstrap está disponível
    if (typeof bootstrap === "undefined") {
      console.error("❌ Bootstrap não carregado!");
      this.showToast(
        "Erro: Bootstrap não está carregado corretamente",
        "error"
      );
      return;
    }

    let modalElement = document.getElementById("completionModal");

    // Criar modal se não existir
    if (!modalElement) {
      const modalHTML = `
                <div class="modal fade" id="completionModal" tabindex="-1" aria-labelledby="completionModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header bg-success text-white">
                                <h5 class="modal-title" id="completionModalLabel">
                                    <i class="bi bi-trophy me-2"></i>
                                    Tutorial Concluído!
                                </h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Fechar"></button>
                            </div>
                            <div class="modal-body text-center py-4">
                                <i class="bi bi-check-circle display-1 text-success mb-3"></i>
                                <h4 class="fw-bold text-success">Parabéns! 🎉</h4>
                                <p class="text-muted mb-3">
                                    Você completou com sucesso o tutorial de como fazer pedidos na CraveNow.
                                </p>
                                <div class="alert alert-info">
                                    <i class="bi bi-lightbulb"></i>
                                    <strong>Pronto para começar?</strong> 
                                    <a href="../restaurant.html" class="alert-link">Faça seu primeiro pedido agora!</a>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-success w-100" data-bs-dismiss="modal">
                                    <i class="bi bi-bag-check me-2"></i>
                                    Fazer Meu Primeiro Pedido
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

      document.body.insertAdjacentHTML("beforeend", modalHTML);
      modalElement = document.getElementById("completionModal");
    }

    // Inicializar e mostrar o modal
    try {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();

      // Adicionar evento para quando o modal for fechado
      modalElement.addEventListener("hidden.bs.modal", () => {
        console.log(" Modal de conclusão fechado");
      });
    } catch (error) {
      console.error("❌ Erro ao abrir modal:", error);
      this.showToast("Erro ao abrir modal de conclusão", "error");
    }
  }

  // ==================================================
  // MODAIS DEMONSTRATIVOS PARA CADA FUNÇÃO
  // ==================================================

  showSearchDemoModal() {
    this.showDemoModal(
      "Buscar Restaurantes - Demonstração",
      `
            <div class="text-center">
                <i class="bi bi-search display-1 text-primary mb-3"></i>
                <h5 class="fw-bold text-primary">Como Buscar Restaurantes</h5>
                <p class="text-muted">Encontre os melhores restaurantes perto de você</p>
                
                <div class="demo-content mt-4">
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" placeholder="Ex: Pizza, Hambúrguer, Tradicional...">
                        <button class="btn btn-primary">
                            <i class="bi bi-search"></i> Buscar
                        </button>
                    </div>
                    
                    <div class="filters-demo">
                        <h6 class="fw-bold mb-3">Filtros Disponíveis:</h6>
                        <div class="row g-2">
                            <div class="col-6">
                                <div class="card border-0 bg-light p-2 text-center">
                                    <i class="bi bi-star text-warning"></i>
                                    <small>Avaliação 4+</small>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="card border-0 bg-light p-2 text-center">
                                    <i class="bi bi-clock text-primary"></i>
                                    <small>Entrega Rápida</small>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="card border-0 bg-light p-2 text-center">
                                    <i class="bi bi-coin text-success"></i>
                                    <small>Preço Baixo</small>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="card border-0 bg-light p-2 text-center">
                                    <i class="bi bi-truck text-info"></i>
                                    <small>Grátis</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `,
      "primary"
    );
  }

  showOrderDemoModal() {
    this.showDemoModal(
      "Montar Pedido - Demonstração",
      `
            <div class="text-center">
                <i class="bi bi-basket display-1 text-success mb-3"></i>
                <h5 class="fw-bold text-success">Simulador de Pedido</h5>
                <p class="text-muted">Veja como personalizar seu pedido</p>
                
                <div class="demo-content mt-4">
                    <div class="card mb-3">
                        <div class="card-body">
                            <h6 class="fw-bold">Pizza Margherita</h6>
                            <div class="row align-items-center">
                                <div class="col-4">
                                    <span class="fw-bold text-success">2.500 Kz</span>
                                </div>
                                <div class="col-4">
                                    <div class="input-group input-group-sm">
                                        <button class="btn btn-outline-secondary">-</button>
                                        <input type="text" class="form-control text-center" value="1" readonly>
                                        <button class="btn btn-outline-secondary">+</button>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <button class="btn btn-outline-danger btn-sm">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="personalization-options">
                        <h6 class="fw-bold mb-3">Personalizar:</h6>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="extraCheese">
                            <label class="form-check-label" for="extraCheese">
                                Queijo Extra (+200 Kz)
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="spicy">
                            <label class="form-check-label" for="spicy">
                                Pimenta Extra
                            </label>
                        </div>
                        
                        <div class="mt-3">
                            <textarea class="form-control" rows="2" placeholder="Observações especiais..."></textarea>
                        </div>
                    </div>
                </div>
            </div>
            `,
      "success"
    );
  }

  showPaymentDemoModal() {
    this.showDemoModal(
      "Métodos de Pagamento - Demonstração",
      `
            <div class="text-center">
                <i class="bi bi-credit-card display-1 text-warning mb-3"></i>
                <h5 class="fw-bold text-warning">Escolha sua Forma de Pagamento</h5>
                <p class="text-muted">Selecione o método mais conveniente para você</p>
                
                <div class="demo-content mt-4">
                    <div class="row g-3">
                        <div class="col-6">
                            <div class="card payment-option border-primary h-100 text-center p-3">
                                <i class="bi bi-phone text-primary display-6 mb-2"></i>
                                <h6 class="fw-bold">Multicaixa Express</h6>
                                <small class="text-muted">Pagamento rápido por referência</small>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="card payment-option border-success h-100 text-center p-3">
                                <i class="bi bi-credit-card text-success display-6 mb-2"></i>
                                <h6 class="fw-bold">Cartão</h6>
                                <small class="text-muted">Crédito/Débito seguro</small>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="card payment-option border-info h-100 text-center p-3">
                                <i class="bi bi-cash text-info display-6 mb-2"></i>
                                <h6 class="fw-bold">Dinheiro</h6>
                                <small class="text-muted">Pague na entrega</small>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="card payment-option border-warning h-100 text-center p-3">
                                <i class="bi bi-wallet2 text-warning display-6 mb-2"></i>
                                <h6 class="fw-bold">Carteira Digital</h6>
                                <small class="text-muted">Saldo CraveNow</small>
                            </div>
                        </div>
                    </div>
                    
                    <div class="security-info mt-4 p-3 bg-light rounded">
                        <i class="bi bi-shield-check text-success me-2"></i>
                        <small class="text-muted">Todos os pagamentos são 100% seguros</small>
                    </div>
                </div>
            </div>
            `,
      "warning"
    );
  }

  showTrackingDemoModal() {
    this.showDemoModal(
      "Acompanhar Entrega - Demonstração",
      `
            <div class="text-center">
                <i class="bi bi-truck display-1 text-info mb-3"></i>
                <h5 class="fw-bold text-info">Rastreamento em Tempo Real</h5>
                <p class="text-muted">Acompanhe seu pedido a cada momento</p>
                
                <div class="demo-content mt-4">
                    <!-- Timeline de entrega -->
                    <div class="delivery-timeline mb-4">
                        <div class="timeline-progress mb-3">
                            <div class="progress" style="height: 8px;">
                                <div class="progress-bar bg-info" style="width: 60%"></div>
                            </div>
                        </div>
                        <div class="timeline-steps d-flex justify-content-between">
                            <div class="step completed text-center">
                                <div class="step-icon bg-success text-white rounded-circle mx-auto mb-1" style="width: 30px; height: 30px; line-height: 30px;">
                                    <i class="bi bi-check"></i>
                                </div>
                                <small>Confirmado</small>
                            </div>
                            <div class="step completed text-center">
                                <div class="step-icon bg-success text-white rounded-circle mx-auto mb-1" style="width: 30px; height: 30px; line-height: 30px;">
                                    <i class="bi bi-check"></i>
                                </div>
                                <small>Preparação</small>
                            </div>
                            <div class="step active text-center">
                                <div class="step-icon bg-info text-white rounded-circle mx-auto mb-1" style="width: 30px; height: 30px; line-height: 30px;">
                                    <i class="bi bi-truck"></i>
                                </div>
                                <small>A caminho</small>
                            </div>
                            <div class="step text-center">
                                <div class="step-icon bg-secondary text-white rounded-circle mx-auto mb-1" style="width: 30px; height: 30px; line-height: 30px;">
                                    <i class="bi bi-house"></i>
                                </div>
                                <small>Entregue</small>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Informações do entregador -->
                    <div class="delivery-info card border-0 bg-light">
                        <div class="card-body">
                            <div class="row align-items-center">
                                <div class="col-8">
                                    <h6 class="fw-bold mb-1">João Silva</h6>
                                    <small class="text-muted">Entregador</small>
                                    <div class="mt-2">
                                        <i class="bi bi-geo-alt text-danger me-1"></i>
                                        <small class="text-muted">A 1.2km • 5-7 min</small>
                                    </div>
                                </div>
                                <div class="col-4 text-end">
                                    <button class="btn btn-outline-primary btn-sm">
                                        <i class="bi bi-telephone"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="estimated-time mt-3 p-2 bg-warning text-dark rounded">
                        <i class="bi bi-clock me-2"></i>
                        <strong>Tempo estimado:</strong> 5-7 minutos
                    </div>
                </div>
            </div>
            `,
      "info"
    );
  }

  showDemoModal(title, content, type = "primary") {
    const modalId = "demoModal";
    let modalElement = document.getElementById(modalId);

    // Criar modal demonstrativo se não existir
    if (!modalElement) {
      const modalHTML = `
                <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header bg-${type} text-white">
                                <h5 class="modal-title" id="${modalId}Label">${title}</h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Fechar"></button>
                            </div>
                            <div class="modal-body">
                                ${content}
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-${type} w-100" data-bs-dismiss="modal">
                                    <i class="bi bi-check-lg me-2"></i>
                                    Entendi, Obrigado!
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

      document.body.insertAdjacentHTML("beforeend", modalHTML);
      modalElement = document.getElementById(modalId);
    } else {
      // Atualizar conteúdo do modal existente
      modalElement.querySelector(".modal-title").textContent = title;
      modalElement.querySelector(".modal-body").innerHTML = content;
      modalElement.querySelector(
        ".modal-header"
      ).className = `modal-header bg-${type} text-white`;
      modalElement.querySelector(
        ".modal-footer .btn"
      ).className = `btn btn-${type} w-100`;
    }

    // Mostrar o modal
    try {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } catch (error) {
      console.error("❌ Erro ao abrir modal demonstrativo:", error);
      this.showToast("Erro ao abrir demonstração", "error");
    }
  }

  tryStep(stepType) {
    // Esta função agora é tratada pelos event listeners específicos
    // Mantida para compatibilidade com cliques diretos
    const actions = {
      search: () => this.showSearchDemoModal(),
      customize: () => this.showOrderDemoModal(),
      payment: () => this.showPaymentDemoModal(),
      tracking: () => this.showTrackingDemoModal(),
    };

    if (actions[stepType]) {
      actions[stepType]();
    }

    this.trackEvent("step_try", { step_type: stepType });
  }

  downloadGuidePDF() {
    this.showToast("📥 Preparando download do guia em PDF...", "info");

    // Simular processo de download
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      this.showToast(`Download: ${progress}%`, "info");

      if (progress >= 100) {
        clearInterval(interval);
        this.showToast(" Guia baixado com sucesso!", "success");

        // Mensagem adicional
        setTimeout(() => {
          this.showToast("📁 Verifique sua pasta de downloads", "info");
        }, 1000);
      }
    }, 300);

    this.trackEvent("guide_download", {});
  }

  trackEvent(eventName, properties) {
    // Em aplicação real, enviaria para analytics (Google Analytics, etc.)
    console.log(`📊 Guide Event: ${eventName}`, properties);
  }

  showToast(message, type = "info") {
    let toastContainer = document.getElementById("toastContainer");
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.id = "toastContainer";
      toastContainer.className =
        "toast-container position-fixed top-0 end-0 p-3";
      toastContainer.style.zIndex = "1090";
      document.body.appendChild(toastContainer);
    }

    const toastId = "toast-" + Date.now();
    const typeClass = type === "error" ? "danger" : type;
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

    toastContainer.insertAdjacentHTML("beforeend", toastHTML);

    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, {
      autohide: true,
      delay: 4000,
    });

    toast.show();

    // Remover toast do DOM quando esconder
    toastElement.addEventListener("hidden.bs.toast", () => {
      toastElement.remove();
    });
  }

  getToastIcon(type) {
    const icons = {
      success: "bi-check-circle-fill",
      error: "bi-x-circle-fill",
      warning: "bi-exclamation-triangle-fill",
      info: "bi-info-circle-fill",
    };
    return icons[type] || "bi-info-circle-fill";
  }

  // Função para testar passos específicos (debug)
  testStep(stepNumber) {
    this.goToStep(stepNumber);
  }

  // Reiniciar progresso do tutorial
  resetTutorial() {
    this.currentStep = 1;
    this.completedSteps.clear();

    // Remover ícones de check
    document
      .querySelectorAll(".interactive-step .bi-check-circle-fill")
      .forEach((icon) => {
        icon.remove();
      });

    // Resetar estilos dos passos
    document.querySelectorAll(".interactive-step").forEach((step) => {
      step.style.borderColor = "";
    });

    // Re-inicializar sistema
    this.initializeStepSystem();
    this.showToast("🔄 Tutorial reiniciado!", "info");
  }
}

// ==================================================
// INICIALIZAÇÃO DO SISTEMA
// ==================================================

document.addEventListener("DOMContentLoaded", function () {
  window.guideSystem = new GuideSystem();
  console.log(" Guide System carregado com sucesso!");
});

// ==================================================
// FUNÇÕES GLOBAIS PARA USO NO HTML
// ==================================================

// Testar passo específico (para debugging)
function testStep(stepNumber = 1) {
  if (window.guideSystem) {
    window.guideSystem.testStep(stepNumber);
  }
}

// Reiniciar tutorial
function resetTutorial() {
  if (window.guideSystem) {
    window.guideSystem.resetTutorial();
  }
}

// Iniciar tutorial do início
function startTutorial() {
  if (window.guideSystem) {
    window.guideSystem.startInteractiveTutorial();
  }
}

// Função global para marcar passo como completo
function markStepComplete(stepNumber) {
  if (window.guideSystem) {
    window.guideSystem.markStepComplete(stepNumber);
  }
}

// Função global para testar demonstrações
function tryStep(stepType) {
  if (window.guideSystem) {
    window.guideSystem.tryStep(stepType);
  }
}
