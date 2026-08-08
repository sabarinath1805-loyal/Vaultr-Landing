(() => {
  const header = document.querySelector('#site-header');
  const announcement = document.querySelector('#announcement');
  const announcementClose = document.querySelector('.announcement__close');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('#mobile-menu');
  const mobileClose = document.querySelector('.mobile-menu__close');
  const menuItems = [...document.querySelectorAll('[data-menu]')];
  const form = document.querySelector('#access-form');
  const formSuccess = document.querySelector('#form-success');
  const timers = new WeakMap();

  const syncHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 40);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  announcementClose?.addEventListener('click', () => {
    announcement.classList.add('is-dismissed');
    header.classList.add('banner-dismissed');
  });

  const closeMenus = (except) => {
    menuItems.forEach((item) => {
      if (item === except) return;
      item.classList.remove('is-open');
      item.querySelector('button')?.setAttribute('aria-expanded', 'false');
    });
  };

  const openMenu = (item) => {
    closeMenus(item);
    item.classList.add('is-open');
    item.querySelector('button')?.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = (item) => {
    item.classList.remove('is-open');
    item.querySelector('button')?.setAttribute('aria-expanded', 'false');
  };

  menuItems.forEach((item) => {
    const button = item.querySelector('button');
    button?.addEventListener('click', () => item.classList.contains('is-open') ? closeMenu(item) : openMenu(item));
    item.addEventListener('mouseenter', () => {
      clearTimeout(timers.get(item));
      timers.set(item, setTimeout(() => openMenu(item), 140));
    });
    item.addEventListener('mouseleave', () => {
      clearTimeout(timers.get(item));
      timers.set(item, setTimeout(() => closeMenu(item), 180));
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('[data-menu]')) closeMenus();
  });

  const setMobileMenu = (open) => {
    mobileMenu.classList.toggle('is-open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    document.body.classList.toggle('menu-open', open);
    if (open) mobileClose.focus();
  };

  menuToggle?.addEventListener('click', () => setMobileMenu(true));
  mobileClose?.addEventListener('click', () => setMobileMenu(false));
  mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMobileMenu(false)));

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    closeMenus();
    if (mobileMenu?.classList.contains('is-open')) setMobileMenu(false);
  });

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    form.hidden = true;
    formSuccess.hidden = false;
    formSuccess.querySelector('h3')?.focus?.();
  });
})();
