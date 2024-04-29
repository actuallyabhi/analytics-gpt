from flask import Blueprint, request
from src.models import User 
from src.schemas import RegisterRequestSchema, LoginRequestSchema
from src.helpers import generate_access_token, construct_response, log
from src.decorators import validate_marshmallow_schema

## Blueprints ##
users_blueprint = Blueprint('users', __name__, url_prefix='/users')

## Routes ##
@users_blueprint.route('/register', methods=['POST'])
@validate_marshmallow_schema(RegisterRequestSchema())
def register_user():
    try:
        data = request.get_json()
        name, email, password = data['name'], data['email'], data['password']

        # Check if user already exists
        user = User(name=name, email=email, password=password)
        if user.exists():
            return construct_response('User already exists', 400)
        user.save()
        return construct_response('User registered successfully', 201, user.serialize())
    except Exception as e:
        log(e)
        return construct_response("User registration failed", 500, e)

@users_blueprint.route('/login', methods=['POST'])
@validate_marshmallow_schema(LoginRequestSchema())
def login_user():
    try:
        data = request.get_json()
        email, password = data['email'], data['password']
        user = User.query.filter_by(email=email, password=password).first()
        if user is None:
            return construct_response('Invalid email or password', 400)
        return construct_response('Login successful', 200, {
            'access_token': generate_access_token(user.id),
            'user': user.serialize()
        })
    except Exception as e:
        log(e)
        return construct_response("Login failed", 500, e)
