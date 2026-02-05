// ==================================================
// SISTEMA DE PÁGINA DE POST - CraveNow
// ==================================================

class PostSystem {
  constructor() {
    this.postData = null;
    this.comments = [];
    this.init();
  }

  init() {
    this.initializeEventListeners();
    this.loadPostData();
    this.initializeScrollSpy();
    this.initializeSocialShare();
    console.log(" Sistema de Post inicializado");
  }

  initializeEventListeners() {
    // Comment form
    const commentForm = document.getElementById("commentForm");
    if (commentForm) {
      commentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleCommentSubmit(e.target);
      });
    }

    // Newsletter form
    const newsletterForm = document.getElementById("postNewsletter");
    if (newsletterForm) {
      newsletterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleNewsletterSubscription(e.target);
      });
    }

    // Like buttons
    document.addEventListener("click", (e) => {
      if (e.target.closest(".btn-outline-danger")) {
        this.handleLikeClick(e.target.closest(".btn-outline-danger"));
      }
    });

    // Table of contents navigation
    document.querySelectorAll(".list-group-item-action").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        this.scrollToSection(link.getAttribute("href"));
      });
    });
  }

  initializeScrollSpy() {
    // Highlight table of contents on scroll
    const sections = document.querySelectorAll("h2, h3");
    const navLinks = document.querySelectorAll(".list-group-item-action");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              link.classList.remove("active", "text-danger", "fw-bold");
              if (link.getAttribute("href") === `#${id}`) {
                link.classList.add("active", "text-danger", "fw-bold");
              }
            });
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: "-20% 0px -20% 0px",
      }
    );

    sections.forEach((section) => {
      const id = section.getAttribute("id");
      if (id) {
        observer.observe(section);
      }
    });
  }

  initializeSocialShare() {
    // Social share buttons
    document.querySelectorAll(".social-share .btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleSocialShare(btn);
      });
    });
  }

  loadPostData() {
    // Simular carregamento de dados do post
    this.postData = {
      id: 1,
      title:
        "A Rica História da Gastronomia Angolana: Dos Tempos Antigos aos Dias de Hoje",
      author: "Chef João Silva",
      date: "2024-12-15",
      readTime: 8,
      views: 2800,
      likes: 248,
      shares: 124,
    };

    // Simular carregamento de comentários
    this.comments = [
      {
        id: 1,
        author: "Maria Santos",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80",
        date: "2024-12-16",
        content:
          "Artigo fantástico! Como angolana no estrangeiro, este texto me fez sentir em casa. Saudades da muamba da minha avó!",
        likes: 8,
      },
      {
        id: 2,
        author: "Carlos Mendes",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80",
        date: "2024-12-15",
        content:
          "Excelente trabalho de pesquisa! Gostaria de ver mais artigos sobre as variações regionais da culinária angolana.",
        likes: 5,
      },
    ];
  }

  handleCommentSubmit(form) {
    const formData = new FormData(form);
    const commentData = {
      author: formData.get("name"),
      email: formData.get("email"),
      content: formData.get("comment"),
    };

    // Validar dados
    if (!commentData.author || !commentData.email || !commentData.content) {
      this.showNotification("Por favor, preencha todos os campos.", "error");
      return;
    }

    // Simular envio
    this.showNotification("A enviar comentário...", "info");

    setTimeout(() => {
      // Adicionar comentário à lista
      const newComment = {
        id: Date.now(),
        author: commentData.author,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          commentData.author
        )}&background=dc3545&color=fff`,
        date: new Date().toISOString().split("T")[0],
        content: commentData.content,
        likes: 0,
      };

      this.comments.unshift(newComment);
      this.updateCommentsDisplay();
      form.reset();

      this.showNotification("Comentário publicado com sucesso!", "success");
    }, 1500);
  }

  updateCommentsDisplay() {
    const commentsContainer = document.querySelector(".comment-list");
    if (!commentsContainer) return;

    commentsContainer.innerHTML = this.comments
      .map(
        (comment) => `
            <div class="card border-0 shadow-sm mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div class="d-flex align-items-center">
                            <img src="${comment.avatar}"
                                class="author-avatar me-2" alt="${
                                  comment.author
                                }">
                            <div>
                                <div class="fw-bold">${comment.author}</div>
                                <div class="text-muted small">${this.formatRelativeTime(
                                  comment.date
                                )}</div>
                            </div>
                        </div>
                        <button class="btn btn-sm btn-outline-danger" data-comment-id="${
                          comment.id
                        }">
                            <i class="bi bi-heart"></i> ${comment.likes}
                        </button>
                    </div>
                    <p class="mb-0">${comment.content}</p>
                </div>
            </div>
        `
      )
      .join("");

    // Re-attach event listeners
    this.initializeEventListeners();
  }

  handleLikeClick(button) {
    const commentId = button.dataset.commentId;

    // Animação de like
    button.disabled = true;
    button.innerHTML = '<i class="bi bi-heart-fill text-danger"></i> ...';

    setTimeout(() => {
      // Atualizar contagem
      const currentLikes = parseInt(button.textContent.match(/\d+/)?.[0] || 0);
      const newLikes = currentLikes + 1;

      button.innerHTML = `<i class="bi bi-heart-fill text-danger"></i> ${newLikes}`;
      button.disabled = false;

      // Atualizar nos dados
      const comment = this.comments.find((c) => c.id == commentId);
      if (comment) {
        comment.likes = newLikes;
      }
    }, 800);
  }

  handleSocialShare(button) {
    const platform = button.textContent.trim();
    const url = window.location.href;
    const title = document.title;

    let shareUrl = "";

    switch (platform) {
      case "Facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case "Twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          title
        )}&url=${encodeURIComponent(url)}`;
        break;
      case "WhatsApp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(
          title + " " + url
        )}`;
        break;
      case "Copiar Link":
        navigator.clipboard.writeText(url).then(() => {
          this.showNotification(
            "Link copiado para a área de transferência!",
            "success"
          );
        });
        return;
      default:
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  }

  handleNewsletterSubscription(form) {
    const email = form.querySelector('input[type="email"]').value;

    if (!this.validateEmail(email)) {
      this.showNotification("Por favor, insira um email válido.", "error");
      return;
    }

    this.showNotification("A subscrever newsletter...", "info");

    setTimeout(() => {
      this.showNotification(
        "🎉 Obrigado por subscrever nossa newsletter!",
        "success"
      );
      form.reset();
    }, 1500);
  }

  scrollToSection(sectionId) {
    const target = document.querySelector(sectionId);
    if (target) {
      const offsetTop = target.offsetTop - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Há 1 dia";
    if (diffDays < 7) return `Há ${diffDays} dias`;
    if (diffDays < 30) return `Há ${Math.floor(diffDays / 7)} semanas`;
    return `Há ${Math.floor(diffDays / 30)} meses`;
  }

  showNotification(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `alert alert-${
      type === "error" ? "danger" : type
    } alert-dismissible fade show position-fixed`;
    toast.style.cssText =
      "top: 20px; right: 20px; z-index: 1060; min-width: 300px;";
    toast.innerHTML = `
            <strong>${
              type === "success"
                ? "<i class='bi bi-check'></i>"
                : type === "error"
                ? "<i class='bi bi-x'></i>"
                : "<i class='bi bi-info'></i>"
            } ${message}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 4000);
  }

  // Métodos para analytics
  trackReadingProgress() {
    const article = document.querySelector("article");
    if (!article) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const percentage = Math.round(
              (entry.boundingClientRect.top /
                (entry.rootBounds.height - entry.boundingClientRect.height)) *
                100
            );
            console.log(`📖 Progresso de leitura: ${100 - percentage}%`);
          }
        });
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    observer.observe(article);
  }

  // Método para tempo de leitura estimado
  calculateReadingTime() {
    const article = document.querySelector("article");
    if (!article) return;

    const text = article.textContent || article.innerText;
    const wordCount = text.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // 200 palavras por minuto

    console.log(`⏱️ Tempo de leitura estimado: ${readingTime} minutos`);
    return readingTime;
  }
}

// ==================================================
// INICIALIZAÇÃO
// ==================================================

document.addEventListener("DOMContentLoaded", function () {
  window.postSystem = new PostSystem();

  // Iniciar tracking de progresso
  setTimeout(() => {
    window.postSystem.trackReadingProgress();
    window.postSystem.calculateReadingTime();
  }, 1000);
});
