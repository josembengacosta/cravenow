// ==================================================
// SISTEMA DE AJUDA E SUPORTE
// ==================================================

class HelpSystem {
  constructor() {
    this.faqData = [];
    this.searchResults = [];
    this.searchTimeout = null;
    this.init();
  }

  init() {
    this.initializeEventListeners();
    this.loadFAQData();
    this.initializeScrollSpy();
    this.addMissingFAQs();
    console.log(" Sistema de ajuda inicializado");
  }

  initializeEventListeners() {
    // Pesquisa
    const searchInput = document.getElementById("helpSearch");
    const searchButton = document.getElementById("searchButton");

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        // Limpar timeout anterior
        if (this.searchTimeout) {
          clearTimeout(this.searchTimeout);
        }

        // Configurar novo timeout para pesquisa após 500ms
        this.searchTimeout = setTimeout(() => {
          this.handleSearch(e.target.value);
        }, 500);
      });

      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          // Limpar timeout se usuário pressionar Enter
          if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
          }
          this.performSearch();
        }
      });

      // Permitir digitação normalmente
      searchInput.addEventListener("keydown", (e) => {
        // Não interferir com teclas normais de digitação
        if (e.key.length === 1 || e.key === "Backspace" || e.key === "Delete") {
          return true;
        }
      });
    }

    if (searchButton) {
      searchButton.addEventListener("click", () => this.performSearch());
    }

    // Feedback
    document
      .getElementById("helpfulYes")
      ?.addEventListener("click", () => this.handleFeedback(true));
    document
      .getElementById("helpfulNo")
      ?.addEventListener("click", () => this.handleFeedback(false));

    // Chat
    document
      .getElementById("startChat")
      ?.addEventListener("click", () => this.startChat());

    // Botões de ajuda rápida
    document
      .querySelectorAll(
        '[href="#fazer-pedido"], [href="#acompanhar-entrega"], [href="#problemas-pagamento"]'
      )
      .forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const target = btn.getAttribute("href");
          this.scrollToSection(target);
        });
      });

    // Smooth scroll para âncoras
    this.initializeSmoothScroll();

    // Contador de caracteres para feedback
    this.initializeCharCounter();
  }

  initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }

  scrollToSection(sectionId) {
    const target = document.querySelector(sectionId);
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Adicionar classe ativa na navegação
      document.querySelectorAll(".list-group-item").forEach((item) => {
        item.classList.remove("active");
        if (item.getAttribute("href") === sectionId) {
          item.classList.add("active");
        }
      });
    }
  }

  initializeScrollSpy() {
    const sidebarLinks = document.querySelectorAll(
      '.list-group-item[href^="#"]'
    );
    const sections = document.querySelectorAll(".faq-category, #contactos");

    const observerOptions = {
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          sidebarLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${id}`) {
              link.classList.add("active");
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));
  }

  initializeCharCounter() {
    const commentField = document.getElementById("feedbackComment");
    if (commentField) {
      commentField.addEventListener("input", (e) => {
        const charCount = e.target.value.length;
        document.getElementById("charCount").textContent = charCount;

        if (charCount > 450) {
          document.getElementById("charCount").classList.add("text-warning");
        } else {
          document.getElementById("charCount").classList.remove("text-warning");
        }
      });
    }
  }

  addMissingFAQs() {
    // Adicionar seções que estavam faltando
    this.addMinhaContaFAQs();
    this.addRestaurantesFAQs();
    this.addFazerPedidoSection();
    this.addAcompanharEntregaSection();
    this.addProblemasPagamentoSection();
  }

  addMinhaContaFAQs() {
    const contaSection = document.getElementById("conta");
    if (!contaSection) {
      // Criar seção Minha Conta se não existir
      const pagamentosSection = document.getElementById("pagamentos");
      if (pagamentosSection) {
        const newSection = document.createElement("div");
        newSection.className = "faq-category mb-4";
        newSection.id = "conta";
        newSection.innerHTML = `
                    <h4 class="fw-bold mb-3 text-info">
                        <i class="bi bi-person me-2"></i>Minha Conta
                    </h4>
                    
                    <div class="accordion-item faq-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq7">
                                Como criar uma conta na CraveNow?
                            </button>
                        </h2>
                        <div id="faq7" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                            <div class="accordion-body">
                                <p>Para criar sua conta:</p>
                                <ol>
                                    <li>Clique em "Registar" no canto superior direito</li>
                                    <li>Preencha seu email e crie uma senha segura</li>
                                    <li>Confirme seu email através do link que enviaremos</li>
                                    <li>Complete seu perfil com nome, telefone e endereço</li>
                                </ol>
                                <p class="text-success mb-0">
                                    <i class="bi bi-lightning"></i>
                                    <strong>Dica:</strong> Com conta você salva endereços, vê histórico de pedidos e tem ofertas exclusivas!
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item faq-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq8">
                                Esqueci minha senha. Como recuperar?
                            </button>
                        </h2>
                        <div id="faq8" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                            <div class="accordion-body">
                                <p>Siga estes passos para recuperar sua senha:</p>
                                <ol>
                                    <li>Clique em "Entrar"</li>
                                    <li>Selecione "Esqueci minha senha"</li>
                                    <li>Digite o email da sua conta</li>
                                    <li>Clique no link que enviaremos por email</li>
                                    <li>Crie uma nova senha</li>
                                </ol>
                                <div class="alert alert-warning mt-3">
                                    <i class="bi bi-exclamation-triangle"></i>
                                    <strong>Problemas?</strong> Se não receber o email em 5 minutos, verifique sua pasta de spam.
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item faq-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq9">
                                Como alterar meus dados pessoais?
                            </button>
                        </h2>
                        <div id="faq9" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                            <div class="accordion-body">
                                <p>Para atualizar seus dados:</p>
                                <ol>
                                    <li>Faça login na sua conta</li>
                                    <li>Clique no seu nome no canto superior direito</li>
                                    <li>Selecione "Meu Perfil"</li>
                                    <li>Edite as informações desejadas</li>
                                    <li>Clique em "Salvar Alterações"</li>
                                </ol>
                                <p class="mb-0">Você pode alterar: nome, telefone, email, endereços e preferências.</p>
                            </div>
                        </div>
                    </div>
                `;
        pagamentosSection.parentNode.insertBefore(
          newSection,
          pagamentosSection.nextSibling
        );
      }
    }
  }

  addRestaurantesFAQs() {
    const restaurantesSection = document.getElementById("restaurantes");
    if (!restaurantesSection) {
      // Criar seção Restaurantes se não existir
      const contaSection =
        document.getElementById("conta") ||
        document.querySelector(".faq-category:last-child");
      if (contaSection) {
        const newSection = document.createElement("div");
        newSection.className = "faq-category mb-4";
        newSection.id = "restaurantes";
        newSection.innerHTML = `
                    <h4 class="fw-bold mb-3 text-secondary">
                        <i class="bi bi-shop me-2"></i>Restaurantes
                    </h4>
                    
                    <div class="accordion-item faq-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq10">
                                Como encontrar restaurantes perto de mim?
                            </button>
                        </h2>
                        <div id="faq10" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                            <div class="accordion-body">
                                <p>Encontrar restaurantes próximos é fácil:</p>
                                <ul>
                                    <li><strong>Localização automática:</strong> Permitir acesso à sua localização</li>
                                    <li><strong>Buscar por nome:</strong> Use a barra de pesquisa</li>
                                    <li><strong>Filtrar por categoria:</strong> Pizza, sushi, tradicional, etc.</li>
                                    <li><strong>Ver no mapa:</strong> Restaurantes mais próximos primeiro</li>
                                </ul>
                                <p class="text-success mb-0">
                                    <i class="bi bi-star"></i>
                                    <strong>Dica:</strong> Restaurantes com avaliação acima de 4.5⭐ têm entrega mais rápida!
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item faq-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq11">
                                Os restaurantes são verificados?
                            </button>
                        </h2>
                        <div id="faq11" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                            <div class="accordion-body">
                                <div class="alert alert-success">
                                    <i class="bi bi-shield-check"></i>
                                    <strong>Sim, todos os restaurantes são rigorosamente verificados!</strong>
                                </div>
                                <p>Nossa verificação inclui:</p>
                                <ul>
                                    <li>Licença sanitária válida</li>
                                    <li>Inspeção da cozinha e instalações</li>
                                    <li>Qualidade dos ingredientes</li>
                                    <li>Treinamento da equipe</li>
                                    <li>Avaliações de clientes</li>
                                </ul>
                                <p class="mb-0">Sua segurança alimentar é nossa prioridade!</p>
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item faq-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq12">
                                Como funciona o sistema de avaliações?
                            </button>
                        </h2>
                        <div id="faq12" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                            <div class="accordion-body">
                                <p>Após cada pedido, você pode avaliar:</p>
                                <div class="row">
                                    <div class="col-md-6">
                                        <h6><i class="bi bi-star-fill text-warning"></i> Restaurante:</h6>
                                        <ul>
                                            <li>Qualidade da comida (1-5 estrelas)</li>
                                            <li>Embalagem e apresentação</li>
                                            <li>Fidelidade ao pedido</li>
                                        </ul>
                                    </div>
                                    <div class="col-md-6">
                                        <h6><i class="bi bi-bicycle text-primary"></i> Entrega:</h6>
                                        <ul>
                                            <li>Pontualidade</li>
                                            <li>Atendimento do entregador</li>
                                            <li>Estado da entrega</li>
                                        </ul>
                                    </div>
                                </div>
                                <p class="mb-0">Suas avaliações ajudam outros clientes e melhoram nossos serviços!</p>
                            </div>
                        </div>
                    </div>
                `;
        contaSection.parentNode.insertBefore(
          newSection,
          contaSection.nextSibling
        );
      }
    }
  }

  addFazerPedidoSection() {
    // Adicionar âncora para "Fazer Pedido"
    const fazerPedidoSection = document.createElement("div");
    fazerPedidoSection.id = "fazer-pedido";
    fazerPedidoSection.innerHTML = `
            <div class="faq-category mb-4">
                <h4 class="fw-bold mb-3 text-primary">
                    <i class="bi bi-cart-plus me-2"></i>Como Fazer um Pedido
                </h4>
                
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <div class="card border-0 shadow-sm h-100">
                            <div class="card-body">
                                <h5 class="fw-bold text-primary">1. Encontrar Restaurante</h5>
                                <p class="text-muted">Use a busca ou navegue pelas categorias para encontrar o restaurante ideal.</p>
                                <ul>
                                    <li>Digite o nome ou tipo de comida</li>
                                    <li>Filtre por avaliação ou tempo de entrega</li>
                                    <li>Veja o cardápio completo</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-6 mb-3">
                        <div class="card border-0 shadow-sm h-100">
                            <div class="card-body">
                                <h5 class="fw-bold text-success">2. Fazer o Pedido</h5>
                                <p class="text-muted">Selecione os itens e personalize seu pedido.</p>
                                <ul>
                                    <li>Escolha tamanhos e quantidades</li>
                                    <li>Adicione observações especiais</li>
                                    <li>Verifique o valor total</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-6 mb-3">
                        <div class="card border-0 shadow-sm h-100">
                            <div class="card-body">
                                <h5 class="fw-bold text-warning">3. Pagamento</h5>
                                <p class="text-muted">Escolha a forma de pagamento mais conveniente.</p>
                                <ul>
                                    <li>Cartão de crédito/débito</li>
                                    <li>Multicaixa Express</li>
                                    <li>Dinheiro na entrega</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-6 mb-3">
                        <div class="card border-0 shadow-sm h-100">
                            <div class="card-body">
                                <h5 class="fw-bold text-info">4. Acompanhar</h5>
                                <p class="text-muted">Acompanhe seu pedido em tempo real.</p>
                                <ul>
                                    <li>Status do preparo</li>
                                    <li>Localização do entregador</li>
                                    <li>Tempo estimado de entrega</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

    // Inserir após a seção de FAQ geral
    const faqSection = document.getElementById("faq");
    if (faqSection) {
      faqSection.parentNode.insertBefore(
        fazerPedidoSection,
        faqSection.nextSibling
      );
    }
  }

  addAcompanharEntregaSection() {
    const acompanharSection = document.createElement("div");
    acompanharSection.id = "acompanhar-entrega";
    acompanharSection.innerHTML = `
            <div class="faq-category mb-4">
                <h4 class="fw-bold mb-3 text-success">
                    <i class="bi bi-bicycle me-2"></i>Acompanhar Sua Entrega
                </h4>
                
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i>
                    <strong>Acompanhe seu pedido em tempo real!</strong> Saiba exatamente onde está seu pedido a qualquer momento.
                </div>
                
                <div class="row mt-4">
                    <div class="col-md-8">
                        <h5>Como funciona o rastreamento:</h5>
                        <ol>
                            <li><strong>Pedido Confirmado:</strong> Restaurante aceitou seu pedido</li>
                            <li><strong>Em Preparação:</strong> Sua comida está sendo preparada</li>
                            <li><strong>Saiu para Entrega:</strong> Entregador a caminho</li>
                            <li><strong>Chegando:</strong> Entregador na sua região (5-10 min)</li>
                            <li><strong>Entregue:</strong> Pedido concluído com sucesso!</li>
                        </ol>
                    </div>
                    <div class="col-md-4">
                        <div class="card bg-success text-white">
                            <div class="card-body text-center">
                                <i class="bi bi-phone display-4 mb-3"></i>
                                <h5>App CraveNow</h5>
                                <p class="mb-0">Baixe nosso app para melhor experiência de rastreamento!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

    const fazerPedidoSection = document.getElementById("fazer-pedido");
    if (fazerPedidoSection) {
      fazerPedidoSection.parentNode.insertBefore(
        acompanharSection,
        fazerPedidoSection.nextSibling
      );
    }
  }

  addProblemasPagamentoSection() {
    const problemasSection = document.createElement("div");
    problemasSection.id = "problemas-pagamento";
    problemasSection.innerHTML = `
            <div class="faq-category mb-4">
                <h4 class="fw-bold mb-3 text-warning">
                    <i class="bi bi-credit-card me-2"></i>Problemas com Pagamento
                </h4>
                
                <div class="alert alert-warning">
                    <i class="bi bi-exclamation-triangle"></i>
                    <strong>Problemas no pagamento?</strong> Veja as soluções mais comuns abaixo.
                </div>
                
                <div class="row">
                    <div class="col-md-6 mb-4">
                        <div class="card border-warning h-100">
                            <div class="card-header bg-warning text-white">
                                <h6 class="mb-0"><i class="bi bi-credit-card"></i> Cartão Recusado</h6>
                            </div>
                            <div class="card-body">
                                <p><strong>Possíveis causas:</strong></p>
                                <ul>
                                    <li>Saldo insuficiente</li>
                                    <li>Limite do cartão excedido</li>
                                    <li>Dados incorretos</li>
                                    <li>Cartão bloqueado</li>
                                </ul>
                                <p><strong>Solução:</strong> Verifique os dados ou use outro método de pagamento.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-6 mb-4">
                        <div class="card border-warning h-100">
                            <div class="card-header bg-warning text-white">
                                <h6 class="mb-0"><i class="bi bi-phone"></i> Multicaixa Não Funciona</h6>
                            </div>
                            <div class="card-body">
                                <p><strong>Possíveis causas:</strong></p>
                                <ul>
                                    <li>Problema temporário do sistema</li>
                                    <li>App desatualizado</li>
                                    <li>Saldo insuficiente</li>
                                </ul>
                                <p><strong>Solução:</strong> Tente novamente em 5 minutos ou use cartão.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="text-center mt-4">
                    <p class="text-muted">Problema não resolvido?</p>
                    <button class="btn btn-danger" onclick="helpSystem.startChat()">
                        <i class="bi bi-headset"></i> Falar com Suporte
                    </button>
                </div>
            </div>
        `;

    const acompanharSection = document.getElementById("acompanhar-entrega");
    if (acompanharSection) {
      acompanharSection.parentNode.insertBefore(
        problemasSection,
        acompanharSection.nextSibling
      );
    }
  }

  loadFAQData() {
    // Dados das FAQs para pesquisa (atualizado com novas FAQs)
    this.faqData = [
      {
        id: "faq1",
        question: "Como faço para cancelar um pedido?",
        answer:
          'Você pode cancelar um pedido enquanto ele estiver com status "Em preparação"...',
        category: "pedidos",
        tags: ["cancelar", "pedido", "cancelamento"],
      },
      {
        id: "faq2",
        question: "Posso alterar um pedido depois de feito?",
        answer:
          "Alterações no pedido são possíveis apenas nos primeiros 5 minutos...",
        category: "pedidos",
        tags: ["alterar", "pedido", "mudança"],
      },
      {
        id: "faq3",
        question: "Meu pedido chegou incompleto. O que fazer?",
        answer: "Relate o problema em até 2 horas após a entrega...",
        category: "pedidos",
        tags: ["incompleto", "problema", "itens em falta"],
      },
      {
        id: "faq4",
        question: "Qual o tempo médio de entrega?",
        answer: "O tempo de entrega varia conforme localização, trânsito...",
        category: "entregas",
        tags: ["tempo", "entrega", "duração"],
      },
      {
        id: "faq5",
        question: "Posso rastrear meu pedido em tempo real?",
        answer: "Sim! Você pode acompanhar seu pedido em tempo real...",
        category: "entregas",
        tags: ["rastrear", "acompanhar", "localização"],
      },
      {
        id: "faq6",
        question: "Quais métodos de pagamento são aceites?",
        answer: "Aceitamos Multicaixa, cartões, dinheiro...",
        category: "pagamentos",
        tags: ["pagamento", "multicaixa", "cartão", "dinheiro"],
      },
      {
        id: "faq7",
        question: "Como criar uma conta na CraveNow?",
        answer: "Para criar sua conta...",
        category: "conta",
        tags: ["conta", "registar", "criar conta"],
      },
      {
        id: "faq8",
        question: "Esqueci minha senha. Como recuperar?",
        answer: "Siga estes passos para recuperar sua senha...",
        category: "conta",
        tags: ["senha", "recuperar", "esqueci senha"],
      },
      {
        id: "faq9",
        question: "Como alterar meus dados pessoais?",
        answer: "Para atualizar seus dados...",
        category: "conta",
        tags: ["dados", "perfil", "atualizar"],
      },
      {
        id: "faq10",
        question: "Como encontrar restaurantes perto de mim?",
        answer: "Encontrar restaurantes próximos é fácil...",
        category: "restaurantes",
        tags: ["restaurantes", "encontrar", "próximos"],
      },
      {
        id: "faq11",
        question: "Os restaurantes são verificados?",
        answer: "Sim, todos os restaurantes são rigorosamente verificados...",
        category: "restaurantes",
        tags: ["verificados", "segurança", "qualidade"],
      },
      {
        id: "faq12",
        question: "Como funciona o sistema de avaliações?",
        answer: "Após cada pedido, você pode avaliar...",
        category: "restaurantes",
        tags: ["avaliações", "classificação", "reviews"],
      },
    ];
  }

  handleSearch(query) {
    console.log("Pesquisando:", query); // Debug

    // Se campo vazio, limpar resultados
    if (!query || query.trim().length === 0) {
      this.clearSearchResults();
      return;
    }

    const searchTerm = query.trim();

    if (searchTerm.length < 2) {
      this.clearSearchResults();
      return;
    }

    // Fazer pesquisa imediatamente para termos com 2+ caracteres
    if (searchTerm.length >= 2) {
      this.performSearch(searchTerm);
    }
  }

  performSearch(query = null) {
    const searchTerm =
      query || document.getElementById("helpSearch")?.value.trim();

    if (!searchTerm || searchTerm.length < 2) {
      this.showToast(
        "Digite pelo menos 2 caracteres para pesquisar",
        "warning"
      );
      return;
    }
    console.log("Executando pesquisa por:", searchTerm); // Debug

    // Filtrar resultados
    this.searchResults = this.faqData.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    console.log("Resultados encontrados:", this.searchResults.length); // Debug
    this.displaySearchResults(searchTerm);
  }

  displaySearchResults(searchTerm) {
    const faqAccordion = document.getElementById("faqAccordion");
    if (!faqAccordion) return;

    // Esconder todas as FAQs primeiro
    document.querySelectorAll(".faq-category").forEach((category) => {
      category.style.display = "none";
    });

    // Esconder também as seções especiais
    ["fazer-pedido", "acompanhar-entrega", "problemas-pagamento"].forEach(
      (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) section.style.display = "none";
      }
    );

    if (this.searchResults.length === 0) {
      this.showNoResultsMessage(searchTerm);
      return;
    }

    // Mostrar categorias com resultados
    const categoriesWithResults = [
      ...new Set(this.searchResults.map((result) => result.category)),
    ];

    categoriesWithResults.forEach((category) => {
      const categoryElement = document.getElementById(category);
      if (categoryElement) {
        categoryElement.style.display = "block";

        // Destacar termos da pesquisa
        this.highlightSearchTerms(categoryElement, searchTerm);
      }
    });

    // Expandir primeiros resultados
    if (this.searchResults.length > 0) {
      const firstResult = document.getElementById(this.searchResults[0].id);
      if (firstResult) {
        const collapse = new bootstrap.Collapse(firstResult, { toggle: true });
      }
    }

    this.showToast(
      `Encontramos ${this.searchResults.length} resultado(s) para "${searchTerm}"`,
      "success"
    );
  }

  highlightSearchTerms(element, searchTerm) {
    const regex = new RegExp(searchTerm, "gi");
    const questions = element.querySelectorAll(".accordion-button");

    questions.forEach((question) => {
      const originalText = question.textContent;
      const highlightedText = originalText.replace(
        regex,
        (match) => `<span class="search-highlight">${match}</span>`
      );
      question.innerHTML = highlightedText;
    });
  }

  showNoResultsMessage(searchTerm) {
    const faqAccordion = document.getElementById("faqAccordion");
    const noResultsHTML = `
            <div class="text-center py-5">
                <i class="bi bi-search display-1 text-muted mb-3"></i>
                <h4 class="text-muted">Nenhum resultado encontrado</h4>
                <p class="text-muted">Não encontramos resultados para "<strong>${searchTerm}</strong>"</p>
                <div class="mt-4">
                    <p class="text-muted mb-2">Sugestões:</p>
                    <ul class="list-unstyled">
                        <li>• Verifique a ortografia das palavras</li>
                        <li>• Tente termos mais genéricos</li>
                        <li>• Entre em contacto com nosso suporte</li>
                    </ul>
                </div>
                <button class="btn btn-danger mt-3" onclick="helpSystem.clearSearchResults()">
                    <i class="bi bi-arrow-left"></i> Ver Todas as FAQs
                </button>
            </div>
        `;

    faqAccordion.innerHTML = noResultsHTML;
  }

  clearSearchResults() {
    document.getElementById("helpSearch").value = "";

    // Restaurar todas as FAQs e seções
    document
      .querySelectorAll(
        ".faq-category, #fazer-pedido, #acompanhar-entrega, #problemas-pagamento"
      )
      .forEach((section) => {
        section.style.display = "block";
      });

    // Remover highlights
    document.querySelectorAll(".search-highlight").forEach((highlight) => {
      highlight.outerHTML = highlight.textContent;
    });

    // Restaurar conteúdo original se necessário
    const faqAccordion = document.getElementById("faqAccordion");
    if (
      faqAccordion &&
      faqAccordion.children.length === 1 &&
      faqAccordion.querySelector(".text-center")
    ) {
      location.reload();
    }
  }

  handleFeedback(wasHelpful) {
    if (wasHelpful) {
      this.showToast(
        "Obrigado pelo feedback! Ficamos felizes em ajudar.",
        "success"
      );

      // Animação de confirmação
      const button = document.getElementById("helpfulYes");
      button.innerHTML = '<i class="bi bi-check-lg"></i> Obrigado!';
      button.classList.remove("btn-success");
      button.classList.add("btn-outline-success");
      button.disabled = true;
    } else {
      this.showFeedbackForm();
    }
  }

  showFeedbackForm() {
    const feedbackHTML = `
            <div class="modal fade" id="helpFeedbackModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Como podemos melhorar?</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p class="text-muted mb-3">Sua opinião é muito importante para nós.</p>
                            <form id="feedbackForm">
                                <div class="mb-3">
                                    <label class="form-label">O que não foi útil?</label>
                                    <select class="form-select" id="feedbackReason">
                                        <option value="">Selecione o motivo...</option>
                                        <option value="info_incorreta">Informação incorreta</option>
                                        <option value="info_falta">Falta informação</option>
                                        <option value="dificil_entender">Difícil de entender</option>
                                        <option value="nao_resolveu">Não resolveu meu problema</option>
                                        <option value="outro">Outro</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Descrição (opcional)</label>
                                    <textarea class="form-control" rows="3" placeholder="Descreva como podemos melhorar..."></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-danger" onclick="helpSystem.submitFeedback()">Enviar Feedback</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

    // Adicionar modal ao DOM se não existir
    if (!document.getElementById("helpFeedbackModal")) {
      document.body.insertAdjacentHTML("beforeend", feedbackHTML);
    }

    const modal = new bootstrap.Modal(
      document.getElementById("helpFeedbackModal")
    );
    modal.show();
  }

  submitFeedback() {
    const reason = document.getElementById("feedbackReason").value;
    const description = document.querySelector("#feedbackForm textarea").value;

    if (!reason) {
      this.showToast("Por favor, selecione um motivo", "warning");
      return;
    }

    // Simular envio do feedback
    console.log("Feedback enviado:", { reason, description });

    this.showToast(
      "Obrigado pelo feedback! Vamos analisar suas sugestões.",
      "success"
    );

    const modal = bootstrap.Modal.getInstance(
      document.getElementById("helpFeedbackModal")
    );
    modal.hide();

    // Atualizar botão
    const button = document.getElementById("helpfulNo");
    button.innerHTML = '<i class="bi bi-check-lg"></i> Feedback Enviado';
    button.classList.remove("btn-outline-danger");
    button.classList.add("btn-outline-secondary");
    button.disabled = true;
  }

  startChat() {
    // Simular início de chat
    this.showToast("Iniciando chat com nosso suporte...", "info");

    // Mostrar status de conexão
    const chatButton = document.getElementById("startChat");
    const originalText = chatButton.innerHTML;
    chatButton.innerHTML =
      '<i class="bi bi-arrow-repeat spinner-border spinner-border-sm"></i> Conectando...';
    chatButton.disabled = true;

    // Simular conexão
    setTimeout(() => {
      chatButton.innerHTML = originalText;
      chatButton.disabled = false;
      this.showToast(
        "💬 Conectado com o suporte! Em breve serás atendido.",
        "success",
        5000
      );

      // Abrir chat
      this.openChatWindow();
    }, 2000);
  }

  openChatWindow() {
    const chatHTML = `
            <div class="modal fade" id="chatModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-bottom">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h6 class="modal-title">
                                <i class="bi bi-headset me-2"></i>
                                Suporte CraveNow
                            </h6>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body" style="height: 300px; overflow-y: auto;" id="chatMessages">
                            <div class="chat-message bot-message mb-3">
                                <div class="message-bubble bg-light rounded p-3">
                                    <small class="text-muted">Suporte CraveNow</small>
                                    <p class="mb-0">Olá! Sou a Ana, do suporte da CraveNow. Como posso ajudá-lo hoje?</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <div class="input-group">
                                <input type="text" class="form-control" placeholder="Digite sua mensagem..." id="chatInput">
                                <button class="btn btn-primary" type="button" onclick="helpSystem.sendChatMessage()">
                                    <i class="bi bi-send"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

    if (!document.getElementById("chatModal")) {
      document.body.insertAdjacentHTML("beforeend", chatHTML);
    }

    const modal = new bootstrap.Modal(document.getElementById("chatModal"));
    modal.show();

    // Focar no input do chat
    setTimeout(() => {
      document.getElementById("chatInput")?.focus();
    }, 500);
  }

  sendChatMessage() {
    const chatInput = document.getElementById("chatInput");
    const message = chatInput.value.trim();

    if (!message) return;

    const chatBody = document.getElementById("chatMessages");

    // Adicionar mensagem do usuário
    const userMessageHTML = `
            <div class="chat-message user-message mb-3 text-end">
                <div class="message-bubble bg-primary text-white rounded p-3 d-inline-block">
                    <p class="mb-0">${message}</p>
                </div>
            </div>
        `;
    chatBody.insertAdjacentHTML("beforeend", userMessageHTML);

    // Limpar input
    chatInput.value = "";

    // Scroll para baixo
    chatBody.scrollTop = chatBody.scrollHeight;

    // Simular resposta automática
    setTimeout(() => {
      this.simulateBotResponse();
    }, 1500);
  }

  simulateBotResponse() {
    const chatBody = document.getElementById("chatMessages");
    const responses = [
      "Entendi sua dúvida. Deixe-me verificar isso para você...",
      "Obrigada pela informação. Estou consultando nossa base de dados...",
      "Compreendo sua situação. Vou ajudar a resolver isso.",
      "Essa é uma questão importante. Deixe-me fornecer mais detalhes...",
    ];

    const randomResponse =
      responses[Math.floor(Math.random() * responses.length)];

    const botMessageHTML = `
            <div class="chat-message bot-message mb-3">
                <div class="message-bubble bg-light rounded p-3">
                    <small class="text-muted">Suporte CraveNow</small>
                    <p class="mb-0">${randomResponse}</p>
                </div>
            </div>
        `;

    chatBody.insertAdjacentHTML("beforeend", botMessageHTML);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  createToastContainer() {
    const container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container position-fixed top-0 end-0 p-3";
    container.style.zIndex = "1090";
    document.body.appendChild(container);
    return container;
  }

  getToastIcon(type) {
    const icons = {
      success: "bi-check-circle-fill",
      warning: "bi-exclamation-triangle-fill",
      error: "bi-x-circle-fill",
      info: "bi-info-circle-fill",
    };
    return icons[type] || "bi-info-circle-fill";
  }

  showToast(message, type = "info", duration = 4000) {
    const toastContainer =
      document.getElementById("toastContainer") || this.createToastContainer();

    const toastId = "toast-" + Date.now();
    const toastHTML = `
            <div id="${toastId}" class="toast align-items-center text-bg-${type} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="bi ${this.getToastIcon(type)} me-2"></i>
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
      delay: duration,
    });

    toast.show();

    toastElement.addEventListener("hidden.bs.toast", () => {
      toastElement.remove();
    });
  }
}

