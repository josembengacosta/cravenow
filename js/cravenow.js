// Seleção de elementos
const htmlEl = document.documentElement;
const toggleBtn = document.getElementById("toggleDark");
const filterBtns = document.querySelectorAll(".filter-btn");
const restaurants = document.querySelectorAll("#restaurantList .col");
const loadingBar = document.getElementById("loadingBar");
const LAST_THEME_KEY = "CraveNow_theme";
const LAST_FILTER_KEY = "CraveNow_filter";
const LAST_LOCATION_KEY = "CraveNow_location";

// ---------------------------------------------
// 1. Lógica de Dark Mode (Com Persistência)
// ---------------------------------------------
const savedTheme = localStorage.getItem(LAST_THEME_KEY);
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
let initialTheme = savedTheme || (prefersDark ? "dark" : "light");

if (initialTheme === "dark") {
  htmlEl.setAttribute("data-bs-theme", "dark");
  toggleBtn.innerHTML = '<i class="bi bi-brightness-high-fill"></i>';
} else {
  htmlEl.setAttribute("data-bs-theme", "light");
  toggleBtn.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
}

toggleBtn.addEventListener("click", () => {
  const current = htmlEl.getAttribute("data-bs-theme");
  const newTheme = current === "dark" ? "light" : "dark";
  htmlEl.setAttribute("data-bs-theme", newTheme);
  localStorage.setItem(LAST_THEME_KEY, newTheme);
  toggleBtn.innerHTML =
    newTheme === "dark"
      ? '<i class="bi bi-brightness-high-fill"></i>'
      : '<i class="bi bi-moon-stars-fill"></i>';
});

// ---------------------------------------------
// 2. Lógica de Filtros (Com Persistência)
// ---------------------------------------------
function applyFilter(category) {
  filterBtns.forEach((b) => b.classList.remove("active"));
  const targetBtn = document.querySelector(
    `.filter-btn[data-category="${category}"]`
  );

  if (targetBtn) {
    targetBtn.classList.add("active");
    localStorage.setItem(LAST_FILTER_KEY, category);
  } else {
    document
      .querySelector('.filter-btn[data-category="all"]')
      .classList.add("active");
    localStorage.setItem(LAST_FILTER_KEY, "all");
    category = "all";
  }

  restaurants.forEach((rest) => {
    rest.style.display =
      category === "all" || rest.dataset.category === category
        ? "block"
        : "none";
  });
}

// Aplica o filtro guardado ao carregar
const savedFilter = localStorage.getItem(LAST_FILTER_KEY) || "all";
applyFilter(savedFilter);

// Adiciona evento de clique aos botões de filtro
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    applyFilter(btn.dataset.category);
  });
});

// ---------------------------------------------
// 3. Sistema de Localização
// ---------------------------------------------
function initLocation() {
  const locationText = document.getElementById("locationText");
  const currentLocation = document.getElementById("currentLocation");
  const currentLocationMobile = document.getElementById(
    "currentLocationMobile"
  );
  const provinceSelect = document.getElementById("provinceSelect");
  const municipalitySelect = document.getElementById("municipalitySelect");
  const saveLocationBtn = document.getElementById("saveLocation");

  // Localização salva ou padrão
  const savedLocation = localStorage.getItem(LAST_LOCATION_KEY);
  const defaultLocation = {
    province: "luanda",
    municipality: "belas",
    name: "Luanda, Belas",
  };
  const currentLocationData = savedLocation
    ? JSON.parse(savedLocation)
    : defaultLocation;

  // Atualiza textos da localização
  function updateLocationText() {
    const displayText = `Entregamos em <strong>${currentLocationData.name}</strong>`;
    if (locationText) locationText.innerHTML = displayText;
    if (currentLocation)
      currentLocation.textContent = currentLocationData.name.split(",")[0];
    if (currentLocationMobile)
      currentLocationMobile.textContent =
        currentLocationData.name.split(",")[0];
  }

  // Salvar localização
  if (saveLocationBtn) {
    saveLocationBtn.addEventListener("click", function () {
      const province = provinceSelect ? provinceSelect.value : "luanda";
      const municipality = municipalitySelect
        ? municipalitySelect.value
        : "belas";
      const locationName = `${
        provinceSelect?.options[provinceSelect.selectedIndex]?.text
      }, ${
        municipalitySelect?.options[municipalitySelect.selectedIndex]?.text
      }`;

      const newLocation = {
        province: province,
        municipality: municipality,
        name: locationName,
      };

      localStorage.setItem(LAST_LOCATION_KEY, JSON.stringify(newLocation));
      Object.assign(currentLocationData, newLocation);
      updateLocationText();

      // Fecha o modal
      const locationModal = bootstrap.Modal.getInstance(
        document.getElementById("locationModal")
      );
      if (locationModal) locationModal.hide();

      // Mostra feedback
      showToast("Localização atualizada com sucesso!", "success");
    });
  }

  updateLocationText();
}

