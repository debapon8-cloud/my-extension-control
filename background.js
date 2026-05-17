console.log("SECURITY V2 LOADED");

async function checkStatus() {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/debapon8-cloud/my-extension-control/main/status.json?x=" + Date.now()
    );

    const data = await res.json();

    await chrome.storage.local.set({
      enabled: data.enabled
    });

    console.log("Enabled =", data.enabled);

  } catch(e) {
    console.log("ERROR:", e);
  }
}

checkStatus();

setInterval(checkStatus,3000);
