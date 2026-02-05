// error-pages.js - Sistema unificado para páginas de erro

class ErrorPagesSystem {
  constructor() {
    this.init();
  }

  init() {
    this.initializeTheme();
    this.initializeAnimations();
    this.initializeAnalytics();
    console.log(" Sistema de páginas de erro inicializado");
  }

  initializeTheme() {
    const toggleButton = document.getElementById("toggleDark");
    if (toggleButton) {
      toggleButton.addEventListener("click", () => this.toggleTheme());

      // Load saved theme
      const savedTheme = localStorage.getItem("theme") || "light";
      this.applyTheme(savedTheme);
    }
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-bs-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    this.applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute("data-bs-theme", theme);
    const icon = document.querySelector("#toggleDark i");
    if (icon) {
      icon.className =
        theme === "dark" ? "bi bi-sun-fill" : "bi bi-moon-stars-fill";
    }
  }

  initializeAnimations() {
    // Add entrance animations to error elements
    const errorElements = document.querySelectorAll(".error-code, .error-card");
    errorElements.forEach((element, index) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(30px)";

      setTimeout(() => {
        element.style.transition = "all 0.6s ease-out";
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }, index * 200);
    });
  }

  initializeAnalytics() {
    // Track error page views
    const errorCode =
      document.querySelector(".error-code")?.textContent || "unknown";
    this.trackEvent("error_page_view", {
      error_code: errorCode,
      url: window.location.href,
    });
  }

  trackEvent(eventName, properties) {
    // In real app, send to analytics
    console.log(`Error Page Event: ${eventName}`, properties);

    // Example: Send to Google Analytics
    if (typeof gtag !== "undefined") {
      gtag("event", eventName, properties);
    }
  }

  // Utility methods for all error pages
  redirectToHome() {
    window.location.href = "/";
  }

  contactSupport() {
    window.location.href = "../support/contact.html";
  }

  searchFromError() {
    const searchInput = document.getElementById("errorSearch");
    if (searchInput && searchInput.value.trim()) {
      window.location.href = `../search.html?q=${encodeURIComponent(
        searchInput.value
      )}`;
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  window.errorPagesSystem = new ErrorPagesSystem();
});

// Global functions for HTML onclick attributes
function searchFromError() {
  if (window.errorPagesSystem) {
    window.errorPagesSystem.searchFromError();
  }
}

function redirectToHome() {
  if (window.errorPagesSystem) {
    window.errorPagesSystem.redirectToHome();
  }
}

function contactSupport() {
  if (window.errorPagesSystem) {
    window.errorPagesSystem.contactSupport();
  }
}

console.log(" Sistema de Páginas de Erro carregado com sucesso!");
