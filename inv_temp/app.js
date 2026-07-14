// =====================================================
// GLOBAL
// =====================================================

const wrapper = document.querySelector(".horizontal-wrapper");
const panels = document.querySelectorAll(".panel");

const loader = document.getElementById("loader");
const cover = document.getElementById("cover");
const main = document.getElementById("main");

const progressBar = document.getElementById("progressBar");

const music = document.getElementById("music");

let weddingData = null;

let currentPanel = 0;

let isScrolling = false;

const totalPanel = panels.length;


// =====================================================
// LOAD JSON
// =====================================================

async function loadData() {

    const response = await fetch("wedding.json");

    weddingData = await response.json();

    renderData();

}


// =====================================================
// RENDER
// =====================================================

function renderData() {

    document.getElementById("coverCouple").innerHTML =
        weddingData.bride.name +
        " & " +
        weddingData.groom.name;

    document.getElementById("coverDate").innerHTML =
        weddingData.event.date;



    document.getElementById("brideName").innerHTML =
        weddingData.bride.name;

    document.getElementById("brideDesc").innerHTML =
        weddingData.bride.parent;

    document.getElementById("bridePhoto").src =
        weddingData.bride.photo;



    document.getElementById("groomName").innerHTML =
        weddingData.groom.name;

    document.getElementById("groomDesc").innerHTML =
        weddingData.groom.parent;

    document.getElementById("groomPhoto").src =
        weddingData.groom.photo;



    document.getElementById("akadDate").innerHTML =
        weddingData.akad.date;

    document.getElementById("akadTime").innerHTML =
        weddingData.akad.time;

    document.getElementById("akadLocation").innerHTML =
        weddingData.akad.location;



    document.getElementById("resepsiDate").innerHTML =
        weddingData.resepsi.date;

    document.getElementById("resepsiTime").innerHTML =
        weddingData.resepsi.time;

    document.getElementById("resepsiLocation").innerHTML =
        weddingData.resepsi.location;



    renderStory();

    renderGallery();

    renderGift();

    music.src = weddingData.music;

}



// =====================================================
// STORY
// =====================================================

function renderStory() {

    let html = "";

    weddingData.story.forEach(item => {

        html += `

        <div class="story-item">

            <h4>${item.title}</h4>

            <small>${item.date}</small>

            <p>${item.description}</p>

        </div>

        `;

    });

    document.getElementById("storyContainer").innerHTML = html;

}



// =====================================================
// GALLERY
// =====================================================

function renderGallery() {

    let html = "";

    weddingData.gallery.forEach(photo => {

        html += `

        <img
            src="${photo}"
            class="gallery-image">

        `;

    });

    document.getElementById("galleryGrid").innerHTML = html;

}



// =====================================================
// GIFT
// =====================================================

function renderGift() {

    let html = "";

    weddingData.gift.forEach(item => {

        html += `

        <div class="gift-card">

            <h3>${item.bank}</h3>

            <p>${item.name}</p>

            <p>${item.number}</p>

            <button
                class="copy-button"
                data-copy="${item.number}">

                Copy Rekening

            </button>

        </div>

        `;

    });

    document.getElementById("giftContainer").innerHTML = html;

}



// =====================================================
// LOADER
// =====================================================

window.addEventListener("load", () => {

    setTimeout(() => {

        loader.style.opacity = 0;

        loader.style.visibility = "hidden";

    }, 1000);

});



// =====================================================
// INIT
// =====================================================

loadData();
// =====================================================
// OPEN INVITATION
// =====================================================

document
    .getElementById("openInvitation")
    .addEventListener("click", openInvitation);

function openInvitation() {

    cover.style.opacity = "0";
    cover.style.visibility = "hidden";

    main.style.opacity = "1";
    main.style.visibility = "visible";

    if (music.src) {

        music.play().catch(() => {});

    }

    updatePanel();

}



// =====================================================
// HORIZONTAL SCROLL
// =====================================================

function movePanel(index) {

    if (index < 0) return;

    if (index >= totalPanel) return;

    currentPanel = index;

    wrapper.style.transform =
        `translateX(-${currentPanel * window.innerWidth}px)`;

    updatePanel();

}



// =====================================================
// UPDATE ACTIVE PANEL
// =====================================================

function updatePanel() {

    panels.forEach((panel, i) => {

        panel.classList.remove("active");

        if (i === currentPanel) {

            panel.classList.add("active");

        }

    });

    updateProgress();

}



// =====================================================
// PROGRESS BAR
// =====================================================

function updateProgress() {

    const percent =
        ((currentPanel + 1) / totalPanel) * 100;

    progressBar.style.width = percent + "%";

}



// =====================================================
// MOUSE WHEEL
// =====================================================

window.addEventListener("wheel", (e) => {

    if (cover.style.visibility !== "hidden") return;

    if (isScrolling) return;

    isScrolling = true;

    if (e.deltaY > 0) {

        movePanel(currentPanel + 1);

    } else {

        movePanel(currentPanel - 1);

    }

    setTimeout(() => {

        isScrolling = false;

    }, 700);

}, {
    passive: true
});



// =====================================================
// KEYBOARD
// =====================================================

