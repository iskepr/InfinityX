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
                devices.forEach((deviceData) => {
                    const deviceCard = document.createElement("a");
                    deviceCard.className = "DeviceCard";
                    deviceCard.href =
                        "/Download/?device=" + deviceData.filename;

                    fetchDeviceImage(deviceData.codename.split("/")[0]).then((imageUrl) => {
                        deviceCard.innerHTML = `
                        <h3 class="device_name">${deviceData.codename}</h3>
                        <p class="device_model">${deviceData.devicemodel}</p>
                        <img src="${imageUrl}" class="device_image" alt="${deviceData.devicemodel}"/>`;
                            devicesContainer.appendChild(deviceCard);
                    });
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
