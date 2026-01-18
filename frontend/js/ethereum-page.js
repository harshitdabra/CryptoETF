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

        const lastWeekEl = document.querySelector('[data-period="last-week"]');
        if (lastWeekEl) lastWeekEl.textContent = formatCurrency(data.last_week);

        const lastMonthEl = document.querySelector('[data-period="last-month"]');
        if (lastMonthEl) lastMonthEl.textContent = formatCurrency(data.last_month);

        const last3MonthsEl = document.querySelector('[data-period="last-3-months"]');
        if (last3MonthsEl) last3MonthsEl.textContent = formatCurrency(data.last_3_months);

        const periodEl = document.getElementById('eth-current-period');
        if (periodEl) periodEl.textContent = getPeriodText(days);

        const rangeEl = document.getElementById('eth-date-range');
        if (rangeEl) rangeEl.textContent = data.date_range;

        updateLastUpdateTime();

        if (data.chart_data?.length) {
            if (ethereumChart) ethereumChart.destroy();
            ethereumChart = Charts.createFlowChart(
                'ethereum-flow-chart',
                data.chart_data,
                'Ethereum'
            );
        }

    } catch (error) {
        console.error('Ethereum page error:', error);
    }
}

function initEthereumControls() {
    document.querySelectorAll('.chart-controls button').forEach(button => {
        button.addEventListener('click', function () {
            document.querySelectorAll('.chart-controls button')
                .forEach(btn => btn.classList.remove('active'));

            this.classList.add('active');

            const daysMap = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 };
            loadEthereumData(daysMap[this.dataset.period] || 30);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadEthereumData(30);
    initEthereumControls();
});
