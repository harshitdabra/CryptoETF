// Utility Functions for Crypto ETF Tracker

/**
 * Format currency values with proper suffixes (B, M, K)
 */
function formatCurrency(value) {
    if (value === undefined || value === null) return '$0';
    
    const absValue = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    
    if (absValue >= 1e9) {
        return sign + '$' + (absValue / 1e9).toFixed(2) + 'B';
    } else if (absValue >= 1e6) {
        return sign + '$' + (absValue / 1e6).toFixed(2) + 'M';
    } else if (absValue >= 1e3) {
        return sign + '$' + (absValue / 1e3).toFixed(2) + 'K';
    }
    return sign + '$' + absValue.toFixed(2);
}

/**
 * Format large numbers with suffixes
 */
function formatLargeNumber(value) {
    if (value === undefined || value === null || isNaN(value)) {
        return '0';
    }
    
    const absValue = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    
    if (absValue >= 1e12) {
        return sign + (absValue / 1e12).toFixed(2) + 'T';
    }
    if (absValue >= 1e9) {
        return sign + (absValue / 1e9).toFixed(2) + 'B';
    }
    if (absValue >= 1e6) {
        return sign + (absValue / 1e6).toFixed(2) + 'M';
    }
    if (absValue >= 1e3) {
        return sign + (absValue / 1e3).toFixed(2) + 'K';
    }
    return sign + absValue.toFixed(0);
}

/**
 * Format date string to readable format
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Get current time in relative format (e.g., "Today at 1:29 AM")
 */
function getRelativeTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    
    return `Today at ${displayHours}:${displayMinutes} ${ampm}`;
}

/**
 * Update the "Last Updated" timestamp on the page
 */
function updateLastUpdateTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
    const el = document.getElementById('last-update-time');
    if (el) {
        el.textContent = `Today at ${timeStr}`;
    }
}
function getPeriodText(days) {
    if (days <= 7) return 'Last 7 Days';
    if (days <= 30) return 'Last 30 Days';
    if (days <= 90) return 'Last 90 Days';
    return 'Last Year';
}

/**
 * Update the date range display under chart title
 */
function updateDateRange(chartData) {
    const el = document.getElementById('date-range');
    if (el && chartData && chartData.length > 0) {
        const firstDate = new Date(chartData[0].date);
        const lastDate = new Date(chartData[chartData.length - 1].date);
        
        const formatShort = (date) => date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
        
        el.textContent = `${formatShort(firstDate)} - ${formatShort(lastDate)}`;
    }
}

/**
 * Update the period label (e.g., "Last 7 Days")
 */
function updatePeriodLabel(days) {
    const el = document.getElementById('current-period');
    if (el) {
        let label = '';
        switch(days) {
            case 7: 
                label = 'Last 7 Days'; 
                break;
            case 30: 
                label = 'Last 30 Days'; 
                break;
            case 90: 
                label = 'Last 90 Days'; 
                break;
            case 365: 
                label = 'Last Year'; 
                break;
            default: 
                label = `Last ${days} Days`;
        }
        el.textContent = label;
    }
}

/**
 * Format percentage with + or - sign
 */
function formatPercentage(value) {
    if (value === undefined || value === null || isNaN(value)) {
        return '0.00%';
    }
    
    const sign = value > 0 ? '+' : '';
    return sign + value.toFixed(2) + '%';
}

/**
 * Debounce function to limit function calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Check if date is today
 */
function isToday(date) {
    const today = new Date();
    const checkDate = new Date(date);
    return checkDate.getDate() === today.getDate() &&
           checkDate.getMonth() === today.getMonth() &&
           checkDate.getFullYear() === today.getFullYear();
}

/**
 * Check if date is yesterday
 */
function isYesterday(date) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const checkDate = new Date(date);
    return checkDate.getDate() === yesterday.getDate() &&
           checkDate.getMonth() === yesterday.getMonth() &&
           checkDate.getFullYear() === yesterday.getFullYear();
}

/**
 * Get relative date string (Today, Yesterday, or date)
 */
function getRelativeDate(dateString) {
    if (isToday(dateString)) {
        return 'Today';
    } else if (isYesterday(dateString)) {
        return 'Yesterday';
    } else {
        return formatDate(dateString);
    }
}

/**
 * Copy text to clipboard
 */
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Copied to clipboard:', text);
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
}

/**
 * Show loading state
 */
function showLoading(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        el.innerHTML = '<div style="text-align: center; padding: 20px; color: #888;">Loading...</div>';
    }
}

/**
 * Show error state
 */
function showError(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) {
        el.innerHTML = `<div style="text-align: center; padding: 20px; color: #ff3b30;">${message}</div>`;
    }
}

/**
 * Validate number
 */
function isValidNumber(value) {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Calculate percentage change
 */
function calculatePercentageChange(oldValue, newValue) {
    if (!isValidNumber(oldValue) || !isValidNumber(newValue) || oldValue === 0) {
        return 0;
    }
    return ((newValue - oldValue) / Math.abs(oldValue)) * 100;
}

/**
 * Format compact number (1.2K, 3.4M, etc.)
 */
function formatCompactNumber(value) {
    if (!isValidNumber(value)) return '0';
    
    const absValue = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    
    if (absValue >= 1e9) return sign + (absValue / 1e9).toFixed(1) + 'B';
    if (absValue >= 1e6) return sign + (absValue / 1e6).toFixed(1) + 'M';
    if (absValue >= 1e3) return sign + (absValue / 1e3).toFixed(1) + 'K';
    return sign + absValue.toFixed(0);
}