// ---------------------------------------------
// 4. Sistema de Status Online/Offline
// ---------------------------------------------
function initNetworkStatus() {
  const networkStatus = document.getElementById("networkStatus");
  const networkMessage = document.getElementById("networkMessage");

  function updateNetworkStatus() {
    if (!networkStatus || !networkMessage) return;

    if (navigator.onLine) {
      networkStatus.classList.add("d-none");
    } else {
      networkStatus.classList.remove("d-none");
      networkMessage.textContent = "Sem conexão à internet";
      networkStatus.className =
        "alert alert-warning alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-2";
      networkStatus.style.zIndex = "1060";
    }
  }

  window.addEventListener("online", updateNetworkStatus);
  window.addEventListener("offline", updateNetworkStatus);
  updateNetworkStatus(); // Status inicial
}

// ---------------------------------------------
// 5. Sistema de Contagem Animada (Stats)
// ---------------------------------------------
function initCounterAnimation() {
  const counters = document.querySelectorAll(".counter");

  function animateCounter(counter) {
    const target = parseInt(counter.getAttribute("data-valor"));
    const duration = 2000; // 2 segundos
    const step = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        counter.textContent = target + "+";
        clearInterval(timer);
      } else {
        counter.textContent = Math.floor(current) + "+";
      }
    }, 16);
  }

  // Observador para animar quando elemento entra na viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

// ---------------------------------------------
// 6. Sistema de Modais para Restaurantes
// ---------------------------------------------
function initRestaurantModals() {
  const restaurantModal = document.getElementById("restaurantModal");
  const restaurantModalBody = document.getElementById("restaurantModalBody");

  // Dados mockados dos restaurantes (depois vem do backend)
  const restaurantsData = {
    1: {
      name: "O Paladar Angolano",
      category: "Tradicional",
      rating: 4.8,
      deliveryTime: "30-45 min",
      deliveryFee: "KZ 1.500",
      paymentMethods: ["Multicaixa", "Dinheiro"],
      description: "Os melhores sabores tradicionais de Angola",
      image: "assets/img/restaurantes/paladar-angolano.jpg",
    },
    2: {
      name: "Pizzaria Napolitana",
      category: "Pizza",
      rating: 4.5,
      deliveryTime: "20-30 min",
      deliveryFee: "Grátis",
      paymentMethods: ["Multicaixa"],
      description: "Pizza italiana autêntica",
      image: "assets/img/restaurantes/pizzaria-napolitana.jpg",
    },
  };

  // Evento para abrir modal do restaurante
  document
    .querySelectorAll(".restaurant-card[data-restaurant-id]")
    .forEach((card) => {
      card.addEventListener("click", function () {
        const restaurantId = this.getAttribute("data-restaurant-id");
        const restaurant = restaurantsData[restaurantId];

        if (restaurant && restaurantModalBody) {
          restaurantModalBody.innerHTML = `
                    <div class="row">
                        <div class="col-md-6">
                            <img src="${
                              restaurant.image
                            }" class="img-fluid rounded" alt="${
            restaurant.name
          }">
                        </div>
                        <div class="col-md-6">
                            <h4>${restaurant.name}</h4>
                            <p class="text-muted">${restaurant.description}</p>
                            <div class="mb-3">
                                <span class="badge bg-success me-2"><i class="bi bi-star-fill"></i> ${
                                  restaurant.rating
                                }</span>
                                <span class="badge bg-secondary">${
                                  restaurant.category
                                }</span>
                            </div>
                            <div class="mb-3">
                                <strong>Entrega:</strong> ${
                                  restaurant.deliveryFee
                                }<br>
                                <strong>Tempo:</strong> ${
                                  restaurant.deliveryTime
                                }<br>
                                <strong>Pagamentos:</strong> ${restaurant.paymentMethods.join(
                                  ", "
                                )}
                            </div>
                            <button class="btn btn-danger w-100">Fazer Pedido</button>
                        </div>
                    </div>
                `;
        }
      });
    });
}

