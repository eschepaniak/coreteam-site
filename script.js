const header = document.querySelector('[data-header]');
const nav = document.querySelector('[data-nav]');
const menuButton = document.querySelector('[data-menu-button]');
const year = document.querySelector('[data-year]');

year.textContent = new Date().getFullYear();

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 12);
});

menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.site-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

/* ── Dashboard bar animation ──────────────────────────── */
const dashBars = document.querySelectorAll('.dash-bar');
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('animated'), 350);
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
dashBars.forEach((b) => barObserver.observe(b));

/* ── Counter animation ────────────────────────────────── */
function animateCounter(el, target, duration = 2000) {
  let startTime = null;
  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.counter, 10);
      if (!isNaN(target)) animateCounter(entry.target, target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-counter]').forEach((el) => counterObserver.observe(el));

/* ── Contact form ─────────────────────────────────────── */
const contactForm   = document.querySelector('[data-contact-form]');
const formToast     = document.querySelector('[data-form-toast]');   // fixed: was getElementById('formToast') — element has no id
const submitButton  = contactForm ? contactForm.querySelector('button[type="submit"]') : null;

function showToast(message, isError = false) {
  if (!formToast) return;
  formToast.textContent = message;
  formToast.style.borderColor = isError
    ? 'rgba(248, 113, 113, 0.55)'
    : 'rgba(16, 185, 129, 0.5)';
  formToast.classList.add('show');
  setTimeout(() => formToast.classList.remove('show'), 4500);
}

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando…';
  }

  try {
    // Coleta campos do formulário
    const formData = new FormData(contactForm);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch(contactForm.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
    });

    let result;
    try {
      result = await response.json();
    } catch {
      throw new Error('Resposta inesperada do servidor.');
    }

    console.info('[CoreTeam form] status:', response.status, '| result:', result);

    // Formspree retorna { ok: true } no sucesso
    if (!response.ok || result.ok === false) {
      const msg = result?.errors?.[0]?.message || result?.error || `Erro ${response.status}`;
      throw new Error(msg);
    }

    contactForm.reset();
    showToast('Mensagem enviada com sucesso. Em breve retornaremos o contato.');
  } catch (error) {
    console.error('[CoreTeam form] Falha:', error.message);
    showToast(`Não foi possível enviar: ${error.message}`, true);
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Enviar mensagem';
    }
  }
});
