import requests
from typing import Dict, List, Optional
import sys
sys.path.append('..')
from config import Config

class CoinGeckoClient:
    def __init__(self):
        self.base_url = Config.COINGECKO_BASE_URL
        self.api_key = Config.COINGECKO_API_KEY
        self.headers = {
            'x-cg-pro-api-key': self.api_key
        } if self.api_key else {}

    def _make_request(self, endpoint: str, params: Optional[Dict] = None) -> Dict:
        try:
            url = f"{self.base_url}/{endpoint}"
            response = requests.get(url, headers=self.headers, params=params, timeout=30)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"CoinGecko API Error: {e}")
            return {"error": str(e)}

    def get_coin_price(self, coin_id: str, vs_currency: str = 'usd') -> Dict:
        '''Get current price of a coin'''
        params = {
            'ids': coin_id,
            'vs_currencies': vs_currency,
            'include_market_cap': 'true',
            'include_24hr_vol': 'true',
            'include_24hr_change': 'true'
        }
        return self._make_request('simple/price', params)

    def get_coin_market_data(self, coin_id: str) -> Dict:
        '''Get detailed market data for a coin'''
        return self._make_request(f'coins/{coin_id}', {
            'localization': 'false',
            'tickers': 'false',
            'community_data': 'false',
            'developer_data': 'false'
        })

    def get_btc_eth_data(self) -> Dict:
        '''Get Bitcoin and Ethereum market data'''
        params = {
            'ids': 'bitcoin,ethereum',
            'vs_currencies': 'usd',
            'include_market_cap': 'true',
            'include_24hr_vol': 'true',
            'include_24hr_change': 'true'
        }
        return self._make_request('simple/price', params)