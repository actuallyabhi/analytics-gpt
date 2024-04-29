import jwt
from functools import wraps
from flask import request, jsonify
from settings import SECRET_KEY

def jwt_required(fn):
    """
    Decorator to check if a valid JWT token is present in the Authorization header
    """
    try:
        @wraps(fn)
        def wrapper(*args, **kwargs):
            auth_header = request.headers.get('Authorization')
            if auth_header:
                try:
                    token = auth_header.split()[1]
                    payload = jwt.decode(token, SECRET_KEY , algorithms=['HS256'])
                    current_user_id = payload['identity']

                    return fn(current_user_id, *args, **kwargs)
                except jwt.ExpiredSignatureError:
                    return jsonify(message='Token has expired'), 401
                except jwt.InvalidTokenError:
                    return jsonify(message='Invalid token'), 401
            else:
                return jsonify(message='Token is missing'), 401
        return wrapper
    except Exception as e:
        return jsonify({'message': str(e)}), 500

def validate_marshmallow_schema(schema):
    """
    Decorator to validate incoming JSON data against a Marshmallow schema
    """
    try:
        def decorator(fn):
            @wraps(fn)
            def wrapper(*args, **kwargs):
                data = request.get_json()
                errors = schema.validate(data)
                if errors:
                    return jsonify(errors), 400
                return fn(*args, **kwargs)
            return wrapper
        return decorator
    except Exception as e:
        return jsonify({'message': str(e)}), 500