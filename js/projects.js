/*
  ╔══════════════════════════════════════════════════════════════════════════╗
  ║              projects.js — Project Loading & Rendering                   ║
  ╚══════════════════════════════════════════════════════════════════════════╝
*/

export const ProjectRenderer = {
    async load() {
        try {
            const res = await fetch('./data/projects.json');
            if (!res.ok) throw new Error('Failed to load projects');
            return await res.json();
        } catch (e) {
            console.error(e);
            return [];
        }
    },

    render(list) {
        const grid = document.getElementById('projects-grid');
        const tpl = document.getElementById('project-template');
        if (!grid || !tpl) return;

        grid.innerHTML = '';

        list.forEach(project => {
            const node = tpl.content.cloneNode(true);
            const card = node.querySelector('.project-card');
            const img = node.querySelector('.project-image');
            img.src = project.image || '';
            img.alt = project.title || '';
            node.querySelector('.project-title').textContent = project.title;
            node.querySelector('.project-desc').textContent = project.description;
            node.querySelector('.tags').textContent = (project.tags || []).join(' • ');

            card.dataset.project = JSON.stringify(project);

            grid.appendChild(node);
        });
    }
};
