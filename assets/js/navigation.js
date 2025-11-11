/**
 * ================================================================
 * AGENTICX5 - NAVIGATION.JS
 * Gestion centralisée de la navigation et du Team Builder
 * Version: 1.0.0
 * Date: 10 novembre 2025
 * ================================================================
 */

// ==================== CONFIGURATION ====================
const SITE_CONFIG = {
    baseUrl: window.location.origin,
    pages: {
        home: '/agenticx5-landing-wope.html',
        marketplace: '/agenticx5-marketplace-complete.html',
        architecture: '/index-architecture-agenticx5.html',
        products: {
            sst: '/agenticx5-sst-qhse-product.html',
            production: '/agenticx5-production-product.html',
            maintenance: '/agenticx5-maintenance-product.html',
            qualite: '/agenticx5-qualite-product.html',
            rh: '/agenticx5-rh-product.html'
        },
        solutions: '/solutions/',
        security: '/securite/trust-center.html',
        contact: '/contact.html',
        docs: '/ARCHITECTURE_SITE_AGENTICX5.md'
    },
    categories: {
        sst: { name: 'SST/QHSE', color: '#10b981', icon: '🛡️' },
        production: { name: 'Production', color: '#f59e0b', icon: '⚙️' },
        maintenance: { name: 'Maintenance', color: '#8b5cf6', icon: '🔧' },
        qualite: { name: 'Qualité', color: '#3b82f6', icon: '✓' },
        rh: { name: 'RH', color: '#ec4899', icon: '👥' }
    }
};

// ==================== TEAM BUILDER ====================
class TeamBuilder {
    constructor() {
        this.storageKey = 'agenticx5_team';
        this.team = this.loadTeam();
        this.listeners = [];
    }

