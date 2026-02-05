// ==================================================
// SISTEMA COMPLETO DE CADASTRO DE RESTAURANTE
// Com Toast Profissional e Multi-Step
// ==================================================

class RestaurantRegistration {
  constructor() {
    this.currentStep = 1;
    this.maxSteps = 4;
    this.formData = {
      basicInfo: {},
      location: {},
      schedule: {},
      delivery: {},
      payments: {},
      documents: {},
      images: [],
    };
    this.uploadedImages = [];

    this.init();
  }

  init() {
    this.initializeEventListeners();
    this.initializeToastSystem();
    this.setupDynamicFields();
    this.updateStepDisplay();
    console.log(" Sistema de cadastro inicializado");
  }

  // ==================================================
  // 1. SISTEMA DE TOAST PROFISSIONAL
  // ==================================================

  initializeToastSystem() {
    // Criar container de toasts se não existir
    if (!document.getElementById("toastContainer")) {
      const toastContainer = document.createElement("div");
      toastContainer.id = "toastContainer";
      toastContainer.className =
        "toast-container position-fixed top-0 end-0 p-3";
      toastContainer.style.zIndex = "9999";
      document.body.appendChild(toastContainer);
    }
  }

  showToast(message, type = "info", duration = 5000) {
    const toastId = "toast-" + Date.now();
    const icons = {
      success: "bi-check-circle-fill",
      error: "bi-exclamation-circle-fill",
      warning: "bi-exclamation-triangle-fill",
      info: "bi-info-circle-fill",
    };

    const toastHTML = `
            <div id="${toastId}" class="toast align-items-center text-bg-${type} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="bi ${icons[type]} me-2"></i>
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;

    document
      .getElementById("toastContainer")
      .insertAdjacentHTML("beforeend", toastHTML);

    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, {
      autohide: true,
      delay: duration,
    });

    toast.show();

    // Remover do DOM quando esconder
    toastElement.addEventListener("hidden.bs.toast", () => {
      toastElement.remove();
    });
  }

  // ==================================================
  // 2. SISTEMA MULTI-STEP
  // ==================================================

  initializeEventListeners() {
    // Navegação entre steps
    document
      .getElementById("nextStep1")
      ?.addEventListener("click", () => this.nextStep());
    document
      .getElementById("nextStep2")
      ?.addEventListener("click", () => this.nextStep());
    document
      .getElementById("nextStep3")
      ?.addEventListener("click", () => this.nextStep());

    document
      .getElementById("prevStep2")
      ?.addEventListener("click", () => this.previousStep());
    document
      .getElementById("prevStep3")
      ?.addEventListener("click", () => this.previousStep());
    document
      .getElementById("prevStep4")
      ?.addEventListener("click", () => this.previousStep());

    // Submissão final
    document
      .getElementById("restaurantRegistrationForm")
      ?.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleFinalSubmission();
      });

    // Upload de imagens
    this.initializeImageUpload();

    // Validação em tempo real
    this.setupRealTimeValidation();
  }

  nextStep() {
    if (this.validateCurrentStep()) {
      this.saveStepData();
      this.currentStep++;
      this.updateStepDisplay();
      this.scrollToTop();
      this.showToast(
        `Passo ${this.currentStep - 1} concluído!`,
        "success",
        3000
      );
    } else {
      this.showToast(
        "Por favor, preencha todos os campos obrigatórios.",
        "warning"
      );
      this.scrollToFirstInvalid();
    }
  }

  previousStep() {
    this.currentStep--;
    this.updateStepDisplay();
    this.scrollToTop();
  }

  updateStepDisplay() {
    // Atualizar steps visuais
    document.querySelectorAll(".step").forEach((step, index) => {
      const stepNumber = index + 1;
      step.classList.toggle("active", stepNumber <= this.currentStep);
      step.classList.toggle("current", stepNumber === this.currentStep);
    });

    // Mostrar/ocultar steps
    document.querySelectorAll(".form-step").forEach((step) => {
      step.style.display = "none";
    });

    const currentStepElement = document.getElementById(
      `step${this.currentStep}`
    );
    if (currentStepElement) {
      currentStepElement.style.display = "block";
    }

    // Atualizar cabeçalho
    this.updateStepHeader();

    // Atualizar resumo no último step
    if (this.currentStep === 4) {
      this.updateRegistrationSummary();
    }
  }

  updateStepHeader() {
    const titles = {
      1: "Informações Básicas",
      2: "Localização",
      3: "Horários e Entregas",
      4: "Documentos e Finalização",
    };

    const descriptions = {
      1: "Preencha os dados básicos do seu estabelecimento",
      2: "Informe a localização do seu restaurante",
      3: "Configure horários e opções de entrega",
      4: "Anexe documentos e finalize o cadastro",
    };

    const titleElement = document.getElementById("currentStepTitle");
    const descElement = document.getElementById("currentStepDescription");

    if (titleElement) titleElement.textContent = titles[this.currentStep];
    if (descElement) descElement.textContent = descriptions[this.currentStep];
  }

  // ==================================================
  // 3. VALIDAÇÃO E DADOS
  // ==================================================

  setupRealTimeValidation() {
    // Validação de email
    const emailField = document.getElementById("restaurantEmail");
    if (emailField) {
      emailField.addEventListener("blur", () => this.validateEmail(emailField));
    }

    // Validação de telefone
    const phoneField = document.getElementById("restaurantPhone");
    if (phoneField) {
      phoneField.addEventListener("input", (e) =>
        this.formatPhoneNumber(e.target)
      );
    }

    // Contador de caracteres
    const descriptionField = document.getElementById("restaurantDescription");
    const counterElement = document.getElementById("descriptionCount");
    if (descriptionField && counterElement) {
      descriptionField.addEventListener("input", (e) => {
        const count = e.target.value.length;
        counterElement.textContent = count;

        if (count > 450) {
          counterElement.className = "text-warning";
        } else if (count > 490) {
          counterElement.className = "text-danger";
        } else {
          counterElement.className = "text-muted";
        }
      });
    }
  }

  validateCurrentStep() {
    const currentStepElement = document.getElementById(
      `step${this.currentStep}`
    );
    if (!currentStepElement) return false;

    const requiredFields = currentStepElement.querySelectorAll("[required]");
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    // Validação especial para métodos de pagamento
    if (this.currentStep === 3) {
      const paymentMethods = document.querySelectorAll(
        '#step3 input[type="checkbox"]:checked'
      );
      if (paymentMethods.length === 0) {
        document.getElementById("paymentMethodsError").style.display = "block";
        isValid = false;
      } else {
        document.getElementById("paymentMethodsError").style.display = "none";
      }
    }

    return isValid;
  }

  validateField(field) {
    const isValid = field.checkValidity();

    field.classList.remove("is-valid", "is-invalid");

    if (isValid) {
      field.classList.add("is-valid");
    } else {
      field.classList.add("is-invalid");
    }

    return isValid;
  }

  validateEmail(field) {
    const email = field.value;
    if (!email) return true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);

    if (!isValid) {
      field.setCustomValidity("Por favor, insira um email válido");
    } else {
      field.setCustomValidity("");
    }

    this.validateField(field);
    return isValid;
  }

  formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, "");

    if (value.length > 0) {
      value = value.replace(/^(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
    }

    input.value = value;
  }

  saveStepData() {
    switch (this.currentStep) {
      case 1:
        this.formData.basicInfo = this.getStep1Data();
        break;
      case 2:
        this.formData.location = this.getStep2Data();
        break;
      case 3:
        this.formData.schedule = this.getStep3Data();
        this.formData.delivery = this.getDeliveryData();
        this.formData.payments = this.getPaymentsData();
        break;
    }
  }

  getStep1Data() {
    return {
      name: document.getElementById("restaurantName").value,
      phone: document.getElementById("restaurantPhone").value,
      email: document.getElementById("restaurantEmail").value,
      category: document.getElementById("restaurantCategory").value,
      description: document.getElementById("restaurantDescription").value,
    };
  }

  getStep2Data() {
    return {
      address: document.getElementById("restaurantAddress").value,
      city: document.getElementById("restaurantCity").value,
      province: document.getElementById("restaurantProvince").value,
      postalCode: document.getElementById("restaurantPostalCode").value,
      lat: document.getElementById("restaurantLat").value,
      lng: document.getElementById("restaurantLng").value,
    };
  }

  getStep3Data() {
    return {
      open24h: document.getElementById("open24h").checked,
      openingTime: document.getElementById("openingTime").value,
      closingTime: document.getElementById("closingTime").value,
    };
  }

  getDeliveryData() {
    return {
      radius: document.getElementById("deliveryRadius").value,
      time: document.getElementById("deliveryTime").value,
      fee: document.getElementById("deliveryFee").value,
      freeDelivery: document.getElementById("freeDelivery").checked,
    };
  }

  getPaymentsData() {
    return {
      multicaixa: document.getElementById("paymentMulticaixa").checked,
      cash: document.getElementById("paymentCash").checked,
      transfer: document.getElementById("paymentTransfer").checked,
    };
  }

  // ==================================================
  // 4. UPLOAD DE IMAGENS
  // ==================================================

  initializeImageUpload() {
    const uploadArea = document.querySelector(".upload-area");
    const fileInput = document.getElementById("restaurantImages");

    if (!uploadArea || !fileInput) return;

    // Drag and drop
    uploadArea.addEventListener("dragover", (e) => {
      e.preventDefault();
      uploadArea.classList.add("dragover");
    });

    uploadArea.addEventListener("dragleave", () => {
      uploadArea.classList.remove("dragover");
    });

    uploadArea.addEventListener("drop", (e) => {
      e.preventDefault();
      uploadArea.classList.remove("dragover");
      this.handleFiles(e.dataTransfer.files);
    });

    // Click to upload
    uploadArea.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", (e) =>
      this.handleFiles(e.target.files)
    );
  }

  handleFiles(files) {
    const maxFiles = 5;
    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (this.uploadedImages.length + files.length > maxFiles) {
      this.showToast(`Máximo de ${maxFiles} imagens permitido.`, "warning");
      return;
    }

    Array.from(files).forEach((file) => {
      if (!this.validateFile(file, maxSize, allowedTypes)) return;
      this.createImagePreview(file);
      this.uploadedImages.push(file);
    });

    this.updateImageCounter();
  }

  validateFile(file, maxSize, allowedTypes) {
    if (file.size > maxSize) {
      this.showToast(`"${file.name}" é muito grande. Máximo 5MB.`, "warning");
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      this.showToast(`"${file.name}" deve ser JPEG, PNG ou WebP.`, "warning");
      return false;
    }

    return true;
  }

  createImagePreview(file) {
    const reader = new FileReader();
    const previewContainer = document.getElementById("imagePreview");

    reader.onload = (e) => {
      const col = document.createElement("div");
      col.className = "col-6 col-md-4 col-lg-6";
      col.innerHTML = `
                <div class="image-preview-item position-relative">
                    <img src="${
                      e.target.result
                    }" class="img-fluid rounded" alt="Preview" style="height: 100px; object-fit: cover;">
                    <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0 m-1" 
                            onclick="restaurantRegistration.removeImage(this, '${
                              file.name
                            }')">
                        <i class="bi bi-x"></i>
                    </button>
                    <div class="image-info small text-muted mt-1">${this.formatFileSize(
                      file.size
                    )}</div>
                </div>
            `;
      previewContainer.appendChild(col);
    };

    reader.readAsDataURL(file);
  }

  removeImage(button, fileName) {
    const previewItem = button.closest(".col-6");
    if (previewItem) {
      previewItem.remove();
      this.uploadedImages = this.uploadedImages.filter(
        (file) => file.name !== fileName
      );
      this.updateImageCounter();
      this.showToast("Imagem removida.", "info");
    }
  }

  updateImageCounter() {
    const counter =
      document.querySelector(".image-counter") || this.createImageCounter();
    counter.textContent = `${this.uploadedImages.length}/5 imagens`;
  }

  createImageCounter() {
    const counter = document.createElement("div");
    counter.className = "image-counter small text-muted mt-2 text-center";
    document.querySelector(".image-upload-container").appendChild(counter);
    return counter;
  }

  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  // ==================================================
  // 5. CAMPOS DINÂMICOS
  // ==================================================

  setupDynamicFields() {
    // Toggle 24h
    const open24h = document.getElementById("open24h");
    const openingTime = document.getElementById("openingTime");
    const closingTime = document.getElementById("closingTime");

    if (open24h && openingTime && closingTime) {
      open24h.addEventListener("change", (e) => {
        const disabled = e.target.checked;
        openingTime.disabled = disabled;
        closingTime.disabled = disabled;

        if (disabled) {
          openingTime.value = "00:00";
          closingTime.value = "23:59";
        }
      });
    }

    // Toggle entrega grátis
    const freeDelivery = document.getElementById("freeDelivery");
    const deliveryFee = document.getElementById("deliveryFee");

    if (freeDelivery && deliveryFee) {
      freeDelivery.addEventListener("change", (e) => {
        deliveryFee.disabled = e.target.checked;
        if (e.target.checked) {
          deliveryFee.value = "0";
        }
      });
    }
  }

  // ==================================================
  // 6. SUBMISSÃO FINAL
  // ==================================================

  async handleFinalSubmission() {
    if (!this.validateCurrentStep()) {
      this.showToast("Por favor, corrija os erros antes de enviar.", "warning");
      this.scrollToFirstInvalid();
      return;
    }

    // Coletar dados finais
    this.formData.documents = this.getDocumentsData();
    this.formData.images = this.uploadedImages;
    this.formData.metadata = {
      submittedAt: new Date().toISOString(),
      userAgent: navigator.userAgent,
      source: "web_form",
    };

    this.setLoadingState(true);

    try {
      const result = await this.submitToBackend(this.formData);

      if (result.success) {
        this.showToast(
          "🎉 Cadastro enviado com sucesso! Entraremos em contacto dentro de 24h.",
          "success",
          8000
        );
        this.resetForm();

        // Redirecionar após 5 segundos
        setTimeout(() => {
          window.location.href = "/";
        }, 5000);
      } else {
        throw new Error(result.message || "Erro ao processar cadastro");
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      this.showToast(
        error.message || "Erro ao enviar cadastro. Tente novamente.",
        "error"
      );
    } finally {
      this.setLoadingState(false);
    }
  }

  getDocumentsData() {
    return {
      nif: document.getElementById("restaurantNIF")?.value || "",
      license: document.getElementById("businessLicense")?.value || "",
    };
  }

  async submitToBackend(formData) {
    // INTEGRAÇÃO COM BACKEND
    const endpoint = "/api/restaurant/register.php";

    // Simular envio para demonstração
    return await this.mockBackendSubmit(formData);

    /*
        // CÓDIGO REAL PARA BACKEND:
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
        */
  }

  async mockBackendSubmit(formData) {
    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simular resposta do servidor
    return {
      success: true,
      message: "Cadastro recebido com sucesso",
      data: {
        id: "RST_" + Date.now(),
        reference:
          "REF_" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        nextSteps: [
          "Verificação de documentos",
          "Contacto da equipa",
          "Ativação da conta",
        ],
      },
    };
  }

  // ==================================================
  // 7. RESUMO E UTILITÁRIOS
  // ==================================================

  updateRegistrationSummary() {
    const summary = document.getElementById("registrationSummary");
    if (!summary) return;

    const data = this.formData.basicInfo;
    const location = this.formData.location;

    summary.innerHTML = `
            <div class="row mb-2">
                <div class="col-5"><strong>Nome:</strong></div>
                <div class="col-7">${data.name || "Não informado"}</div>
            </div>
            <div class="row mb-2">
                <div class="col-5"><strong>Telefone:</strong></div>
                <div class="col-7">${data.phone || "Não informado"}</div>
            </div>
            <div class="row mb-2">
                <div class="col-5"><strong>Email:</strong></div>
                <div class="col-7">${data.email || "Não informado"}</div>
            </div>
            <div class="row mb-2">
                <div class="col-5"><strong>Categoria:</strong></div>
                <div class="col-7">${
                  this.getCategoryName(data.category) || "Não informado"
                }</div>
            </div>
            <div class="row mb-2">
                <div class="col-5"><strong>Localização:</strong></div>
                <div class="col-7">${location.address || "Não informado"}, ${
      location.city || ""
    }</div>
            </div>
            <div class="row">
                <div class="col-5"><strong>Imagens:</strong></div>
                <div class="col-7">${this.uploadedImages.length} enviadas</div>
            </div>
        `;
  }

  getCategoryName(categoryValue) {
    const categories = {
      tradicional: "Tradicional Angolano",
      pizza: "Pizza",
      sushi: "Sushi",
      churrasco: "Churrasco",
      hamburguer: "Hambúrguer",
      vegetariano: "Vegetariano",
      frutos_mar: "Frutos do Mar",
      internacional: "Internacional",
      cafe: "Café & Lanches",
      sobremesas: "Sobremesas",
      outro: "Outro",
    };
    return categories[categoryValue] || categoryValue;
  }

  setLoadingState(loading) {
    const buttons = document.querySelectorAll("button");
    const submitButton = document.getElementById("submitForm");

    buttons.forEach((btn) => {
      if (btn.type !== "file") {
        btn.disabled = loading;
      }
    });

    if (submitButton) {
      if (loading) {
        submitButton.innerHTML =
          '<i class="bi bi-hourglass-split"></i> Enviando...';
        submitButton.classList.remove("btn-success");
        submitButton.classList.add("btn-secondary");
      } else {
        submitButton.innerHTML =
          '<i class="bi bi-check-lg"></i> Finalizar Cadastro';
        submitButton.classList.remove("btn-secondary");
        submitButton.classList.add("btn-success");
      }
    }
  }

  scrollToFirstInvalid() {
    const firstInvalid = document.querySelector(".is-invalid");
    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      firstInvalid.focus();
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  resetForm() {
    document.getElementById("restaurantRegistrationForm").reset();
    this.uploadedImages = [];
    document.getElementById("imagePreview").innerHTML = "";
    this.updateImageCounter();
    this.currentStep = 1;
    this.formData = {
      basicInfo: {},
      location: {},
      schedule: {},
      delivery: {},
      payments: {},
      documents: {},
      images: [],
    };
    this.updateStepDisplay();

    // Limpar validação
    document.querySelectorAll(".is-valid, .is-invalid").forEach((el) => {
      el.classList.remove("is-valid", "is-invalid");
    });
  }
}

// ==================================================
// INICIALIZAÇÃO
// ==================================================

let restaurantRegistration;

document.addEventListener("DOMContentLoaded", function () {
  restaurantRegistration = new RestaurantRegistration();
  window.restaurantRegistration = restaurantRegistration;
});

// Exportar para uso em módulos
if (typeof module !== "undefined" && module.exports) {
  module.exports = RestaurantRegistration;
}
