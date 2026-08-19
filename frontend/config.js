window.API_BASE_URL = window.location.hostname.includes('localhost')
  ? 'http://localhost:5000'
  : window.location.origin;
