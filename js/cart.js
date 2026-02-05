// ==================================================
// SISTEMA DE ACOMPANHAMENTO DO PEDIDO (CLIENTE)
// ==================================================

class AcompanharPedidoSystem {
  constructor() {
    this.orderData = null;
    this.driverData = null;
    this.liveTracking = true;
    this.updateInterval = null;
    this.init();
  }

  init() {
    this.initializeEventListeners();
    this.loadOrderData();
    this.startLiveTracking();
    console.log(" Sistema de acompanhamento do pedido inicializado");
  }

  initializeEventListeners() {
    // Refresh button
    document.getElementById("refreshBtn")?.addEventListener("click", () => {
      this.manualRefresh();
    });

    // Contact buttons
    document.getElementById("callDriverBtn")?.addEventListener("click", () => {
      this.callDriver();
    });

    document
      .getElementById("messageDriverBtn")
      ?.addEventListener("click", () => {
        this.messageDriver();
      });

    // Help button
    document.getElementById("helpBtn")?.addEventListener("click", () => {
      this.showHelpOptions();
    });
  }

  loadOrderData() {
    // Sample order data
    this.orderData = {
      id: "ORD-83492",
      restaurant: "Pizza Palace",
      total: 12500,
      orderTime: "25/12/2024 10:28",
      status: "on-way",
      eta: 12, // minutes
      progress: 75, // percentage
      timeline: [
        { step: "confirmed", time: "10:30 AM", completed: true },
        { step: "preparing", time: "10:45 AM", completed: true },
        { step: "ready", time: "11:15 AM", completed: true },
        { step: "on-way", time: "11:30 AM", completed: true, current: true },
        { step: "arriving", time: null, completed: false },
        { step: "delivered", time: "11:55 AM", completed: false },
      ],
      items: [
        {
          name: "Pizza Margherita Grande",
          description: "Massa tradicional, molho de tomate, mussarela",
          quantity: 1,
          price: 8500,
        },
        {
          name: "Coca-Cola 2L",
          description: "Refrigerante",
          quantity: 1,
          price: 1500,
        },
        {
          name: "Molho Extra",
          description: "Molho de tomate especial",
          quantity: 2,
          price: 500,
        },
      ],
    };

    // Sample driver data
    this.driverData = {
      name: "João Fernandes",
      phone: "+244 923 456 789",
      rating: 4.7,
      totalRatings: 247,
      totalDeliveries: 2100,
      punctuality: 98,
      vehicle: "Moto",
      photo:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    };

    this.updateDisplay();
  }

  startLiveTracking() {
    // Simulate live tracking updates
    this.updateInterval = setInterval(() => {
      if (this.liveTracking && this.orderData) {
        this.updateLiveData();
      }
    }, 30000); // Update every 30 seconds

    // Initial update
    this.updateLiveData();
  }

  updateLiveData() {
    if (this.orderData && this.orderData.eta > 0) {
      // Simulate ETA decreasing
      this.orderData.eta = Math.max(0, this.orderData.eta - 0.5);

      // Simulate progress increasing
      this.orderData.progress = Math.min(100, this.orderData.progress + 2);

      this.updateDisplay();

      // Show notification for significant updates
      if (this.orderData.eta <= 5 && !this.orderData.notified5min) {
        this.showNotification(
          "Seu pedido chegará em aproximadamente 5 minutos!"
        );
        this.orderData.notified5min = true;
      }

      if (this.orderData.eta <= 2 && !this.orderData.notified2min) {
        this.showNotification(
          "Seu pedido está quase chegando! Prepare-se para receber."
        );
        this.orderData.notified2min = true;
      }
    }

    // Simulate driver movement on map
    this.simulateDriverMovement();
  }

  updateDisplay() {
    // Update ETA display
    const etaDisplay = document.getElementById("etaDisplay");
    const liveETA = document.getElementById("liveETA");

    if (etaDisplay && liveETA && this.orderData) {
      const etaMinutes = Math.ceil(this.orderData.eta);
      etaDisplay.textContent = `${etaMinutes} min`;
      liveETA.textContent = `${etaMinutes} minutos`;

      // Change color based on ETA
      if (this.orderData.eta <= 5) {
        etaDisplay.style.color = "#28a745"; // Green
      } else if (this.orderData.eta <= 10) {
        etaDisplay.style.color = "#ffc107"; // Yellow
      } else {
        etaDisplay.style.color = "#dc3545"; // Red
      }
    }

    // Update progress bar
    const progressBar = document.getElementById("deliveryProgress");
    const progressText = document.getElementById("progressText");

    if (progressBar && progressText && this.orderData) {
      progressBar.style.width = `${this.orderData.progress}%`;
      progressText.textContent = `${this.orderData.progress}% do caminho percorrido`;

      // Update progress bar color
      if (this.orderData.progress >= 90) {
        progressBar.classList.remove("bg-warning");
        progressBar.classList.add("bg-success");
      } else if (this.orderData.progress >= 50) {
        progressBar.classList.remove("bg-success", "bg-danger");
        progressBar.classList.add("bg-warning");
      }
    }

    // Update timeline if needed
    this.updateTimeline();
  }

