document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("lodaer").style.backdropFilter = "blur(0)";
    setTimeout(() => {
        document.getElementById("lodaer").style.display = "none";
    }, 1000);
    setTimeout(() => {
        document.querySelector(".hero .container").style.transform =
            "translateY(0)";
        setTimeout(() => {
            document.querySelector(".hero .hero_title").style.transform =
                "translateY(0)";
            setTimeout(() => {
                document.querySelector(
                    ".hero .hero_description"
                ).style.transform = "translateY(0)";
                setTimeout(() => {
                    document.querySelector(
                        ".hero .cta_buttons"
                    ).style.transform = "translateY(0)";
                }, 100);
            }, 100);
        }, 100);
    }, 100);
});

async function fetchDeviceImage(codename) {
    const sources = [
        `https://raw.githubusercontent.com/GenesisOS/Website-Data/v2/devices/roster/${codename}/${codename}.png`,
        `https://wiki.lineageos.org/images/devices/${codename}.png`,
        `https://images.evolution-x.org/devices/${codename}.png`,
    ];

    for (let url of sources) {
        try {
            const res = await fetch(url, { method: "HEAD" });
            if (res.ok) {
                return url;
            }
        } catch (err) {}
    }

    return "https://raw.githubusercontent.com/GenesisOS/Website-Data/v2/devices/roster/pong/pong.png"; // لو ولا واحد شغال
}

function LoadScreenshots() {
    let screenshotsSwiper;
    const screenshotsContainer = document.getElementById(
        "screenshotsContainer"
    );
    if (screenshotsContainer) {
        for (let i = 1; i <= 10; i++) {
            const slideDiv = document.createElement("div");
            slideDiv.className = "swiper-slide";

            const slideContent = document.createElement("div");
            slideContent.className = "swiper-slide-content";

            const img = document.createElement("img");
            img.src = `https://projectinfinity-x.com/ss-${i}.png`;
            img.alt = `Screenshot ${i} - InfinityX Roms`;
            img.loading = "lazy";

            slideContent.appendChild(img);
            slideDiv.appendChild(slideContent);
            screenshotsContainer.appendChild(slideDiv);
        }

        if (typeof Swiper !== "undefined") {
            if (screenshotsSwiper) {
                screenshotsSwiper.destroy(true, true);
            }

            screenshotsSwiper = new Swiper(".SSSwiper", {
                effect: "coverflow",
                grabCursor: true,
                centeredSlides: true,
                slidesPerView: "auto",
                coverflowEffect: {
                    rotate: 0,
                    stretch: 0,
                    depth: 500,
                    modifier: 1,
                    slideShadows: true,
                },
                loop: true,
                autoplay: {
                    delay: 7000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true,
                    dynamicBullets: true,
                },
                breakpoints: {
                    320: {
                        slidesPerView: 1.2,
                        spaceBetween: 20,
                        coverflowEffect: {
                            rotate: 0,
                            stretch: 0,
                            depth: 300,
                            modifier: 1,
                        },
                    },
                    640: {
                        slidesPerView: 1.5,
                        spaceBetween: 30,
                    },
                    1024: {
                        slidesPerView: 2.5,
                        spaceBetween: 40,
                    },
                    1280: {
                        slidesPerView: 3,
                        spaceBetween: 50,
                    },
                },
                on: {
                    init: function () {
                        // Add shadow elements for 3D effect
                        this.slides.forEach((slide) => {
                            slide.style.transform =
                                "translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg)";
                        });
                    },
                },
            });
        }
    }
}
LoadScreenshots();

// cursor animation
const ua = navigator.userAgent;
if (!/mobile|tablet|ipad|playbook|silk/i.test(ua)) {
    let cursor = document.getElementById("cursor");

    const mouse = { x: 0, y: 0 };
    const circle = { x: 0, y: 0 };

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    const speed = 0.17;

    const tick = () => {
        // position
        circle.x += (mouse.x - circle.x) * speed;
        circle.y += (mouse.y - circle.y) * speed;
        const position = `translate(${circle.x}px, ${circle.y}px)`;

        cursor.style.transform = position;

        window.requestAnimationFrame(tick);
    };

    tick();
}

function GlobalUI() {
    document.querySelector("header").innerHTML = `
            <div class="container">
            <a href="/" class="logo">
                <img src="../assets/InfinityX.png" onerror="this.onerror=null; this.src='./assets/InfinityX.png';" width="40" alt="InfinityX">
                <span class="logo_text">InfinityX</span>
            </a>
            <nav class="nav">
                <a href="/#Features">Features</a>
                <a href="/#Screenshots">Screenshots</a>
                <a href="/Devices/">Devices</a>
            </nav>
            <div class="header_actions">
                <a href="https://github.com/ProjectInfinity-X" target="_blank" class="social_icon">
                    <i class="fab fa-github"></i>
                </a>
                <a href="https://t.me/ProjectInfinityX" target="_blank" class="social_icon">
                    <i class="fab fa-telegram"></i>
                </a>
                <a href="#donate" class="donate_btn">Donate</a>
            </div>
        </div>`;
}
GlobalUI();
