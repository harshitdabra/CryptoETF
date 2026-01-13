let ethereumChart = null;

async function loadEthereumData(days = 30) {
    try {
        const response = await fetch(`${window.API_BASE_URL}/api/etf/ethereum/flows?days=${days}`);
        const data = await response.json();
        
        if (!data.success) return;
        
        const flowEl = document.querySelector('[data-metric="eth-net-flow"]');
        if (flowEl) {
            flowEl.textContent = formatCurrency(data.total_flow);
            flowEl.classList.remove('positive', 'negative');
            flowEl.classList.add(data.total_flow >= 0 ? 'positive' : 'negative');
        }
        
        document.querySelector('[data-period="last-week"]').textContent = formatCurrency(data.last_week);
        document.querySelector('[data-period="last-month"]').textContent = formatCurrency(data.last_month);
        document.querySelector('[data-period="last-3-months"]').textContent = formatCurrency(data.last_3_months);
        
        document.getElementById('eth-current-period').textContent = getPeriodText(days);
        document.getElementById('eth-date-range').textContent = data.date_range;
        updateLastUpdateTime();
        
        if (data.chart_data && data.chart_data.length > 0) {
            if (ethereumChart) ethereumChart.destroy();
            setTimeout(() => {
                ethereumChart = Charts.createFlowChart('ethereum-flow-chart', data.chart_data, 'Ethereum');
            }, 100);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function initEthereumControls() {
    document.querySelectorAll('.chart-controls button').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.chart-controls button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const days = {'7d': 7, '30d': 30, '90d': 90, '1y': 365}[this.dataset.period] || 30;
            loadEthereumData(days);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    loadEthereumData(30);
    initEthereumControls();
});

