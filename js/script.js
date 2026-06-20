/* ==========================================================
   GABBE — Designer de Marcas — script.js
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Ano no rodapé ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header: estado ao rolar ---------- */
  const header = document.getElementById('siteHeader');
  const brand = document.getElementById('brandLogo');
  const heroEl = document.querySelector('.hero');

  function updateHeaderState() {
    const scrollY = window.scrollY;
    if (scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Logo claro quando ainda sobre o hero escuro, escuro quando sobre fundo claro
    if (heroEl) {
      const heroBottom = heroEl.offsetTop + heroEl.offsetHeight;
      if (scrollY < heroBottom - 100) {
        brand.classList.add('on-dark');
      } else {
        brand.classList.remove('on-dark');
      }
    }
  }
  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });

  /* ---------- Menu mobile ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
    });
    mainNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mainNav.classList.remove('open'));
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    io.observe(el);
  });

  /* ---------- Campos do formulário com label flutuante ---------- */
  document.querySelectorAll('.field input, .field textarea, .field select').forEach(input => {
    const field = input.closest('.field');

    const checkValue = () => {
      if (input.tagName === 'SELECT' && input.value) {
        field.classList.add('has-value');
      } else {
        field.classList.remove('has-value');
      }
    };

    input.addEventListener('focus', () => field.classList.add('focused'));
    input.addEventListener('blur', () => {
      field.classList.remove('focused');
      checkValue();
    });
    input.addEventListener('change', checkValue);
    checkValue();
  });

  /* ---------- Envio do formulário de contacto (demo client-side) ---------- */
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();

      if (!name || !email) {
        formNote.textContent = 'Preenche o nome e o e-mail para continuar.';
        formNote.classList.remove('success');
        return;
      }

      const firstName = name.split(' ')[0];
      formNote.textContent = `Obrigada, ${firstName}! A tua mensagem foi recebida — respondo em breve.`;
      formNote.classList.add('success');

      form.reset();
      form.querySelectorAll('.field').forEach(f => f.classList.remove('has-value', 'focused'));
    });
  }

  /* ---------- Smooth anchor offset (compensar header fixo) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 84;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});
