// search-system.js - Sistema Avançado de Pesquisa para CraveNow

class SearchSystem {
  constructor() {
    this.searchData = [];
    this.currentResults = [];
    this.currentFilters = new Set(["all"]);
    this.searchTerm = "";
    this.init();
  }

  init() {
    this.initializeEventListeners();
    this.loadSearchData();
    this.initializeSearchFromURL();
    console.log(" Sistema de pesquisa inicializado");
  }

  initializeEventListeners() {
    // Main search input
    const searchInput = document.getElementById("mainSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.handleSearchInput(e.target.value);
      });

      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.performSearch();
        }
      });
    }

    // Filter tags
    document.querySelectorAll(".filter-tag").forEach((tag) => {
      tag.addEventListener("click", (e) => {
        this.handleFilterClick(e.target);
      });
    });

    // Category chips
    document.querySelectorAll(".category-chip").forEach((chip) => {
      chip.addEventListener("click", (e) => {
        this.searchByCategory(e.target.getAttribute("data-category"));
      });
    });

    // Search suggestions
    document.querySelectorAll(".search-suggestion").forEach((suggestion) => {
      suggestion.addEventListener("click", (e) => {
        const term = e.target.getAttribute("data-suggestion");
        this.searchByTerm(term);
      });
    });

    // Popular items
    document.querySelectorAll(".cursor-pointer").forEach((item) => {
      item.addEventListener("click", (e) => {
        const term = e.currentTarget
          .getAttribute("onclick")
          ?.match(/'([^']+)'/)?.[1];
        if (term) {
          this.searchByTerm(term);
        }
      });
    });
  }

  loadSearchData() {
    // Simulated search data - In production, this would come from an API
    this.searchData = [
      // Restaurants
      {
        id: 1,
        type: "restaurant",
        name: "Pizza Palace",
        description:
          "As melhores pizzas de Luanda, com ingredientes frescos e massa artesanal.",
        image:
          "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        rating: 4.8,
        deliveryTime: "30-45 min",
        category: "pizza",
        tags: ["pizza", "italiana", "massas"],
        available: true,
        promotion: true,
      },
      {
        id: 2,
        type: "restaurant",
        name: "Sushi Master",
        description: "Sushi autêntico japonês com peixes frescos importados.",
        image:
          "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        rating: 4.9,
        deliveryTime: "40-55 min",
        category: "sushi",
        tags: ["sushi", "japonesa", "saudável"],
        available: true,
        promotion: false,
      },
      {
        id: 3,
        type: "restaurant",
        name: "Burger House",
        description:
          "Hambúrgueres artesanais com carne angolana de primeira qualidade.",
        image:
          "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        rating: 4.6,
        deliveryTime: "25-40 min",
        category: "hamburguer",
        tags: ["hamburguer", "artesanal", "carne"],
        available: true,
        promotion: true,
      },

      // Dishes
      {
        id: 101,
        type: "dish",
        name: "Pizza Calabresa",
        description:
          "Pizza com calabresa fatiada, queijo mozzarella e molho de tomate especial.",
        image:
          "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        price: 4500,
        restaurant: "Pizza Palace",
        category: "pizza",
        tags: ["pizza", "calabresa", "queijo"],
        available: true,
        promotion: false,
      },
      {
        id: 102,
        type: "dish",
        name: "Sushi Salmão",
        description:
          "Sushi fresco com salmão norueguês, arroz japonês e alga nori.",
        image:
          "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        price: 7500,
        restaurant: "Sushi Master",
        category: "sushi",
        tags: ["sushi", "salmão", "japonesa"],
        available: true,
        promotion: true,
      },
      {
        id: 103,
        type: "dish",
        name: "Hambúrguer Artesanal",
        description:
          "Pão brioche, carne angolana 180g, queijo cheddar, bacon e molho especial.",
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        price: 3500,
        restaurant: "Burger House",
        category: "hamburguer",
        tags: ["hamburguer", "artesanal", "carne"],
        available: true,
        promotion: false,
      },

      // Categories
      {
        id: 201,
        type: "category",
        name: "Culinária Tradicional",
        description: "Pratos típicos da culinária angolana e africana.",
        image:
          "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        itemCount: 45,
        tags: ["tradicional", "angolana", "africana"],
      },
      {
        id: 202,
        type: "category",
        name: "Comida Saudável",
        description:
          "Opções nutritivas e balanceadas para uma alimentação saudável.",
        image:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        itemCount: 28,
        tags: ["saudável", "nutritivo", "balanceado"],
      },
    ];
  }

  initializeSearchFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get("q");

    if (searchQuery) {
      document.getElementById("mainSearchInput").value = searchQuery;
      this.searchByTerm(searchQuery);
    }
  }

  handleSearchInput(value) {
    this.searchTerm = value.trim().toLowerCase();

    // Show/hide suggestions
    const suggestions = document.getElementById("searchSuggestions");
    if (this.searchTerm.length > 2) {
      suggestions.style.display = "block";
      this.updateSuggestions();
    } else {
      suggestions.style.display = "none";
    }
  }

  updateSuggestions() {
    // In production, this would make an API call for real suggestions
    console.log("Updating suggestions for:", this.searchTerm);
  }

  handleFilterClick(filterElement) {
    const filter = filterElement.getAttribute("data-filter");

    if (filter === "all") {
      // Clear all other filters when "all" is clicked
      this.currentFilters.clear();
      this.currentFilters.add("all");
      document.querySelectorAll(".filter-tag").forEach((tag) => {
        tag.classList.remove("active");
      });
      filterElement.classList.add("active");
    } else {
      // Remove "all" when specific filter is clicked
      this.currentFilters.delete("all");
      this.currentFilters.add(filter);

      document.querySelectorAll(".filter-tag").forEach((tag) => {
        if (tag.getAttribute("data-filter") === "all") {
          tag.classList.remove("active");
        }
      });
      filterElement.classList.toggle("active");

      if (!filterElement.classList.contains("active")) {
        this.currentFilters.delete(filter);
        // If no filters left, activate "all"
        if (this.currentFilters.size === 0) {
          this.currentFilters.add("all");
          document.querySelector('[data-filter="all"]').classList.add("active");
        }
      }
    }

    this.updateSearchResults();
  }

  performSearch() {
    const searchInput = document.getElementById("mainSearchInput");
    const term = searchInput.value.trim();

    if (term) {
      this.searchByTerm(term);
    } else {
      this.showAllResults();
    }
  }

  searchByTerm(term) {
    document.getElementById("mainSearchInput").value = term;
    this.searchTerm = term.toLowerCase();
    this.updateSearchResults();

    // Update URL
    const newUrl = new URL(window.location);
    newUrl.searchParams.set("q", term);
    window.history.pushState({}, "", newUrl);
  }

  searchByCategory(category) {
    this.searchTerm = category.toLowerCase();
    document.getElementById("mainSearchInput").value =
      this.capitalizeFirstLetter(category);
    this.updateSearchResults();

    // Highlight category chip
    document.querySelectorAll(".category-chip").forEach((chip) => {
      chip.classList.remove("active");
    });
    document
      .querySelector(`[data-category="${category}"]`)
      .classList.add("active");
  }

  updateSearchResults() {
    this.showLoading();

    // Simulate API delay
    setTimeout(() => {
      this.currentResults = this.searchData.filter((item) => {
        // Text search
        const matchesSearch =
          !this.searchTerm ||
          item.name.toLowerCase().includes(this.searchTerm) ||
          item.description.toLowerCase().includes(this.searchTerm) ||
          item.tags.some((tag) => tag.includes(this.searchTerm));

        // Filter matching
        const matchesFilter =
          this.currentFilters.has("all") ||
          (this.currentFilters.has("restaurant") &&
            item.type === "restaurant") ||
          (this.currentFilters.has("dish") && item.type === "dish") ||
          (this.currentFilters.has("category") && item.type === "category") ||
          (this.currentFilters.has("available") && item.available) ||
          (this.currentFilters.has("promotion") && item.promotion);

        return matchesSearch && matchesFilter;
      });

      this.displayResults();
      this.updateSearchStats();
    }, 800);
  }

  displayResults() {
    const resultsContainer = document.getElementById("searchResults");
    const noResults = document.getElementById("noResults");
    const popularSuggestions = document.getElementById("popularSuggestions");

    if (this.currentResults.length === 0) {
      resultsContainer.innerHTML = "";
      noResults.style.display = "block";
      popularSuggestions.style.display = "block";
      return;
    }

    noResults.style.display = "none";
    popularSuggestions.style.display = "none";

    let resultsHTML = "";

    this.currentResults.forEach((result, index) => {
      resultsHTML += this.generateResultHTML(result, index);
    });

    resultsContainer.innerHTML = resultsHTML;

    // Add click handlers to result cards
    document.querySelectorAll(".result-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        const resultId = card.getAttribute("data-id");
        const resultType = card.getAttribute("data-type");
        this.handleResultClick(resultId, resultType);
      });
    });
  }

  generateResultHTML(result, index) {
    const animationDelay = index * 100;

    switch (result.type) {
      case "restaurant":
        return `
                    <div class="col-lg-6 mb-4 fade-in-up" style="animation-delay: ${animationDelay}ms">
                        <div class="card result-card result-restaurant cursor-pointer" data-id="${
                          result.id
                        }" data-type="restaurant">
                            <div class="row g-0">
                                <div class="col-md-4">
                                    <img src="${
                                      result.image
                                    }" class="restaurant-image w-100 h-100" alt="${
          result.name
        }">
                                    <span class="result-type-badge badge bg-danger">Restaurante</span>
                                </div>
                                <div class="col-md-8">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between align-items-start mb-2">
                                            <h5 class="card-title fw-bold">${this.highlightText(
                                              result.name
                                            )}</h5>
                                            <span class="rating-badge">${
                                              result.rating
                                            }★</span>
                                        </div>
                                        <p class="card-text text-muted small">${this.highlightText(
                                          result.description
                                        )}</p>
                                        <div class="d-flex justify-content-between align-items-center">
                                            <span class="delivery-time">
                                                <i class="bi bi-clock"></i> ${
                                                  result.deliveryTime
                                                }
                                            </span>
                                            ${
                                              result.promotion
                                                ? '<span class="badge bg-warning text-dark">Promoção</span>'
                                                : ""
                                            }
                                        </div>
                                        <div class="mt-2">
                                            ${result.tags
                                              .map(
                                                (tag) =>
                                                  `<span class="badge bg-light text-dark me-1">${tag}</span>`
                                              )
                                              .join("")}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

      case "dish":
        return `
                    <div class="col-lg-4 col-md-6 mb-4 fade-in-up" style="animation-delay: ${animationDelay}ms">
                        <div class="card result-card result-dish cursor-pointer" data-id="${
                          result.id
                        }" data-type="dish">
                            <img src="${
                              result.image
                            }" class="dish-image w-100" alt="${result.name}">
                            <span class="result-type-badge badge bg-success">Prato</span>
                            <div class="card-body">
                                <h5 class="card-title fw-bold">${this.highlightText(
                                  result.name
                                )}</h5>
                                <p class="card-text text-muted small">${this.highlightText(
                                  result.description
                                )}</p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="price">${
                                      result.price
                                    } Kz</span>
                                    <small class="text-muted">${
                                      result.restaurant
                                    }</small>
                                </div>
                                ${
                                  result.promotion
                                    ? '<span class="badge bg-warning text-dark mt-2">Promoção Ativa</span>'
                                    : ""
                                }
                            </div>
                        </div>
                    </div>
                `;

      case "category":
        return `
                    <div class="col-lg-3 col-md-4 col-6 mb-4 fade-in-up" style="animation-delay: ${animationDelay}ms">
                        <div class="card result-card result-category cursor-pointer" data-id="${
                          result.id
                        }" data-type="category">
                            <img src="${
                              result.image
                            }" class="dish-image w-100" alt="${result.name}">
                            <span class="result-type-badge badge bg-warning text-dark">Categoria</span>
                            <div class="card-body text-center">
                                <h6 class="card-title fw-bold">${this.highlightText(
                                  result.name
                                )}</h6>
                                <p class="card-text text-muted small">${
                                  result.itemCount
                                } itens</p>
                                <div class="mt-2">
                                    ${result.tags
                                      .slice(0, 2)
                                      .map(
                                        (tag) =>
                                          `<span class="badge bg-light text-dark me-1">${tag}</span>`
                                      )
                                      .join("")}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
    }
  }

  highlightText(text) {
    if (!this.searchTerm) return text;

    const regex = new RegExp(`(${this.searchTerm})`, "gi");
    return text.replace(regex, '<span class="highlight">$1</span>');
  }

  handleResultClick(resultId, resultType) {
    console.log(`Clicked ${resultType} with ID: ${resultId}`);

    // In production, this would navigate to the appropriate page
    switch (resultType) {
      case "restaurant":
        window.location.href = `../restaurant-detail.html?id=${resultId}`;
        break;
      case "dish":
        window.location.href = `../dish-detail.html?id=${resultId}`;
        break;
      case "category":
        window.location.href = `../category.html?id=${resultId}`;
        break;
    }
  }

  updateSearchStats() {
    const statsElement = document.getElementById("searchStats");
    const resultCount = this.currentResults.length;

    if (this.searchTerm) {
      statsElement.textContent = `${resultCount} resultado(s) para "${this.searchTerm}"`;
    } else {
      statsElement.textContent = `${resultCount} resultado(s) encontrado(s)`;
    }
  }

  showLoading() {
    document.getElementById("searchLoading").style.display = "block";
    document.getElementById("searchResults").innerHTML = "";
    document.getElementById("noResults").style.display = "none";

    setTimeout(() => {
      document.getElementById("searchLoading").style.display = "none";
    }, 800);
  }

  showAllResults() {
    this.searchTerm = "";
    this.currentFilters.clear();
    this.currentFilters.add("all");

    document.querySelectorAll(".filter-tag").forEach((tag) => {
      tag.classList.remove("active");
    });
    document.querySelector('[data-filter="all"]').classList.add("active");

    document.getElementById("mainSearchInput").value = "";
    document.getElementById("searchSuggestions").style.display = "none";

    this.currentResults = this.searchData;
    this.displayResults();
    this.updateSearchStats();

    // Clear URL parameter
    const newUrl = new URL(window.location);
    newUrl.searchParams.delete("q");
    window.history.pushState({}, "", newUrl);
  }

  showPopularItems() {
    this.searchByTerm("");
    document.getElementById("mainSearchInput").value = "";
  }

  clearSearch() {
    this.showAllResults();
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

// Global functions for HTML onclick attributes
function performSearch() {
  if (window.searchSystem) {
    window.searchSystem.performSearch();
  }
}

function searchByTerm(term) {
  if (window.searchSystem) {
    window.searchSystem.searchByTerm(term);
  }
}

function clearSearch() {
  if (window.searchSystem) {
    window.searchSystem.clearSearch();
  }
}

function showPopularItems() {
  if (window.searchSystem) {
    window.searchSystem.showPopularItems();
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  window.searchSystem = new SearchSystem();

  console.log(" Sistema de Pesquisa CraveNow carregado com sucesso!");
});
