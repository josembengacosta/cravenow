// new-restaurants-system.js - Sistema de Novos Restaurantes CraveNow

class NewRestaurantsSystem {
  constructor() {
    this.restaurants = [];
    this.filteredRestaurants = [];
    this.currentFilter = "all";
    this.currentCategory = "all";
    this.currentPage = 1;
    this.restaurantsPerPage = 12;
    this.hasMore = true;
    this.init();
  }

  init() {
    this.initializeEventListeners();
    this.loadRestaurantsData();
    this.initializeFilters();
    console.log(" Sistema de novos restaurantes inicializado");
  }

  initializeEventListeners() {
    // Filter buttons
    document.querySelectorAll(".filter-btn[data-filter]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.handleFilterClick(e.target);
      });
    });

    // Category buttons
    document.querySelectorAll(".filter-btn[data-category]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.handleCategoryClick(e.target);
      });
    });

    // Search functionality
    const searchInput = document.getElementById("searchRestaurants");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.handleSearch(e.target.value);
      });
    }

    // Newsletter subscription
    const newsletterInput = document.getElementById("newsletterEmail");
    if (newsletterInput) {
      newsletterInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.subscribeNewsletter();
        }
      });
    }
  }

  loadRestaurantsData() {
    // Simulated data - In production, this would come from an API
    this.restaurants = [
      {
        id: 1,
        name: "Sabor Brasileiro",
        description:
          "Autêntica culinária brasileira com feijoada, picanha e moqueca.",
        image:
          "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        rating: 4.8,
        reviewCount: 127,
        deliveryTime: "30-45 min",
        deliveryFee: 350,
        category: "brasileira",
        tags: ["feijoada", "churrasco", "tradicional"],
        isNew: true,
        isFeatured: true,
        hasPromo: true,
        isTrending: true,
        isExclusive: false,
        isOpen: true,
        arrivalDate: "2024-01-15",
        promoText: "20% OFF no primeiro pedido",
      },
      {
        id: 2,
        name: "Tokyo Sushi",
        description:
          "Sushi fresco e autêntico com ingredientes importados do Japão.",
        image:
          "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        rating: 4.9,
        reviewCount: 89,
        deliveryTime: "40-55 min",
        deliveryFee: 450,
        category: "sushi",
        tags: ["sushi", "japonês", "saudável"],
        isNew: true,
        isFeatured: false,
        hasPromo: true,
        isTrending: true,
        isExclusive: true,
        isOpen: true,
        arrivalDate: "2024-01-14",
        promoText: "Combo família 15% OFF",
      },
      {
        id: 3,
        name: "Pizza Artesanal",
        description:
          "Pizzas com massa fermentada naturalmente e ingredientes premium.",
        image:
          "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        rating: 4.7,
        reviewCount: 203,
        deliveryTime: "25-40 min",
        deliveryFee: 300,
        category: "pizza",
        tags: ["pizza", "massas", "italiana"],
        isNew: true,
        isFeatured: true,
        hasPromo: false,
        isTrending: false,
        isExclusive: false,
        isOpen: true,
        arrivalDate: "2024-01-13",
      },
      {
        id: 4,
        name: "Green Life",
        description:
          "Comida saudável e nutritiva com opções veganas e vegetarianas.",
        image:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        rating: 4.6,
        reviewCount: 67,
        deliveryTime: "35-50 min",
        deliveryFee: 400,
        category: "saudavel",
        tags: ["saudável", "vegano", "vegetariano"],
        isNew: true,
        isFeatured: false,
        hasPromo: true,
        isTrending: false,
        isExclusive: false,
        isOpen: true,
        arrivalDate: "2024-01-12",
        promoText: "2ª refeição 50% OFF",
      },
      {
        id: 5,
        name: "Burger Master",
        description:
          "Hambúrgueres artesanais com carne angolana e pão caseiro.",
        image:
          "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        rating: 4.5,
        reviewCount: 156,
        deliveryTime: "20-35 min",
        deliveryFee: 250,
        category: "hamburguer",
        tags: ["hambúrguer", "artesanal", "carne"],
        isNew: true,
        isFeatured: false,
        hasPromo: false,
        isTrending: true,
        isExclusive: false,
        isOpen: true,
        arrivalDate: "2024-01-11",
      },
      {
        id: 6,
        name: "Sabores de Angola",
        description:
          "Culinária tradicional angolana com muamba, funge e calulu.",
        image:
          "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        rating: 4.9,
        reviewCount: 234,
        deliveryTime: "45-60 min",
        deliveryFee: 500,
        category: "tradicional",
        tags: ["tradicional", "angolana", "muamba"],
        isNew: true,
        isFeatured: true,
        hasPromo: true,
        isTrending: true,
        isExclusive: true,
        isOpen: true,
        arrivalDate: "2024-01-10",
        promoText: "Prato tradicional + sobremesa grátis",
      },
      // Add more restaurants...
    ];

    // Sort by arrival date (newest first)
    this.restaurants.sort(
      (a, b) => new Date(b.arrivalDate) - new Date(a.arrivalDate)
    );

    this.applyFilters();
  }

  initializeFilters() {
    this.filters = {
      all: () => true,
      featured: (restaurant) => restaurant.isFeatured,
      promo: (restaurant) => restaurant.hasPromo,
      trending: (restaurant) => restaurant.isTrending,
      exclusive: (restaurant) => restaurant.isExclusive,
      opening: (restaurant) => restaurant.isOpen,
    };
  }

  handleFilterClick(button) {
    const filter = button.getAttribute("data-filter");

    // Update active button
    document.querySelectorAll(".filter-btn[data-filter]").forEach((btn) => {
      btn.classList.remove("active");
    });
    button.classList.add("active");

    this.currentFilter = filter;
    this.currentPage = 1;
    this.applyFilters();

    this.showToast(`Filtro: ${this.getFilterName(filter)}`, "info");
  }

  handleCategoryClick(button) {
    const category = button.getAttribute("data-category");

    // Toggle active state
    button.classList.toggle("active");

    if (button.classList.contains("active")) {
      this.currentCategory = category;
    } else {
      this.currentCategory = "all";
      // If no category is active, activate "all" filter
      document.querySelector('.filter-btn[data-filter="all"]').click();
    }

    this.currentPage = 1;
    this.applyFilters();
  }

  handleSearch(searchTerm) {
    this.searchTerm = searchTerm.toLowerCase();
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters() {
    this.showLoading();

    // Simulate API delay
    setTimeout(() => {
      this.filteredRestaurants = this.restaurants.filter((restaurant) => {
        // Filter matching
        const matchesFilter = this.filters[this.currentFilter](restaurant);

        // Category matching
        const matchesCategory =
          this.currentCategory === "all" ||
          restaurant.category === this.currentCategory;

        // Search matching
        const matchesSearch =
          !this.searchTerm ||
          restaurant.name.toLowerCase().includes(this.searchTerm) ||
          restaurant.description.toLowerCase().includes(this.searchTerm) ||
          restaurant.tags.some((tag) => tag.includes(this.searchTerm));

        return matchesFilter && matchesCategory && matchesSearch;
      });

      this.displayRestaurants();
      this.updateStats();
    }, 800);
  }

  displayRestaurants() {
    const grid = document.getElementById("newRestaurantsGrid");
    const loading = document.getElementById("restaurantsLoading");
    const noResults = document.getElementById("noRestaurants");
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    const allLoaded = document.getElementById("allLoaded");

    loading.style.display = "none";

    if (this.filteredRestaurants.length === 0) {
      grid.style.display = "none";
      noResults.style.display = "block";
      loadMoreBtn.style.display = "none";
      allLoaded.style.display = "none";
      return;
    }

    noResults.style.display = "none";
    grid.style.display = "grid";

    // Calculate pagination
    const startIndex = 0;
    const endIndex = this.currentPage * this.restaurantsPerPage;
    const restaurantsToShow = this.filteredRestaurants.slice(
      startIndex,
      endIndex
    );

    let restaurantsHTML = "";

    restaurantsToShow.forEach((restaurant, index) => {
      restaurantsHTML += this.generateRestaurantHTML(restaurant, index);
    });

    grid.innerHTML = restaurantsHTML;

    // Show/hide load more button
    this.hasMore = endIndex < this.filteredRestaurants.length;
    loadMoreBtn.style.display = this.hasMore ? "block" : "none";
    allLoaded.style.display = this.hasMore ? "none" : "block";

    // Add click handlers
    this.initializeRestaurantCards();
  }

  generateRestaurantHTML(restaurant, index) {
    const animationDelay = index * 100;
    const daysAgo = this.getDaysAgo(restaurant.arrivalDate);

    return `
            <div class="slide-in-up" style="animation-delay: ${animationDelay}ms">
                <div class="card restaurant-card ${
                  restaurant.isFeatured ? "featured-restaurant" : ""
                }" 
                     data-id="${restaurant.id}">
                    <div class="position-relative">
                        <img src="${
                          restaurant.image
                        }" class="restaurant-image w-100" alt="${
      restaurant.name
    }">
                        <div class="new-badge">
                            <i class="bi bi-star-fill"></i> NOVO
                        </div>
                        ${
                          restaurant.hasPromo
                            ? `
                            <div class="position-absolute top-0 end-0 m-2">
                                <span class="promo-badge">${restaurant.promoText}</span>
                            </div>
                        `
                            : ""
                        }
                        ${
                          restaurant.isExclusive
                            ? `
                            <div class="position-absolute bottom-0 start-0 m-2">
                                <span class="exclusive-badge">EXCLUSIVO</span>
                            </div>
                        `
                            : ""
                        }
                    </div>
                    
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title fw-bold">${
                              restaurant.name
                            }</h5>
                            <span class="rating-badge">${
                              restaurant.rating
                            }★</span>
                        </div>
                        
                        <p class="card-text text-muted small mb-3">${
                          restaurant.description
                        }</p>
                        
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="category-badge">${this.getCategoryName(
                              restaurant.category
                            )}</span>
                            <span class="arrival-date">Há ${daysAgo} dias</span>
                        </div>
                        
                        <div class="delivery-info mb-3">
                            <i class="bi bi-clock"></i> ${
                              restaurant.deliveryTime
                            } • 
                            <i class="bi bi-truck"></i> ${
                              restaurant.deliveryFee
                            } Kz
                        </div>
                        
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">
                                <i class="bi bi-chat"></i> ${
                                  restaurant.reviewCount
                                } avaliações
                            </small>
                            ${
                              restaurant.isTrending
                                ? `
                                <span class="trending-badge">
                                    <i class="bi bi-fire"></i> Em Alta
                                </span>
                            `
                                : ""
                            }
                        </div>
                    </div>
                    
                    <div class="card-footer bg-transparent border-0 pt-0">
                        <button class="btn btn-danger w-100" onclick="newRestaurantsSystem.viewRestaurant(${
                          restaurant.id
                        })">
                            <i class="bi bi-eye"></i> Ver Restaurante
                        </button>
                    </div>
                </div>
            </div>
        `;
  }

  initializeRestaurantCards() {
    document.querySelectorAll(".restaurant-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (!e.target.closest("button")) {
          const restaurantId = card.getAttribute("data-id");
          this.viewRestaurant(restaurantId);
        }
      });
    });
  }

  getDaysAgo(dateString) {
    const arrivalDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - arrivalDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getCategoryName(category) {
    const categories = {
      pizza: "Pizza",
      hamburguer: "Hambúrguer",
      sushi: "Sushi",
      tradicional: "Tradicional",
      saudavel: "Saudável",
      brasileira: "Brasileira",
      churrasco: "Churrasco",
      sobremesa: "Sobremesas",
    };
    return categories[category] || category;
  }

  getFilterName(filter) {
    const names = {
      all: "Todos",
      featured: "Em Destaque",
      promo: "Com Promoção",
      trending: "Em Alta",
      exclusive: "Exclusivos",
      opening: "Abertos Agora",
    };
    return names[filter] || filter;
  }

  viewRestaurant(restaurantId) {
    const restaurant = this.restaurants.find((r) => r.id === restaurantId);
    if (restaurant) {
      // In production, this would navigate to restaurant detail page
      console.log("Visualizando restaurante:", restaurant.name);
      window.location.href = `../restaurant-detail.html?id=${restaurantId}`;

      // Track view
      this.trackRestaurantView(restaurantId);
    }
  }

  loadMore() {
    this.currentPage++;
    this.applyFilters();

    // Scroll to newly loaded items
    setTimeout(() => {
      const newItems = document.querySelectorAll(".slide-in-up");
      if (newItems.length > 0) {
        newItems[newItems.length - 1].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, 300);
  }

  updateStats() {
    // Update statistics
    const newThisWeek = this.restaurants.filter(
      (r) => this.getDaysAgo(r.arrivalDate) <= 7
    ).length;
    const totalNew = this.restaurants.length;
    const avgRating = (
      this.restaurants.reduce((sum, r) => sum + r.rating, 0) / totalNew
    ).toFixed(1);
    const promoCount = this.restaurants.filter((r) => r.hasPromo).length;

    document.getElementById("newThisWeek").textContent = newThisWeek;
    document.getElementById("totalNew").textContent = totalNew;
    document.getElementById("avgRating").textContent = avgRating;
    document.getElementById("promoCount").textContent = promoCount;
  }

  showLoading() {
    document.getElementById("restaurantsLoading").style.display = "block";
    document.getElementById("newRestaurantsGrid").style.display = "none";
  }

  showRandomRestaurant() {
    if (this.filteredRestaurants.length === 0) return;

    const randomIndex = Math.floor(
      Math.random() * this.filteredRestaurants.length
    );
    const randomRestaurant = this.filteredRestaurants[randomIndex];

    this.viewRestaurant(randomRestaurant.id);

    this.showToast(`Descobrindo: ${randomRestaurant.name}`, "info");
  }

  clearFilters() {
    this.currentFilter = "all";
    this.currentCategory = "all";
    this.currentPage = 1;

    // Reset all filter buttons
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document
      .querySelector('.filter-btn[data-filter="all"]')
      .classList.add("active");

    this.applyFilters();
    this.showToast("Filtros limpos", "success");
  }

  subscribeNewsletter() {
    const emailInput = document.getElementById("newsletterEmail");
    const email = emailInput.value.trim();

    if (!email) {
      this.showToast("Por favor, insira seu email", "warning");
      emailInput.focus();
      return;
    }

    if (!this.validateEmail(email)) {
      this.showToast("Email inválido", "warning");
      return;
    }

    // Simulate subscription
    emailInput.disabled = true;
    const subscribeBtn = emailInput.nextElementSibling;
    const originalText = subscribeBtn.innerHTML;
    subscribeBtn.innerHTML =
      '<i class="bi bi-arrow-repeat spinner-border spinner-border-sm"></i>';

    setTimeout(() => {
      this.showToast(
        "🎉 Inscrito com sucesso! Você receberá alertas de novos restaurantes.",
        "success"
      );
      emailInput.value = "";
      emailInput.disabled = false;
      subscribeBtn.innerHTML = originalText;

      // Track subscription
      this.trackNewsletterSubscription(email);
    }, 1500);
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  trackRestaurantView(restaurantId) {
    console.log("Restaurante visualizado:", restaurantId);

    if (typeof gtag !== "undefined") {
      gtag("event", "restaurant_view", {
        restaurant_id: restaurantId,
        page: "new_restaurants",
      });
    }
  }

  trackNewsletterSubscription(email) {
    console.log("Newsletter inscrito:", email);

    if (typeof gtag !== "undefined") {
      gtag("event", "newsletter_subscription", {
        email: email,
        page: "new_restaurants",
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
function loadMore() {
  if (window.newRestaurantsSystem) {
    window.newRestaurantsSystem.loadMore();
  }
}

function subscribeNewsletter() {
  if (window.newRestaurantsSystem) {
    window.newRestaurantsSystem.subscribeNewsletter();
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  window.newRestaurantsSystem = new NewRestaurantsSystem();

  console.log(" Sistema de Novos Restaurantes CraveNow carregado com sucesso!");
});
