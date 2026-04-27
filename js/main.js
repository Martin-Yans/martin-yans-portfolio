/*
  ╔══════════════════════════════════════════════════════════════════════════╗
  ║              main.js — Application Entry Point                           ║
  ╚══════════════════════════════════════════════════════════════════════════╝
*/

import { ProjectRenderer } from './projects.js';
import { CarouselController } from './carousel.js';
import { ProjectModal } from './modal.js';
import { NavigationManager, initTextAnimation } from './utils.js';

async function initializeApplication() {
    window.scrollTo(0, 0);
    const projects = await ProjectRenderer.load();
    ProjectRenderer.render(projects);

    new CarouselController();
    new NavigationManager();
    const projectModal = new ProjectModal();
    projectModal.init();
    
    // Initialize text animations
    initTextAnimation('.hero-title',0 , 0.005); // Vitesse par défaut (0.05s par lettre)
    initTextAnimation('.hero-subtitle', 0, 0.01); // Très rapide (0.015s par lettre)
    
    // Skills animation observer
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.skills-list').forEach(list => {
        skillsObserver.observe(list);
    });
}

document.addEventListener('DOMContentLoaded', initializeApplication);
