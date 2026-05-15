const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const nav = document.querySelector('[data-nav]');
const year = document.querySelector('[data-year]');

if (year) {
  year.textContent = new Date().getFullYear();
}

window.addEventListener('scroll', () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 12);
});

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
}

const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

revealItems.forEach((item) => observer.observe(item));

const contactForm = document.getElementById('contactForm');
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

if (contactForm && submitButton) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';

    try {
      const formData = new FormData(contactForm);
      const payload = Object.fromEntries(formData);

      const response = await fetch(contactForm.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.message || 'Falha no envio');
      }

      contactForm.reset();
      showToast('Mensagem enviada com sucesso. Em breve retornaremos o contato.');
    } catch (error) {
      showToast('Não foi possível enviar a mensagem agora. Tente novamente ou envie um e-mail para contato@coreteam.com.br.', true);
      console.error('Erro ao enviar formulário:', error);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Enviar mensagem';
    }
  });
}