    /**
     * Charge l'équipe depuis localStorage
     */
    loadTeam() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Erreur chargement équipe:', e);
            return [];
        }
    }

    /**
     * Sauvegarde l'équipe dans localStorage
     */
    saveTeam() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.team));
            this.notifyListeners();
        } catch (e) {
            console.error('Erreur sauvegarde équipe:', e);
        }
    }

    /**
     * Ajoute un agent à l'équipe
     */
    addAgent(agentId, agentName, category) {
        // Vérifie si l'agent existe déjà
        if (this.team.find(a => a.id === agentId)) {
            console.warn('Agent déjà dans l\'équipe:', agentId);
            return false;
        }

        const agent = {
            id: agentId,
            name: agentName,
            category: category,
            addedAt: new Date().toISOString()
        };

        this.team.push(agent);
        this.saveTeam();
        this.updateUI();
        
        console.log('Agent ajouté:', agent);
        return true;
    }

    /**
     * Retire un agent de l'équipe
     */
    removeAgent(agentId) {
        const initialLength = this.team.length;
        this.team = this.team.filter(a => a.id !== agentId);
        
        if (this.team.length < initialLength) {
            this.saveTeam();
            this.updateUI();
            console.log('Agent retiré:', agentId);
            return true;
        }
        return false;
    }

    /**
     * Récupère l'équipe complète
     */
    getTeam() {
        return [...this.team];
    }

    /**
     * Nombre d'agents dans l'équipe
     */
    getCount() {
        return this.team.length;
    }

    /**
     * Vide l'équipe
     */
    clearTeam() {
        this.team = [];
        this.saveTeam();
        this.updateUI();
        console.log('Équipe vidée');
    }

    /**
     * Vérifie si un agent est dans l'équipe
     */
    hasAgent(agentId) {
        return this.team.some(a => a.id === agentId);
    }

    /**
     * Ajoute un listener pour les changements
     */
    addListener(callback) {
        this.listeners.push(callback);
    }

    /**
     * Notifie tous les listeners
     */
    notifyListeners() {
        this.listeners.forEach(callback => {
            try {
                callback(this.team);
            } catch (e) {
                console.error('Erreur listener:', e);
            }
        });
    }

    /**
     * Met à jour l'interface utilisateur
     */
    updateUI() {
        this.updateCounter();
        this.updatePanel();
        this.updateButtons();
    }

    /**
     * Met à jour le compteur dans le header
     */
    updateCounter() {
        const counter = document.getElementById('teamCounter');
        if (counter) {
            const count = this.team.length;
            if (count > 0) {
                counter.textContent = `(${count})`;
                counter.style.display = 'inline';
                counter.style.background = '#10b981';
                counter.style.color = '#fff';
                counter.style.padding = '0.2rem 0.5rem';
                counter.style.borderRadius = '50px';
                counter.style.fontSize = '0.85rem';
                counter.style.marginLeft = '0.5rem';
            } else {
                counter.style.display = 'none';
            }
        }
    }

    /**
     * Met à jour le panel Team Builder
     */
    updatePanel() {
        const teamList = document.getElementById('teamList');
        const deployBtn = document.getElementById('deployBtn');

        if (teamList) {
            if (this.team.length === 0) {
                teamList.innerHTML = `
                    <div style="text-align: center; padding: 2rem 1rem; color: #64748b;">
                        <div style="font-size: 2rem; margin-bottom: 0.5rem;">🤖</div>
                        <p style="font-size: 0.85rem;">Aucun agent sélectionné</p>
                        <p style="font-size: 0.75rem; margin-top: 0.5rem;">
                            Parcourez le marketplace et ajoutez des agents
                        </p>
                    </div>
                `;
            } else {
                teamList.innerHTML = this.team.map(agent => {
                    const category = SITE_CONFIG.categories[agent.category];
                    return `
                        <div class="team-item" style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding: 0.75rem;
                            background: #f8fafc;
                            border-radius: 8px;
                            margin-bottom: 0.5rem;
                            border-left: 3px solid ${category?.color || '#10b981'};
                        ">
                            <div style="flex: 1;">
                                <div style="font-size: 0.85rem; font-weight: 600; color: #1e293b;">
                                    ${category?.icon || '•'} ${agent.name}
                                </div>
                                <div style="font-size: 0.7rem; color: #64748b; margin-top: 0.25rem;">
                                    ${category?.name || agent.category}
                                </div>
                            </div>
                            <button 
                                onclick="teamBuilder.removeAgent('${agent.id}')"
                                style="
                                    background: none;
                                    border: none;
                                    cursor: pointer;
                                    color: #ef4444;
                                    font-size: 1.2rem;
                                    padding: 0.25rem;
                                    transition: transform 0.2s;
                                "
                                onmouseover="this.style.transform='scale(1.2)'"
                                onmouseout="this.style.transform='scale(1)'"
                                title="Retirer de l'équipe"
                            >
                                ✕
                            </button>
                        </div>
                    `;
                }).join('');
            }
        }

        if (deployBtn) {
            const count = this.team.length;
            deployBtn.disabled = count === 0;
            deployBtn.textContent = count > 0 
                ? `🚀 Déployer l'Équipe (${count})`
                : 'Sélectionnez des agents';
            
            deployBtn.style.opacity = count > 0 ? '1' : '0.5';
            deployBtn.style.cursor = count > 0 ? 'pointer' : 'not-allowed';
        }
    }

    /**
     * Met à jour les boutons "Ajouter" sur la page
     */
    updateButtons() {
        document.querySelectorAll('.btn-add').forEach(btn => {
            const card = btn.closest('.agent-card');
            if (card) {
                const agentId = card.dataset.agentId || 
                               card.querySelector('.agent-id')?.textContent.split(' ')[0];
                
                if (this.hasAgent(agentId)) {
                    btn.textContent = '✓ Dans l\'équipe';
                    btn.style.background = '#10b981';
                    btn.disabled = true;
                } else {
                    btn.textContent = '+ Ajouter à mon équipe';
                    btn.style.background = '';
                    btn.disabled = false;
                }
            }
        });
    }

    /**
     * Déploie l'équipe (redirige vers formulaire)
     */
    deploy() {
        if (this.team.length === 0) {
            alert('⚠️ Veuillez ajouter au moins un agent à votre équipe avant de déployer.');
            return;
        }

        // Encode l'équipe pour l'URL
        const teamData = encodeURIComponent(JSON.stringify(this.team));
        
        // Analytics
        Analytics.track('TeamBuilder', 'deploy', `${this.team.length} agents`);
        
        // Redirige vers contact avec données équipe
        const contactUrl = `${SITE_CONFIG.pages.contact}?team=${teamData}`;
        
        console.log('Déploiement équipe:', this.team);
        console.log('Redirection vers:', contactUrl);
        
        // Pour la démo, on affiche un message
        const agentsList = this.team.map(a => `  • ${a.name} (${a.category})`).join('\n');
        const message = `🎉 Équipe prête au déploiement !\n\n` +
                       `${this.team.length} agent(s) sélectionné(s):\n\n${agentsList}\n\n` +
                       `Un expert AgenticX5 vous contactera pour configurer votre solution.`;
        
        if (confirm(message + '\n\nSouhaitez-vous continuer vers le formulaire de contact ?')) {
            window.location.href = contactUrl;
        }
    }

    /**
     * Exporte l'équipe en JSON
     */
    exportTeam() {
        const dataStr = JSON.stringify(this.team, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `agenticx5-team-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        Analytics.track('TeamBuilder', 'export', `${this.team.length} agents`);
    }
}

// ==================== NAVIGATION ====================
class Navigation {
    /**
     * Va à une page produit
     */
    static goToProduct(category) {
        const url = SITE_CONFIG.pages.products[category];
        if (url) {
            Analytics.trackNavigation(`Product: ${category}`);
            window.location.href = url;
        } else {
            console.error('Page produit inconnue:', category);
        }
    }

    /**
     * Va à la marketplace avec filtre optionnel
     */
    static goToMarketplace(filter = null) {
        let url = SITE_CONFIG.pages.marketplace;
        if (filter) {
            url += `?filter=${filter}`;
            Analytics.trackFilter('Category', filter);
        }
        Analytics.trackNavigation('Marketplace');
        window.location.href = url;
    }

    /**
     * Va aux détails d'un agent
     */
    static goToAgentDetails(agentId, category) {
        const productPage = SITE_CONFIG.pages.products[category];
        if (productPage) {
            const url = `${productPage}#agent-${agentId}`;
            Analytics.trackNavigation(`Agent: ${agentId}`);
            window.location.href = url;
        } else {
            // Fallback vers marketplace
            this.goToMarketplace(category);
        }
    }

    /**
     * Va au Trust Center
     */
    static goToTrustCenter() {
        Analytics.trackNavigation('Trust Center');
        window.location.href = SITE_CONFIG.pages.security;
    }

    /**
     * Demande une démo
     */
    static requestDemo(source = 'general') {
        Analytics.trackCTA(`Demo Request: ${source}`);
        window.location.href = `${SITE_CONFIG.pages.contact}?type=demo&source=${source}`;
    }

    /**
     * Retour à l'accueil
     */
    static goHome() {
        Analytics.trackNavigation('Home');
        window.location.href = SITE_CONFIG.pages.home;
    }
}

