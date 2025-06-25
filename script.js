document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const logobg = document.querySelector("#lodaer .logobg");
        logobg.style.opacity = "0";
        setTimeout(() => {
            const lodaerDiv = document.getElementById("lodaer");
            lodaerDiv.style.background = "#00000000";
            lodaerDiv.style.backdropFilter = "blur(0px)";
            setTimeout(() => {
                lodaerDiv.style.display = "none";
            }, 1000);
            setTimeout(() => {
                document.querySelector(".hero .container").style.transform =
                    "translateY(0)";
                setTimeout(() => {
                    document.querySelector(
                        ".hero .hero_title"
                    ).style.transform = "translateY(0)";
                    setTimeout(() => {
                        document.querySelector(
                            ".hero .hero_description"
                        ).style.transform = "translateY(0)";
                        setTimeout(() => {
                            document.querySelector(
                                ".hero .cta_buttons"
                            ).style.transform = "translateY(0)";
                        }, 100);
                    }, 200);
                }, 200);
            }, 300);
        }, 500);
    }, 7000);
});

function loadDevices() {
    const devicesContainer = document.getElementById("devices_container");
    if (devicesContainer) {
        const loadingElement = document.createElement("div");
        loadingElement.className = "loading";
        loadingElement.innerHTML = `
        <div class="loading_spinner"></div>
        <p>Loading devices...</p>
    `;

        // Replace the loading text with our styled loading element
        devicesContainer.innerHTML = "";
        devicesContainer.appendChild(loadingElement);

        async function loadDevicesData() {
            const repoApiUrl =
                "https://api.github.com/repos/ProjectInfinity-X/official_devices/contents/devices";
            const baseRawUrl =
                "https://raw.githubusercontent.com/ProjectInfinity-X/official_devices/master/devices/";

            try {
                const response = await fetch(repoApiUrl);
                if (!response.ok)
                    console.log("Failed to fetch device list" + response);

                const files = await response.json();
                const jsonFiles = files.filter((file) =>
                    file.name.endsWith(".json")
                );

                if (jsonFiles.length === 0) {
                    throw new Error("No device files found");
                }

                // Clear loading state
                devicesContainer.innerHTML = "";

                // Load all device data in parallel
                const devicePromises = jsonFiles.map(async (file) => {
                    try {
                        const jsonRes = await fetch(baseRawUrl + file.name);
                        if (!jsonRes.ok) return null;
                        const deviceData = await jsonRes.json();
                        deviceData.filename = file.name.replace(".json", "");
                        return deviceData;
                    } catch (error) {
                        console.error(
                            `Error loading device ${file.name}:`,
                            error
                        );
                        return null;
                    }
                });

                // Wait for all device data to load
                const devices = (await Promise.all(devicePromises)).filter(
                    (device) => device !== null
                );

                // Sort devices alphabetically by model name
                devices.sort((a, b) =>
                    a.devicemodel.localeCompare(b.devicemodel)
                );

                // Render devices
                devices.forEach((deviceData, index) => {
                    const deviceCard = document.createElement("a");
                    deviceCard.className = "DeviceCard";
                    deviceCard.href = "Download/?device=" + deviceData.filename;

                    // Format maintainer name (remove email if present)
                    const maintainerName = deviceData.maintainer
                        .split("<")[0]
                        .trim();

                    // const imageUrl = `https://raw.githubusercontent.com/ProjectInfinity-X/official_devices/master/devices/img/${deviceData.codename}.png`;
                    const imageUrl = `https://raw.githubusercontent.com/GenesisOS/Website-Data/v2/devices/roster/${deviceData.codename}/${deviceData.codename}.png`;

                    deviceCard.innerHTML = `
                    <h3 class="device_name">${
                        deviceData.codename.split("/")[0]
                    }</h3>
                    <p class="device_model">${deviceData.devicemodel}</p>
                    <img src="${imageUrl}" onerror="this.onerror=null; this.src='https://raw.githubusercontent.com/GenesisOS/Website-Data/v2/devices/roster/pong/pong.png';"
                    class="device_image" alt="${deviceData.devicemodel}"/>
                `;

                    devicesContainer.appendChild(deviceCard);
                });
            } catch (error) {
                console.error("Error loading devices:", error);
                devicesContainer.innerHTML = `
                <div class="error_message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Failed to load devices. Please try again later.</p>
                    <button class="btn btn_retry" onclick="window.location.reload()">Retry</button>
                </div>
            `;
            }
        }

        // Add smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener("click", function (e) {
                e.preventDefault();
                const targetId = this.getAttribute("href");
                if (targetId === "#") return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100, // Adjust for fixed header
                        behavior: "smooth",
                    });
                }
            });
        });

        // Initialize the page
        loadDevicesData();
    }
}
loadDevices();

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
                <img src="../assets/InfinityX.png" width="40" alt="InfinityX">
                <span class="logo_text">InfinityX</span>
            </a>
            <nav class="nav">
                <a href="/#features">Features</a>
                <a href="/#devices">Devices</a>
                <a href="/#Screenshots">Screenshots</a>
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