
/* ===== PENGATURAN UNDANGAN ===== */
const CFG = {
    groom: "Rafi",
    bride: "Alya",
    date: "2026-12-12T08:00:00+07:00",
    dateText: "12 . 12 . 2026",

    photos: {
        p1: "assets/img/bayu/1",
        p2: "assets/img/bayu/2",
        p3: "assets/img/bayu/3",
        p7: "assets/img/bayu/7",
        p8: "assets/img/bayu/8",
        p9: "assets/img/bayu/9",
        p10: "assets/img/bayu/10"
    }
};

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

/* ===== NAMA MEMPELAI ===== */
const nm =
    `${CFG.groom}<span class="amp">&amp;</span>${CFG.bride}`;

$('#coverNames').innerHTML = nm;
$('#heroNames').innerHTML = nm;

$('#footNames').textContent =
    `${CFG.groom} & ${CFG.bride}`;

$('#heroDate').textContent = CFG.dateText;

/* ===== NAMA TAMU DARI URL ===== */
const to = new URLSearchParams(location.search).get('to');

if (to) {
    $('#guest').textContent = to;
}

/* ===== LOAD FOTO OTOMATIS ===== */
function loadPhoto(img, path) {
    if (/\.[a-z0-9]{3,4}$/i.test(path)) {
        img.src = path;
        return;
    }

    const extensions = [
        'jpg', 'jpeg', 'png', 'webp', 'JPG', 'JPEG', 'PNG'
    ];

    let i = 0;

    img.onerror = () => {
        i++;

        if (i < extensions.length) {
            img.src = path + '.' + extensions[i];
        } else {
            img.onerror = null;
            console.warn('Foto tidak ditemukan:', path);
        }
    };

    img.src = path + '.' + extensions[0];
}

for (const key in CFG.photos) {
    loadPhoto($('#' + key), CFG.photos[key]);
}

/* ===== VIDEO ===== */
const v = $('#vid');

v.play().catch(() => {});

/* ===== BUKA UNDANGAN ===== */
$('#openBtn').onclick = () => {
    $('#cover').classList.add('open');

    document.body.classList.remove('lock');
    document.body.classList.add('opened');

    // Section pembuka menggunakan foto nomor 3.
    setScene('p3');

    window.scrollTo(0, 0);

    // Video berhenti sementara dan dapat diputar kembali di penutup.
    v.pause();
};

/* ===== TOAST ===== */
let tt;

function toast(message) {
    const el = $('#toast');

    el.textContent = message;
    el.classList.add('show');

    clearTimeout(tt);

    tt = setTimeout(() => {
        el.classList.remove('show');
    }, 2200);
}

/* ===== COUNTDOWN ===== */
const target = new Date(CFG.date).getTime();

function tick() {
    let remaining = Math.max(0, target - Date.now());

    const units = [
        86400000,
        3600000,
        60000,
        1000
    ];

    const ids = ['d', 'h', 'm', 's'];

    units.forEach((unit, i) => {
        const number = Math.floor(remaining / unit);

        remaining -= number * unit;

        $('#' + ids[i]).textContent =
            String(number).padStart(2, '0');
    });
}

tick();
setInterval(tick, 1000);

/* ===== SALIN NOMOR REKENING ===== */
$$('.copy').forEach(button => {
    button.onclick = () => {
        const number = button.dataset.v;

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(number)
                .then(() => toast('Nomor rekening disalin'))
                .catch(() => toast('Salin manual: ' + number));
        } else {
            const temp = document.createElement('textarea');

            temp.value = number;
            temp.style.position = 'fixed';
            temp.style.opacity = '0';

            document.body.appendChild(temp);
            temp.select();

            let copied = false;

            try {
                copied = document.execCommand('copy');
            } catch (error) {
                copied = false;
            }

            temp.remove();

            toast(
                copied
                    ? 'Nomor rekening disalin'
                    : 'Salin manual: ' + number
            );
        }
    };
});

