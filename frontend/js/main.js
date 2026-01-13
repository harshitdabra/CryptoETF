let combinedChart = null;

async function loadDashboardData(days = 7) {
    try {
        // CHANGED: Use window.API_BASE_URL instead of hardcoded localhost
        const response = await fetch(`${window.API_BASE_URL}/api/etf/combined?days=${days}`);
        const data = await response.json();
        
        if (!data.success) {
            console.error('Error:', data.error);
            return;
        }
        
        updateMetric('[data-metric="total-flow"]', data.total_combined_flow);
        updateMetric('[data-metric="btc-flow"]', data.total_btc_flow);
        updateMetric('[data-metric="eth-flow"]', data.total_eth_flow);
        
        const periodText = getPeriodText(days);
        document.getElementById('current-period').textContent = periodText;
        document.getElementById('btc-period').textContent = periodText;
        document.getElementById('eth-period').textContent = periodText;
        
        document.getElementById('chart-date-range').textContent = data.date_range;
        updateLastUpdateTime();
        
        if (data.chart_data && data.chart_data.length > 0) {
            if (combinedChart) combinedChart.destroy();
            setTimeout(() => {
                combinedChart = Charts.createCombinedFlowChart('combined-flow-chart', data.chart_data);
            }, 100);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function updateMetric(selector, value) {
    const el = document.querySelector(selector);
    if (el && value !== undefined) {
        el.textContent = formatCurrency(value);
        el.classList.remove('positive', 'negative');
        el.classList.add(value >= 0 ? 'positive' : 'negative');
    }
}

function initControls() {
    document.querySelectorAll('.chart-controls button').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.chart-controls button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const days = {'7d': 7, '30d': 30, '90d': 90, '1y': 365}[this.dataset.period] || 7;
            loadDashboardData(days);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData(7);
    initControls();
});
