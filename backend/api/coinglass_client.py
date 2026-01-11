import requests
from typing import Dict, Optional
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import Config

class CoinGlassClient:
    """CoinGlass API Client"""
    
    def __init__(self):
        self.base_url = 'https://open-api-v4.coinglass.com/api'
        self.api_key = Config.COINGLASS_API_KEY
        self.headers = {
            'CG-API-KEY': self.api_key,
            'accept': 'application/json'
        }
        self.max_records = 1000
        print(f"[DEBUG] CoinGlass Client initialized with API key: {self.api_key[:10]}...")
    
    def _make_request(self, endpoint: str, params: Optional[Dict] = None) -> Dict:
        """Make API request"""
        try:
            url = f"{self.base_url}/{endpoint}"
            print(f"[DEBUG] API Request URL: {url}")
            print(f"[DEBUG] API Request Params: {params}")
            print(f"[DEBUG] API Request Headers: {self.headers}")
            
            response = requests.get(url, headers=self.headers, params=params, timeout=30)
            
            print(f"[DEBUG] API Response Status: {response.status_code}")
            print(f"[DEBUG] API Response Text: {response.text[:500]}")
            
            response.raise_for_status()
            
            json_response = response.json()
            print(f"[DEBUG] API JSON Keys: {json_response.keys()}")
            
            return json_response
            
        except requests.exceptions.RequestException as e:
            print(f"[ERROR] API Request Failed: {e}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"[ERROR] Response Status: {e.response.status_code}")
                print(f"[ERROR] Response Body: {e.response.text}")
            return {"error": str(e), "data": [], "success": False}
    
    def get_bitcoin_etf_flows(self) -> Dict:
        """Get ALL Bitcoin ETF flow history"""
        print("[DEBUG] Calling get_bitcoin_etf_flows...")
        return self._make_request('etf/bitcoin/flow-history', {'limit': self.max_records})
    
    def get_ethereum_etf_flows(self) -> Dict:
        """Get ALL Ethereum ETF flow history"""
        print("[DEBUG] Calling get_ethereum_etf_flows...")
        return self._make_request('etf/ethereum/flow-history', {'limit': self.max_records})
    
    def get_bitcoin_etf_list(self) -> Dict:
        """Get list of all Bitcoin ETFs"""
        print("[DEBUG] Calling get_bitcoin_etf_list...")
        return self._make_request('etf/bitcoin/list')
    
    def get_ethereum_etf_list(self) -> Dict:
        """Get list of all Ethereum ETFs"""
        print("[DEBUG] Calling get_ethereum_etf_list...")
        return self._make_request('etf/ethereum/list')
