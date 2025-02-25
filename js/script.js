const dropdowns = document.querySelectorAll('.dropdown');

dropdowns.forEach(dropdown => {
    const dropdownLink = dropdown.querySelector('a');
    
    dropdownLink.addEventListener('click', (e) => {
        e.preventDefault(); 
        
        dropdowns.forEach(otherDropdown => {
            if (otherDropdown !== dropdown) {
                otherDropdown.querySelector('.dropdown-content').style.display = 'none';
            }
        });
        
        const dropdownContent = dropdown.querySelector('.dropdown-content');
        if (dropdownContent.style.display === 'block') {
            dropdownContent.style.display = 'none';
        } else {
            dropdownContent.style.display = 'block';
            dropdownContent.style.display = 'flex';
            dropdownContent.style.flexDirection = 'column';
        }
    });
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
        dropdowns.forEach(dropdown => {
            dropdown.querySelector('.dropdown-content').style.display = 'none';
        });
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        dropdowns.forEach(dropdown => {
            dropdown.querySelector('.dropdown-content').style.display = 'none';
        });
    }
});


//caroussel


document.addEventListener('DOMContentLoaded', function() {
    // Initialisation du carrousel
    const carousel = {
        container: document.querySelector('.carousel-container'),
        slides: document.querySelectorAll('.carousel-slide'),
        indicators: document.querySelectorAll('.carousel-indicator'),
        descriptions: document.querySelectorAll('.description'),
        prevButton: document.getElementById('carousel-prev'),
        nextButton: document.getElementById('carousel-next'),
        pauseButton: document.getElementById('carousel-pause'),
        timerBars: document.querySelectorAll('.timer-progress'),
        currentIndex: 0,
        interval: null,
        isPaused: false,
        slideInterval: 6000, // 6 secondes par slide
        
        // Initialiser le carrousel
        init: function() {
            this.showSlide(0);
            this.startAutoPlay();
            this.attachEventListeners();
            this.makeAccessible();
        },
        
        // Afficher un slide spécifique
        showSlide: function(index) {
            // Gérer l'index si hors limites
            if (index < 0) index = this.slides.length - 1;
            if (index >= this.slides.length) index = 0;
            
            // Supprimer la classe 'active' de tous les éléments
            this.slides.forEach(slide => slide.classList.remove('active'));
            this.indicators.forEach(ind => {
                ind.classList.remove('active');
                ind.setAttribute('aria-selected', 'false');
            });
            this.descriptions.forEach(desc => {
                desc.classList.remove('active');
                desc.setAttribute('aria-hidden', 'true');
            });
            
            // Ajouter la classe 'active' à l'élément actuel
            this.slides[index].classList.add('active');
            this.indicators[index].classList.add('active');
            this.indicators[index].setAttribute('aria-selected', 'true');
            this.descriptions[index].classList.add('active');
            this.descriptions[index].setAttribute('aria-hidden', 'false');
            
            // Réinitialiser la barre de progression
            this.resetProgressBar();
            
            // Mettre à jour l'index courant
            this.currentIndex = index;
            
            // Annonce pour les lecteurs d'écran
            this.announceSlide();
        },
        
        // Slide précédent
        prevSlide: function() {
            this.showSlide(this.currentIndex - 1);
            if (!this.isPaused) this.resetAutoPlay();
        },
        
        // Slide suivant
        nextSlide: function() {
            this.showSlide(this.currentIndex + 1);
            if (!this.isPaused) this.resetAutoPlay();
        },
        
        // Démarrer le défilement automatique
        startAutoPlay: function() {
            this.resetProgressBar();
            this.updateProgressBar();
            
            this.interval = setInterval(() => {
                this.nextSlide();
            }, this.slideInterval);
        },
        
        // Réinitialiser le défilement automatique
        resetAutoPlay: function() {
            clearInterval(this.interval);
            this.startAutoPlay();
        },
        
        // Pause/Reprise du défilement
        togglePause: function() {
            const pauseIcon = this.pauseButton.querySelector('.fa-pause');
            const playIcon = this.pauseButton.querySelector('.fa-play');
            
            if (this.isPaused) {
                // Reprendre
                this.startAutoPlay();
                pauseIcon.style.display = 'inline-block';
                playIcon.style.display = 'none';
                this.pauseButton.setAttribute('aria-label', 'Mettre en pause le défilement');
            } else {
                // Mettre en pause
                clearInterval(this.interval);
                pauseIcon.style.display = 'none';
                playIcon.style.display = 'inline-block';
                this.pauseButton.setAttribute('aria-label', 'Reprendre le défilement');
            }
            
            this.isPaused = !this.isPaused;
        },
        
        // Réinitialiser l'animation de la barre de progression
        resetProgressBar: function() {
            this.timerBars.forEach(bar => {
                bar.style.width = '0%';
            });
        },
        
        // Mettre à jour l'animation de la barre de progression
        updateProgressBar: function() {
            const activeBar = this.slides[this.currentIndex].querySelector('.timer-progress');
            let width = 0;
            const increment = 0.1; // Incrément plus petit pour une animation plus fluide
            
            const progressInterval = setInterval(() => {
                if (width >= 100) {
                    clearInterval(progressInterval);
                } else {
                    width += increment;
                    activeBar.style.width = width + '%';
                }
            }, this.slideInterval / 1000);
        },
        
        // Attacher les écouteurs d'événements
        attachEventListeners: function() {
            // Boutons navigation
            this.prevButton.addEventListener('click', () => this.prevSlide());
            this.nextButton.addEventListener('click', () => this.nextSlide());
            this.pauseButton.addEventListener('click', () => this.togglePause());
            
            // Indicateurs
            this.indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    this.showSlide(index);
                    if (!this.isPaused) this.resetAutoPlay();
                });
            });
            
            // Navigation clavier quand le focus est sur le conteneur
            this.container.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    this.prevSlide();
                    this.indicators[this.currentIndex].focus();
                    e.preventDefault();
                } else if (e.key === 'ArrowRight') {
                    this.nextSlide();
                    this.indicators[this.currentIndex].focus();
                    e.preventDefault();
                }
            });
            
            // Arrêter le défilement automatique lorsque l'utilisateur interagit
            this.container.addEventListener('mouseenter', () => {
                if (!this.isPaused) clearInterval(this.interval);
            });
            
            this.container.addEventListener('mouseleave', () => {
                if (!this.isPaused) this.startAutoPlay();
            });
            
            // Arrêter lors du focus sur un élément du carrousel
            this.container.addEventListener('focusin', () => {
                if (!this.isPaused) clearInterval(this.interval);
            });
            
            this.container.addEventListener('focusout', (e) => {
                // Vérifier si le focus est toujours dans le carrousel
                if (!this.container.contains(e.relatedTarget) && !this.isPaused) {
                    this.startAutoPlay();
                }
            });
        },
        
        // Amélioration de l'accessibilité
        makeAccessible: function() {
            // S'assurer que chaque slide a un rôle et un état appropriés
            this.slides.forEach((slide, i) => {
                slide.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
                slide.setAttribute('role', 'tabpanel');
            });
        },
        
        // Annoncer le changement de slide pour les lecteurs d'écran
        announceSlide: function() {
            const liveRegion = document.querySelector('.carousel-slides');
            
            if (liveRegion) {
                // Utilisez le contenu comme annonce implicite
                // L'attribut aria-live assurera que les changements sont annoncés
                liveRegion.setAttribute('aria-live', 'polite');
            }
        }
    };
    
    // Initialiser le carrousel
    carousel.init();
});

