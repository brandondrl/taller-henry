// =============================================
// CONFIGURACIÓN
// =============================================
const WA_NUMBER = '584126466657'; // solo dígitos, sin + ni espacios

// =============================================
// TRACKING DE CTAs (GA4)
// =============================================
// Cuando GA4 esté activo, todos los elementos con
// data-track="nombre-del-evento" registran un evento
// automáticamente. Solo descomenta el bloque GA4 en
// el <head> del index.html y esto funciona solo.
//
// Nomenclatura de eventos:
//   nav-whatsapp         → WhatsApp desde la navbar
//   hero-whatsapp-*      → Hero CTA
//   service-ac-whatsapp  → CTA de servicio A/C
//   service-mec-whatsapp → CTA de servicio mecánica
//   service-pin-whatsapp → CTA de servicio pintura
//   process-whatsapp     → CTA sección proceso
//   contact-whatsapp-block → Bloque de contacto
//   contact-*            → Formulario
//   location-*           → Links de ubicación
//   footer-*             → Footer
//   fab-whatsapp         → Botón flotante
//   reviews-google-link  → Link a Google
//   form-submit          → Envío del formulario
//
function trackClick(eventName, label) {
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, {
      event_category: 'cta',
      event_label: label || eventName
    });
  }
}

document.querySelectorAll('[data-track]').forEach(el => {
  el.addEventListener('click', () => {
    trackClick(el.getAttribute('data-track'));
  });
});

// =============================================
// NAVBAR – scroll
// =============================================
const navbar = document.getElementById('navbar');

const handleScroll = () => {
  navbar.classList.toggle('scrolled', window.scrollY > 48);
};

window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();

// =============================================
// MENÚ HAMBURGER
// =============================================
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// =============================================
// ANIMACIONES DE SCROLL
// =============================================
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// =============================================
// FORMULARIO – validación + WhatsApp
// =============================================
const form    = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');

function sanitize(str) {
  return String(str).trim()
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#x27;');
}

function isValidPhone(p) { return /^[\d\s\+\-\(\)]{7,20}$/.test(p); }

function showMsg(text, type) {
  formMsg.textContent = text;
  formMsg.className   = 'form-msg ' + type;
  formMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

form.addEventListener('submit', e => {
  e.preventDefault();

  // Honeypot antispam
  const hp = form.querySelector('[name="_hp"]');
  if (hp && hp.value.trim() !== '') return;

  const nombre   = sanitize(form.nombre.value);
  const telefono = sanitize(form.telefono.value);
  const servicio = sanitize(form.servicio.value);
  const mensaje  = sanitize(form.mensaje.value);

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
    showMsg('Selecciona el servicio que necesitas.', 'error');
    form.servicio.focus();
    return;
  }

  const lines = [
    `Hola Henry, me llamo ${nombre}.`,
    `Tel/WA: ${telefono}`,
    `Servicio: ${servicio}`,
    mensaje ? `Mensaje: ${mensaje}` : ''
  ].filter(Boolean);

  window.open(
    `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`,
    '_blank',
    'noopener,noreferrer'
  );

  // =============================================
  // FORMSPREE (opcional) – también recibe por email
  // 1. Crea cuenta en formspree.io (gratis hasta 50/mes)
  // 2. Copia tu endpoint ID
  // 3. Descomenta y reemplaza TU_ID_AQUI
  // =============================================
  /*
  fetch('https://formspree.io/f/TU_ID_AQUI', {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, telefono, servicio, mensaje })
  });
  */

  trackClick('form-submit-success');
  showMsg('Listo, te abrimos WhatsApp para continuar.', 'success');
  form.reset();
});
