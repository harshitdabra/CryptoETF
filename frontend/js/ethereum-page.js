let ethereumChart = null;

function getEl(selector) {
    return document.querySelector(selector);
}

async function loadEthereumData(days = 30) {
    const flowEl = getEl('[data-metric="eth-net-flow"]');
    const periodEl = getEl('#eth-current-period');
    const rangeEl = getEl('#eth-date-range');
    const canvasEl = document.getElementById('ethereum-flow-chart');

    if (!flowEl || !periodEl || !rangeEl || !canvasEl) {
        console.error('ETH page DOM elements missing', {
            flowEl,
            periodEl,
            rangeEl,
            canvasEl
        });
        return;
    }

    try {
        const url = `${window.API_BASE_URL}/api/etf/ethereum/flows?days=${days}`;
        console.log('Fetching ETH data:', url);

        const response = await fetch(url);
        const data = await response.json();

        if (!data || data.success !== true) {
            console.error('ETH API failed:', data);
            return;
        }

        flowEl.textContent = formatCurrency(data.total_flow);
        flowEl.classList.remove('positive', 'negative');
        flowEl.classList.add(data.total_flow >= 0 ? 'positive' : 'negative');

        getEl('[data-period="last-week"]').textContent =
            formatCurrency(data.last_week);
        getEl('[data-period="last-month"]').textContent =
            formatCurrency(data.last_month);
        getEl('[data-period="last-3-months"]').textContent =
            formatCurrency(data.last_3_months);

        periodEl.textContent = getPeriodText(days);
        rangeEl.textContent = data.date_range;
        updateLastUpdateTime();

        // ---- CHART ----
        if (Array.isArray(data.chart_data) && data.chart_data.length > 0) {
            if (ethereumChart) ethereumChart.destroy();

            ethereumChart = Charts.createFlowChart(
                'ethereum-flow-chart',
                data.chart_data,
                'Ethereum'
            );
        }
    } catch (err) {
        console.error('ETH load error:', err);
    }
}

function initEthereumControls() {
    const buttons = document.querySelectorAll('.chart-controls button');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const daysMap = {
                '7d': 7,
                '30d': 30,
                '90d': 90,
                '1y': 365
            };

            const days = daysMap[btn.dataset.period] || 30;
            loadEthereumData(days);
        });
    });
}

window.addEventListener('load', () => {
    console.log('ETH page loaded');
    loadEthereumData(30);
    initEthereumControls();
});