window.addEventListener("keydown", (e) => {

    if (cover.style.visibility !== "hidden") return;

    if (e.key === "ArrowRight") {

        movePanel(currentPanel + 1);

    }

    if (e.key === "ArrowLeft") {

        movePanel(currentPanel - 1);

    }

});



// =====================================================
// TOUCH SWIPE
// =====================================================

let touchStartX = 0;
let touchEndX = 0;

window.addEventListener("touchstart", (e) => {

    touchStartX = e.changedTouches[0].clientX;

});

window.addEventListener("touchend", (e) => {

    touchEndX = e.changedTouches[0].clientX;

    const distance = touchStartX - touchEndX;

    if (Math.abs(distance) < 60) return;

    if (distance > 0) {

        movePanel(currentPanel + 1);

    } else {

        movePanel(currentPanel - 1);

    }

});



// =====================================================
// WINDOW RESIZE
// =====================================================

window.addEventListener("resize", () => {

    wrapper.style.transform =
        `translateX(-${currentPanel * window.innerWidth}px)`;

});



// =====================================================
// SMOOTH SCROLL BY BUTTON
// =====================================================

document.querySelectorAll("[data-next]").forEach(button => {

    button.addEventListener("click", () => {

        movePanel(currentPanel + 1);

    });

});



// =====================================================
// PREVENT DRAG IMAGE
// =====================================================

document.addEventListener("dragstart", (e) => {

    if (e.target.tagName === "IMG") {

        e.preventDefault();

    }

});



// =====================================================
// START PANEL
// =====================================================

updatePanel();
// =====================================================
// COUNTDOWN
// =====================================================

function startCountdown() {

    const target = new Date(weddingData.event.datetime).getTime();

    function update() {

        const now = new Date().getTime();

        const distance = target - now;

        if (distance <= 0) {

            document.getElementById("days").textContent = "00";
            document.getElementById("hours").textContent = "00";
            document.getElementById("minutes").textContent = "00";
            document.getElementById("seconds").textContent = "00";

            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));

        const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) /
            (1000 * 60 * 60)
        );

        const minutes = Math.floor(
            (distance % (1000 * 60 * 60)) /
            (1000 * 60)
        );

        const seconds = Math.floor(
            (distance % (1000 * 60)) /
            1000
        );

        document.getElementById("days").textContent =
            String(days).padStart(2, "0");

        document.getElementById("hours").textContent =
            String(hours).padStart(2, "0");

        document.getElementById("minutes").textContent =
            String(minutes).padStart(2, "0");

        document.getElementById("seconds").textContent =
            String(seconds).padStart(2, "0");

    }

    update();

    setInterval(update, 1000);

}



// =====================================================
// COPY BANK ACCOUNT
// =====================================================

document.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("copy-button")) return;

    const number = e.target.dataset.copy;

    try {

        await navigator.clipboard.writeText(number);

        const oldText = e.target.innerText;

        e.target.innerText = "Berhasil Disalin";

        setTimeout(() => {

            e.target.innerText = oldText;

        }, 2000);

    } catch {

        alert("Tidak dapat menyalin.");

    }

});



// =====================================================
// LIGHTBOX
// =====================================================

const lightbox = document.getElementById("lightbox");

const lightboxImage = document.getElementById("lightboxImage");

const closeLightbox = document.getElementById("closeLightbox");

document.addEventListener("click", (e) => {

    if (!e.target.classList.contains("gallery-image")) return;

    lightbox.classList.add("show");

    lightboxImage.src = e.target.src;

});

closeLightbox.addEventListener("click", () => {

    lightbox.classList.remove("show");

});

lightbox.addEventListener("click", (e) => {

    if (e.target === lightbox) {

        lightbox.classList.remove("show");

    }

});



// =====================================================
// SIMPLE PARALLAX
// =====================================================

window.addEventListener("mousemove", (e) => {

    const x = (e.clientX / window.innerWidth - 0.5) * 20;

    const y = (e.clientY / window.innerHeight - 0.5) * 20;

    document.querySelectorAll(".parallax").forEach(item => {

        item.style.transform =
            `translate(${x}px,${y}px)`;

    });

});



// =====================================================
// OBSERVER ANIMATION
// =====================================================

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

}, {
    threshold: .3
});

document
    .querySelectorAll(".fade-up,.scale,.rotate")
    .forEach(el => {

        observer.observe(el);

    });



// =====================================================
// AUTO START COUNTDOWN
// =====================================================

const waitCountdown = setInterval(() => {

    if (weddingData) {

        clearInterval(waitCountdown);

        startCountdown();

    }

}, 100);



// =====================================================
// DISABLE RIGHT CLICK
// =====================================================

document.addEventListener("contextmenu", e => {

    e.preventDefault();

});



// =====================================================
// PREVENT ZOOM DOUBLE TAP
// =====================================================

let lastTouchEnd = 0;

document.addEventListener("touchend", function (event) {

    const now = Date.now();

    if (now - lastTouchEnd <= 300) {

        event.preventDefault();

    }

    lastTouchEnd = now;

}, {
    passive: false
});



// =====================================================
// END
// =====================================================