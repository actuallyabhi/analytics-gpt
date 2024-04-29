import jwt
from flask import jsonify
from datetime import datetime, timedelta
from settings import SECRET_KEY, DEBUG

def log (message):
    if DEBUG:
        print(message)
    

def generate_access_token(user_id):
    validity_period = timedelta(hours=24)
    expiry_time = datetime.utcnow() + validity_period
    payload = {
        'identity': user_id,
        'exp': expiry_time
    }
    access_token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return access_token

def construct_response(message, status_code, data=[]):
    try:
        response = {
            'message': message,
            'data': data 
        }
        return jsonify(response), status_code
    except Exception as e:
        return jsonify({'message': str(e)}), 500