// ---------------------------------------------
// 7. Sistema de Avaliação com Estrelas
// ---------------------------------------------
// Sistema de Avaliação da Plataforma
function initFeedbackSystem() {
  const feedbackForm = document.getElementById("platformFeedbackForm");
  const feedbackComment = document.getElementById("feedbackComment");
  const charCount = document.getElementById("charCount");
  const ratingInputs = document.querySelectorAll('input[name="rating"]');
  const ratingText = document.getElementById("ratingText");

  // Contador de caracteres
  if (feedbackComment && charCount) {
    feedbackComment.addEventListener("input", function () {
      const count = this.value.length;
      charCount.textContent = count;

      // Altera a cor conforme se aproxima do limite
      charCount.className = "";
      if (count > 400) charCount.classList.add("warning");
      if (count > 480) charCount.classList.add("danger");
    });
  }

  // Atualizar texto da avaliação
  if (ratingInputs && ratingText) {
    ratingInputs.forEach((input) => {
      input.addEventListener("change", function () {
        const rating = this.value;
        const texts = {
          1: "Péssimo 😞",
          2: "Ruim 🙁",
          3: "Regular 😐",
          4: "Bom 😊",
          5: "Excelente 🤩",
        };
        ratingText.textContent = texts[rating] || "Clique para avaliar";
        ratingText.style.fontWeight = "600";
        ratingText.style.color = "var(--primary-color)";
      });
    });
  }

  // Envio do formulário
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Validar avaliação
      const rating = document.querySelector('input[name="rating"]:checked');
      if (!rating) {
        showAlert(
          "Por favor, selecione uma avaliação com estrelas.",
          "warning"
        );
        return;
      }

      // Validar termos
      const terms = document.getElementById("feedbackTerms");
      if (!terms.checked) {
        showAlert(
          "Por favor, aceite os termos para enviar sua avaliação.",
          "warning"
        );
        return;
      }

      // Simular envio (substituir por AJAX depois)
      const formData = {
        rating: rating.value,
        comment: feedbackComment.value,
        type: document.querySelector('input[name="feedbackType"]:checked')
          .value,
        email: document.getElementById("feedbackEmail").value,
      };

      console.log("Avaliação enviada:", formData);

      // Fechar modal atual e mostrar confirmação
      const feedbackModal = bootstrap.Modal.getInstance(
        document.getElementById("feedbackModal")
      );
      feedbackModal.hide();

      // Mostrar modal de sucesso
      setTimeout(() => {
        const successModal = new bootstrap.Modal(
          document.getElementById("successModal")
        );
        successModal.show();

        // Resetar formulário
        feedbackForm.reset();
        charCount.textContent = "0";
        charCount.className = "";
        ratingText.textContent = "Clique para avaliar";
        ratingText.style.fontWeight = "normal";
        ratingText.style.color = "";
      }, 300);
    });
  }

  // Fechar modal de sucesso automaticamente após 3 segundos
  const successModal = document.getElementById("successModal");
  if (successModal) {
    successModal.addEventListener("shown.bs.modal", function () {
      setTimeout(() => {
        const modal = bootstrap.Modal.getInstance(this);
        modal.hide();
      }, 3000);
    });
  }
}

// Função auxiliar para mostrar alertas
function showAlert(message, type = "info") {
  // Pode implementar um sistema de toasts aqui
  alert(message); // Temporário - substituir por toast bonito
}

// Inicializar quando DOM estiver pronto
document.addEventListener("DOMContentLoaded", initFeedbackSystem);

// ---------------------------------------------
// 8. Sistema de Feedback/Parceiro
// ---------------------------------------------
function initForms() {
  // Formulário de feedback da plataforma
  const feedbackForm = document.getElementById("platformReviewForm");
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", function (e) {
      e.preventDefault();
      showToast("Obrigado pelo seu feedback!", "success");
      this.reset();
    });
  }

  // Formulário de parceiro
  const partnerForm = document.getElementById("partnerForm");
  if (partnerForm) {
    partnerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      showToast(
        "Pedido de parceria enviado! Entraremos em contacto.",
        "success"
      );
      this.reset();

      // Fecha o modal
      const partnerModal = bootstrap.Modal.getInstance(
        document.getElementById("partnerModal")
      );
      if (partnerModal) partnerModal.hide();
    });
  }
}

