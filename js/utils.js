/*
  ╔══════════════════════════════════════════════════════════════════════════╗
  ║              utils.js — Utility Functions                                ║
  ╚══════════════════════════════════════════════════════════════════════════╝
*/

export class NavigationManager {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.navToggle = document.querySelector('.nav-toggle');
    this.navMenu = document.querySelector('#nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.header = document.querySelector('.header');

    if (!this.navbar) return;

    this.init();
  }

  init() {
    if (this.navToggle) {
      this.navToggle.addEventListener('click', () => this.toggleMenu());
    }
    this.setupActiveLinkOnScroll();
    this.setupLinkClicks();
    document.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    this.handleScroll();
  }

  toggleMenu() {
    const isExpanded = this.navToggle.getAttribute('aria-expanded') === 'true';
    this.navToggle.setAttribute('aria-expanded', !isExpanded);
    this.navMenu.classList.toggle('is-active');
    document.body.classList.toggle('no-scroll', !isExpanded);
  }
  
  setupLinkClicks() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (this.navMenu.classList.contains('is-active')) {
          this.toggleMenu();
        }
      });
    });
  }

  handleScroll() {
    if (window.scrollY > 20) {
      this.navbar.classList.add('is-scrolled');
    } else {
      this.navbar.classList.remove('is-scrolled');
    }
  }

  setupActiveLinkOnScroll() {
    const sections = Array.from(this.navLinks).map(link => {
      const id = link.getAttribute('href');
      if (id && id.startsWith('#') && id.length > 1) {
        return document.querySelector(id);
      }
      return null;
    }).filter(Boolean);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(entries => {
      let activeSectionId = null;
      const visibleSections = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top);
      
      if (visibleSections.length > 0) {
        activeSectionId = visibleSections[0].target.getAttribute('id');
      }

      this.navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');
        if (linkHref === `#${activeSectionId}`) {
          link.classList.add('active');
        }
      });

    }, { rootMargin: '-50% 0px -50% 0px', threshold: [0] });

    sections.forEach(section => {
        if(section) observer.observe(section);
    });
  }
}

/**
 * Split text into spans for letter-by-letter animation
 * @param {string} selector CSS selector for the element to animate
 * @param {number} baseDelay Initial delay before animation starts (seconds)
 * @param {number} delayIncrement Delay between each letter (seconds)
 */
export function initTextAnimation(selector, baseDelay = 0, delayIncrement = 0.05) {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach(element => {
    // Save original content in case we need to reconstruct (e.g. for screen readers)
    const text = element.textContent;
    // We use innerHTML to preserve <br> tags if any exist
    const html = element.innerHTML;
    
    // Split by <br> or other tags if needed, but for simple text:
    let newHtml = '';
    
    // This regex splits the HTML into tags and text nodes
    const parts = html.split(/(<br\s*\/?>)/gi);
    
    let delay = baseDelay;
    
    parts.forEach(part => {
      if (part.match(/<br\s*\/?>/gi)) {
        // It's a <br> tag, just append it
        newHtml += part;
      } else {
        // It's text, split it by words
        const words = part.split(' ');
        words.forEach((word, index) => {
          if (word) {
            newHtml += `<span class="word-wrapper">`;
            const chars = Array.from(word);
            chars.forEach(char => {
              newHtml += `<span class="letter-animate" style="animation-delay: ${delay}s">${char}</span>`;
              delay += delayIncrement;
            });
            newHtml += `</span>`;
          }
          // Add space between words, but not at the end of the line
          if (index < words.length - 1) {
            newHtml += ' ';
          }
        });
      }
    });
    
    element.innerHTML = newHtml;
    // Add aria-label to the parent and hide the spans from screen readers
    // so they read the whole word, not letter by letter
    element.setAttribute('aria-label', text);
    element.querySelectorAll('.letter-animate').forEach(span => {
      span.setAttribute('aria-hidden', 'true');
    });
  });
}

let copyToastTimer = null;

/** Copie synchrone : fonctionne en local (file://) et conserve le geste utilisateur. */
function copyWithExecCommand(text) {
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.readOnly = true;
    ta.style.cssText =
      'position:fixed;top:0;left:0;width:2px;height:2px;opacity:0;padding:0;border:none;outline:none';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export function initContactEmailCopy() {
  const btn = document.querySelector('.contact-email');
  const toast = document.getElementById('copy-toast');
  if (!btn || !toast) return;

  function showCopyToast(ok) {
    clearTimeout(copyToastTimer);

    toast.textContent = ok
      ? 'Copié !'
      : 'Copie impossible ! Veuillez réessayer.';

    /* Masquage instantané puis réaffichage animé (sinon un 2e clic arrive avant la fin du fade-out). */
    toast.style.transition = 'none';
    toast.classList.remove('copy-toast--visible');
    void toast.offsetHeight;

    requestAnimationFrame(() => {
      toast.style.transition = '';
      void toast.offsetHeight;
      toast.classList.add('copy-toast--visible');
    });

    copyToastTimer = setTimeout(() => {
      toast.classList.remove('copy-toast--visible');
    }, 2600);
  }

  btn.addEventListener('click', () => {
    const email = (btn.dataset.email || btn.textContent || '').trim();
    if (!email) {
      showCopyToast(false);
      return;
    }

    if (copyWithExecCommand(email)) {
      showCopyToast(true);
      return;
    }

    if (navigator.clipboard?.writeText && window.isSecureContext) {
      navigator.clipboard.writeText(email).then(
        () => showCopyToast(true),
        () => showCopyToast(false)
      );
    } else {
      showCopyToast(false);
    }
  });
}
