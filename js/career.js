// ==================================================
// SISTEMA DE CANDIDATURAS - CARREIRAS
// ==================================================

class CareersSystem {
  constructor() {
    this.jobs = [];
    this.filters = {
      department: "all",
      city: "all",
    };
    this.init();
  }

  init() {
    this.initializeEventListeners();
    this.initializeFormValidation();
    this.loadJobsData();
    console.log(" Sistema de carreiras inicializado");
  }

  initializeEventListeners() {
    // Form submission
    const careerForm = document.getElementById("careerForm");
    if (careerForm) {
      careerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleCareerForm(e);
      });
    }

    // Partnership form
    const partnershipForm = document.getElementById("partnershipForm");
    if (partnershipForm) {
      partnershipForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handlePartnershipForm(e);
      });
    }

    // Department filter
    document.querySelectorAll("[data-department]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.handleDepartmentFilter(e.target);
      });
    });

    // City filter
    document.querySelectorAll("[data-city]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.handleCityFilter(e.target);
      });
    });

    // Job detail modals
    document.querySelectorAll('[data-bs-toggle="modal"]').forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.trackJobView(e.target);
      });
    });

    // Quick apply buttons in modals
    document.addEventListener("click", (e) => {
      if (
        e.target.closest(".btn-danger") &&
        e.target.textContent.includes("Candidate-se")
      ) {
        this.scrollToApplicationForm();
      }
    });
  }

  initializeFormValidation() {
    // Bootstrap form validation
    const forms = document.querySelectorAll(".needs-validation");

    Array.from(forms).forEach((form) => {
      form.addEventListener(
        "submit",
        (event) => {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }

          form.classList.add("was-validated");
        },
        false
      );
    });

    // Real-time validation for phone number
    const phoneInput = document.getElementById("phone");
    if (phoneInput) {
      phoneInput.addEventListener("input", (e) => {
        this.validatePhoneNumber(e.target);
      });
    }

    // CV file validation
    const cvInput = document.getElementById("cvUpload");
    if (cvInput) {
      cvInput.addEventListener("change", (e) => {
        this.validateCVFile(e.target);
      });
    }
  }

  validatePhoneNumber(input) {
    const phone = input.value.replace(/\D/g, "");

    // Basic Angolan phone number validation
    if (phone.length > 0 && !phone.startsWith("244")) {
      if (!phone.startsWith("244") && phone.length >= 9) {
        input.value = "+244 " + phone.slice(-9);
      }
    }

    // Validate length
    if (phone.length > 0 && phone.length < 12) {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
    } else if (phone.length >= 12) {
      input.classList.remove("is-invalid");
      input.classList.add("is-valid");
    } else {
      input.classList.remove("is-invalid", "is-valid");
    }
  }

  validateCVFile(input) {
    const file = input.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["application/pdf"];

    if (file) {
      // Check file type
      if (!allowedTypes.includes(file.type)) {
        input.classList.add("is-invalid");
        this.showToast("Por favor, selecione um arquivo PDF.", "error");
        return;
      }

      // Check file size
      if (file.size > maxSize) {
        input.classList.add("is-invalid");
        this.showToast("O arquivo é muito grande. Máximo 5MB.", "error");
        return;
      }

      input.classList.remove("is-invalid");
      input.classList.add("is-valid");
      this.showToast("CV validado com sucesso!", "success");
    }
  }

  loadJobsData() {
    // Simulated jobs data - in real app, this would come from an API
    this.jobs = [
      {
        id: 1,
        title: "Desenvolvedor Full Stack",
        department: "tecnologia",
        city: "luanda",
        type: "Tempo Integral",
        level: "Sénior",
        published: "2024-12-15",
        featured: true,
        salary: "Competitivo",
        description:
          "Procuramos um desenvolvedor full stack para ajudar a construir e escalar nossa plataforma de cravenow.",
        responsibilities: [
          "Desenvolver e manter features frontend e backend",
          "Colaborar com equipas de produto e design",
          "Otimizar performance e escalabilidade",
          "Implementar testes automatizados",
        ],
        requirements: [
          "3+ anos experiência em desenvolvimento full stack",
          "Conhecimento em JavaScript, React, Node.js",
          "Experiência com bancos de dados SQL e NoSQL",
          "Conhecimento em AWS ou outras clouds",
        ],
        benefits: [
          "Salário competitivo",
          "Plano de saúde",
          "Stock options",
          "Ambiente de trabalho flexível",
          "Formação contínua",
        ],
      },
      {
        id: 2,
        title: "Gestor de Operações",
        department: "operacoes",
        city: "luanda",
        type: "Tempo Integral",
        level: "Sénior",
        published: "2024-12-14",
        featured: false,
        salary: "Atractivo + Bónus",
        description:
          "Responsável por otimizar processos operacionais e garantir a eficiência da cadeia de cravenow.",
        responsibilities: [
          "Gerir equipas de operações",
          "Otimizar processos de delivery",
          "Analisar métricas de performance",
          "Coordenação com restaurantes parceiros",
        ],
        requirements: [
          "5+ anos em gestão de operações",
          "Experiência em logística ou delivery",
          "Conhecimento em análise de dados",
          "Liderança de equipas",
        ],
        benefits: [
          "Salário atrativo",
          "Bónus de performance",
          "Carro da empresa",
          "Plano de saúde familiar",
        ],
      },
      // Add more jobs as needed...
    ];
  }

  handleDepartmentFilter(button) {
    const department = button.getAttribute("data-department");

    // Update active button
    document.querySelectorAll("[data-department]").forEach((btn) => {
      btn.classList.remove("active", "btn-danger");
      btn.classList.add("btn-outline-secondary");
    });

    button.classList.remove("btn-outline-secondary");
    button.classList.add("active", "btn-danger");

    this.filters.department = department;
    this.applyFilters();

    this.showToast(`Filtro: ${this.getDepartmentName(department)}`, "info");
  }

  handleCityFilter(button) {
    const city = button.getAttribute("data-city");

    // Update active button
    document.querySelectorAll("[data-city]").forEach((btn) => {
      btn.classList.remove("active", "btn-primary");
      btn.classList.add("btn-outline-secondary");
    });

    button.classList.remove("btn-outline-secondary");
    button.classList.add("active", "btn-primary");

    this.filters.city = city;
    this.applyFilters();

    this.showToast(`Localização: ${this.getCityName(city)}`, "info");
  }

  applyFilters() {
    const jobCards = document.querySelectorAll(".job-card");
    let visibleCount = 0;

    jobCards.forEach((card) => {
      const department = card.getAttribute("data-department");
      const city = card.getAttribute("data-city");

      const departmentMatch =
        this.filters.department === "all" ||
        department === this.filters.department;
      const cityMatch =
        this.filters.city === "all" || city === this.filters.city;

      if (departmentMatch && cityMatch) {
        card.style.display = "block";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    // Update results count
    this.updateResultsCount(visibleCount);
  }

  updateResultsCount(count) {
    let countElement = document.getElementById("resultsCount");
    if (!countElement) {
      countElement = document.createElement("div");
      countElement.id = "resultsCount";
      countElement.className = "alert alert-info mt-3";
      document.querySelector(".job-listings").appendChild(countElement);
    }

    if (count === 0) {
      countElement.innerHTML = `
                <i class="bi bi-search"></i>
                <strong>Nenhuma vaga encontrada</strong> 
                <p class="mb-0 mt-1">Tente ajustar os filtros ou <a href="#candidatura" class="alert-link">envie uma candidatura espontânea</a>.</p>
            `;
      countElement.style.display = "block";
    } else {
      countElement.innerHTML = `
                <i class="bi bi-check-circle"></i>
                <strong>${count} vaga(s) encontrada(s)</strong>
            `;
      countElement.style.display = "block";
    }
  }

  handleCareerForm(event) {
    const form = event.target;

    if (!form.checkValidity()) {
      this.showToast(
        "Por favor, preencha todos os campos obrigatórios.",
        "warning"
      );
      return;
    }

    const formData = {
      name: document.getElementById("fullName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      position: document.getElementById("position").value,
      coverLetter: document.getElementById("coverLetter").value,
      cv: document.getElementById("cvUpload").files[0]?.name || "Não enviado",
      privacy: document.getElementById("privacyConsent").checked,
      timestamp: new Date().toISOString(),
      applicationId: "DHJ-CAREER-" + Date.now().toString().slice(-6),
    };

    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML =
      '<i class="bi bi-arrow-repeat spinner-border spinner-border-sm"></i> Processando...';
    submitButton.disabled = true;

    // Simulate API call with progress
    this.simulateApplicationSubmission(formData, submitButton, originalText);
  }

  simulateApplicationSubmission(formData, submitButton, originalText) {
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 10;
      submitButton.innerHTML = `<i class="bi bi-arrow-repeat spinner-border spinner-border-sm"></i> Enviando... ${progress}%`;

      if (progress >= 100) {
        clearInterval(progressInterval);
        this.finalizeApplication(formData, submitButton, originalText);
      }
    }, 200);
  }

  finalizeApplication(formData, submitButton, originalText) {
    // Simulate different scenarios
    const successRate = 0.95; // 95% success rate
    const isSuccess = Math.random() < successRate;

    if (isSuccess) {
      this.showApplicationSuccess(formData);
      this.resetForm();
    } else {
      this.showApplicationError();
    }

    // Reset button
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
  }

  showApplicationSuccess(formData) {
    this.showToast("Candidatura enviada com sucesso!", "success");

    // Show confirmation modal
    const modalHTML = `
            <div class="modal fade" id="applicationSuccessModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-check-circle-fill me-2"></i>
                                Candidatura Enviada!
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body text-center py-4">
                            <i class="bi bi-person-check display-1 text-success mb-3"></i>
                            <h4 class="fw-bold text-success">Obrigado, ${
                              formData.name
                            }!</h4>
                            <p class="text-muted">
                                Sua candidatura para <strong>${this.getPositionName(
                                  formData.position
                                )}</strong> 
                                foi recebida com sucesso.
                            </p>
                            
                            <div class="alert alert-success mt-3">
                                <i class="bi bi-info-circle"></i>
                                <strong>Número da candidatura:</strong> ${
                                  formData.applicationId
                                }
                            </div>
                            
                            <div class="mt-4">
                                <h6>Próximos Passos:</h6>
                                <div class="timeline-simple">
                                    <div class="timeline-item">
                                        <i class="bi bi-check-circle text-success"></i>
                                        <span>Candidatura Recebida</span>
                                    </div>
                                    <div class="timeline-item">
                                        <i class="bi bi-clock text-warning"></i>
                                        <span>Análise Curricular (2-3 dias)</span>
                                    </div>
                                    <div class="timeline-item">
                                        <i class="bi bi-envelope text-muted"></i>
                                        <span>Contacto da nossa equipa</span>
                                    </div>
                                </div>
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

    if (!document.getElementById("applicationSuccessModal")) {
      document.body.insertAdjacentHTML("beforeend", modalHTML);
    }

    const modal = new bootstrap.Modal(
      document.getElementById("applicationSuccessModal")
    );
    modal.show();
  }

  showApplicationError() {
    this.showToast("Erro ao enviar candidatura. Tente novamente.", "error");

    const errorHTML = `
            <div class="alert alert-danger alert-dismissible fade show mt-3" role="alert">
                <h6 class="alert-heading">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                    Erro no envio
                </h6>
                <p class="mb-2">Sugestões:</p>
                <ul class="mb-2">
                    <li>Verifique sua conexão com a internet</li>
                    <li>Certifique-se de que o CV é um PDF até 5MB</li>
                    <li>Tente enviar novamente em alguns minutos</li>
                    <li>Entre em contacto por email se o problema persistir</li>
                </ul>
                <div class="d-flex gap-2">
                    <a href="mailto:carreiras@CraveNow.com" class="btn btn-sm btn-primary">
                        <i class="bi bi-envelope me-1"></i> Email
                    </a>
                    <button class="btn btn-sm btn-outline-danger" onclick="careersSystem.retryApplication()">
                        <i class="bi bi-arrow-repeat me-1"></i> Tentar Novamente
                    </button>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;

    const form = document.getElementById("careerForm");
    if (!form.querySelector(".alert-danger")) {
      form.insertAdjacentHTML("beforeend", errorHTML);
    }
  }

  handlePartnershipForm(event) {
    const form = event.target;

    if (!form.checkValidity()) {
      this.showToast(
        "Por favor, preencha todos os campos obrigatórios.",
        "warning"
      );
      return;
    }

    const formData = {
      restaurantName: document.getElementById("restaurantName").value,
      email: document.getElementById("partnerEmail").value,
      phone: document.getElementById("partnerPhone").value,
      city: document.getElementById("partnerCity").value,
      message: document.getElementById("partnerMessage").value,
      timestamp: new Date().toISOString(),
      partnershipId: "DHJ-PARTNER-" + Date.now().toString().slice(-6),
    };

    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML =
      '<i class="bi bi-arrow-repeat spinner-border spinner-border-sm"></i> A processar...';
    submitButton.disabled = true;

    // Simulate API call
    setTimeout(() => {
      this.simulatePartnershipSubmission(formData, submitButton, originalText);
    }, 2000);
  }

  simulatePartnershipSubmission(formData, submitButton, originalText) {
    console.log("Dados da parceria:", formData);

    // Simulate success
    this.showPartnershipSuccess(formData);
    this.resetPartnershipForm();

    // Reset button
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
  }

  showPartnershipSuccess(formData) {
    this.showToast("Solicitação de parceria enviada com sucesso!", "success");

    const modalHTML = `
            <div class="modal fade" id="partnershipSuccessModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-handshake-fill me-2"></i>
                                Solicitação Enviada!
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body text-center py-4">
                            <i class="bi bi-building display-1 text-primary mb-3"></i>
                            <h4 class="fw-bold text-primary">Obrigado pelo seu interesse!</h4>
                            <p class="text-muted">
                                Sua solicitação de parceria para <strong>${formData.restaurantName}</strong> 
                                foi recebida. Nossa equipa de parcerias entrará em contacto em até 48 horas.
                            </p>
                            
                            <div class="alert alert-info mt-3">
                                <i class="bi bi-info-circle"></i>
                                <strong>Número do protocolo:</strong> ${formData.partnershipId}
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary w-100" data-bs-dismiss="modal">
                                <i class="bi bi-check-lg me-2"></i>
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

    if (!document.getElementById("partnershipSuccessModal")) {
      document.body.insertAdjacentHTML("beforeend", modalHTML);
    }

    const modal = new bootstrap.Modal(
      document.getElementById("partnershipSuccessModal")
    );
    modal.show();
  }

  resetForm() {
    const form = document.getElementById("careerForm");
    if (form) {
      form.reset();
      form.classList.remove("was-validated");

      // Remove validation classes
      form.querySelectorAll(".is-valid, .is-invalid").forEach((el) => {
        el.classList.remove("is-valid", "is-invalid");
      });
    }
  }

  resetPartnershipForm() {
    const form = document.getElementById("partnershipForm");
    if (form) {
      form.reset();
      form.classList.remove("was-validated");
    }
  }

  trackJobView(button) {
    const jobTitle = button
      .closest(".job-card")
      .querySelector("h5").textContent;
    console.log(`Vaga visualizada: ${jobTitle}`);

    // In real app, send to analytics
    this.showToast(`Abrindo detalhes da vaga: ${jobTitle}`, "info");
  }

  scrollToApplicationForm() {
    const formSection = document.getElementById("candidatura");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" });
      this.showToast("Preencha o formulário abaixo para se candidatar", "info");
    }
  }

  retryApplication() {
    this.showToast("Tentando enviar novamente...", "info");
    // In real app, this would retry the API call
    setTimeout(() => {
      this.showApplicationSuccess({
        name: document.getElementById("fullName").value,
        position: document.getElementById("position").value,
        applicationId: "DHJ-CAREER-" + Date.now().toString().slice(-6),
      });
    }, 1500);
  }

  // Utility methods
  getDepartmentName(department) {
    const departments = {
      all: "Todos os Departamentos",
      tecnologia: "Tecnologia",
      operacoes: "Operações",
      marketing: "Marketing",
      suporte: "Suporte",
      entregas: "Entregas",
    };
    return departments[department] || department;
  }

  getCityName(city) {
    const cities = {
      all: "Todas as Cidades",
      luanda: "Luanda",
      huambo: "Huambo",
      lobito: "Lobito",
      benguela: "Benguela",
      lubango: "Lubango",
    };
    return cities[city] || city;
  }

  getPositionName(position) {
    const positions = {
      "desenvolvedor-fullstack": "Desenvolvedor Full Stack",
      "gestor-operacoes": "Gestor de Operações",
      "marketing-digital": "Especialista em Marketing Digital",
      "coordenador-entregas": "Coordenador de Entregas",
      "suporte-cliente": "Agente de Suporte ao Cliente",
    };
    return positions[position] || position;
  }

  showToast(message, type = "info") {
    // Create toast container if it doesn't exist
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

  // Demo functions
  fillDemoApplication() {
    document.getElementById("fullName").value = "João Silva";
    document.getElementById("email").value = "joao.silva@email.com";
    document.getElementById("phone").value = "+244 923 456 789";
    document.getElementById("position").value = "desenvolvedor-fullstack";
    document.getElementById("coverLetter").value =
      "Tenho 4 anos de experiência em desenvolvimento full stack e estou muito interessado em fazer parte da equipa CraveNow. Admiro o trabalho de vocês em revolucionar o delivery em Angola e gostaria de contribuir com minhas habilidades técnicas.";
    document.getElementById("privacyConsent").checked = true;

    this.showToast("Formulário preenchido com dados de demonstração", "info");
  }

  fillDemoPartnership() {
    document.getElementById("restaurantName").value = "Sabores Tradicionais";
    document.getElementById("partnerEmail").value =
      "geral@saborestradicionais.com";
    document.getElementById("partnerPhone").value = "+244 922 123 456";
    document.getElementById("partnerCity").value = "luanda";
    document.getElementById("partnerMessage").value =
      "Gostaríamos de fazer parte da vossa rede de parceiros. Temos um restaurante especializado em comida tradicional angolana com excelentes avaliações.";

    this.showToast(
      "Formulário de parceria preenchido com dados de demonstração",
      "info"
    );
  }
}

// ==================================================
// INICIALIZAÇÃO
// ==================================================

document.addEventListener("DOMContentLoaded", function () {
  window.careersSystem = new CareersSystem();
});

// ==================================================
// FUNÇÕES GLOBAIS PARA DEMONSTRAÇÃO
// ==================================================

// Preencher formulário de candidatura com dados demo
function fillDemoApplication() {
  if (window.careersSystem) {
    window.careersSystem.fillDemoApplication();
  }
}

// Preencher formulário de parceria com dados demo
function fillDemoPartnership() {
  if (window.careersSystem) {
    window.careersSystem.fillDemoPartnership();
  }
}

// Testar diferentes tipos de candidatura
function testApplication(type = "desenvolvedor") {
  const testData = {
    desenvolvedor: {
      name: "Ana Pereira",
      email: "ana.pereira@email.com",
      position: "desenvolvedor-fullstack",
      coverLetter:
        "Sou desenvolvedora full stack com experiência em React, Node.js e AWS. Tenho trabalhado em aplicações de grande escala e estou animada com a oportunidade de contribuir para a plataforma CraveNow.",
    },
    marketing: {
      name: "Carlos Santos",
      email: "carlos.santos@email.com",
      position: "marketing-digital",
      coverLetter:
        "Com 5 anos de experiência em marketing digital, especializei-me em growth hacking e aquisição de utilizadores. Gostaria de aplicar minhas habilidades para expandir a base de clientes da CraveNow.",
    },
    operacoes: {
      name: "Maria Fernandes",
      email: "maria.fernandes@email.com",
      position: "gestor-operacoes",
      coverLetter:
        "Tenho vasta experiência em gestão de operações logísticas e otimização de processos. Acredito que posso contribuir significativamente para melhorar a eficiência da cadeia de cravenow.",
    },
  };

  const data = testData[type];
  if (data && window.careersSystem) {
    document.getElementById("fullName").value = data.name;
    document.getElementById("email").value = data.email;
    document.getElementById("position").value = data.position;
    document.getElementById("coverLetter").value = data.coverLetter;
    document.getElementById("privacyConsent").checked = true;

    window.careersSystem.showToast(`Candidatura demo: ${type}`, "info");
  }
}
