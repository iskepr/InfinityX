const deviceName = new URLSearchParams(window.location.search).get("device");

if (!deviceName) {
    window.location.href = "/";
}

const deviceTitle = document.getElementById("device_title");
deviceTitle.textContent = deviceName;

const deviceContainer = document.getElementById("device_container");

let deviceData;
let DownloadDataGapps;
let DownloadDataVanilla;

async function loadDeviceData(deviceName) {
    try {
        const [deviceRes, gappsRes, vanillaRes] = await Promise.all([
            fetch(`https://raw.githubusercontent.com/ProjectInfinity-X/official_devices/master/devices/${deviceName}.json`),
            fetch(`https://raw.githubusercontent.com/ProjectInfinity-X/official_devices/master/gapps/${deviceName}.json`),
            fetch(`https://raw.githubusercontent.com/ProjectInfinity-X/official_devices/master/vanilla/${deviceName}.json`)
        ]);

        if (!deviceRes.ok) throw new Error("فشل تحميل بيانات الجهاز");

        const deviceData = await deviceRes.json();
        let DownloadDataGapps = null;
        let DownloadDataVanilla = null;

        if (gappsRes.ok) {
            const gappsJson = await gappsRes.json();
            DownloadDataGapps = gappsJson.response?.[0] || null;
        }

        if (vanillaRes.ok) {
            const vanillaJson = await vanillaRes.json();
            DownloadDataVanilla = vanillaJson.response?.[0] || null;
        }

        if (!DownloadDataGapps && !DownloadDataVanilla) {
            throw new Error("لا يوجد أي إصدار GApps أو Vanilla متاح للجهاز");
        }

        const deviceCard = document.createElement("div");
        deviceCard.className = "DevicePage";

        const versionHTML = `
            <div class="item">
                <h3>Version</h3>
                ${DownloadDataGapps ? `<span>GApps: ${DownloadDataGapps.version}</span>` : ""}
                ${DownloadDataVanilla ? `<span>Vanilla: ${DownloadDataVanilla.version}</span>` : ""}
            </div>`;

        const sizeHTML = `
            <div class="item">
                <h3>Size</h3>
                ${DownloadDataGapps ? `<span>GApps: ${(DownloadDataGapps.size / 1073741824).toFixed(2)} GB</span>` : ""}
                ${DownloadDataVanilla ? `<span>Vanilla: ${(DownloadDataVanilla.size / 1073741824).toFixed(2)} GB</span>` : ""}
            </div>`;

        const dateHTML = `
            <div class="item">
                <h3>Date</h3>
                ${DownloadDataGapps ? `<span>GApps: ${new Date(DownloadDataGapps.timestamp * 1000).toLocaleDateString("en-US")}</span>` : ""}
                ${DownloadDataVanilla ? `<span>Vanilla: ${new Date(DownloadDataVanilla.timestamp * 1000).toLocaleDateString("en-US")}</span>` : ""}
            </div>`;

        const buttonsHTML = `
            ${DownloadDataGapps ? `<a href="${DownloadDataGapps.download}" class="btn btn_sm btn_donate" target="_blank" rel="noopener noreferrer"><i class="fas fa-download"></i> GApps</a>` : ""}
            ${DownloadDataVanilla ? `<a href="${DownloadDataVanilla.download}" class="btn btn_sm btn_donate" target="_blank" rel="noopener noreferrer"><i class="fas fa-download"></i> Vanilla</a>` : ""}
            ${deviceData.donateurl1 ? `<a href="${deviceData.donateurl1}" class="btn btn_sm btn_donate" target="_blank" rel="noopener noreferrer"><i class="fas fa-donate"></i> Donate</a>` : ""}
        `;

        deviceCard.innerHTML = `
            <div class="left">
                <img src="${deviceData.image || "https://raw.githubusercontent.com/GenesisOS/Website-Data/v2/devices/roster/pong/pong.png"}" alt="${deviceData.name}">
            </div>
            <div class="right">
                <div class="item">
                    <h3>Device Name</h3>
                    <span>${deviceData.devicemodel}</span>
                </div>
                <div class="device_meta">
                    <div class="item">
                        <h3>Maintainer</h3>
                        <span>${deviceData.maintainer}</span>
                    </div>
                    ${versionHTML}
                    ${sizeHTML}
                    ${dateHTML}
                </div>
                <div class="device_actions">
                    ${buttonsHTML}
                </div>
            </div>
        `;

        deviceContainer.appendChild(deviceCard);
    } catch (error) {
        console.error("فشل في تحميل البيانات:", error.message);
    }
}

loadDeviceData(deviceName);

// if (deviceData && DownloadDataGapps) {

// else {
//     deviceContainer.innerHTML = `
//     <div class="error_message">
//         <i class="fas fa-exclamation-triangle"></i>
//         <p>Failed to load device. Please try again later.</p>
//         <button class="btn btn_retry" onclick="window.location.reload()">Retry</button>
//     </div>
// `;
// }
