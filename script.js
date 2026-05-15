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


const contactForm = document.querySelector('[data-contact-form]');
const formStatus = document.querySelector('[data-form-status]');

const formToast = document.getElementById('formToast');
const submitButton = contactForm ? contactForm.querySelector('button[type="submit"]') : null;

function showToast(message, isError = false) {
  if (!formToast) return;
  formToast.textContent = message;
  formToast.style.borderColor = isError ? 'rgba(248, 113, 113, 0.55)' : 'rgba(16, 185, 129, 0.5)';
  formToast.classList.add('show');

  setTimeout(() => {
    formToast.classList.remove('show');
  }, 3000);
}

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  formStatus.textContent = 'Enviando mensagem...';

  try {
    const data = new FormData(contactForm);
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: data
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Falha no envio');
    }

    contactForm.reset();
    showToast('Mensagem enviada com sucesso. Em breve retornaremos o contato.');
  } catch (error) {
    formStatus.textContent = 'Não foi possível enviar a mensagem agora. Tente novamente ou envie um e-mail para contato@coreteam.com.br.';
  }
});