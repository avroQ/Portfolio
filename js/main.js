/**
 * Cybersecurity & Software Engineering Portfolio
 * Author: Kirill Perebikovskii (@avroQ)
 * 100% Offline Vanilla JS (Zero external dependencies)
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'avroq_portfolio_lang';

  // ---------------------------------------------------------------------------
  // 1. Language Toggle Engine (Instant 0ms switching, local storage + detection)
  // ---------------------------------------------------------------------------
  const titles = {
    ru: 'Кирилл Перебиковский | Специалист по ИБ и Разработчик',
    en: 'Kirill Perebikovskii | Cybersecurity Specialist & Software Engineer'
  };

  const descriptions = {
    ru: 'Портфолио Кирилла Перебиковского (avroQ) — Разработчик и специалист по информационной безопасности. Проектирование защищенных сервисов, WebAuthn, мониторинг.',
    en: 'Portfolio of Kirill Perebikovskii (avroQ) — Cybersecurity Specialist & Software Engineer. Secure service design, WebAuthn, DevSecOps monitoring.'
  };

  function setLanguage(lang) {
    const targetLang = (lang === 'en') ? 'en' : 'ru';
    document.documentElement.lang = targetLang;
    
    try {
      localStorage.setItem(STORAGE_KEY, targetLang);
    } catch (e) {
      // localStorage may fail in some restricted sandbox environments
    }

    // Update toggle button text and aria-label
    const toggleBtn = document.getElementById('lang-toggle');
    if (toggleBtn) {
      const nextLang = targetLang === 'ru' ? 'EN' : 'RU';
      toggleBtn.innerHTML = `<span class="lang-globe">🌐</span><span>${nextLang}</span>`;
      toggleBtn.setAttribute(
        'aria-label',
        targetLang === 'ru' ? 'Switch to English' : 'Переключить на русский'
      );
      toggleBtn.setAttribute('title', targetLang === 'ru' ? 'Switch to English' : 'Переключить на русский');
    }

    // Update document title and meta description
    document.title = titles[targetLang] || titles.ru;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', descriptions[targetLang] || descriptions.ru);
    }

    // If modal is currently open, refresh its title and description
    updateModalContentIfOpen(targetLang);
  }

  function initLanguage() {
    let savedLang = null;
    try {
      savedLang = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      savedLang = null;
    }

    if (savedLang === 'ru' || savedLang === 'en') {
      setLanguage(savedLang);
    } else {
      const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
      setLanguage(browserLang.startsWith('ru') ? 'ru' : 'en');
    }

    const toggleBtn = document.getElementById('lang-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        const currentLang = document.documentElement.lang || 'ru';
        setLanguage(currentLang === 'ru' ? 'en' : 'ru');
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 2. Accessible Lightbox Modal for Certificates
  // ---------------------------------------------------------------------------
  const modal = document.getElementById('cert-modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalPdfLink = document.getElementById('modal-pdf-link');
  const modalCloseBtn = document.getElementById('modal-close');

  let previousFocusedElement = null;
  let activeCertCard = null;

  function openModal(card) {
    if (!modal || !card) return;

    activeCertCard = card;
    previousFocusedElement = document.activeElement;

    const currentLang = document.documentElement.lang || 'ru';
    const imgSrc = card.getAttribute('data-cert-img');
    const titleRu = card.getAttribute('data-cert-title-ru');
    const titleEn = card.getAttribute('data-cert-title-en');
    const descRu = card.getAttribute('data-cert-desc-ru');
    const descEn = card.getAttribute('data-cert-desc-en');
    const pdfSrc = card.getAttribute('data-cert-pdf');

    if (modalImg) {
      modalImg.src = imgSrc || '';
      modalImg.alt = (currentLang === 'en' ? titleEn : titleRu) || 'Certificate Preview';
    }

    if (modalTitle) {
      modalTitle.textContent = (currentLang === 'en' ? titleEn : titleRu) || '';
    }

    if (modalDesc) {
      modalDesc.textContent = (currentLang === 'en' ? descEn : descRu) || '';
    }

    if (modalPdfLink && pdfSrc) {
      modalPdfLink.href = pdfSrc;
    }

    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Move focus to close button
    if (modalCloseBtn) {
      modalCloseBtn.focus();
    }
  }

  function updateModalContentIfOpen(currentLang) {
    if (!modal || !modal.classList.contains('is-active') || !activeCertCard) return;

    const titleRu = activeCertCard.getAttribute('data-cert-title-ru');
    const titleEn = activeCertCard.getAttribute('data-cert-title-en');
    const descRu = activeCertCard.getAttribute('data-cert-desc-ru');
    const descEn = activeCertCard.getAttribute('data-cert-desc-en');

    if (modalTitle) {
      modalTitle.textContent = (currentLang === 'en' ? titleEn : titleRu) || '';
    }

    if (modalDesc) {
      modalDesc.textContent = (currentLang === 'en' ? descEn : descRu) || '';
    }

    if (modalImg) {
      modalImg.alt = (currentLang === 'en' ? titleEn : titleRu) || 'Certificate Preview';
    }
  }

  function closeModal() {
    if (!modal || !modal.classList.contains('is-active')) return;

    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    activeCertCard = null;

    if (previousFocusedElement && typeof previousFocusedElement.focus === 'function') {
      previousFocusedElement.focus();
    }
  }

  function initCertLightbox() {
    const certCards = document.querySelectorAll('.cert-card');

    certCards.forEach(function (card) {
      const preview = card.querySelector('.cert-preview');
      const viewBtn = card.querySelector('.btn-cert-view');

      if (preview) {
        preview.setAttribute('tabindex', '0');
        preview.setAttribute('role', 'button');
        preview.setAttribute('aria-label', 'View Certificate Details');

        preview.addEventListener('click', function (e) {
          e.preventDefault();
          openModal(card);
        });

        preview.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal(card);
          }
        });
      }

      if (viewBtn) {
        viewBtn.addEventListener('click', function (e) {
          e.preventDefault();
          openModal(card);
        });
      }
    });

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeModal);
    }

    if (modal) {
      // Backdrop click closes modal
      modal.addEventListener('click', function (e) {
        if (e.target === modal) {
          closeModal();
        }
      });

      // Escape key closes modal & Focus trap
      document.addEventListener('keydown', function (e) {
        if (!modal.classList.contains('is-active')) return;

        if (e.key === 'Escape' || e.key === 'Esc') {
          e.preventDefault();
          closeModal();
          return;
        }

        if (e.key === 'Tab') {
          const focusables = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
          if (focusables.length === 0) return;

          const firstEl = focusables[0];
          const lastEl = focusables[focusables.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstEl) {
              e.preventDefault();
              lastEl.focus();
            }
          } else {
            if (document.activeElement === lastEl) {
              e.preventDefault();
              firstEl.focus();
            }
          }
        }
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 3. Mobile Navigation Menu Toggle
  // ---------------------------------------------------------------------------
  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when a link is clicked
    const links = navLinks.querySelectorAll('a');
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        if (navLinks.classList.contains('is-open')) {
          navLinks.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Initialization
  // ---------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    initLanguage();
    initCertLightbox();
    initMobileNav();
  });
})();
