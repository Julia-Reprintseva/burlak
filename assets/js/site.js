// Меню: кнопка-бургер открывает список разделов; на компьютере кнопка появляется после первого экрана.
(function () {
  var root = document.documentElement;
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('menu');
  var hero = document.getElementById('top');

  function setOpen(open) {
    root.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    menu.setAttribute('aria-hidden', String(!open));
  }

  toggle.addEventListener('click', function () { setOpen(!root.classList.contains('menu-open')); });
  // пока меню открыто, прокрутка страницы заблокирована: сначала закрываем, потом едем к разделу
  menu.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var target = document.querySelector(link.getAttribute('href'));
    e.preventDefault();
    setOpen(false);
    if (target) {
      target.scrollIntoView();
      history.replaceState(null, '', link.getAttribute('href'));
    }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });

  if ('IntersectionObserver' in window && hero) {
    new IntersectionObserver(function (entries) {
      toggle.classList.toggle('is-visible', !entries[0].isIntersecting);
    }).observe(hero);
  }
})();

// Частые вопросы: на компьютере место под список ограничено макетом, поэтому открыт один вопрос за раз.
(function () {
  var items = document.querySelectorAll('.faq-ui details');
  items.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open || !window.matchMedia('(min-width: 1024px)').matches) return;
      items.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });
})();

// Запись на консультацию: сервера у сайта нет, поэтому форма готовит письмо Екатерине в почтовой программе.
(function () {
  var form = document.getElementById('signup');
  if (!form) return;
  var status = form.querySelector('.f-status');
  var TO = 'ekaterinaburlak@gmail.com';

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = form.email, name = form.name;
    var bad = [email, name].filter(function (f) { return !f.value.trim() || !f.checkValidity(); });
    [email, name].forEach(function (f) { f.setAttribute('aria-invalid', String(bad.indexOf(f) !== -1)); });
    if (bad.length) {
      status.textContent = 'Заполните, пожалуйста, почту и имя.';
      bad[0].focus();
      return;
    }
    var body = 'Имя: ' + name.value.trim() + '\nПочта: ' + email.value.trim() +
      (form.comment.value.trim() ? '\n\n' + form.comment.value.trim() : '');
    window.location.href = 'mailto:' + TO + '?subject=' + encodeURIComponent('Запись на консультацию') +
      '&body=' + encodeURIComponent(body);
    status.textContent = 'Открываем почту с готовым письмом. Если не открылась — напишите на ' + TO;
  });
})();

// Панель меню (компьютер): появляется, как только меню первого экрана уходит за край, и видна дальше всё время.
(function () {
  var bar = document.querySelector('.topbar');
  if (!bar) return;
  function update() { bar.classList.toggle('is-visible', window.scrollY > 110); }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();
