/* ==========================================================
   GABBE — Designer de Marcas — script.js
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Configurações WhatsApp ---------- */
  const phoneNumber = "5511943934176";
  const message = "Olá! Vi seu site e gostaria de conversar sobre...";

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
  if (navToggle && mainNav && header) {
    navToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      header.classList.toggle('nav-open');
    });
    mainNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mainNav.classList.remove('open');
        header.classList.remove('nav-open');
      });
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

  /* ---------- Gerar QR Code WhatsApp ---------- */
  const qrcodeContainer = document.getElementById('qrcode');
  if (qrcodeContainer && typeof QRCode !== 'undefined') {
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    new QRCode(qrcodeContainer, {
      text: whatsappURL,
      width: 180,
      height: 180,
      colorDark: "#052B2A",
      colorLight: "#F7F2E9",
      correctLevel: QRCode.CorrectLevel.H
    });
  }

  /* ==========================================================
     IMAGENS DOS SERVIÇOS — carregamento dinâmico + click to advance
     ==========================================================
     COMO ADICIONAR MAIS IMAGENS NO FUTURO:
      1. Coloque os arquivos .jpg na pasta /images/
      2. Adicione os nomes dos arquivos no array abaixo,
         dentro do serviço correspondente.
     
     Exemplo — Adicionar uma 4ª imagem ao Serviço 01:
       "01": ["serv_1.jpg", "serv_1_2.jpg", "serv_1_3.jpg", "serv_1_4.jpg"]
     ========================================================== */
  const serviceImages = {
    "01": ["serv_1.jpg", "serv_2.jpg", "serv_3.jpg", "serv_4.jpg"],
    "02": ["serv_1.jpg", "serv_2.jpg", "serv_3.jpg", "serv_4.jpg"],
    "03": ["serv_1.jpg", "serv_2.jpg", "serv_3.jpg", "serv_4.jpg"],
    "04": ["serv_1.jpg", "serv_2.jpg", "serv_3.jpg", "serv_4.jpg"]
  };

  function loadServiceImages() {
    document.querySelectorAll('.service-row').forEach(row => {
      const serviceNum = row.getAttribute('data-service');
      const images = serviceImages[serviceNum];
      if (!images || images.length === 0) return;

      const stack = row.querySelector('.service-img-stack');
      if (!stack) return;

      stack.innerHTML = '';

      images.forEach((filename, idx) => {
        const div = document.createElement('div');
        div.className = 'service-img';
        div.setAttribute('data-index', idx + 1);
        
        const img = document.createElement('img');
        img.src = `images/${filename}`;
        img.alt = `Serviço ${serviceNum} — imagem ${idx + 1}`;
        img.loading = 'lazy';
        
        div.appendChild(img);
        stack.appendChild(div);
      });
    });
  }

  /**
   * Inicializa o carrossel de cada stack:
   * - Imagem clicada vai para cima (classe .active), maior
   * - As demais ficam abaixo (classe .thumb), lado a lado
   */
  function initServiceCarousels() {
    document.querySelectorAll('.service-img-stack').forEach(stack => {
      const imgs = stack.querySelectorAll('.service-img');
      if (imgs.length < 4) return;

      function layout(activeIdx) {
        imgs.forEach((img, i) => {
          img.classList.remove('active', 'thumb');
          if (i === activeIdx) {
            img.classList.add('active');
          } else {
            img.classList.add('thumb');
          }
        });
      }

      imgs.forEach((img, i) => {
        img.addEventListener('click', () => layout(i));
      });

      // Primeira imagem como ativa
      layout(0);
    });
  }

  loadServiceImages();
  initServiceCarousels();

});