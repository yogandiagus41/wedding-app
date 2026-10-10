(function () {
  "use strict";

  // ====== PENGATURAN (ganti sesuai kebutuhan) ======
  var WEDDING_DATE = new Date("2026-12-19T08:00:00+07:00"); // tanggal dummy untuk hitung mundur
  var PHOTO_DIR = "assets/img/bayu/";
  var PHOTO_COUNT = 10;                                     // 1.jpeg ... 10.jpeg
  // ==================================================

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var html = document.documentElement, body = document.body;
  var book = $("#book"), main = $("#main"), dots = $("#dots");

  // ---------- Nama tamu: ?to=Budi+Santoso ----------
  var to = new URLSearchParams(location.search).get("to");
  if (to) $("#guest").textContent = to;

  // ---------- Hitung mundur ----------
  function pad(n) { return String(n).padStart(2, "0"); }
  function tick() {
    var s = Math.max(0, Math.floor((WEDDING_DATE - new Date()) / 1000));
    $("#cd").textContent = pad(Math.floor(s / 86400));
    $("#ch").textContent = pad(Math.floor(s % 86400 / 3600));
    $("#cm").textContent = pad(Math.floor(s % 3600 / 60));
    $("#cs").textContent = pad(s % 60);
  }
  tick(); setInterval(tick, 1000);

  // ---------- Galeri: 10 foto, 2 foto besar ----------
  var gallery = $("#gallery"), photos = [];
  var bigAt = { 1: true, 7: true };            // urutan foto yang dibuat besar (agar grid 4x4 penuh)
  for (var i = 1; i <= PHOTO_COUNT; i++) {
    var src = PHOTO_DIR + i + ".jpeg";
    photos.push(src);
    var t = document.createElement("button");
    t.type = "button";
    t.className = "tile" + (bigAt[i] ? " big" : "");
    t.setAttribute("aria-label", "Buka foto " + i);
    t.dataset.i = i - 1;
    t.innerHTML = '<img src="' + src + '" alt="Foto galeri ' + i + '" loading="lazy" decoding="async">';
    gallery.appendChild(t);
  }

  // ---------- Lightbox ----------
  var lb = $("#lb"), lbImg = $("#lbImg"), lbCount = $("#lbCount"), cur = 0, lastFocus = null;
  function show(n) {
    cur = (n + photos.length) % photos.length;
    lbImg.src = photos[cur];
    lbImg.alt = "Foto galeri " + (cur + 1);
    lbCount.textContent = (cur + 1) + " / " + photos.length;
  }
  function openLb(n) { lastFocus = document.activeElement; show(n); lb.hidden = false; $(".lb-close").focus(); }
  function closeLb() { lb.hidden = true; if (lastFocus) lastFocus.focus(); }
  gallery.addEventListener("click", function (e) {
    var b = e.target.closest(".tile"); if (b) openLb(+b.dataset.i);
  });
  $(".lb-close").addEventListener("click", closeLb);
  $(".lb-prev").addEventListener("click", function () { show(cur - 1); });
  $(".lb-next").addEventListener("click", function () { show(cur + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") show(cur - 1);
    if (e.key === "ArrowRight") show(cur + 1);
  });
  var tx = null;
  lb.addEventListener("touchstart", function (e) { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (tx === null) return;
    var dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
  });

  // ---------- Salin nomor rekening ----------
  $$("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = $(btn.dataset.copy).textContent.trim();
      var label = $("span", btn), old = label.textContent;
      var done = function (m) { label.textContent = m; setTimeout(function () { label.textContent = old; }, 2000); };
      try { navigator.clipboard.writeText(text).then(function () { done("Tersalin"); }, function () { done("Salin manual"); }); }
      catch (err) { done("Salin manual"); }
    });
  });

  // ---------- Animasi per layar + indikator ----------
  var screens = $$(".screen");
  screens.forEach(function (s, idx) {
    var b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", s.dataset.title || "Bagian " + (idx + 1));
    b.addEventListener("click", function () { s.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); });
    dots.appendChild(b);
  });
  var dotBtns = $$("button", dots);

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      en.target.classList.toggle("in", en.isIntersecting);   // animasi ulang tiap kali layar masuk
      if (en.isIntersecting) {
        dotBtns.forEach(function (d, i) { d.classList.toggle("on", screens[i] === en.target); });
      }
    });
  }, { threshold: 0.5 });
  // pengamatan dimulai saat undangan dibuka, agar layar pertama beranimasi tepat ketika halaman terangkat
  function startObserving() { screens.forEach(function (s) { io.observe(s); }); }

  // ---------- Buka undangan: animasi halaman buku ----------
  var opened = false;
  function finishOpen() {
    book.hidden = true;
    html.classList.remove("locked"); body.classList.remove("locked");
    main.inert = false; dots.hidden = false;
    window.scrollTo(0, 0);
  }
  $("#open").addEventListener("click", function () {
    if (opened) return; opened = true;
    book.classList.add("open");
    if (reduce) { startObserving(); finishOpen(); return; }
    // layar pertama mulai beranimasi saat halaman terangkat
    setTimeout(function () { main.inert = false; startObserving(); }, 600);
    setTimeout(finishOpen, 2000);
  });

  // pastikan mulai dari atas saat dimuat ulang
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
})();