// ---------------------------------------------
// 9. Utilitários
// ---------------------------------------------
function showToast(message, type = "info") {
  // Criar toast dinâmico (pode usar Bootstrap Toast)
  console.log(`[${type.toUpperCase()}] ${message}`);
  // Implementação completa do toast aqui
}

// ---------------------------------------------
// 10. Lógica da Barra de Carregamento (UX)
// ---------------------------------------------
window.addEventListener("load", () => {
  // Barra de progresso
  if (loadingBar) {
    loadingBar.style.transition = "opacity 0.5s ease-out";
    loadingBar.style.opacity = "0";
    setTimeout(() => {
      loadingBar.style.display = "none";
    }, 500);
  }

  // Preloader
  const preloader = document.querySelector(".preloader");
  if (preloader) {
    preloader.style.opacity = "0";
    setTimeout(() => {
      preloader.style.display = "none";
    }, 500);
  }

  // Inicializar todos os sistemas
  initLocation();
  initNetworkStatus();
  initCounterAnimation();
  initRestaurantModals();
  initStarRating();
  initForms();
});

// Inicialização quando DOM estiver pronto
document.addEventListener("DOMContentLoaded", function () {
  // Sistemas que precisam do DOM pronto
  initLocation();
  initNetworkStatus();
});

// Inicializar carousel com configurações personalizadas
function initFoodCarousel() {
  const foodCarousel = document.getElementById("foodCarousel");

  if (foodCarousel) {
    // Configuração automática do Bootstrap já funciona
    // Adicionar interações extras se necessário

    // Auto-play com pause no hover
    const carousel = new bootstrap.Carousel(foodCarousel, {
      interval: 5000, // 5 segundos
      pause: "hover", // Pausa quando o mouse está em cima
      wrap: true, // Volta ao início quando chega no final
    });

    // Adicionar efeito de clique nos mini cards
    document.querySelectorAll(".food-category-icon").forEach((icon) => {
      icon.addEventListener("click", function () {
        // Animação de feedback
        this.style.transform = "scale(0.95)";
        setTimeout(() => {
          this.style.transform = "";
        }, 150);
      });
    });
  }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", initFoodCarousel);

// Sistema de Newsletter
function initNewsletterSystem() {
  const newsletterForm = document.getElementById("newsletterForm");
  const successModal = new bootstrap.Modal(
    document.getElementById("newsletterSuccessModal")
  );

  if (newsletterForm) {
    // Validação do formulário
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!this.checkValidity()) {
        e.stopPropagation();
        this.classList.add("was-validated");
        return;
      }

      // Coletar dados do formulário
      const formData = {
        name: document.getElementById("newsletterName").value,
        email: document.getElementById("newsletterEmail").value,
        preferences: {
          promotions: document.getElementById("prefPromotions").checked,
          newRestaurants: document.getElementById("prefNewRestaurants").checked,
          tips: document.getElementById("prefTips").checked,
        },
        timestamp: new Date().toISOString(),
      };

      // Simular envio (substituir por AJAX/API)
      console.log("Newsletter subscription:", formData);

      // Salvar no localStorage
      const subscriptions = JSON.parse(
        localStorage.getItem("CraveNow_newsletter") || "[]"
      );
      subscriptions.push(formData);
      localStorage.setItem(
        "CraveNow_newsletter",
        JSON.stringify(subscriptions)
      );

      // Mostrar modal de sucesso
      successModal.show();

      // Resetar formulário
      this.reset();
      this.classList.remove("was-validated");

      // Analytics (simulado)
      console.log("Nova inscrição na newsletter:", formData.email);
    });

    // Validação em tempo real
    const inputs = newsletterForm.querySelectorAll("input[required]");
    inputs.forEach((input) => {
      input.addEventListener("input", function () {
        if (this.checkValidity()) {
          this.classList.remove("is-invalid");
          this.classList.add("is-valid");
        } else {
          this.classList.remove("is-valid");
          this.classList.add("is-invalid");
        }
      });
    });
  }
}

// Inicializar quando DOM estiver pronto
document.addEventListener("DOMContentLoaded", initNewsletterSystem);
