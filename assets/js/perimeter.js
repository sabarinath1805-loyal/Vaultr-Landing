(() => {
  const composition = document.querySelector('[data-perimeter]');
  if (!composition) return;

  const activate = () => {
    if (sessionStorage.getItem('vaultr-perimeter-seen') === 'true') {
      composition.classList.add('is-active');
      return;
    }

    composition.classList.add('is-active');
    sessionStorage.setItem('vaultr-perimeter-seen', 'true');

    window.setTimeout(() => {
      composition.classList.add('is-pulsing');
      window.setTimeout(() => composition.classList.remove('is-pulsing'), 620);
    }, 860);
  };

  if (!('IntersectionObserver' in window)) {
    activate();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    activate();
    observer.disconnect();
  }, { threshold: 0.45 });

  observer.observe(composition);
})();
