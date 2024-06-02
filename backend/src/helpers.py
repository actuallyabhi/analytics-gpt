import jwt, traceback
from flask import jsonify
from datetime import datetime, timedelta
from settings import SECRET_KEY, DEBUG
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError

## Constants
MYSQL_TYPE_ID = 1
POSTGRES_TYPE_ID = 2


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

# Function to get the initial connection string based on the database type
def get_intial_connection_str(database_type_id):
    return "postgresql+psycopg2://" if  int(database_type_id) == POSTGRES_TYPE_ID else "mysql+mysqlconnector://"

# Function to validate the database connection
def validate_database_connection(database_type, host, port, username, password, database_name):
    try:
     
        try:
            connection_uri = f'{get_intial_connection_str(database_type)}{username}:{password}@{host}:{port}/{database_name}'
            # set timeout to 5 seconds
            engine = create_engine(connection_uri, connect_args={'connect_timeout': 5})
            connection = engine.connect()
            connection.close()
            return True, f"{database_type.capitalize()} connection successful"
        except OperationalError as e:
            return False, str(e)
    except Exception as e:
        traceback.print_exc()
        return False, str(e)

# Function to execute a query
def create_db_engine(database):
    try:
        database_type, host, port, username, password, database_name = database["type"], database['host'], database['port'], database['username'], database['password'], database['database_name']
        # construct the connection uri
        connection_uri = f'{get_intial_connection_str(database_type["id"])}{username}:{password}@{host}:{port}/{database_name}'

        # create the engine and connect to the database
        engine = create_engine(connection_uri, connect_args={'connect_timeout': 5})
        return engine
    except Exception as e:
        traceback.print_exc()
        return str(e)