// ==================================================
// INICIALIZAÇÃO DO SISTEMA
// ==================================================

// Inicializar quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", function () {
  window.helpSystem = new HelpSystem();
});

// ==================================================
// FUNÇÕES AUXILIARES GLOBAIS
// ==================================================

// Função para expandir/colapsar todas as FAQs
function toggleAllFAQs(expand = true) {
  const accordionButtons = document.querySelectorAll(".accordion-button");
  accordionButtons.forEach((button) => {
    if (button.classList.contains("collapsed") === expand) {
      button.click();
    }
  });
}

// Função para copiar informações de contacto
function copyContactInfo(text, type) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      const helpSystem = window.helpSystem;
      if (helpSystem) {
        helpSystem.showToast(
          `${type} copiado para a área de transferência!`,
          "success"
        );
      }
    })
    .catch((err) => {
      console.error("Erro ao copiar:", err);
    });
}

// Função para imprimir página de ajuda
function printHelpPage() {
  window.print();
}

// ==================================================
// CONFIGURAÇÃO DO SERVICE WORKER (OPCIONAL)
// ==================================================

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/sw.js")
      .then(function (registration) {
        console.log(
          "ServiceWorker registrado com sucesso: ",
          registration.scope
        );
      })
      .catch(function (error) {
        console.log("Falha no registro do ServiceWorker: ", error);
      });
  });
}

// ==================================================
// TRATAMENTO DE ERROS
// ==================================================

window.addEventListener("error", function (e) {
  console.error("Erro capturado:", e.error);
});

// ==================================================
// OFFLINE DETECTION
// ==================================================

window.addEventListener("online", function () {
  const helpSystem = window.helpSystem;
  if (helpSystem) {
    helpSystem.showToast("Conexão restaurada", "success");
  }
});

window.addEventListener("offline", function () {
  const helpSystem = window.helpSystem;
  if (helpSystem) {
    helpSystem.showToast(
      "Você está offline. Algumas funcionalidades podem não estar disponíveis.",
      "warning",
      6000
    );
  }
});
