from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from api.coinglass_client import CoinGlassClient
from api.data_processor import DataProcessor
import traceback

app = Flask(__name__, static_folder='../frontend', static_url_path='')
CORS(app)

coinglass = CoinGlassClient()

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/bitcoin-etf')
def bitcoin_etf():
    return send_from_directory(app.static_folder, 'bitcoin-etf.html')

@app.route('/ethereum-etf')
def ethereum_etf():
    return send_from_directory(app.static_folder, 'ethereum-etf.html')

@app.route('/api/etf/combined')
def get_combined_flows():
    try:
        days = request.args.get('days', 7, type=int)
        print(f"[DEBUG] Fetching combined data for {days} days...")
        
        btc_raw = coinglass.get_bitcoin_etf_flows()
        eth_raw = coinglass.get_ethereum_etf_flows()
        
        print(f"[DEBUG] BTC data success: {btc_raw.get('success', False)}")
        print(f"[DEBUG] ETH data success: {eth_raw.get('success', False)}")
        
        if not btc_raw.get('data') or not eth_raw.get('data'):
            error_msg = f"BTC data: {len(btc_raw.get('data', []))} records, ETH data: {len(eth_raw.get('data', []))} records"
            print(f"[ERROR] {error_msg}")
            return jsonify({'error': 'No data available', 'details': error_msg}), 500
        
        combined_data = DataProcessor.process_combined_flows(btc_raw, eth_raw, days)
        
        if not combined_data.get('success'):
            print(f"[ERROR] Processing failed: {combined_data.get('error')}")
            return jsonify(combined_data), 500
        
        print(f"[SUCCESS] Combined data: {combined_data.get('data_points')} points")
        return jsonify(combined_data)
        
    except Exception as e:
        print(f"[EXCEPTION] {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/api/etf/bitcoin/flows')
def get_bitcoin_flows():
    try:
        days = request.args.get('days', 30, type=int)
        print(f"[DEBUG] Fetching Bitcoin data for {days} days...")
        
        btc_raw = coinglass.get_bitcoin_etf_flows()
        
        print(f"[DEBUG] BTC API Response - Success: {btc_raw.get('success')}")
        print(f"[DEBUG] BTC API Response - Data records: {len(btc_raw.get('data', []))}")
        
        if 'error' in btc_raw:
            print(f"[ERROR] API Error: {btc_raw.get('error')}")
            return jsonify({'error': btc_raw.get('error'), 'success': False}), 500
        
        if not btc_raw.get('data'):
            print(f"[ERROR] No Bitcoin data returned from API")
            return jsonify({'error': 'No Bitcoin data', 'success': False}), 500
        
        btc_processed = DataProcessor.process_etf_flows(btc_raw, 'Bitcoin', days)
        
        if not btc_processed.get('success'):
            print(f"[ERROR] Processing failed: {btc_processed.get('error')}")
            return jsonify(btc_processed), 500
        
        print(f"[SUCCESS] Bitcoin data: {btc_processed.get('data_points')} points")
        return jsonify(btc_processed)
        
    except Exception as e:
        print(f"[EXCEPTION] {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e), 'success': False}), 500

@app.route('/api/etf/ethereum/flows')
def get_ethereum_flows():
    try:
        days = request.args.get('days', 30, type=int)
        print(f"[DEBUG] Fetching Ethereum data for {days} days...")
        
        eth_raw = coinglass.get_ethereum_etf_flows()
        
        print(f"[DEBUG] ETH API Response - Success: {eth_raw.get('success')}")
        print(f"[DEBUG] ETH API Response - Data records: {len(eth_raw.get('data', []))}")
        
        if 'error' in eth_raw:
            print(f"[ERROR] API Error: {eth_raw.get('error')}")
            return jsonify({'error': eth_raw.get('error'), 'success': False}), 500
        
        if not eth_raw.get('data'):
            print(f"[ERROR] No Ethereum data returned from API")
            return jsonify({'error': 'No Ethereum data', 'success': False}), 500
        
        eth_processed = DataProcessor.process_etf_flows(eth_raw, 'Ethereum', days)
        
        if not eth_processed.get('success'):
            print(f"[ERROR] Processing failed: {eth_processed.get('error')}")
            return jsonify(eth_processed), 500
        
        print(f"[SUCCESS] Ethereum data: {eth_processed.get('data_points')} points")
        return jsonify(eth_processed)
        
    except Exception as e:
        print(f"[EXCEPTION] {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e), 'success': False}), 500

@app.route('/api/etf/bitcoin/list')
def get_bitcoin_etf_list():
    try:
        print("[DEBUG] Fetching Bitcoin ETF list...")
        raw_data = coinglass.get_bitcoin_etf_list()
        etf_list = DataProcessor.process_etf_list(raw_data)
        print(f"[SUCCESS] Bitcoin ETF list: {len(etf_list)} ETFs")
        return jsonify({'success': True, 'data': etf_list, 'count': len(etf_list)})
    except Exception as e:
        print(f"[EXCEPTION] {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e), 'success': False}), 500

@app.route('/api/etf/ethereum/list')
def get_ethereum_etf_list():
    try:
        print("[DEBUG] Fetching Ethereum ETF list...")
        raw_data = coinglass.get_ethereum_etf_list()
        etf_list = DataProcessor.process_etf_list(raw_data)
        print(f"[SUCCESS] Ethereum ETF list: {len(etf_list)} ETFs")
        return jsonify({'success': True, 'data': etf_list, 'count': len(etf_list)})
    except Exception as e:
        print(f"[EXCEPTION] {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e), 'success': False}), 500

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 Crypto ETF Tracker API Server")
    print("="*60)
    print("Dashboard: http://localhost:5000")
    print("Bitcoin ETF: http://localhost:5000/bitcoin-etf")
    print("Ethereum ETF: http://localhost:5000/ethereum-etf")
    print("="*60 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