  updateTimeline() {
    if (this.orderData.eta <= 3 && this.orderData.status === "on-way") {
      // Update to "arriving" status
      this.orderData.status = "arriving";

      const timelineItems = document.querySelectorAll(".timeline-item");
      if (timelineItems.length >= 5) {
        // Mark "on-way" as completed
        timelineItems[3].classList.remove("current");
        timelineItems[3].classList.add("completed");

        // Mark "arriving" as current
        timelineItems[4].classList.add("current");

        // Update badge
        const arrivingBadge = timelineItems[4].querySelector(".badge");
        if (arrivingBadge) {
          arrivingBadge.textContent = "EM ANDAMENTO";
          arrivingBadge.className = "badge bg-primary";
        }
      }

      this.showNotification("Seu entregador está chegando!");
    }
  }

  simulateDriverMovement() {
    const driverMarker = document.querySelector(".delivery-man-marker");
    if (driverMarker) {
      // Add slight movement animation to simulate live tracking
      driverMarker.style.transform = "translateX(2px) translateY(-1px)";
      setTimeout(() => {
        driverMarker.style.transform = "translateX(0px) translateY(0px)";
      }, 1000);
    }
  }

  manualRefresh() {
    const button = document.getElementById("refreshBtn");
    const originalHtml = button.innerHTML;

    button.innerHTML =
      '<i class="bi bi-arrow-repeat spinner-border spinner-border-sm"></i>';
    button.disabled = true;

    // Simulate API call
    setTimeout(() => {
      this.updateLiveData();
      button.innerHTML = originalHtml;
      button.disabled = false;
      this.showToast("Dados atualizados!", "success");
    }, 1000);
  }

  callDriver() {
    if (this.driverData) {
      const phone = this.driverData.phone;
      this.showToast(`A ligar para: ${phone}`, "info");

      // In a real app, this would initiate a phone call
      // For demo purposes, we'll simulate the call
      setTimeout(() => {
        this.showNotification("Chamada em curso com o entregador...");
      }, 1000);
    }
  }

  messageDriver() {
    this.showToast("Abrindo conversa com o entregador...", "info");

    // Simulate opening chat
    setTimeout(() => {
      const message = prompt("Digite sua mensagem para o entregador:");
      if (message) {
        this.showToast("Mensagem enviada!", "success");
      }
    }, 500);
  }

  showHelpOptions() {
    const helpOptions = `
            <div class="alert alert-info">
                <h6><i class="bi bi-question-circle"></i> Precisa de ajuda?</h6>
                <div class="mt-2">
                    <button class="btn btn-outline-primary btn-sm me-2" onclick="acompanharPedidoSystem.contactSupport()">
                        <i class="bi bi-headset"></i> Suporte
                    </button>
                    <button class="btn btn-outline-warning btn-sm me-2" onclick="acompanharPedidoSystem.reportProblem()">
                        <i class="bi bi-exclamation-triangle"></i> Reportar Problema
                    </button>
                    <button class="btn btn-outline-danger btn-sm" onclick="acompanharPedidoSystem.cancelOrder()">
                        <i class="bi bi-x-circle"></i> Cancelar Pedido
                    </button>
                </div>
            </div>
        `;

    // Show help options as a toast
    this.showToast(helpOptions, "info", 10000);
  }

  contactSupport() {
    this.showToast("Conectando com o suporte...", "info");
    // In real app, would open support chat/call
  }

  reportProblem() {
    const problem = prompt("Descreva o problema com sua entrega:");
    if (problem) {
      this.showToast(
        "Problema reportado! Entraremos em contacto em breve.",
        "success"
      );
    }
  }

  cancelOrder() {
    if (confirm("Tem certeza que deseja cancelar este pedido?")) {
      this.showToast("Solicitação de cancelamento enviada...", "warning");
      // In real app, would send cancellation request
    }
  }

  showNotification(message) {
    // Create a custom notification
    const notification = document.createElement("div");
    notification.className =
      "alert alert-warning alert-dismissible fade show position-fixed";
    notification.style.cssText =
      "top: 20px; right: 20px; z-index: 1060; max-width: 300px;";
    notification.innerHTML = `
            <i class="bi bi-bell"></i> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
  }

  showToast(message, type = "info", duration = 4000) {
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
                        ${
                          message.includes("<")
                            ? message
                            : `<i class="bi ${icon} me-2"></i>${message}`
                        }
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;

    toastContainer.insertAdjacentHTML("beforeend", toastHTML);

    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, {
      autohide: true,
      delay: duration,
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

  // Cleanup on page unload
  destroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
}

// ==================================================
// INICIALIZAÇÃO
// ==================================================

document.addEventListener("DOMContentLoaded", function () {
  window.acompanharPedidoSystem = new AcompanharPedidoSystem();
});

// Cleanup when leaving page
window.addEventListener("beforeunload", function () {
  if (window.acompanharPedidoSystem) {
    window.acompanharPedidoSystem.destroy();
  }
});