/* ===== SIMPAN KE KALENDER ===== */
$('#calBtn').onclick = () => {
    const formatDate = date => {
        return date.toISOString().replace(/[-:]|\.\d{3}/g, '');
    };

    const start = new Date(CFG.date);
    const end = new Date(start.getTime() + 6 * 3600000);

    const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Undangan Pernikahan//ID',
        'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        'SUMMARY:Pernikahan ' + CFG.groom + ' & ' + CFG.bride,
        'DTSTART:' + formatDate(start),
        'DTEND:' + formatDate(end),
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob(
        [ics],
        { type: 'text/calendar;charset=utf-8' }
    );

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

/* ===== EFEK 3D ===== */
const fine = matchMedia(
    '(hover:hover) and (pointer:fine)'
).matches;

const reduce = matchMedia(
    '(prefers-reduced-motion:reduce)'
).matches;

if (fine && !reduce) {
    $$('.t, .btn').forEach(el => {
        const isButton = el.classList.contains('btn');
        const strength = isButton ? 12 : 7;

        el.addEventListener('pointermove', event => {
            const rect = el.getBoundingClientRect();

            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;

            el.style.setProperty(
                '--rx',
                ((.5 - y) * strength) + 'deg'
            );

            el.style.setProperty(
                '--ry',
                ((x - .5) * strength * 1.2) + 'deg'
            );

            el.style.setProperty('--mx', (x * 100) + '%');
            el.style.setProperty('--my', (y * 100) + '%');
            el.style.setProperty('--g', 1);
        });

        el.addEventListener('pointerleave', () => {
            ['--rx', '--ry'].forEach(prop => {
                el.style.setProperty(prop, '0deg');
            });

            el.style.setProperty('--g', 0);
        });
    });
}

/* ===== EFEK 3D KETIKA SCROLL ===== */
const cards = $$('.t:not(#cover .t)');

let busy = false;

function onScroll() {
    if (busy) return;

    busy = true;

    requestAnimationFrame(() => {
        const viewportHeight = innerHeight;

        cards.forEach(el => {
            const rect = el.getBoundingClientRect();

            const position = Math.max(
                -1,
                Math.min(
                    1,
                    (rect.top + rect.height / 2 - viewportHeight / 2)
                    / (viewportHeight * .75)
                )
            );

            if (reduce) return;

            el.style.setProperty(
                '--sx',
                (position * 10) + 'deg'
            );

            el.style.setProperty(
                '--ty',
                (position * 25) + 'px'
            );

            el.style.setProperty(
                '--sc',
                1 - Math.abs(position) * .05
            );

            el.style.setProperty(
                '--o',
                Math.max(.3, 1 - Math.abs(position) * .65)
            );
        });

        busy = false;
    });
}

addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', onScroll);

onScroll();

/* ===== PERGANTIAN BACKGROUND SMOOTH ===== */
function setScene(name) {
    if (!document.body.classList.contains('opened')) {
        return;
    }

    if (!name) return;

    // Perubahan data-scene menjalankan transisi opacity CSS.
    document.body.dataset.scene = name;

    if (name === 'video') {
        // Video diputar kembali ketika section penutup aktif.
        if (v.paused) {
            v.play().catch(() => {});
        }
    } else {
        // Semua section foto menggunakan video yang dijeda.
        v.pause();
    }
}

/* Amati section yang sedang berada di tengah viewport */
const sceneObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        if (!document.body.classList.contains('opened')) {
            return;
        }

        const scene = entry.target.dataset.scene;

        if (scene) {
            setScene(scene);
        }
    });
}, {
    rootMargin: '-40% 0px -40% 0px',
    threshold: 0
});

$$('main section, main footer').forEach(section => {
    sceneObserver.observe(section);
});

/* ===== MENU AKTIF ===== */
const links = $$('#nav a');

const sections = links
    .map(link => $(link.getAttribute('href')))
    .filter(Boolean);

const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        links.forEach(link => {
            link.classList.toggle(
                'on',
                link.getAttribute('href') === '#' + entry.target.id
            );
        });
    });
}, {
    threshold: .3
});

sections.forEach(section => {
    navObserver.observe(section);
});


 
(function () {
    const musik = document.getElementById('musik');

    if (!musik) {
        console.error('Elemen musik tidak ditemukan!');
        return;
    }

    const mulaiDariDetik = 21;

    window.addEventListener('load', function () {
        musik.currentTime = mulaiDariDetik;

        musik.play()
            .then(function () {
                console.log('Musik berhasil diputar!');
            })
            .catch(function (error) {
                console.error('Musik gagal diputar:', error);
            });
    });
})();