// ==================== ANALYTICS (WOPE.JS) ====================
const Analytics = {
    /**
     * Track événement générique
     */
    track(category, action, label = '') {
        const event = {
            category: category,
            action: action,
            label: label,
            timestamp: new Date().toISOString(),
            page: window.location.pathname,
            url: window.location.href
        };

        console.log('[Analytics]', event);

        // Intégration Wope.js
        if (typeof wope !== 'undefined' && wope.track) {
            wope.track(event);
        }

        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }

        // Matomo
        if (typeof _paq !== 'undefined') {
            _paq.push(['trackEvent', category, action, label]);
        }
    },

    /**
     * Track CTA click
     */
    trackCTA(ctaName) {
        this.track('CTA', 'click', ctaName);
    },

    /**
     * Track navigation
     */
    trackNavigation(destination) {
        this.track('Navigation', 'click', destination);
    },

    /**
     * Track filtre
     */
    trackFilter(filterType, filterValue) {
        this.track('Filter', 'select', `${filterType}: ${filterValue}`);
    },

    /**
     * Track recherche
     */
    trackSearch(query) {
        this.track('Search', 'query', query);
    },

    /**
     * Track action Team Builder
     */
    trackTeamAction(action, agentId) {
        this.track('TeamBuilder', action, agentId);
    },

    /**
     * Track scroll depth
     */
    trackScrollDepth(depth) {
        this.track('Scroll', 'depth', `${depth}%`);
    },

    /**
     * Track temps sur page
     */
    trackTimeOnPage() {
        const startTime = Date.now();
        
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            this.track('Engagement', 'time_on_page', `${timeSpent}s`);
        });
    }
};

// ==================== FILTRES MARKETPLACE ====================
class MarketplaceFilters {
    constructor() {
        this.activeFilters = {
            category: 'all',
            search: ''
        };
    }

    /**
     * Applique un filtre de catégorie
     */
    applyFilter(category) {
        this.activeFilters.category = category;
        Analytics.trackFilter('Category', category);
        
        this.updateFilterUI();
        this.filterAgents();
        
        console.log('Filtre appliqué:', category);
    }

    /**
     * Applique une recherche
     */
    applySearch(query) {
        this.activeFilters.search = query.toLowerCase().trim();
        
        if (query.length > 0) {
            Analytics.trackSearch(query);
        }
        
        this.filterAgents();
        console.log('Recherche:', query);
    }

