// press-system.js - Sistema de Imprensa CraveNow

class PressSystem {
  constructor() {
    this.pressItems = [];
    this.filteredItems = [];
    this.currentFilters = {
      type: "type-all",
      category: "category-all",
      year: "year-all",
      source: "source-all",
    };
    this.init();
  }

  init() {
    this.initializeEventListeners();
    this.loadPressData();
    console.log(" Sistema de imprensa inicializado");
  }

  initializeEventListeners() {
    // Filter options
    document.querySelectorAll(".filter-option").forEach((option) => {
      option.addEventListener("click", (e) => {
        this.handleFilterClick(e.target);
      });
    });

    // Resource download buttons
    document.querySelectorAll(".download-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const resource = e.target
          .closest(".resource-card")
          .getAttribute("onclick")
          .match(/'([^']+)'/)[1];
        this.downloadResource(resource);
      });
    });
  }

  loadPressData() {
    // Simulated press data
    this.pressItems = [
      {
        id: 1,
        title: "CraveNow Atinge 1 Milhão de Pedidos em Angola",
        excerpt:
          "Plataforma de delivery angolana celebra marco histórico com crescimento de 200% no último trimestre.",
        content:
          "A CraveNow, principal plataforma de delivery de Angola, anunciou hoje ter alcançado a marca de 1 milhão de pedidos processados através da sua plataforma. Este marco representa um crescimento de 200% no último trimestre...",
        image:
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        date: "2024-01-15",
        type: "release",
        category: "business",
        source: "official",
        isFeatured: true,
        tags: ["crescimento", "milhão", "histórico"],
        downloadUrl: "/press/releases/CraveNow-1m-pedidos.pdf",
      },
      {
        id: 2,
        title: "Nova Funcionalidade: Entrega em 15 Minutos",
        excerpt:
          "Plataforma lança serviço express com tecnologia própria de roteamento inteligente.",
        content:
          "A CraveNow anunciou o lançamento do seu novo serviço de entrega express, prometendo tempos de entrega de apenas 15 minutos em áreas centrais de Luanda. A tecnologia desenvolvida internamente utiliza algoritmos de roteamento inteligente...",
        image:
          "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        date: "2024-01-10",
        type: "news",
        category: "tech",
        source: "official",
        isFeatured: true,
        tags: ["tecnologia", "express", "inovação"],
        downloadUrl: "/press/releases/entrega-express.pdf",
      },
      {
        id: 3,
        title: "Parceria com Restaurantes Tradicionais Angolanos",
        excerpt:
          "Plataforma une-se a 50 restaurantes tradicionais para promover culinária local.",
        content:
          "A CraveNow firmou parceria estratégica com 50 restaurantes tradicionais angolanos, com o objetivo de promover e preservar a culinária local. A iniciativa inclui suporte tecnológico e marketing digital para os estabelecimentos parceiros...",
        image:
          "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        date: "2024-01-08",
        type: "release",
        category: "partnership",
        source: "official",
        isFeatured: false,
        tags: ["parceria", "tradicional", "culinária"],
        downloadUrl: "/press/releases/parceria-tradicional.pdf",
      },
      {
        id: 4,
        title: "Expansão para Benguela e Huíla",
        excerpt:
          "CraveNow anuncia expansão para duas novas províncias no primeiro trimestre.",
        content:
          "A startup de delivery CraveNow confirmou sua expansão para as províncias de Benguela e Huíla, marcando o início de sua expansão nacional. A empresa planeja estar presente em 5 províncias até o final do ano...",
        image:
          "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        date: "2024-01-05",
        type: "news",
        category: "expansion",
        source: "official",
        isFeatured: false,
        tags: ["expansão", "benguela", "huíla"],
        downloadUrl: "/press/releases/expansao-2024.pdf",
      },
      {
        id: 5,
        title: "Jornal de Angola: O Fenómeno CraveNow",
        excerpt:
          "Reportagem especial analisa o impacto da plataforma no mercado angolano.",
        content:
          "Em reportagem de capa, o Jornal de Angola destaca o crescimento exponencial da CraveNow e seu impacto na economia digital do país. A matéria inclui entrevistas com fundadores, parceiros e clientes...",
        image:
          "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        date: "2024-01-03",
        type: "coverage",
        category: "business",
        source: "media",
        isFeatured: true,
        tags: ["reportagem", "jornal", "impacto"],
        externalUrl: "https://jornaldeangola.com/CraveNow-fenomeno",
      },
      {
        id: 6,
        title: "TechAO Analisa Modelo de Negócio Inovador",
        excerpt:
          "Site especializado em tecnologia destaca a estratégia da CraveNow.",
        content:
          "O portal TechAO publicou análise detalhada do modelo de negócio da CraveNow, destacando a estratégia de crescimento e inovação tecnológica. O artigo inclui comparações com players internacionais...",
        image:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        date: "2023-12-20",
        type: "coverage",
        category: "tech",
        source: "blog",
        isFeatured: false,
        tags: ["análise", "tecnologia", "modelo"],
        externalUrl: "https://techaO.com/CraveNow-modelo-inovador",
      },
      {
        id: 7,
        title: "Programa de Sustentabilidade e Impacto Social",
        excerpt:
          "CraveNow anuncia iniciativas de responsabilidade social corporativa.",
        content:
          "A empresa revelou seu programa de sustentabilidade com foco em embalagens ecológicas e apoio a pequenos produtores locais. O programa inclui também capacitação digital para microempreendedores...",
        image:
          "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        date: "2023-12-15",
        type: "release",
        category: "business",
        source: "official",
        isFeatured: false,
        tags: ["sustentabilidade", "social", "ecológico"],
        downloadUrl: "/press/releases/sustentabilidade-2024.pdf",
      },
      {
        id: 8,
        title: "Entrevista com CEO na Rádio Nacional",
        excerpt:
          "Fundador da CraveNow fala sobre desafios e oportunidades do mercado.",
        content:
          "Em entrevista exclusiva à Rádio Nacional de Angola, o CEO da CraveNow discutiu os desafios do mercado de delivery no país e as oportunidades de crescimento. A entrevista abordou também planos futuros...",
        image:
          "https://images.unsplash.com/photo-1589903308904-1010c2294adc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        date: "2023-12-10",
        type: "coverage",
        category: "business",
        source: "media",
        isFeatured: false,
        tags: ["entrevista", "rádio", "CEO"],
        externalUrl: "https://radio nacional.ao/entrevista-CraveNow",
      },
    ];

    this.applyFilters();
  }

  handleFilterClick(option) {
    const filterType = this.getFilterType(option.getAttribute("data-filter"));
    const filterValue = option.getAttribute("data-filter");

    // Update active state
    document
      .querySelectorAll(`.filter-option[data-filter^="${filterType}"]`)
      .forEach((opt) => {
        opt.classList.remove("active");
      });
    option.classList.add("active");

    this.currentFilters[filterType] = filterValue;
    this.applyFilters();
  }

  getFilterType(filterValue) {
    if (filterValue.startsWith("type-")) return "type";
    if (filterValue.startsWith("category-")) return "category";
    if (filterValue.startsWith("year-")) return "year";
    if (filterValue.startsWith("source-")) return "source";
    return "unknown";
  }

  applyFilters() {
    this.showLoading();

    // Simulate API delay
    setTimeout(() => {
      this.filteredItems = this.pressItems.filter((item) => {
        // Type filter
        const matchesType =
          this.currentFilters.type === "type-all" ||
          item.type === this.currentFilters.type.replace("type-", "");

        // Category filter
        const matchesCategory =
          this.currentFilters.category === "category-all" ||
          item.category ===
            this.currentFilters.category.replace("category-", "");

        // Year filter
        const matchesYear =
          this.currentFilters.year === "year-all" ||
          item.date.startsWith(this.currentFilters.year.replace("year-", ""));

        // Source filter
        const matchesSource =
          this.currentFilters.source === "source-all" ||
          item.source === this.currentFilters.source.replace("source-", "");

        return matchesType && matchesCategory && matchesYear && matchesSource;
      });

      // Sort by date (newest first)
      this.filteredItems.sort((a, b) => new Date(b.date) - new Date(a.date));

      this.displayPressItems();
      this.updateStats();
    }, 600);
  }

  displayPressItems() {
    const grid = document.getElementById("pressGrid");
    const loading = document.getElementById("pressLoading");
    const noResults = document.getElementById("noPress");

    loading.style.display = "none";

    if (this.filteredItems.length === 0) {
      grid.style.display = "none";
      noResults.style.display = "block";
      return;
    }

    noResults.style.display = "none";
    grid.style.display = "grid";

    let pressHTML = "";

    this.filteredItems.forEach((item, index) => {
      pressHTML += this.generatePressItemHTML(item, index);
    });

    grid.innerHTML = pressHTML;

    // Update count
    document.getElementById("pressCount").textContent =
      this.filteredItems.length;

    // Add click handlers
    this.initializePressItems();
  }

  generatePressItemHTML(item, index) {
    const animationDelay = index * 100;
    const formattedDate = this.formatDate(item.date);
    const categoryName = this.getCategoryName(item.category);
    const typeName = this.getTypeName(item.type);

    return `
            <div class="fade-in-up ${
              item.isFeatured ? "press-featured" : ""
            }" style="animation-delay: ${animationDelay}ms">
                <div class="card press-card" data-id="${item.id}">
                    ${
                      item.isFeatured
                        ? `
                        <div class="featured-badge">
                            <i class="bi bi-star-fill"></i> Destaque
                        </div>
                    `
                        : ""
                    }
                    
                    <div class="position-relative">
                        <img src="${
                          item.image
                        }" class="news-image w-100" alt="${item.title}">
                        <div class="position-absolute top-0 start-0 m-2">
                            <span class="press-badge">
                                <i class="bi bi-${this.getTypeIcon(
                                  item.type
                                )}"></i> ${typeName}
                            </span>
                        </div>
                    </div>
                    
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <span class="news-category">${categoryName}</span>
                            <span class="press-date">${formattedDate}</span>
                        </div>
                        
                        <h5 class="card-title fw-bold text-press mb-3">${
                          item.title
                        }</h5>
                        
                        <p class="card-text news-excerpt mb-3">${
                          item.excerpt
                        }</p>
                        
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="source-badge">${this.getSourceName(
                              item.source
                            )}</span>
                            
                            ${
                              item.downloadUrl
                                ? `
                                <button class="btn btn-sm btn-press" onclick="pressSystem.downloadItem(${item.id})">
                                    <i class="bi bi-download"></i> PDF
                                </button>
                            `
                                : `
                                <button class="btn btn-sm btn-press" onclick="pressSystem.viewExternal(${item.id})">
                                    <i class="bi bi-box-arrow-up-right"></i> Ler
                                </button>
                            `
                            }
                        </div>
                    </div>
                </div>
            </div>
        `;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-AO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  getCategoryName(category) {
    const categories = {
      business: "Negócios",
      tech: "Tecnologia",
      expansion: "Expansão",
      partnership: "Parcerias",
    };
    return categories[category] || category;
  }

  getTypeName(type) {
    const types = {
      release: "Comunicado",
      news: "Notícia",
      coverage: "Cobertura",
    };
    return types[type] || type;
  }

  getTypeIcon(type) {
    const icons = {
      release: "megaphone",
      news: "newspaper",
      coverage: "tv",
    };
    return icons[type] || "file-text";
  }

  getSourceName(source) {
    const sources = {
      official: "Oficial",
      media: "Media",
      blog: "Blog",
    };
    return sources[source] || source;
  }

  initializePressItems() {
    document.querySelectorAll(".press-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (!e.target.closest("button")) {
          const itemId = card.getAttribute("data-id");
          this.viewItemDetails(itemId);
        }
      });
    });
  }

  viewItemDetails(itemId) {
    const item = this.pressItems.find((i) => i.id === itemId);
    if (item) {
      // In production, this would show a modal with full content
      console.log("Visualizando item de imprensa:", item.title);

      // For now, simulate opening details
      this.showToast(`Abrindo detalhes: ${item.title}`, "info");

      // Track view
      this.trackItemView(itemId);
    }
  }

  downloadItem(itemId) {
    const item = this.pressItems.find((i) => i.id === itemId);
    if (item && item.downloadUrl) {
      // Simulate download
      console.log("Baixando:", item.title);

      this.showToast(` Iniciando download: ${item.title}`, "success");

      // Track download
      this.trackItemDownload(itemId);

      // In production, this would trigger actual download
      setTimeout(() => {
        window.open(item.downloadUrl, "_blank");
      }, 1000);
    }
  }

  viewExternal(itemId) {
    const item = this.pressItems.find((i) => i.id === itemId);
    if (item && item.externalUrl) {
      window.open(item.externalUrl, "_blank");
      this.trackExternalView(itemId);
    }
  }

  downloadResource(resourceType) {
    const resources = {
      "brand-guidelines": {
        name: "Brand Guidelines",
        url: "/media-kit/brand-guidelines.pdf",
      },
      "press-photos": {
        name: "Fotos de Imprensa",
        url: "/media-kit/press-photos.zip",
      },
      "company-facts": {
        name: "Fact Sheet",
        url: "/media-kit/company-facts.pdf",
      },
    };

    const resource = resources[resourceType];
    if (resource) {
      this.showToast(` Baixando: ${resource.name}`, "success");

      // Track resource download
      this.trackResourceDownload(resourceType);

      // Simulate download
      setTimeout(() => {
        console.log("Downloading:", resource.url);
        // In production: window.open(resource.url, '_blank');
      }, 1000);
    }
  }

  clearFilters() {
    // Reset all filters
    this.currentFilters = {
      type: "type-all",
      category: "category-all",
      year: "year-all",
      source: "source-all",
    };

    // Reset UI
    document.querySelectorAll(".filter-option").forEach((option) => {
      option.classList.remove("active");
    });

    document
      .querySelectorAll('.filter-option[data-filter$="-all"]')
      .forEach((option) => {
        option.classList.add("active");
      });

    this.applyFilters();
    this.showToast("Filtros limpos", "success");
  }

  updateStats() {
    // Update statistics
    const totalMentions = this.pressItems.length;
    const mediaPartners = 24; // This would come from API
    const pressReleases = this.pressItems.filter(
      (item) => item.type === "release"
    ).length;
    const coverageCountries = 3; // This would come from API

    document.getElementById("pressMentions").textContent = totalMentions;
    document.getElementById("mediaPartners").textContent = mediaPartners;
    document.getElementById("pressReleases").textContent = pressReleases;
    document.getElementById("coverageCountries").textContent =
      coverageCountries;
  }

  showLoading() {
    document.getElementById("pressLoading").style.display = "block";
    document.getElementById("pressGrid").style.display = "none";
    document.getElementById("noPress").style.display = "none";
  }

  trackItemView(itemId) {
    console.log("Item de imprensa visualizado:", itemId);

    if (typeof gtag !== "undefined") {
      gtag("event", "press_item_view", {
        item_id: itemId,
      });
    }
  }

  trackItemDownload(itemId) {
    console.log("Item de imprensa baixado:", itemId);

    if (typeof gtag !== "undefined") {
      gtag("event", "press_item_download", {
        item_id: itemId,
      });
    }
  }

  trackExternalView(itemId) {
    console.log("Link externo acessado:", itemId);

    if (typeof gtag !== "undefined") {
      gtag("event", "press_external_view", {
        item_id: itemId,
      });
    }
  }

  trackResourceDownload(resourceType) {
    console.log("Recurso baixado:", resourceType);

    if (typeof gtag !== "undefined") {
      gtag("event", "press_resource_download", {
        resource_type: resourceType,
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
function clearFilters() {
  if (window.pressSystem) {
    window.pressSystem.clearFilters();
  }
}

function downloadResource(resourceType) {
  if (window.pressSystem) {
    window.pressSystem.downloadResource(resourceType);
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  window.pressSystem = new PressSystem();

  console.log(" Sistema de Imprensa CraveNow carregado com sucesso!");
});
