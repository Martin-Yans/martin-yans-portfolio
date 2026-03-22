/*
  ╔══════════════════════════════════════════════════════════════════════════╗
  ║              modal.js — Project Details Modal                            ║
  ╚══════════════════════════════════════════════════════════════════════════╝
*/

export class ProjectModal {
    constructor() {
        this.modal = document.getElementById('project-modal');
        if (!this.modal) return;

        this.overlay = this.modal.querySelector('.modal-overlay');
        this.closeBtn = this.modal.querySelector('.modal-close');
        this.titleEl = this.modal.querySelector('#modal-title');
        this.descEl = this.modal.querySelector('.modal-description');
        this.imageEl = this.modal.querySelector('#modal-image');
        this.tagsEl = this.modal.querySelector('.modal-tags');
        this.linkEl = this.modal.querySelector('#modal-link');
        this.container = this.modal.querySelector('.modal-container');
        this.previousFocus = null;
        this.isOpen = false;
    }

    init() {
        if (!this.modal) return;
        this.bindEvents();
        this.setupCardHandlers();
    }

    bindEvents() {
        this.closeBtn?.addEventListener('click', () => this.close());
        this.overlay?.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.close();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) this.close();
        });
    }

    setupCardHandlers() {
        const projectsGrid = document.getElementById('projects-grid');
        if (!projectsGrid) return;

        projectsGrid.addEventListener('click', (e) => {
            if (e.target.closest('a')) return;
            const card = e.target.closest('.project-card');
            if (!card) return;
            
            try {
                const projectData = JSON.parse(card.dataset.project);
                this.open(projectData);
            } catch (error) {
                console.error("Failed to parse project data from card", error);
            }
        });
    }

    open(projectData) {
        if (!this.modal) return;
        this.previousFocus = document.activeElement;
        this.titleEl.textContent = projectData.title || '';
        this.descEl.textContent = projectData.description || '';
        this.imageEl.src = projectData.image || '';
        this.imageEl.alt = projectData.title || 'Project image';
        this.renderTags(projectData.tags || []);

        if (projectData.link) {
            this.linkEl.href = projectData.link;
            this.linkEl.style.display = '';
        } else {
            this.linkEl.style.display = 'none';
        }

        this.modal.showModal();
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => this.focusFirstElement());
    }

    close() {
        if (!this.modal || !this.isOpen) return;
        this.modal.close();
        this.isOpen = false;
        document.body.style.overflow = '';
        this.previousFocus?.focus();
    }

    renderTags(tags) {
        if (!this.tagsEl) return;
        this.tagsEl.innerHTML = '';
        if (!Array.isArray(tags) || tags.length === 0) return;
        tags.forEach(tag => {
            const span = document.createElement('span');
            span.textContent = tag.trim();
            this.tagsEl.appendChild(span);
        });
    }

    focusFirstElement() {
        if (!this.container) return;
        const focusableElements = this.container.querySelectorAll(
            'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) focusableElements[0].focus();
    }
}