    /**
     * Met à jour l'UI des filtres
     */
    updateFilterUI() {
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.classList.remove('active');
        });
        
        const activeChip = document.querySelector(
            `.filter-chip[data-category="${this.activeFilters.category}"]`
        );
        
        if (activeChip) {
            activeChip.classList.add('active');
        }
    }

    /**
     * Filtre les agents visibles
     */
    filterAgents() {
        const agents = document.querySelectorAll('.agent-card');
        let visibleCount = 0;

        agents.forEach(agent => {
            const category = agent.dataset.category || 
                           agent.querySelector('.agent-category')?.textContent.toLowerCase();
            const name = agent.querySelector('.agent-id')?.textContent.toLowerCase() || '';
            const description = agent.querySelector('.agent-description')?.textContent.toLowerCase() || '';
            
            const categoryMatch = this.activeFilters.category === 'all' || 
                                 category === this.activeFilters.category;
            
            const searchMatch = !this.activeFilters.search || 
                               name.includes(this.activeFilters.search) || 
                               description.includes(this.activeFilters.search);
            
            const visible = categoryMatch && searchMatch;
            agent.style.display = visible ? 'block' : 'none';
            
            if (visible) visibleCount++;
        });

        // Met à jour le compteur de résultats
        this.updateResultCount(visibleCount);
    }

    /**
     * Met à jour le compteur de résultats
     */
    updateResultCount(count) {
        const counter = document.getElementById('resultsCount');
        if (counter) {
            counter.textContent = `${count} agent(s) trouvé(s)`;
        }
    }

    /**
     * Réinitialise tous les filtres
     */
    reset() {
        this.activeFilters = {
            category: 'all',
            search: ''
        };
        
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.value = '';
        }
        
        this.updateFilterUI();
        this.filterAgents();
    }
}

// ==================== UTILITAIRES ====================
const Utils = {
    /**
     * Smooth scroll vers élément
     */
    scrollTo(elementId) {
        const element = document.getElementById(elementId) || 
                       document.querySelector(elementId);
        
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    },

    /**
     * Copie texte dans clipboard
     */
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Copié:', text);
            this.showToast('✓ Copié dans le presse-papiers');
        }).catch(err => {
            console.error('Erreur copie:', err);
        });
    },

    /**
     * Affiche un toast notification
     */
    showToast(message, duration = 3000) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            background: #1e293b;
            color: #fff;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideUp 0.3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideDown 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
};

// ==================== INITIALISATION ====================
let teamBuilder;
let marketplaceFilters;

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 AgenticX5 Navigation initialisé');

    // Initialise Team Builder
    teamBuilder = new TeamBuilder();
    teamBuilder.updateUI();

    // Initialise filtres marketplace si présents
    if (document.querySelector('.marketplace-filters')) {
        marketplaceFilters = new MarketplaceFilters();
        
        // Charge filtre depuis URL
        const urlParams = new URLSearchParams(window.location.search);
        const filterParam = urlParams.get('filter');
        if (filterParam) {
            marketplaceFilters.applyFilter(filterParam);
        }
    }

    // Configure boutons "Ajouter agent"
    document.querySelectorAll('.btn-add').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const card = this.closest('.agent-card');
            if (!card) return;

            const agentId = card.dataset.agentId || 
                           card.querySelector('.agent-id')?.textContent.split(' ')[0];
            const agentName = card.querySelector('.agent-id')?.textContent || 'Agent';
            const category = card.dataset.category || 
                           card.querySelector('.agent-category')?.textContent.toLowerCase() || 'sst';

            if (teamBuilder.addAgent(agentId, agentName, category)) {
                Analytics.trackTeamAction('add', agentId);
                Utils.showToast(`✓ ${agentName} ajouté à votre équipe`);
            } else {
                Utils.showToast('⚠️ Cet agent est déjà dans votre équipe');
            }
        });
    });

    // Configure filtres
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', function() {
            const category = this.dataset.category || 'all';
            if (marketplaceFilters) {
                marketplaceFilters.applyFilter(category);
            }
        });
    });

    // Configure recherche
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (marketplaceFilters) {
                    marketplaceFilters.applySearch(this.value);
                }
            }, 300);
        });
    }

    // Smooth scroll pour ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            if (target && target !== '#') {
                Utils.scrollTo(target);
            }
        });
    });

    // Track scroll depth
    let maxScroll = 0;
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            
            const milestone = Math.floor(scrollPercent / 25) * 25;
            if (milestone > maxScroll && milestone > 0) {
                maxScroll = milestone;
                Analytics.trackScrollDepth(milestone);
            }
        }, 100);
    });

    // Track temps sur page
    Analytics.trackTimeOnPage();

    // Affiche version dans console
    console.log('%c AgenticX5 v1.0.0 ', 
                'background: #10b981; color: #fff; padding: 4px 8px; border-radius: 4px;');
});

// ==================== EXPORT GLOBAL ====================
window.TeamBuilder = TeamBuilder;
window.teamBuilder = teamBuilder;
window.Navigation = Navigation;
window.Analytics = Analytics;
window.MarketplaceFilters = marketplaceFilters;
window.Utils = Utils;
window.SITE_CONFIG = SITE_CONFIG;

// Export pour modules ES6
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TeamBuilder,
        Navigation,
        Analytics,
        MarketplaceFilters,
        Utils,
        SITE_CONFIG
    };
}
