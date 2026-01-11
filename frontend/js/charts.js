const Charts = {
    createCombinedFlowChart(canvasId, data) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const labels = data.map(item => item.date);
        const btcData = data.map(item => item.btc_flow / 1e6);
        const ethData = data.map(item => item.eth_flow / 1e6);

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Bitcoin ETF',
                        data: btcData,
                        backgroundColor: '#f7941a',
                        borderColor: '#f7941a',
                        borderWidth: 1
                    },
                    {
                        label: 'Ethereum ETF',
                        data: ethData,
                        backgroundColor: '#627eea',
                        borderColor: '#627eea',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: '#a0aec0',
                            font: { size: 12 }
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1a1f2e',
                        titleColor: '#ffffff',
                        bodyColor: '#a0aec0',
                        borderColor: '#2d3748',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                const label = context.dataset.label || '';
                                const value = context.parsed.y;
                                return `${label}: $${value.toFixed(2)}M`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        stacked: false,
                        grid: {
                            color: '#2d3748',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#718096',
                            maxRotation: 45,
                            minRotation: 0
                        }
                    },
                    y: {
                        stacked: false,
                        grid: {
                            color: '#2d3748',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#718096',
                            callback: function(value) {
                                return '$' + value + 'M';
                            }
                        }
                    }
                }
            }
        });
    },

    createFlowChart(canvasId, data, coinName) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const labels = data.map(item => item.date);
        const flowData = data.map(item => item.flow / 1e6);
        const color = coinName === 'Bitcoin' ? '#f7941a' : '#627eea';

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: `${coinName} ETF Flow`,
                    data: flowData,
                    backgroundColor: color,
                    borderColor: color,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1a1f2e',
                        titleColor: '#ffffff',
                        bodyColor: '#a0aec0',
                        borderColor: '#2d3748',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed.y;
                                return `Flow: $${value.toFixed(2)}M`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: '#2d3748', drawBorder: false },
                        ticks: { color: '#718096', maxRotation: 45, minRotation: 0 }
                    },
                    y: {
                        grid: { color: '#2d3748', drawBorder: false },
                        ticks: {
                            color: '#718096',
                            callback: function(value) {
                                return '$' + value + 'M';
                            }
                        }
                    }
                }
            }
        });
    }
};
