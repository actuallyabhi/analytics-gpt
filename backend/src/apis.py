from flask import Blueprint, request
from src.models import User, Database_type, Database_credentials
from src.schemas import RegisterRequestSchema, LoginRequestSchema, AddDatabaseRequestSchema
from src.helpers import generate_access_token, construct_response, log
from src.decorators import validate_marshmallow_schema, jwt_required

## Blueprints ##
root_blueprint = Blueprint('root', __name__)
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

#### Database APIs ####
@root_blueprint.route('/databases', methods=['POST'])
@jwt_required
@validate_marshmallow_schema(AddDatabaseRequestSchema())
def add_database(user_id):
    try:
        data = request.get_json()
        type_id, host, port, username, password, database_name = data['type'], data['host'], data['port'], data['username'], data['password'], data['database_name']
        database_type = Database_type.query.get(type_id)
        if database_type is None:
            return construct_response(f"Database type with id {type_id} is invalid", 400)
        # TODO: validate the database connection
        database = Database_credentials(database_type=type_id, host=host, port=port, username=username, password=password, database_name=database_name, created_by=user_id)
        database.save()
        return construct_response('Database added successfully', 201, database.serialize())
    except Exception as e:
        log(e)
        return construct_response("Database addition failed", 500, e)

@root_blueprint.route('/databases', methods=['GET'])
@jwt_required
def get_databases(user_id):
    try:
        databases = Database_credentials.query.filter_by(created_by=user_id).all()
        return construct_response('Databases fetched successfully', 200, [database.serialize() for database in databases])
    except Exception as e:
        log(e)
        return construct_response("Database fetch failed", 500, e)