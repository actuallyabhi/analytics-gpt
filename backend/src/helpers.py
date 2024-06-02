import jwt, traceback
from flask import jsonify
from datetime import datetime, timedelta
from settings import SECRET_KEY, DEBUG, OPENAI_API_KEY
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
from langchain_community.agent_toolkits.sql.base import create_sql_agent
from langchain_community.agent_toolkits import SQLDatabaseToolkit
from langchain_community.utilities import SQLDatabase
from langchain_community.llms import OpenAI


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
    

# Function to execute a the LLM+Database query
def execute_llm_sql_agent_query(current_database, user_prompt: str, tables: str):
    try:

        adjusted_prompt = f'use "{tables}" tables to find {user_prompt}. Reframe this statement so that gpt can answer it easily.'
        # create the database engine
        engine = create_db_engine(current_database)
        db = SQLDatabase(engine)

        # create the LLM and the toolkit
        llm = OpenAI(temperature=0, openai_api_key = OPENAI_API_KEY)
        toolkit = SQLDatabaseToolkit(db=db, llm=llm)
        # TODO: Save the intermediate steps to the database
        agent_executor = create_sql_agent(llm=llm, toolkit=toolkit, verbose=True, return_intermediate_steps=True)
        
        response = llm(adjusted_prompt, max_tokens=150)
        adjusted_prompt = response
        response = agent_executor.run(adjusted_prompt)
        return response
    except Exception as e:
        traceback.print_exc()
        return str(e)