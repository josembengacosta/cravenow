// ==================================================
// SISTEMA DE RESTAURANTES
// ==================================================

class RestaurantSystem {
  constructor() {
    this.restaurants = [];
    this.filteredRestaurants = [];
    this.currentView = "grid";
    this.filters = {
      search: "",
      category: "",
      sortBy: "relevance",
      priceRange: "all",
      minRating: 0,
      maxDeliveryTime: null,
      features: {
        promo: false,
        open: false,
        freeDelivery: false,
      },
    };
    this.init();
  }

  init() {
    this.initializeEventListeners();
    this.loadSampleRestaurants();
    this.applyFilters();
    console.log(" Sistema de restaurantes inicializado");
  }

  initializeEventListeners() {
    // Search
    const searchInput = document.getElementById("restaurantSearch");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.filters.search = e.target.value;
        this.applyFilters();
      });
    }

    // Category Filter
    const categoryFilter = document.getElementById("categoryFilter");
    if (categoryFilter) {
      categoryFilter.addEventListener("change", (e) => {
        this.filters.category = e.target.value;
        this.applyFilters();
      });
    }

    // Sort By
    const sortBy = document.getElementById("sortBy");
    if (sortBy) {
      sortBy.addEventListener("change", (e) => {
        this.filters.sortBy = e.target.value;
        this.applyFilters();
      });
    }

    // Quick Category Filters
    document.querySelectorAll(".category-filter").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const category = e.target.dataset.category;
        this.filters.category = category;

        // Update active state
        document
          .querySelectorAll(".category-filter")
          .forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");

        this.applyFilters();
      });
    });

    // Price Range
    document.querySelectorAll('input[name="priceRange"]').forEach((radio) => {
      radio.addEventListener("change", (e) => {
        this.filters.priceRange = e.target.id
          .replace("price", "")
          .toLowerCase();
        this.applyFilters();
      });
    });

    // Rating
    document.querySelectorAll('input[name="rating"]').forEach((radio) => {
      radio.addEventListener("change", (e) => {
        const ratingId = e.target.id;
        this.filters.minRating =
          ratingId === "ratingAll" ? 0 : ratingId === "rating4" ? 4.0 : 4.5;
        this.applyFilters();
      });
    });

    // Delivery Time
    document.querySelectorAll('input[name="deliveryTime"]').forEach((radio) => {
      radio.addEventListener("change", (e) => {
        const timeId = e.target.id;
        this.filters.maxDeliveryTime =
          timeId === "timeAll" ? null : timeId === "time30" ? 30 : 45;
        this.applyFilters();
      });
    });

    // Features
    document.getElementById("featurePromo")?.addEventListener("change", (e) => {
      this.filters.features.promo = e.target.checked;
      this.applyFilters();
    });

    document.getElementById("featureOpen")?.addEventListener("change", (e) => {
      this.filters.features.open = e.target.checked;
      this.applyFilters();
    });

    document
      .getElementById("featureFreeDelivery")
      ?.addEventListener("change", (e) => {
        this.filters.features.freeDelivery = e.target.checked;
        this.applyFilters();
      });

    // Clear Filters
    document.getElementById("clearFilters")?.addEventListener("click", () => {
      this.clearFilters();
    });

    // View Toggle
    document.getElementById("gridView")?.addEventListener("click", () => {
      this.switchView("grid");
    });

    document.getElementById("listView")?.addEventListener("click", () => {
      this.switchView("list");
    });

    // Load More
    document.getElementById("loadMore")?.addEventListener("click", () => {
      this.loadMoreRestaurants();
    });

    // Reset Search
    document.getElementById("resetSearch")?.addEventListener("click", () => {
      this.clearFilters();
    });
  }

  loadSampleRestaurants() {
    // Sample restaurant data
    this.restaurants = [
      {
        id: 1,
        name: "Pizza Palace",
        category: "pizza",
        rating: 4.8,
        deliveryTime: "25-35 min",
        priceRange: 2,
        image:
          "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description:
          "As melhores pizzas de Luanda, com ingredientes frescos e massa artesanal.",
        promo: true,
        open: true,
        freeDelivery: true,
        features: ["Grátis", "Online"],
      },
      {
        id: 2,
        name: "Sushi Master",
        category: "sushi",
        rating: 4.9,
        deliveryTime: "35-45 min",
        priceRange: 3,
        image:
          "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description:
          "Sushi autêntico preparado por chefs japoneses. Peixe fresco todos os dias.",
        promo: false,
        open: true,
        freeDelivery: false,
        features: ["Premium", "Online"],
      },
      {
        id: 3,
        name: "Sabores de Angola",
        category: "tradicional",
        rating: 4.7,
        deliveryTime: "20-30 min",
        priceRange: 1,
        image:
          "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description:
          "Comida tradicional angolana feita com receitas familiares e ingredientes locais.",
        promo: true,
        open: true,
        freeDelivery: false,
        features: ["Popular", "Dinheiro"],
      },
      {
        id: 4,
        name: "Churrascaria Brasil",
        category: "churrascaria",
        rating: 4.6,
        deliveryTime: "40-50 min",
        priceRange: 3,
        image:
          "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description:
          "Carnes nobres grelhadas no ponto perfeito. Rodízio delivery disponível.",
        promo: false,
        open: true,
        freeDelivery: true,
        features: ["Rodízio", "Grátis"],
      },
      {
        id: 5,
        name: "Burger House",
        category: "hamburguer",
        rating: 4.5,
        deliveryTime: "25-35 min",
        priceRange: 2,
        image:
          "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description:
          "Hambúrgueres artesanais com ingredientes premium e combinações únicas.",
        promo: true,
        open: false,
        freeDelivery: true,
        features: ["Artesanal", "Grátis"],
      },
      {
        id: 6,
        name: "Green Life",
        category: "vegetariano",
        rating: 4.4,
        deliveryTime: "30-40 min",
        priceRange: 2,
        image:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description:
          "Comida vegetariana e vegana saudável, saborosa e criativa.",
        promo: false,
        open: true,
        freeDelivery: false,
        features: ["Vegano", "Saudável"],
      },
    ];
  }

  applyFilters() {
    let filtered = [...this.restaurants];

    // Search filter
    if (this.filters.search) {
      const searchTerm = this.filters.search.toLowerCase();
      filtered = filtered.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(searchTerm) ||
          restaurant.description.toLowerCase().includes(searchTerm) ||
          restaurant.category.toLowerCase().includes(searchTerm)
      );
    }

    // Category filter
    if (this.filters.category) {
      filtered = filtered.filter(
        (restaurant) => restaurant.category === this.filters.category
      );
    }

    // Price range filter
    if (this.filters.priceRange !== "all") {
      filtered = filtered.filter((restaurant) => {
        if (this.filters.priceRange === "low")
          return restaurant.priceRange === 1;
        if (this.filters.priceRange === "medium")
          return restaurant.priceRange === 2;
        if (this.filters.priceRange === "high")
          return restaurant.priceRange === 3;
        return true;
      });
    }

    // Rating filter
    if (this.filters.minRating > 0) {
      filtered = filtered.filter(
        (restaurant) => restaurant.rating >= this.filters.minRating
      );
    }

    // Delivery time filter
    if (this.filters.maxDeliveryTime) {
      filtered = filtered.filter((restaurant) => {
        const minTime = parseInt(restaurant.deliveryTime.split("-")[0]);
        return minTime <= this.filters.maxDeliveryTime;
      });
    }

    // Features filter
    if (this.filters.features.promo) {
      filtered = filtered.filter((restaurant) => restaurant.promo);
    }
    if (this.filters.features.open) {
      filtered = filtered.filter((restaurant) => restaurant.open);
    }
    if (this.filters.features.freeDelivery) {
      filtered = filtered.filter((restaurant) => restaurant.freeDelivery);
    }

    // Sort results
    filtered = this.sortRestaurants(filtered);

    this.filteredRestaurants = filtered;
    this.displayRestaurants();
  }

  sortRestaurants(restaurants) {
    switch (this.filters.sortBy) {
      case "rating":
        return restaurants.sort((a, b) => b.rating - a.rating);
      case "delivery-time":
        return restaurants.sort((a, b) => {
          const aTime = parseInt(a.deliveryTime.split("-")[0]);
          const bTime = parseInt(b.deliveryTime.split("-")[0]);
          return aTime - bTime;
        });
      case "name":
        return restaurants.sort((a, b) => a.name.localeCompare(b.name));
      case "distance":
        // Simulate distance sorting
        return restaurants.sort((a, b) => Math.random() - 0.5);
      default: // relevance
        return restaurants;
    }
  }

  displayRestaurants() {
    const grid = document.getElementById("restaurantsGrid");
    const noResults = document.getElementById("noResults");
    const restaurantCount = document.getElementById("restaurantCount");

    if (!grid) return;

    // Update count
    if (restaurantCount) {
      restaurantCount.textContent = this.filteredRestaurants.length;
    }

    // Show/hide no results message
    if (noResults) {
      if (this.filteredRestaurants.length === 0) {
        noResults.classList.remove("d-none");
        grid.classList.add("d-none");
        return;
      } else {
        noResults.classList.add("d-none");
        grid.classList.remove("d-none");
      }
    }

    // Clear grid
    grid.innerHTML = "";

    // Add restaurants
    this.filteredRestaurants.forEach((restaurant) => {
      const col = document.createElement("div");
      col.className =
        this.currentView === "grid" ? "col-md-6 col-xl-4" : "col-12";

      col.innerHTML = this.createRestaurantCard(restaurant);
      grid.appendChild(col);
    });
  }

  createRestaurantCard(restaurant) {
    const priceSymbols = ["$", "$$", "$$$"];
    const statusClass = restaurant.open
      ? restaurant.rating > 4.7
        ? "bg-success"
        : "bg-warning text-black"
      : "bg-danger";
    const statusText = restaurant.open
      ? restaurant.rating > 4.7
        ? "Aberto"
        : "Movimentado"
      : "Fechado";

    return `
            <div class="card restaurant-card border-0 shadow-sm h-100">
                <div class="position-relative">
                    <img src="${
                      restaurant.image
                    }" class="card-img-top restaurant-image" alt="${
      restaurant.name
    }">
                    <span class="restaurant-badge badge ${statusClass}">${statusText}</span>
                    ${
                      restaurant.promo
                        ? `
                        <span class="position-absolute top-0 end-0 m-2 badge promo-badge">
                            <i class="bi bi-percent"></i> 20% OFF
                        </span>
                    `
                        : ""
                    }
                </div>
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title fw-bold">${restaurant.name}</h5>
                        <span class="badge bg-light text-black">
                            <i class="bi bi-star-fill text-warning"></i> ${
                              restaurant.rating
                            }
                        </span>
                    </div>
                    <p class="card-text text-muted small mb-2">${
                      restaurant.description
                    }</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="badge delivery-time">
                            <i class="bi bi-clock"></i> ${
                              restaurant.deliveryTime
                            }
                        </span>
                        <span class="price-range">${
                          priceSymbols[restaurant.priceRange - 1]
                        }</span>
                    </div>
                    <div class="mt-3">
                        ${restaurant.features
                          .map(
                            (feature) => `
                            <span class="badge bg-light text-black me-1">
                                <i class="bi bi-${this.getFeatureIcon(
                                  feature
                                )}"></i> ${feature}
                            </span>
                        `
                          )
                          .join("")}
                    </div>
                </div>
                <div class="card-footer bg-transparent border-0">
                    <a href="restaurante-detalhe.html?id=${
                      restaurant.id
                    }" class="btn btn-danger w-100">
                        <i class="bi bi-eye"></i> Ver Cardápio
                    </a>
                </div>
            </div>
        `;
  }

  getFeatureIcon(feature) {
    const icons = {
      Grátis: "truck",
      Online: "credit-card",
      Premium: "award",
      Popular: "heart",
      Dinheiro: "cash",
      Rodízio: "arrow-repeat",
      Artesanal: "gear",
      Vegano: "leaf",
      Saudável: "apple",
    };
    return icons[feature] || "circle";
  }

  clearFilters() {
    // Reset all filters
    this.filters = {
      search: "",
      category: "",
      sortBy: "relevance",
      priceRange: "all",
      minRating: 0,
      maxDeliveryTime: null,
      features: {
        promo: false,
        open: false,
        freeDelivery: false,
      },
    };

    // Reset UI elements
    document.getElementById("restaurantSearch").value = "";
    document.getElementById("categoryFilter").value = "";
    document.getElementById("sortBy").value = "relevance";

    document.querySelectorAll('input[name="priceRange"]').forEach((radio) => {
      radio.checked = radio.id === "priceAll";
    });

    document.querySelectorAll('input[name="rating"]').forEach((radio) => {
      radio.checked = radio.id === "ratingAll";
    });

    document.querySelectorAll('input[name="deliveryTime"]').forEach((radio) => {
      radio.checked = radio.id === "timeAll";
    });

    document.getElementById("featurePromo").checked = false;
    document.getElementById("featureOpen").checked = false;
    document.getElementById("featureFreeDelivery").checked = false;

    // Reset category buttons
    document.querySelectorAll(".category-filter").forEach((btn) => {
      btn.classList.remove("active");
      if (btn.dataset.category === "") {
        btn.classList.add("active");
      }
    });

    this.applyFilters();
  }

  switchView(view) {
    this.currentView = view;

    // Update button states
    document
      .getElementById("gridView")
      .classList.toggle("active", view === "grid");
    document
      .getElementById("listView")
      .classList.toggle("active", view === "list");

    this.displayRestaurants();
  }

  loadMoreRestaurants() {
    // Simulate loading more restaurants
    const button = document.getElementById("loadMore");
    const originalText = button.innerHTML;

    button.innerHTML =
      '<i class="bi bi-arrow-repeat spinner-border spinner-border-sm"></i> A carregar...';
    button.disabled = true;

    setTimeout(() => {
      // In a real app, this would fetch more data from an API
      this.showToast("Mais restaurantes carregados!", "success");
      button.innerHTML = originalText;
      button.disabled = false;
    }, 1500);
  }

  showToast(message, type = "info") {
    // Use existing toast system or create a simple one
    const toast = document.createElement("div");
    toast.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    toast.style.cssText = "top: 20px; right: 20px; z-index: 1060;";
    toast.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}

// ==================================================
// INICIALIZAÇÃO
// ==================================================

document.addEventListener("DOMContentLoaded", function () {
  window.restaurantSystem = new RestaurantSystem();
});
