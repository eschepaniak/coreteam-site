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

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(contactForm);
    const subject = `Contato pelo site - ${data.get('name') || 'CoreTeam'}`;
    const body = [
      `Nome: ${data.get('name') || ''}`,
      `E-mail: ${data.get('email') || ''}`,
      `Empresa: ${data.get('company') || ''}`,
      `Interesse: ${data.get('interest') || ''}`,
      '',
      'Mensagem:',
      data.get('message') || '',
    ].join('\n');

    window.location.href = `mailto:contato@coreteam.com.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
