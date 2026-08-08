(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = [...document.querySelectorAll('.reveal')];

  document.querySelectorAll('.stagger-children').forEach((group) => {
    [...group.children].slice(0, 6).forEach((child, index) => child.style.setProperty('--stagger-index', index));
  });

  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -18% 0px', threshold: 0.02 });

  reveals.forEach((element) => observer.observe(element));
})();
