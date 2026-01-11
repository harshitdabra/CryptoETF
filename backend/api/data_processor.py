from datetime import datetime, timedelta
from typing import Dict, List

class DataProcessor:
    """Process and filter ETF data"""
    
    @staticmethod
    def process_etf_flows(raw_data: Dict, coin_type: str, days: int) -> Dict:
        """Process ETF flow data and filter by days"""
        try:
            if not raw_data or 'data' not in raw_data:
                return {'error': 'Invalid data', 'success': False}
            
            data_list = raw_data['data']
            if not data_list:
                return {'error': 'No data available', 'success': False}
            
            cutoff_date = datetime.now() - timedelta(days=days)
            cutoff_timestamp = int(cutoff_date.timestamp() * 1000)
            
            filtered_data = [
                item for item in data_list 
                if item.get('timestamp', 0) >= cutoff_timestamp
            ]
            
            if not filtered_data:
                return {'error': f'No data for last {days} days', 'success': False}
            
            total_flow = sum(item.get('flow_usd', 0) for item in filtered_data)
            
            now = datetime.now()
            last_week = sum(
                item.get('flow_usd', 0) 
                for item in data_list 
                if datetime.fromtimestamp(item.get('timestamp', 0) / 1000) >= now - timedelta(days=7)
            )
            
            last_month = sum(
                item.get('flow_usd', 0) 
                for item in data_list 
                if datetime.fromtimestamp(item.get('timestamp', 0) / 1000) >= now - timedelta(days=30)
            )
            
            last_3_months = sum(
                item.get('flow_usd', 0) 
                for item in data_list 
                if datetime.fromtimestamp(item.get('timestamp', 0) / 1000) >= now - timedelta(days=90)
            )
            
            chart_data = [
                {
                    'date': datetime.fromtimestamp(item.get('timestamp', 0) / 1000).strftime('%Y-%m-%d'),
                    'flow': item.get('flow_usd', 0)
                }
                for item in sorted(filtered_data, key=lambda x: x.get('timestamp', 0))
            ]
            
            return {
                'success': True,
                'coin': coin_type,
                'total_flow': total_flow,
                'last_week': last_week,
                'last_month': last_month,
                'last_3_months': last_3_months,
                'chart_data': chart_data,
                'data_points': len(chart_data),
                'date_range': f"{chart_data[0]['date']} to {chart_data[-1]['date']}" if chart_data else ''
            }
            
        except Exception as e:
            return {'error': str(e), 'success': False}
    
    @staticmethod
    def process_combined_flows(btc_data: Dict, eth_data: Dict, days: int) -> Dict:
        """Combine BTC and ETH flow data"""
        try:
            if 'data' not in btc_data or 'data' not in eth_data:
                return {'error': 'Invalid data', 'success': False}
            
            btc_list = btc_data['data']
            eth_list = eth_data['data']
            
            cutoff_date = datetime.now() - timedelta(days=days)
            cutoff_timestamp = int(cutoff_date.timestamp() * 1000)
            
            btc_filtered = [item for item in btc_list if item.get('timestamp', 0) >= cutoff_timestamp]
            eth_filtered = [item for item in eth_list if item.get('timestamp', 0) >= cutoff_timestamp]
            
            if not btc_filtered or not eth_filtered:
                return {'error': f'Insufficient data for {days} days', 'success': False}
            
            total_btc_flow = sum(item.get('flow_usd', 0) for item in btc_filtered)
            total_eth_flow = sum(item.get('flow_usd', 0) for item in eth_filtered)
            total_combined_flow = total_btc_flow + total_eth_flow
            
            btc_dict = {
                datetime.fromtimestamp(item.get('timestamp', 0) / 1000).strftime('%Y-%m-%d'): item.get('flow_usd', 0)
                for item in btc_filtered
            }
            
            eth_dict = {
                datetime.fromtimestamp(item.get('timestamp', 0) / 1000).strftime('%Y-%m-%d'): item.get('flow_usd', 0)
                for item in eth_filtered
            }
            
            all_dates = sorted(set(list(btc_dict.keys()) + list(eth_dict.keys())))
            
            chart_data = [
                {
                    'date': date,
                    'btc_flow': btc_dict.get(date, 0),
                    'eth_flow': eth_dict.get(date, 0)
                }
                for date in all_dates
            ]
            
            return {
                'success': True,
                'total_btc_flow': total_btc_flow,
                'total_eth_flow': total_eth_flow,
                'total_combined_flow': total_combined_flow,
                'chart_data': chart_data,
                'data_points': len(chart_data),
                'date_range': f"{chart_data[0]['date']} to {chart_data[-1]['date']}" if chart_data else ''
            }
            
        except Exception as e:
            return {'error': str(e), 'success': False}
    
    @staticmethod
    def process_etf_list(raw_data: Dict) -> List[Dict]:
        """Process ETF list data"""
        if 'data' not in raw_data:
            return []
        
        return [
            {
                'ticker': item.get('etfTicker', ''),
                'name': item.get('etfName', ''),
                'issuer': item.get('etfIssuer', ''),
                'holdings': item.get('etfHoldings', 0),
                'aum': item.get('etfAUM', 0)
            }
            for item in raw_data['data']
        ]
