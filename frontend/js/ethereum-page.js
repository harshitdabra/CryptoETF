document.addEventListener("DOMContentLoaded", () => {
  loadEthereumData();
});

async function loadEthereumData() {
  try {
    // ---- REQUIRED DOM ELEMENTS ----
    const priceEl = document.getElementById("eth-price");
    const marketCapEl = document.getElementById("eth-market-cap");
    const supplyEl = document.getElementById("eth-supply");
    const loadingEl = document.getElementById("loading");

    // HARD FAIL if HTML is wrong
    if (!priceEl || !marketCapEl || !supplyEl) {
      console.error("ETH page DOM elements missing");
      return;
    }

    // ---- API CALL ----
    const res = await fetch(`${window.API_BASE_URL}/api/ethereum`);

    if (!res.ok) {
      throw new Error(`ETH API failed: ${res.status}`);
    }

    const data = await res.json();

    // ---- DATA GUARDS ----
    if (!data || !data.price) {
      throw new Error("Invalid ETH API response");
    }

    // ---- UPDATE UI ----
    priceEl.textContent = `$${Number(data.price).toLocaleString()}`;
    marketCapEl.textContent = `$${Number(data.market_cap).toLocaleString()}`;
    supplyEl.textContent = Number(data.circulating_supply).toLocaleString();

    if (loadingEl) loadingEl.style.display = "none";
  } catch (err) {
    console.error("ETH page error:", err);

    const loadingEl = document.getElementById("loading");
    if (loadingEl) {
      loadingEl.textContent = "Failed to load Ethereum data";
    }
  }
}
