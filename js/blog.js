// ==================================================
// SISTEMA DE BLOG - DELIVERYHJ
// ==================================================

class BlogSystem {
    constructor() {
        this.posts = [];
        this.filteredPosts = [];
        this.currentFilter = 'all';
        this.currentPage = 1;
        this.postsPerPage = 4;
        this.init();
    }

    init() {
        this.initializeEventListeners();
        this.loadSamplePosts();
        this.applyFilters();
        this.initializeAnimations();
        console.log('📝 Sistema de Blog inicializado');
    }

    initializeEventListeners() {
        // Filter buttons
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentFilter = e.target.dataset.filter;
                
                // Update active state
                document.querySelectorAll('[data-filter]').forEach(b => {
                    b.classList.remove('active');
                    b.classList.remove('btn-danger');
                    b.classList.add('btn-outline-danger');
                });
                e.target.classList.add('active');
                e.target.classList.remove('btn-outline-danger');
                e.target.classList.add('btn-danger');
                
                this.applyFilters();
            });
        });

        // Load more posts
        const loadMoreBtn = document.getElementById('loadMorePosts');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMorePosts();
            });
        }

        // Newsletter form
        const newsletterForm = document.getElementById('blogNewsletter');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSubscription(e.target);
            });
        }

        // Post card interactions
        document.addEventListener('click', (e) => {
            const postCard = e.target.closest('.blog-card');
            if (postCard) {
                this.handlePostClick(postCard);
            }
        });
    }

    initializeAnimations() {
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all blog cards
        document.querySelectorAll('.blog-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
            observer.observe(card);
        });
    }

    loadSamplePosts() {
        // Dados de exemplo para posts do blog
        this.posts = [
            {
                id: 1,
                title: "5 Dicas para Pedir Delivery Like a Pro",
                excerpt: "Aprenda como maximizar sua experiência de delivery com dicas simples que vão desde a escolha do restaurante até o momento da entrega.",
                category: "dicas",
                image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                author: {
                    name: "Maria Santos",
                    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                },
                date: "2024-12-12",
                readTime: 5,
                views: 2400,
                tags: ["delivery", "dicas", "economia"],
                featured: false
            },
            {
                id: 2,
                title: "Receita Autêntica: Muamba de Galinha da Vovó",
                excerpt: "Descubra os segredos da receita tradicional de muamba que passa de geração em geração nas famílias angolanas.",
                category: "receitas",
                image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                author: {
                    name: "Chef Ana Kiala",
                    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                },
                date: "2024-12-10",
                readTime: 12,
                views: 3100,
                tags: ["receitas", "tradicional", "angolana"],
                featured: false
            },
            {
                id: 3,
                title: "5 Novos Restaurantes que Chegaram a Luanda este Mês",
                excerpt: "Conheça as novas opções gastronômicas que estão agitando a cena culinary da capital angolana.",
                category: "noticias",
                image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                author: {
                    name: "Carlos Mendes",
                    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                },
                date: "2024-12-08",
                readTime: 4,
                views: 1800,
                tags: ["noticias", "restaurantes", "luanda"],
                featured: false
            },
            {
                id: 4,
                title: "Guia: Como Montar uma Mesa de Natal Tipicamente Angolana",
                excerpt: "Tudo o que você precisa saber para criar uma celebração natalina autêntica com os sabores de Angola.",
                category: "dicas",
                image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                author: {
                    name: "Isabel Fernandes",
                    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                },
                date: "2024-12-05",
                readTime: 7,
                views: 2700,
                tags: ["natal", "tradições", "festas"],
                featured: false
            },
            {
                id: 5,
                title: "Os Segredos do Funje Perfeito: Técnicas Tradicionais",
                excerpt: "Aprenda as técnicas ancestrais para preparar o funje na textura ideal, como faziam nossas avós.",
                category: "receitas",
                image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                author: {
                    name: "Dona Benta",
                    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                },
                date: "2024-12-03",
                readTime: 8,
                views: 3200,
                tags: ["receitas", "tradicional", "funje"],
                featured: false
            },
            {
                id: 6,
                title: "Delivery Saudável: Como Fazer Escolhas Inteligentes",
                excerpt: "Descubra como manter uma alimentação balanceada mesmo pedindo delivery todos os dias.",
                category: "dicas",
                image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                author: {
                    name: "Dr. Saúde",
                    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                },
                date: "2024-12-01",
                readTime: 6,
                views: 1900,
                tags: ["saúde", "dicas", "nutrição"],
                featured: false
            }
        ];
    }

    applyFilters() {
        let filtered = [...this.posts];

        // Apply category filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(post => post.category === this.currentFilter);
        }

        this.filteredPosts = filtered;
        this.displayPosts();
    }

    displayPosts() {
        const postsContainer = document.getElementById('blogPosts');
        const loadMoreBtn = document.getElementById('loadMorePosts');

        if (!postsContainer) return;

        // Clear container
        postsContainer.innerHTML = '';

        // Display posts (paginated)
        const startIndex = (this.currentPage - 1) * this.postsPerPage;
        const endIndex = startIndex + this.postsPerPage;
        const postsToShow = this.filteredPosts.slice(startIndex, endIndex);

        if (postsToShow.length === 0 && this.currentPage === 1) {
            postsContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-search display-1 text-muted mb-3"></i>
                    <h4 class="text-muted">Nenhum artigo encontrado</h4>
                    <p class="text-muted">Tente ajustar seus filtros</p>
                </div>
            `;
        } else {
            postsToShow.forEach(post => {
                const postElement = this.createPostCard(post);
                postsContainer.appendChild(postElement);
            });
        }

        // Show/hide load more button
        if (loadMoreBtn) {
            const hasMore = endIndex < this.filteredPosts.length;
            loadMoreBtn.style.display = hasMore ? 'block' : 'none';
            
            if (!hasMore && this.filteredPosts.length > 0) {
                loadMoreBtn.innerHTML = '<i class="bi bi-check-lg"></i> Todos os artigos carregados';
                loadMoreBtn.disabled = true;
                loadMoreBtn.classList.remove('btn-outline-danger');
                loadMoreBtn.classList.add('btn-success');
            }
        }

        // Re-initialize animations for new cards
        setTimeout(() => this.initializeAnimations(), 100);
    }

    createPostCard(post) {
        const col = document.createElement('div');
        col.className = 'col-md-6';
        col.dataset.category = post.category;

        const categoryColors = {
            'dicas': 'success',
            'receitas': 'warning',
            'noticias': 'info',
            'gastronomia': 'danger'
        };

        const categoryColor = categoryColors[post.category] || 'secondary';

        col.innerHTML = `
            <div class="card blog-card border-0 shadow-sm h-100"
                 data-post-id="${post.id}"
                 tabindex="0"
                 role="button"
                 aria-label="Ler artigo: ${post.title}">
                <div class="position-relative">
                    <img src="${post.image}" 
                         class="card-img-top blog-image" 
                         alt="${post.title}"
                         loading="lazy">
                    <div class="blog-category">
                        <span class="badge bg-${categoryColor} ${post.category === 'receitas' ? 'text-dark' : ''}">
                            ${this.formatCategory(post.category)}
                        </span>
                    </div>
                    <div class="position-absolute bottom-0 end-0 m-2">
                        <span class="blog-read-time">${post.readTime} min</span>
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title fw-bold">${post.title}</h5>
                    <p class="card-text text-muted small">${post.excerpt}</p>
                    <div class="blog-tags mb-3">
                        ${post.tags.map(tag => `
                            <span class="badge bg-light text-dark">#${tag}</span>
                        `).join('')}
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <img src="${post.author.avatar}" 
                                 class="author-avatar me-2" 
                                 alt="${post.author.name}">
                            <div>
                                <div class="fw-bold small">${post.author.name}</div>
                                <div class="text-muted small">${this.formatDate(post.date)}</div>
                            </div>
                        </div>
                        <span class="text-muted small">
                            <i class="bi bi-eye"></i> ${this.formatViews(post.views)}
                        </span>
                    </div>
                </div>
                <div class="card-footer bg-transparent border-0">
                    <a href="post/${this.createSlug(post.title)}.html" 
                       class="btn btn-outline-danger w-100"
                       onclick="event.stopPropagation()">
                        Ler Artigo
                    </a>
                </div>
            </div>
        `;

        return col;
    }

    formatCategory(category) {
        const categories = {
            'dicas': 'Dicas',
            'receitas': 'Receitas',
            'noticias': 'Notícias',
            'gastronomia': 'Gastronomia'
        };
        return categories[category] || category;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-AO', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }

    formatViews(views) {
        if (views >= 1000) {
            return (views / 1000).toFixed(1) + 'K';
        }
        return views.toString();
    }

    createSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, '-');
    }

    handlePostClick(card) {
        const postId = card.dataset.postId;
        
        // Add click animation
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 150);

        // Navigate to post page
        setTimeout(() => {
            const post = this.posts.find(p => p.id === parseInt(postId));
            if (post) {
                window.location.href = `post/${this.createSlug(post.title)}.html`;
            }
        }, 300);

        // Track analytics
        this.trackPostView(postId);
    }

    trackPostView(postId) {
        const post = this.posts.find(p => p.id === parseInt(postId));
        if (post) {
            console.log(`📈 Post visualizado: ${post.title}`);
            
            // Simular aumento de visualizações
            post.views += 1;
        }
    }

    loadMorePosts() {
        const button = document.getElementById('loadMorePosts');
        const originalText = button.innerHTML;
        
        button.innerHTML = '<i class="bi bi-arrow-repeat spinner-border spinner-border-sm"></i> A carregar...';
        button.disabled = true;

        // Simular carregamento de mais posts
        setTimeout(() => {
            this.currentPage++;
            this.displayPosts();
            
            button.innerHTML = originalText;
            button.disabled = false;
            
            this.showNotification('Mais artigos carregados!', 'success');
        }, 1000);
    }

    handleNewsletterSubscription(form) {
        const email = form.querySelector('input[type="email"]').value;
        
        // Simular envio
        setTimeout(() => {
            this.showNotification('🎉 Obrigado por subscrever nossa newsletter!', 'success');
            form.reset();
        }, 1000);
    }

    showNotification(message, type = 'info') {
        // Criar notificação toast
        const toast = document.createElement('div');
        toast.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        toast.style.cssText = 'top: 20px; right: 20px; z-index: 1060; min-width: 300px;';
        toast.innerHTML = `
            <strong>${message}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(toast);
        
        // Auto-remove após 3 segundos
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 3000);
    }
}

// ==================================================
// INICIALIZAÇÃO
// ==================================================

document.addEventListener('DOMContentLoaded', function() {
    window.blogSystem = new BlogSystem();
});