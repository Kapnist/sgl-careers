(function () {
  var btn = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  function close() { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
  // Close the mobile menu when the screen grows past the breakpoint (rotation, resize)
  var mq = window.matchMedia('(min-width: 1081px)');
  (mq.addEventListener ? mq.addEventListener('change', close) : mq.addListener(close));
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); btn.focus(); }
  });
})();

// Remember the language the visitor picked (per-browser convenience only)
document.querySelectorAll('.lang a[hreflang]').forEach(function (a) {
  a.addEventListener('click', function () {
    try { localStorage.setItem('lang', a.getAttribute('hreflang')); } catch (e) {}
  });
});
