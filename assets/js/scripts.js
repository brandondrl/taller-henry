    // ---- Navbar scroll ----
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    // ---- Hamburger menu ----
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // ---- Intersection Observer for fade-up animations ----
    const fadeEls = document.querySelectorAll('.fade-up');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    fadeEls.forEach(el => observer.observe(el));

    // ---- Contact form ----
    const form = document.getElementById('contactForm');
    const formMsg = document.getElementById('formMsg');

    // Input sanitization helper
    function sanitize(str) {
      return String(str).trim()
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    }

    // Phone validation (Venezuela format + international)
    function isValidPhone(phone) {
      return /^[\d\s\+\-\(\)]{7,20}$/.test(phone);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Honeypot check
      const hp = form.querySelector('[name="_hp_name"]');
      if (hp && hp.value.trim() !== '') {
        // Silently stop – it's a bot
        return;
      }

      const nombre   = sanitize(form.nombre.value);
      const telefono = sanitize(form.telefono.value);
      const servicio = sanitize(form.servicio.value);
      const mensaje  = sanitize(form.mensaje.value);

      // Validation
      if (!nombre || nombre.length < 2) {
        showMsg('Por favor ingresa tu nombre.', 'error');
        form.nombre.focus();
        return;
      }

      if (!isValidPhone(telefono)) {
        showMsg('Ingresa un número de teléfono válido.', 'error');
        form.telefono.focus();
        return;
      }

      if (!servicio) {
        showMsg('Por favor selecciona un servicio.', 'error');
        form.servicio.focus();
        return;
      }

      // Build WhatsApp message and open
      const texto = encodeURIComponent(
        `Hola Henry! Me llamo ${nombre}.\n` +
        `Teléfono: ${telefono}\n` +
        `Servicio: ${servicio}\n` +
        (mensaje ? `Mensaje: ${mensaje}` : '')
      );

      // REEMPLAZA con el número de WhatsApp real (solo dígitos, sin + ni espacios)
      window.open(`https://wa.me/584XXXXXXXXX?text=${texto}`, '_blank', 'noopener,noreferrer');

      showMsg('¡Perfecto! Te redirigimos a WhatsApp para continuar la conversación. 💬', 'success');
      form.reset();
    });

    function showMsg(text, type) {
      formMsg.textContent = text;
      formMsg.className = 'form-msg ' + type;
      formMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }