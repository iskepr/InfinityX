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
    const repo =
        "https://raw.githubusercontent.com/ProjectInfinity-X/official_devices/master";
    try {
        const [deviceRes, gappsRes, vanillaRes, changelogRes, howtoflashRes] =
            await Promise.all([
                fetch(`${repo}/devices/${deviceName}.json`),
                fetch(`${repo}/gapps/${deviceName}.json`),
                fetch(`${repo}/vanilla/${deviceName}.json`),
                fetch(`${repo}/changelog/${deviceName}.txt`),
                fetch(`${repo}/flashguide/${deviceName}.txt`),
            ]);

        if (!deviceRes.ok) throw new Error("فشل تحميل بيانات الجهاز");

        const deviceData = await deviceRes.json();
        let DownloadDataGapps = null;
        let DownloadDataVanilla = null;
        let DataChangelog = null;
        let DataHowtoflash = null;

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
        if (changelogRes.ok) {
            const changelogtxt = await changelogRes.text();
            DataChangelog = changelogtxt
                .replace(/\n/g, "<br>")
                .replace(/=+/g, "<hr>");
        }
        if (howtoflashRes.ok) {
            const howtoflashtxt = await howtoflashRes.text();
            DataHowtoflash = howtoflashtxt
                .replace(/\n/g, "<br>")
                .replace(/=+/g, "<hr>");
        }

        const deviceCard = document.createElement("div");
        deviceCard.className = "DevicePage";

        fetchDeviceImage(deviceData.codename.split("/")[0]).then((imageUrl) => {
            console.log(deviceData);
            deviceCard.innerHTML = `
            <div class="left">
                <img src="${imageUrl}" class="device_image" alt="${
                deviceData.devicemodel
            }"/>
            </div>
            <div class="right">
                <div class="device_meta">
                    <div class="item">
                        <h3>Device Name</h3>
                        <span>${deviceData.devicemodel}</span>
                    </div>
                    <a href="${deviceData.maintainerurl}" target="_blank" class="item">
                        <h3>Maintainer</h3>
                        <span>${deviceData.maintainer}</span>
                    </a>
                    <div class="item">
                        <h3>Version</h3>
                        ${
                            DownloadDataGapps
                                ? `<span>GApps: ${DownloadDataGapps.version}</span>`
                                : ""
                        }
                        ${
                            DownloadDataVanilla
                                ? `<span>Vanilla: ${DownloadDataVanilla.version}</span>`
                                : ""
                        }
                    </div>
                    <div class="item">
                <h3>Size</h3>
                ${
                    DownloadDataGapps
                        ? `<span>GApps: ${(
                              DownloadDataGapps.size / 1073741824
                          ).toFixed(2)} GB</span>`
                        : ""
                }
                ${
                    DownloadDataVanilla
                        ? `<span>Vanilla: ${(
                              DownloadDataVanilla.size / 1073741824
                          ).toFixed(2)} GB</span>`
                        : ""
                }
            </div>
            <div class="item">
                <h3>Date</h3>
                ${
                    DownloadDataGapps
                        ? `<span>GApps: ${new Date(
                              DownloadDataGapps.timestamp * 1000
                          ).toLocaleDateString("en-US")}</span>`
                        : ""
                }
                ${
                    DownloadDataVanilla
                        ? `<span>Vanilla: ${new Date(
                              DownloadDataVanilla.timestamp * 1000
                          ).toLocaleDateString("en-US")}</span>`
                        : ""
                }
            </div>
                </div>
                <div class="device_actions">
                                ${
                                    DownloadDataGapps
                                        ? `<a href="${DownloadDataGapps.download}" class="btn btn_sm btn_donate" target="_blank" rel="noopener noreferrer"><i class="fas fa-download"></i> GApps</a>`
                                        : ""
                                }
            ${
                DownloadDataVanilla
                    ? `<a href="${DownloadDataVanilla.download}" class="btn btn_sm btn_donate" target="_blank" rel="noopener noreferrer"><i class="fas fa-download"></i> Vanilla</a>`
                    : ""
            }
            ${
                deviceData.donateurl1
                    ? `<a href="${deviceData.donateurl1}" class="btn btn_sm btn_donate" target="_blank" rel="noopener noreferrer"><i class="fas fa-donate"></i> Donate</a>`
                    : ""
            }
                </div>
            </div>
        `;

            deviceContainer.appendChild(deviceCard);

            const ChangelogContainer =
                document.getElementById("ChangelogContainer");
            const HowtoFlashContainer = document.getElementById(
                "HowtoFlashContainer"
            );

            ChangelogContainer.innerHTML = DataChangelog;
            HowtoFlashContainer.innerHTML = DataHowtoflash;
        });
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
