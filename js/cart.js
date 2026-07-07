/* Ten Nuggets client-side cart. Items live in localStorage; checkout hands the
   exact variant + quantity into the real WooCommerce cart on samirdeokuliar.co. */
(function () {
  var KEY = 'tn-cart';

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
  }
  function save(c) {
    localStorage.setItem(KEY, JSON.stringify(c));
    badge();
    if (window.tnRenderCart) window.tnRenderCart();
  }
  function count() { return load().reduce(function (n, i) { return n + i.qty; }, 0); }

  function badge() {
    document.querySelectorAll('.nav-cart').forEach(function (a) {
      var b = a.querySelector('.cart-count');
      var n = count();
      if (n > 0) {
        if (!b) { b = document.createElement('span'); b.className = 'cart-count'; a.appendChild(b); }
        b.textContent = n > 9 ? '9+' : n;
      } else if (b) { b.remove(); }
    });
  }

  window.tnCart = {
    load: load,
    save: save,
    add: function (item) {
      var c = load();
      var f = c.find(function (i) { return i.vid === item.vid; });
      if (f) f.qty += (item.qty || 1); else c.push({ vid: item.vid, title: item.title, variant: item.variant, price: +item.price, qty: item.qty || 1 });
      save(c);
    },
    setQty: function (vid, qty) {
      var c = load().map(function (i) { if (i.vid === vid) i.qty = qty; return i; })
                    .filter(function (i) { return i.qty > 0; });
      save(c);
    },
    remove: function (vid) { save(load().filter(function (i) { return i.vid !== vid; })); },
  };

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-add-vid]');
    if (!b) return;
    e.preventDefault();
    window.tnCart.add({
      vid: b.getAttribute('data-add-vid'),
      title: b.getAttribute('data-add-title'),
      variant: b.getAttribute('data-add-variant'),
      price: b.getAttribute('data-add-price'),
    });
    if (b.getAttribute('data-add-stay') === '1') {
      var t = b.textContent;
      b.textContent = 'Added ✓';
      setTimeout(function () { b.textContent = t; }, 1200);
    } else {
      window.location.href = 'cart.html';
    }
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', badge);
  else badge();
})();
