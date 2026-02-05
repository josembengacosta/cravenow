// complaints-system.js - Sistema de Reclamações CraveNow

class ComplaintsSystem {
  constructor() {
    this.currentStep = 1;
    this.complaintData = {
      type: "delivery",
      urgency: "",
      orderNumber: "",
      email: "",
      title: "",
      description: "",
      solution: "",
      evidence: [],
    };
    this.init();
  }

  init() {
    this.initializeEventListeners();
    this.initializeComplaintTypes();
    console.log(" Sistema de reclamações inicializado");
  }

  initializeEventListeners() {
    // Complaint type selection
    document.querySelectorAll(".complaint-type-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        this.selectComplaintType(e.currentTarget);
      });
    });

    // Quick complaints
    document.querySelectorAll(".quick-complaint").forEach((complaint) => {
      complaint.addEventListener("click", (e) => {
        const type = e.currentTarget
          .getAttribute("onclick")
          .match(/'([^']+)'/)[1];
        this.openQuickComplaint(type);
      });
    });

    // Form validation
    this.initializeFormValidation();
  }

  initializeComplaintTypes() {
    // Set default complaint type
    this.selectComplaintType(
      document.querySelector(".complaint-type-card.active")
    );
  }

  selectComplaintType(card) {
    // Update active card
    document.querySelectorAll(".complaint-type-card").forEach((c) => {
      c.classList.remove("active");
    });
    card.classList.add("active");

    // Update complaint data
    this.complaintData.type = card.getAttribute("data-type");
    console.log("Tipo de reclamação selecionado:", this.complaintData.type);
  }

  openQuickComplaint(type) {
    // Pre-fill form based on quick complaint type
    const quickComplaints = {
      late_delivery: {
        type: "delivery",
        urgency: "high",
        title: "Entrega com atraso significativo",
        description:
          "O pedido está com atraso além do tempo estimado de entrega.",
        solution: "redelivery",
      },
      wrong_order: {
        type: "restaurant",
        urgency: "medium",
        title: "Pedido entregue incorreto",
        description: "Os itens recebidos são diferentes do pedido realizado.",
        solution: "refund",
      },
      food_quality: {
        type: "restaurant",
        urgency: "medium",
        title: "Problema com qualidade da comida",
        description: "A comida não estava em condições adequadas de consumo.",
        solution: "refund",
      },
      missing_items: {
        type: "delivery",
        urgency: "medium",
        title: "Itens faltando no pedido",
        description: "Alguns itens do pedido não foram entregues.",
        solution: "partial_refund",
      },
    };

    const complaint = quickComplaints[type];
    if (complaint) {
      // Set complaint type
      document.querySelector(`[data-type="${complaint.type}"]`).click();

      // Pre-fill form fields
      document.getElementById("complaintUrgency").value = complaint.urgency;
      document.getElementById("complaintTitle").value = complaint.title;
      document.getElementById("complaintDescription").value =
        complaint.description;
      document.getElementById("desiredSolution").value = complaint.solution;

      // Show success message
      this.showToast(
        "Formulário preenchido automaticamente! Revise os dados.",
        "success"
      );
    }
  }

  initializeFormValidation() {
    // Real-time validation for order number
    const orderNumberInput = document.getElementById("orderNumber");
    if (orderNumberInput) {
      orderNumberInput.addEventListener("blur", () => {
        this.validateOrderNumber(orderNumberInput.value);
      });
    }

    // Real-time validation for email
    const emailInput = document.getElementById("customerEmail");
    if (emailInput) {
      emailInput.addEventListener("blur", () => {
        this.validateEmail(emailInput.value);
      });
    }
  }

  validateOrderNumber(orderNumber) {
    if (!orderNumber) return true;

    const orderRegex = /^DHJ-\d{6}$/i;
    const isValid = orderRegex.test(orderNumber);

    if (!isValid) {
      this.showFieldError("orderNumber", "Formato inválido. Use: DHJ-123456");
      return false;
    }

    this.clearFieldError("orderNumber");
    return true;
  }

  validateEmail(email) {
    if (!email) return true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);

    if (!isValid) {
      this.showFieldError("customerEmail", "Email inválido");
      return false;
    }

    this.clearFieldError("customerEmail");
    return true;
  }

  showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    field.classList.add("is-invalid");

    let errorElement = field.parentNode.querySelector(".invalid-feedback");
    if (!errorElement) {
      errorElement = document.createElement("div");
      errorElement.className = "invalid-feedback";
      field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
  }

  clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    field.classList.remove("is-invalid");

    const errorElement = field.parentNode.querySelector(".invalid-feedback");
    if (errorElement) {
      errorElement.remove();
    }
  }

  nextStep(step) {
    if (!this.validateStep(this.currentStep)) {
      this.showToast(
        "Por favor, preencha todos os campos obrigatórios corretamente.",
        "warning"
      );
      return;
    }

    // Update steps
    document
      .querySelector(`[data-step="${this.currentStep}"]`)
      .classList.add("completed");
    document
      .querySelector(`[data-step="${this.currentStep}"]`)
      .classList.remove("active");

    document
      .querySelector(`#step${this.currentStep}`)
      .classList.remove("active");

    this.currentStep = step;

    document
      .querySelector(`[data-step="${this.currentStep}"]`)
      .classList.add("active");
    document.querySelector(`#step${this.currentStep}`).classList.add("active");

    // Update complaint data
    this.updateComplaintData();

    // Special handling for step 4
    if (step === 4) {
      this.updateComplaintSummary();
    }

    // Scroll to top of form
    document
      .querySelector(".complaint-card")
      .scrollIntoView({ behavior: "smooth" });
  }

  prevStep(step) {
    document
      .querySelector(`[data-step="${this.currentStep}"]`)
      .classList.remove("active");
    document
      .querySelector(`#step${this.currentStep}`)
      .classList.remove("active");

    this.currentStep = step;

    document
      .querySelector(`[data-step="${this.currentStep}"]`)
      .classList.add("active");
    document.querySelector(`#step${this.currentStep}`).classList.add("active");

    // Scroll to top of form
    document
      .querySelector(".complaint-card")
      .scrollIntoView({ behavior: "smooth" });
  }

  validateStep(step) {
    switch (step) {
      case 1:
        return this.validateStep1();
      case 2:
        return this.validateStep2();
      case 3:
        return this.validateStep3();
      default:
        return true;
    }
  }

  validateStep1() {
    const orderNumber = document.getElementById("orderNumber").value;
    const urgency = document.getElementById("complaintUrgency").value;
    const email = document.getElementById("customerEmail").value;

    if (!orderNumber) {
      this.showFieldError("orderNumber", "Número do pedido é obrigatório");
      return false;
    }

    if (!this.validateOrderNumber(orderNumber)) {
      return false;
    }

    if (!urgency) {
      this.showFieldError("complaintUrgency", "Selecione a urgência");
      return false;
    }

    if (!email) {
      this.showFieldError("customerEmail", "Email é obrigatório");
      return false;
    }

    if (!this.validateEmail(email)) {
      return false;
    }

    return true;
  }

  validateStep2() {
    const title = document.getElementById("complaintTitle").value;
    const description = document.getElementById("complaintDescription").value;
    const solution = document.getElementById("desiredSolution").value;

    if (!title) {
      this.showFieldError("complaintTitle", "Título é obrigatório");
      return false;
    }

    if (!description) {
      this.showFieldError("complaintDescription", "Descrição é obrigatória");
      return false;
    }

    if (description.length < 20) {
      this.showFieldError(
        "complaintDescription",
        "Descrição muito curta (mín. 20 caracteres)"
      );
      return false;
    }

    if (!solution) {
      this.showFieldError("desiredSolution", "Solução desejada é obrigatória");
      return false;
    }

    return true;
  }

  validateStep3() {
    // Step 3 is optional (evidence), so always valid
    return true;
  }

  updateComplaintData() {
    this.complaintData.orderNumber =
      document.getElementById("orderNumber").value;
    this.complaintData.urgency =
      document.getElementById("complaintUrgency").value;
    this.complaintData.email = document.getElementById("customerEmail").value;
    this.complaintData.title = document.getElementById("complaintTitle").value;
    this.complaintData.description = document.getElementById(
      "complaintDescription"
    ).value;
    this.complaintData.solution =
      document.getElementById("desiredSolution").value;
  }

  updateComplaintSummary() {
    const summaryElement = document.getElementById("complaintSummary");
    const urgencyText = {
      low: "Baixa",
      medium: "Média",
      high: "Alta",
      critical: "Crítica",
    };
    const solutionText = {
      refund: "Reembolso total",
      partial_refund: "Reembolso parcial",
      redelivery: "Nova entrega",
      voucher: "Vale desconto",
      explanation: "Esclarecimento",
      other: "Outro",
    };

    summaryElement.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <strong>Tipo:</strong> ${this.getComplaintTypeText(
                      this.complaintData.type
                    )}
                </div>
                <div class="col-md-6">
                    <strong>Urgência:</strong> <span class="badge bg-${this.getUrgencyBadgeColor(
                      this.complaintData.urgency
                    )}">${urgencyText[this.complaintData.urgency]}</span>
                </div>
                <div class="col-12 mt-2">
                    <strong>Pedido:</strong> ${this.complaintData.orderNumber}
                </div>
                <div class="col-12 mt-2">
                    <strong>Email:</strong> ${this.complaintData.email}
                </div>
                <div class="col-12 mt-2">
                    <strong>Título:</strong> ${this.complaintData.title}
                </div>
                <div class="col-12 mt-2">
                    <strong>Descrição:</strong> ${
                      this.complaintData.description
                    }
                </div>
                <div class="col-12 mt-2">
                    <strong>Solução Desejada:</strong> ${
                      solutionText[this.complaintData.solution]
                    }
                </div>
                <div class="col-12 mt-2">
                    <strong>Evidências:</strong> ${
                      this.complaintData.evidence.length
                    } arquivo(s)
                </div>
            </div>
        `;
  }

  getComplaintTypeText(type) {
    const types = {
      delivery: "Problema com Entrega",
      restaurant: "Problema com Restaurante",
      payment: "Problema com Pagamento",
    };
    return types[type] || type;
  }

  getUrgencyBadgeColor(urgency) {
    const colors = {
      low: "secondary",
      medium: "warning",
      high: "danger",
      critical: "dark",
    };
    return colors[urgency] || "secondary";
  }

  handleEvidenceUpload(files) {
    const preview = document.getElementById("evidencePreview");
    const maxFiles = 5;

    if (files.length + this.complaintData.evidence.length > maxFiles) {
      this.showToast(`Máximo de ${maxFiles} arquivos permitidos`, "warning");
      return;
    }

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        this.showToast(
          `Arquivo ${file.name} muito grande (máx. 5MB)`,
          "warning"
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const evidenceItem = {
          name: file.name,
          type: file.type,
          data: e.target.result,
        };

        this.complaintData.evidence.push(evidenceItem);
        this.addEvidencePreview(evidenceItem);
      };
      reader.readAsDataURL(file);
    });

    // Reset file input
    document.getElementById("evidenceFiles").value = "";
  }

  addEvidencePreview(evidence) {
    const preview = document.getElementById("evidencePreview");
    const isImage = evidence.type.startsWith("image/");

    const item = document.createElement("div");
    item.className = "evidence-item";
    item.innerHTML = `
            ${
              isImage
                ? `<img src="${evidence.data}" alt="${evidence.name}">`
                : `<div class="bg-light w-100 h-100 d-flex align-items-center justify-content-center">
                <i class="bi bi-file-earmark-text fs-2 text-muted"></i>
            </div>`
            }
            <button type="button" class="evidence-remove" onclick="complaintsSystem.removeEvidence('${
              evidence.name
            }')">
                <i class="bi bi-x"></i>
            </button>
        `;

    preview.appendChild(item);
  }

  removeEvidence(fileName) {
    this.complaintData.evidence = this.complaintData.evidence.filter(
      (evidence) => evidence.name !== fileName
    );
    this.updateEvidencePreview();
  }

  updateEvidencePreview() {
    const preview = document.getElementById("evidencePreview");
    preview.innerHTML = "";

    this.complaintData.evidence.forEach((evidence) => {
      this.addEvidencePreview(evidence);
    });
  }

  submitComplaint() {
    if (!document.getElementById("termsAgreement").checked) {
      this.showToast("Você deve aceitar os termos e condições", "warning");
      return;
    }

    if (!this.validateStep(4)) {
      this.showToast("Por favor, revise os dados da reclamação", "warning");
      return;
    }

    // Show loading
    const submitButton = document.querySelector("#step4 .btn-success");
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML =
      '<i class="bi bi-arrow-repeat spinner-border spinner-border-sm"></i> Enviando...';
    submitButton.disabled = true;

    // Simulate API call
    setTimeout(() => {
      // Generate protocol number
      const protocol = "DHJ-" + Date.now().toString().slice(-8);
      document.getElementById("complaintProtocol").textContent = protocol;

      // Show success modal
      const successModal = new bootstrap.Modal(
        document.getElementById("successModal")
      );
      successModal.show();

      // Reset form
      this.resetForm();

      // Reset button
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;

      // Track submission
      this.trackComplaintSubmission(protocol);
    }, 2000);
  }

  resetForm() {
    // Reset form fields
    document.getElementById("complaintForm").reset();

    // Reset steps
    this.currentStep = 1;
    document.querySelectorAll(".step").forEach((step) => {
      step.classList.remove("active", "completed");
    });
    document.querySelector('[data-step="1"]').classList.add("active");

    document.querySelectorAll(".form-step").forEach((step) => {
      step.classList.remove("active");
    });
    document.getElementById("step1").classList.add("active");

    // Reset complaint data
    this.complaintData = {
      type: "delivery",
      urgency: "",
      orderNumber: "",
      email: "",
      title: "",
      description: "",
      solution: "",
      evidence: [],
    };

    // Reset evidence preview
    document.getElementById("evidencePreview").innerHTML = "";
  }

  trackComplaintSubmission(protocol) {
    console.log("Reclamação submetida:", {
      protocol: protocol,
      type: this.complaintData.type,
      urgency: this.complaintData.urgency,
    });

    // In production, send to analytics
    if (typeof gtag !== "undefined") {
      gtag("event", "complaint_submission", {
        complaint_type: this.complaintData.type,
        urgency: this.complaintData.urgency,
        protocol: protocol,
      });
    }
  }

  showToast(message, type = "info") {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById("toastContainer");
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.id = "toastContainer";
      toastContainer.className =
        "toast-container position-fixed top-0 end-0 p-3";
      toastContainer.style.zIndex = "9999";
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
}

// Global functions for HTML onclick attributes
function nextStep(step) {
  if (window.complaintsSystem) {
    window.complaintsSystem.nextStep(step);
  }
}

function prevStep(step) {
  if (window.complaintsSystem) {
    window.complaintsSystem.prevStep(step);
  }
}

function openQuickComplaint(type) {
  if (window.complaintsSystem) {
    window.complaintsSystem.openQuickComplaint(type);
  }
}

function handleEvidenceUpload(files) {
  if (window.complaintsSystem) {
    window.complaintsSystem.handleEvidenceUpload(files);
  }
}

function submitComplaint() {
  if (window.complaintsSystem) {
    window.complaintsSystem.submitComplaint();
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  window.complaintsSystem = new ComplaintsSystem();

  console.log(" Sistema de Reclamações CraveNow carregado com sucesso!");
});
