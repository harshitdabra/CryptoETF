import os
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))
sys.path.insert(0, str(ROOT_DIR / 'backend'))

from backend.app import app

# Vercel Python serverless entrypoint
# The Flask app is exported as `app`.
