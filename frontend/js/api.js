// API Client for backend communication

const API_BASE_URL = '';  // Same origin

class APIClient {
    async fetchData(endpoint) {
        try {
            const response = await fetch(`${API_BASE_URL}/api${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, error: error.message };
        }
    }

    // Get aggregated ETF data (BTC + ETH)
    async getAggregatedData() {
        return this.fetchData('/etf/aggregated');
    }

    // Get Bitcoin ETF flows
    async getBitcoinFlows() {
        return this.fetchData('/etf/bitcoin/flows');
    }

    // Get Ethereum ETF flows
    async getEthereumFlows() {
        return this.fetchData('/etf/ethereum/flows');
    }

    // Get Bitcoin ETF list
    async getBitcoinETFList() {
        return this.fetchData('/etf/bitcoin/list');
    }

    // Get Ethereum ETF list
    async getEthereumETFList() {
        return this.fetchData('/etf/ethereum/list');
    }

    // Get market prices
    async getMarketPrices() {
        return this.fetchData('/market/prices');
    }

    // Get Bitcoin AUM
    async getBitcoinAUM() {
        return this.fetchData('/etf/bitcoin/aum');
    }

    // Get Ethereum AUM
    async getEthereumAUM() {
        return this.fetchData('/etf/ethereum/aum');
    }
}

// Export instance
const api = new APIClient();