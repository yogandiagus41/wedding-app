/* ===== PENGATURAN UNDANGAN ===== */
const CFG = {
    groom: "Rafi",
    bride: "Alya",
    date: "2026-12-12T08:00:00+07:00",
    dateText: "12 . 12 . 2026",
    igGroom: "rafipratama",
    igBride: "alyasafitri",
    musicStart: 21,
    imgDir: "assets/img/",
    imgExt: "jpg"
};

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const photo = n => `${CFG.imgDir}${n}.${CFG.imgExt}`;

/* ===== ISI DATA ===== */
const nm = `${CFG.groom}<span class="amp">&amp;</span>${CFG.bride}`;
$('#coverNames').innerHTML = nm;
$('#heroNames').innerHTML = nm;
$('#footNames').textContent = `${CFG.groom} & ${CFG.bride}`;
$('#heroDate').textContent = CFG.dateText;
$('#coverDate').textContent = CFG.dateText;

const igLink = (el, user) => {
    el.href = `https://instagram.com/${user}`;
    el.textContent = `@${user}`;
};
igLink($('#igGroom'), CFG.igGroom);
igLink($('#igBride'), CFG.igBride);

const to = new URLSearchParams(location.search).get('to');
if (to) $('#guest').textContent = to;

/* ===== FOTO ===== */
$('#p2').src = photo(2);
$('#p6').src = photo(6);
$('#f3').src = photo(3);
$('#f4').src = photo(4);
$('#f5').src = photo(5);
$$('#gal img').forEach(img => { img.src = photo(img.dataset.i); });

/* ===== VIDEO ===== */
const v = $('#vid');
v.play().catch(() => {});

/* ===== MUSIK ===== */
const musik = $('#musik');
const musicBtn = $('#musicBtn');

function seekMusic() {
    try { musik.currentTime = CFG.musicStart; } catch (e) {}
}

function startMusic() {
    musik.play().then(() => musicBtn.classList.add('play')).catch(() => {});
    if (musik.readyState >= 1) {
        seekMusic();
    } else {
        musik.addEventListener('loadedmetadata', seekMusic, { once: true });
    }
}

musicBtn.onclick = () => {
    if (musik.paused) {
        musik.play().then(() => musicBtn.classList.add('play')).catch(() => {});
    } else {
        musik.pause();
        musicBtn.classList.remove('play');
    }
};

/* ===== SCENE LATAR ===== */
function setScene(name) {
    if (!name || !document.body.classList.contains('opened')) return;
    document.body.dataset.scene = name;

    if (name === 'video') {
        if (v.paused) v.play().catch(() => {});
    } else {
        // jeda setelah transisi pudar selesai
        setTimeout(() => {
            if (document.body.dataset.scene !== 'video') v.pause();
        }, 1700);
    }
}

/* ===== BUKA UNDANGAN ===== */
$('#openBtn').onclick = () => {
    $('#cover').classList.add('open');
    document.body.classList.remove('lock');
    document.body.classList.add('opened');
    window.scrollTo(0, 0);
    setScene('p2');
    startMusic();
};

/* ===== TOAST ===== */
let tt;
function toast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(tt);
    tt = setTimeout(() => el.classList.remove('show'), 2200);
}

/* ===== COUNTDOWN ===== */
const target = new Date(CFG.date).getTime();

function tick() {
    let remaining = Math.max(0, target - Date.now());
    const units = [86400000, 3600000, 60000, 1000];
    const ids = ['d', 'h', 'm', 's'];

    units.forEach((unit, i) => {
        const number = Math.floor(remaining / unit);
        remaining -= number * unit;
        $('#' + ids[i]).textContent = String(number).padStart(2, '0');
    });
}
tick();
setInterval(tick, 1000);

/* ===== SALIN REKENING ===== */
$$('.copy').forEach(button => {
    button.onclick = () => {
        const number = button.dataset.v;

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(number)
                .then(() => toast('Nomor rekening disalin'))
                .catch(() => toast('Salin manual: ' + number));
            return;
        }

        const temp = document.createElement('textarea');
        temp.value = number;
        temp.style.position = 'fixed';
        temp.style.opacity = '0';
        document.body.appendChild(temp);
        temp.select();

        let copied = false;
        try { copied = document.execCommand('copy'); } catch (e) {}
        temp.remove();

        toast(copied ? 'Nomor rekening disalin' : 'Salin manual: ' + number);
    };
});

/* ===== SIMPAN KE KALENDER ===== */
$('#calBtn').onclick = () => {
    const fmt = d => d.toISOString().replace(/[-:]|\.\d{3}/g, '');
    const start = new Date(CFG.date);
    const end = new Date(start.getTime() + 6 * 3600000);

    const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Undangan Pernikahan//ID',
        'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        'SUMMARY:Pernikahan ' + CFG.groom + ' & ' + CFG.bride,
        'DTSTART:' + fmt(start),
        'DTEND:' + fmt(end),
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'undangan.ics';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    toast('Acara disimpan');
};

/* ===== ANIMASI MUNCUL SAAT SCROLL ===== */
// jeda bertingkat untuk elemen bersaudara
$$('.grid, .timeline, .count, .wrap').forEach(group => {
    [...group.children].filter(c => c.classList.contains('rv'))
        .forEach((c, i) => c.style.setProperty('--d', (i * .15) + 's'));
});

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: .15, rootMargin: '0px 0px -6% 0px' });

$$('.rv, .row img').forEach(el => revealObserver.observe(el));

/* ===== GANTI BACKGROUND SESUAI SECTION ===== */
const sceneObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) setScene(entry.target.dataset.scene);
    });
}, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });

$$('main section, main footer').forEach(s => sceneObserver.observe(s));

/* ===== MENU AKTIF ===== */
const links = $$('#nav a');
const ids = links.map(l => l.getAttribute('href').slice(1));
const navMap = { mempelaiWanita: 'mempelaiPria', penutup: 'galeri' };

const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = navMap[entry.target.id] || entry.target.id;

        links.forEach(link => {
            const on = link.getAttribute('href') === '#' + id;
            link.classList.toggle('on', on);
            if (on) {
                link.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
            }
        });
    });
}, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

[...ids, 'mempelaiWanita', 'penutup']
    .map(id => document.getElementById(id))
    .filter(Boolean)
    .forEach(el => navObserver.observe(el));
