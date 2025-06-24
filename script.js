document.addEventListener("DOMContentLoaded", function () {
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

        async function loadDevices() {
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
                    deviceCard.className = "device_card";
                    deviceCard.href = "Download/?device=" + deviceData.filename;

                    // Format maintainer name (remove email if present)
                    const maintainerName = deviceData.maintainer
                        .split("<")[0]
                        .trim();

                    // const imageUrl = `https://raw.githubusercontent.com/ProjectInfinity-X/official_devices/master/devices/img/${deviceData.codename}.png`;
                    const imageUrl = `https://raw.githubusercontent.com/GenesisOS/Website-Data/v2/devices/roster/pong/pong.png`;

                    deviceCard.innerHTML = `
                    <div class="device_image">
                        <img src="${imageUrl}" alt="${deviceData.devicemodel}"/>
                    </div>
                    <div class="device_content">
                        <h3>${deviceData.devicemodel}</h3>
                        <div class="device_codename">${
                            deviceData.codename
                        }</div>
                        
                        <div class="device_meta">
                            <div class="meta_item">
                                <i class="fas fa-user"></i>
                                <span>${maintainerName}</span>
                            </div>
                            ${
                                deviceData.maintainerurl
                                    ? `
                            <div class="meta_item">
                                <i class="fas fa-link"></i>
                                <a href="${deviceData.maintainerurl}" target="_blank" rel="noopener noreferrer">Profile</a>
                            </div>`
                                    : ""
                            }
                            ${
                                deviceData.supportgrouprul
                                    ? `
                            <div class="meta_item">
                                <i class="fab fa-telegram"></i>
                                <a href="${deviceData.supportgrouprul}" target="_blank" rel="noopener noreferrer">Support Group</a>
                            </div>`
                                    : ""
                            }
                        </div>
                        
                        ${
                            deviceData.donateurl1 || deviceData.donateurl2
                                ? `
                        <div class="device_actions">
                            ${
                                deviceData.donateurl1
                                    ? `
                            <a href="${deviceData.donateurl1}" class="btn btn_sm btn_donate" target="_blank" rel="noopener noreferrer">
                                <i class="fab fa-paypal"></i> Donate
                            </a>`
                                    : ""
                            }
                            ${
                                deviceData.donateurl2
                                    ? `
                            <a href="${deviceData.donateurl2}" class="btn btn_sm btn_donate" target="_blank" rel="noopener noreferrer">
                                <i class="fas fa-coffee"></i> Ko-fi
                            </a>`
                                    : ""
                            }
                        </div>`
                                : ""
                        }
                    </div>
                `;

                    devicesContainer.appendChild(deviceCard);
                });
            } catch (error) {
                console.error("Error loading devices:", error);
                devicesContainer.innerHTML = `
                <div class="error_message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Failed to load devices. Please try again later.</p>
                    <button class="btn btn_retry" onclick="window.location.reload()">
                        <i class="fas fa-sync-alt"></i> Retry
                    </button>
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
        loadDevices();
    }
});

// cursor animation
const ua = navigator.userAgent;
if (!/mobile|tablet|ipad|playbook|silk/i.test(ua)) {
    let cursor = document.createElement("div");
    cursor.setAttribute("id", "cursor");
    cursor.style = `
      position: fixed;
      top: 0;
      transition: 0.1s;
      border-radius: 100%;
      box-shadow: 0 0 400px 80px #2079fff0;`;
    document.body.appendChild(cursor);

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
