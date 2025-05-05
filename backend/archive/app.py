import logging
import jwt
from functools import wraps
import sys
from flask import Flask, request,  jsonify
from flask_cors import CORS
import mysql.connector
from langchain.agents import create_sql_agent
from langchain.agents.agent_toolkits import SQLDatabaseToolkit
from langchain.sql_database import SQLDatabase
from langchain.llms.openai import OpenAI
from sqlalchemy import create_engine
import os
import settings
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

def generate_access_token(user_id):
    secret_key = 'your-secret-key'
    validity_period = timedelta(hours=24)
    expiry_time = datetime.utcnow() + validity_period
    payload = {
        'identity': user_id,
        'exp': expiry_time
    }
    access_token = jwt.encode(payload, secret_key, algorithm='HS256')
    return access_token

def jwt_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if auth_header:
            try:
                token = auth_header.split()[1]
                payload = jwt.decode(token, 'your-secret-key', algorithms=['HS256'])
                current_user_id = payload['identity']

                return fn(current_user_id, *args, **kwargs)
            except jwt.ExpiredSignatureError:
                return jsonify(message='Token has expired'), 401
            except jwt.InvalidTokenError:
                return jsonify(message='Invalid token'), 401
        else:
            return jsonify(message='Token is missing'), 401
    return wrapper

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

file_handler = logging.FileHandler('app.log')
file_handler.setLevel(logging.DEBUG)

console_handler = logging.StreamHandler()
console_handler.setLevel(logging.ERROR)

formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)
console_handler.setFormatter(formatter)

logger.addHandler(file_handler)
logger.addHandler(console_handler)


os.environ['OPENAI_API_KEY'] = settings.OPENAI_API_KEY
os.environ['OPENAI_ORGANIZATION'] = settings.OPENAI_ORGANIZATION



@app.route('/api/create_user', methods=['POST'])
def create_user():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            port="3306",
            user="root",
            password="admin",
            database="data_insights"
        )
    except mysql.connector.Error as error:
        logger.error('Error connecting to MySQL: {}'.format(error))
        return 'Error connecting to MySQL: {}'.format(error), 400

    name = request.form['name']
    email = request.form['email']
    password = request.form['password']
    mobile = request.form['mobile']

    if not name or not email or not password or not mobile:
        return 'Missing required fields', 400

    if len(password) < 6:
        return 'Password should be at least 6 characters long', 400

    if len(mobile) != 10 or not mobile.isdigit():
        return 'Mobile number should contain 10 digits', 400

    if '@' not in email:
        return 'Invalid email address', 400

    query = "SELECT * FROM users WHERE email = %s"
    values = (email,)

    try:
        cursor = conn.cursor()
        cursor.execute(query, values)
        existing_user = cursor.fetchone()
        if existing_user:
            return 'Email already registered', 400
    except mysql.connector.Error as error:
        logger.error('Error in retrieving from MySQL: {}'.format(error))
        return 'Error in retrieving from MySQL: {}'.format(error), 400

    try:
        cursor.execute("INSERT INTO users (name, email, password, mobile) VALUES (%s, %s, %s, %s)", (name, email, password, mobile,))
        conn.commit()
        user_id = cursor.lastrowid
        logger.info('User created. ID: {}'.format(user_id))
    except mysql.connector.Error as error:
        logger.error('Error storing credentials in MySQL: {}'.format(error))
        return 'Error storing credentials in MySQL: {}'.format(error), 400

    db_host= 'localhost'
    db_port = '3306'
    db_user = 'test'
    db_password = 'test'
    db_name = 'test'

    engine = create_engine("mysql+mysqlconnector://", creator=lambda: conn)
    db = SQLDatabase(engine)

    query = "INSERT INTO `databases` (user_id, host, port, username, password, database_name) VALUES (%s, %s, %s, %s, %s, %s)"
    values = (user_id, db_host, db_port, db_user, db_password, db_name)

    try:
        cursor = conn.cursor()
        cursor.execute(query, values)
        conn.commit()

        db_id = cursor.lastrowid
        logger.info('Database created. ID: {}'.format(db_id))
    except mysql.connector.Error as error:
        logger.error('Error storing credentials in MySQL: {}'.format(error))
        return 'Error storing credentials in MySQL: {}'.format(error), 400

    conn.close()
    return 'Registration successful'


@app.route('/api/login_user', methods=['POST'])
def login_user():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            port="3306",
            user="root",
            password="admin",
            database="data_insights"
        )
    except mysql.connector.Error as error:
        logger.error('Error connecting to MySQL: {}'.format(error))
        return jsonify(login_status='Error connecting to MySQL: {}'.format(error)), 400

    email = request.form['email']
    password = request.form['password']

    if not email or not password:
        return jsonify(login_status='Missing required fields'), 400

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM users WHERE email = %s', (email,))
        user = cursor.fetchone()
    except mysql.connector.Error as error:
        logger.error('Error retrieving credentials from MySQL: {}'.format(error))
        return jsonify(login_status='Error retrieving credentials from MySQL: {}'.format(error)), 400

    conn.close()

    if user and user['password'] == password:
        access_token = generate_access_token(user['id'])
        return jsonify(login_status='success', user_id=user['id'], access_token=access_token)
    else:
        logger.warning('Invalid email or password.')
        return jsonify(login_status='Invalid email or password'), 400

@app.route('/api/user_databases', methods=['GET'])
@jwt_required
def get_user_databases(current_user_id):
    user_id=current_user_id

    if user_id is None:
        return jsonify(message='Invalid or expired token'), 401

    try:
        conn = mysql.connector.connect(
            host="localhost",
            port="3306",
            user="root",
            password="admin",
            database="data_insights"
        )
    except mysql.connector.Error as error:
        logger.error('Error connecting to MySQL: {}'.format(error))
        return 'Error connecting to MySQL: {}'.format(error), 400

    query = "SELECT db_id, database_name FROM `databases` WHERE user_id = %s"
    values = (user_id,)

    try:
        cursor = conn.cursor()
        cursor.execute(query, values)
        results = cursor.fetchall()
        databases = [{"db_id": row[0], "database_name": row[1]} for row in results]
    except mysql.connector.Error as error:
        logger.error('Error retrieving databases from MySQL: {}'.format(error))
        return 'Error retrieving databases from MySQL: {}'.format(error), 400

    conn.close()

    return jsonify({"databases":databases})


@app.route('/api/databases', methods=['POST'])
@jwt_required
def create_database(current_user_id):
    try:
        conn = mysql.connector.connect(
            host="localhost",
            port="3306",
            user="root",
            password="admin",
            database="data_insights"
        )
    except mysql.connector.Error as error:
        logger.error('Error connecting to MySQL: {}'.format(error))
        return 'Error connecting to MySQL: {}'.format(error), 400
    user_id = current_user_id
    db_host = request.form['host']
    db_port = request.form['port']
    db_user = request.form['user']
    db_password = request.form['password']
    db_name = request.form['database']

    try:
        conn1 = mysql.connector.connect(
            host=db_host,
            port=db_port,
            user=db_user,
            password=db_password,
            database=db_name
        )
    except mysql.connector.Error as error:
        logger.error('Error connecting to MySQL: {}'.format(error))
        return 'Wrong database details: {}'.format(error), 400

    engine = create_engine("mysql+mysqlconnector://", creator=lambda: conn)
    db = SQLDatabase(engine)

    query = "INSERT INTO `databases` (user_id, host, port, username, password, database_name) VALUES (%s, %s, %s, %s, %s, %s)"
    values = (user_id, db_host, db_port, db_user, db_password, db_name)

    try:
        cursor = conn.cursor()
        cursor.execute(query, values)
        conn.commit()

        db_id = cursor.lastrowid
        logger.info('Database created. ID: {}'.format(db_id))
    except mysql.connector.Error as error:
        logger.error('Error storing credentials in MySQL: {}'.format(error))
        return 'Error storing credentials in MySQL: {}'.format(error), 400

    conn.close()
    return str(db_id)

@app.route('/api/databases/<db_id>', methods=['GET'])
@jwt_required
def get_database_tables(current_user_id, db_id):
    try:
        conn = mysql.connector.connect(
            host="localhost",
            port="3306",
            user="root",
            password="admin",
            database="data_insights"
        )
    except mysql.connector.Error as error:
        logger.error('Error connecting to MySQL: {}'.format(error))
        return 'Error connecting to MySQL: {}'.format(error), 400

    query = "SELECT db_id FROM `databases` WHERE user_id = %s"
    values = (current_user_id,)

    try:
        cursor = conn.cursor()
        cursor.execute(query, values)
        results = cursor.fetchall()
        database_ids = [row[0] for row in results]
    except mysql.connector.Error as error:
        logger.error('Error retrieving databases from MySQL: {}'.format(error))
        return 'Error retrieving databases from MySQL: {}'.format(error), 400

    database_ids = [str(id) for id in database_ids]
    if db_id not in database_ids:
        logger.error('Invalid access')
        return 'Invalid access', 400

    query = "SELECT host, port, username, password, database_name FROM `databases` WHERE db_id = %s"
    values = (db_id,)

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(query, values)
        row = cursor.fetchone()
    except mysql.connector.Error as error:
        logger.error('Error retrieving database credentials from MySQL: {}'.format(error))
        return 'Error retrieving database credentials from MySQL: {}'.format(error), 400

    if row is None:
        logger.warning('Database credentials not found.')
        return 'Database credentials not found.', 400

    conn.close()

    try:
        conn1 = mysql.connector.connect(
            host=row['host'],
            port=row['port'],
            user=row['username'],
            password=row['password'],
            database=row['database_name']
        )
    except mysql.connector.Error as error:
        logger.error('Error connecting to MySQL: {}'.format(error))
        return 'Error connecting to MySQL: {}'.format(error), 400

    query = "SHOW TABLES "

    try:
        cursor = conn1.cursor()
        cursor.execute(query)
        tables = [row[0] for row in cursor.fetchall()]
    except mysql.connector.Error as error:
        logger.error('Error retrieving tables from MySQL: {}'.format(error))
        return 'Error retrieving tables from MySQL: {}'.format(error), 400

    conn1.close()

    return jsonify(tables=tables)

@app.route('/api/query_texts/<db_id>', methods=['GET'])
@jwt_required
def get_query_texts(current_user_id, db_id):
    try:
        conn = mysql.connector.connect(
            host="localhost",
            port="3306",
            user="root",
            password="admin",
            database="data_insights"
        )
    except mysql.connector.Error as error:
        logger.error('Error connecting to MySQL: {}'.format(error))
        return 'Error connecting to MySQL: {}'.format(error), 400

    query = "SELECT db_id FROM `databases` WHERE user_id = %s"
    values = (current_user_id,)

    try:
        cursor = conn.cursor()
        cursor.execute(query, values)
        results = cursor.fetchall()
        database_ids = [row[0] for row in results]
    except mysql.connector.Error as error:
        logger.error('Error retrieving databases from MySQL: {}'.format(error))
        return 'Error retrieving databases from MySQL: {}'.format(error), 400

    database_ids = [str(id) for id in database_ids]
    if db_id not in database_ids:
        logger.error('Invalid access')
        return 'Invalid access', 400

    query = "SELECT query_text FROM `query` WHERE user_id = %s AND db_id = %s"
    values = (current_user_id, db_id)

    try:
        cursor = conn.cursor()
        cursor.execute(query, values)
        results = cursor.fetchall()
        query_texts = [row[0] for row in results]
    except mysql.connector.Error as error:
        logger.error('Error retrieving query texts from MySQL: {}'.format(error))
        return 'Error retrieving query texts from MySQL: {}'.format(error), 400

    conn.close()
    return jsonify({"query_texts": query_texts})

@app.route('/api/execute', methods=['POST'])
@jwt_required
def execute_query(current_user_id):
    db_id = request.form['db_id']

    try:
        conn = mysql.connector.connect(
            host="localhost",
            port="3306",
            user="root",
            password="admin",
            database="data_insights"
        )
    except mysql.connector.Error as error:
        logger.error('Error connecting to MySQL: {}'.format(error))
        return 'Error connecting to MySQL: {}'.format(error), 400

    query = "SELECT db_id FROM `databases` WHERE user_id = %s"
    values = (current_user_id,)

    try:
        cursor = conn.cursor()
        cursor.execute(query, values)
        results = cursor.fetchall()
        database_ids = [row[0] for row in results]
    except mysql.connector.Error as error:
        logger.error('Error retrieving databases from MySQL: {}'.format(error))
        return 'Error retrieving databases from MySQL: {}'.format(error), 400

    database_ids = [str(id) for id in database_ids]
    if db_id not in database_ids:
        logger.error('Invalid access')
        return 'Invalid access', 400

    query = "SELECT * FROM `databases` WHERE db_id = %s"
    values = (db_id,)

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(query, values)
        row = cursor.fetchone()
    except mysql.connector.Error as error:
        logger.error('Error retrieving credentials from MySQL: {}'.format(error))
        return 'Error retrieving credentials from MySQL: {}'.format(error), 400


    if row is None:
        logger.warning('Database credentials not found.')
        return 'Database credentials not found.'

    try:
        conn1 = mysql.connector.connect(
            host=row['host'],
            port=row['port'],
            user=row['username'],
            password=row['password'],
            database=row['database_name']
        )
    except mysql.connector.Error as error:
        logger.error('Error connecting to MySQL: {}'.format(error))
        return 'Error connecting to MySQL: {}'.format(error), 400

    table = request.form['table']
    prompt = request.form['prompt']

    adjusted_prompt = f'use "{table}" tables to find {prompt}. Reframe this statement so that gpt can answer it easily.'

    engine = create_engine("mysql+mysqlconnector://", creator=lambda: conn1)
    db = SQLDatabase(engine)
    llm = OpenAI(temperature=0)
    toolkit = SQLDatabaseToolkit(db=db, llm=llm)
    agent_executor = create_sql_agent(llm=llm, toolkit=toolkit, verbose=True, return_intermediate_steps=True)

    response = llm(adjusted_prompt, max_tokens=150)
    adjusted_prompt = response

    with open('terminal_output.txt', 'w') as f:
        sys.stdout = f
        response = agent_executor.run(adjusted_prompt)

    sys.stdout = sys.__stdout__

    with open('terminal_output.txt', 'r') as f:
        intermediate_steps = f.read()

    query_insert = "INSERT INTO query (user_id, db_id, query_text, response, intermediate_steps) VALUES (%s, %s, %s, %s, %s)"
    query_values = (current_user_id, db_id, prompt, response, intermediate_steps)

    try:
        cursor = conn.cursor()
        cursor.execute(query_insert, query_values)
        conn.commit()
        query_id = cursor.lastrowid

    except mysql.connector.Error as error:
        logger.error('Error storing query and response in MySQL: {}'.format(error))
        return 'Error storing query and response in MySQL: {}'.format(error), 400

    conn1.close()
    conn.close()

    return jsonify(response=response, query_id=query_id, intermediate_steps=intermediate_steps)

@app.route('/api/feedback', methods=['POST'])
@jwt_required
def submit_feedback(current_user_id):
    try:
        conn = mysql.connector.connect(
            host="localhost",
            port="3306",
            user="root",
            password="admin",
            database="data_insights"
        )
        cursor = conn.cursor()

        db_id = request.form["db_id"]
        query_id = request.form["query_id"]
        response = request.form["response"]

        query = "SELECT db_id FROM `databases` WHERE user_id = %s"
        values = (current_user_id,)

        try:
            cursor = conn.cursor()
            cursor.execute(query, values)
            results = cursor.fetchall()
            database_ids = [row[0] for row in results]
        except mysql.connector.Error as error:
            logger.error('Error retrieving databases from MySQL: {}'.format(error))
            return 'Error retrieving databases from MySQL: {}'.format(error), 400

        database_ids = [str(id) for id in database_ids]
        if db_id not in database_ids:
            logger.error('Invalid access')
            return 'Invalid access', 400

        query = "INSERT INTO feedback (db_id, query_id, feedback) VALUES (%s, %s, %s)"
        values = (db_id, query_id, response)
        cursor.execute(query, values)
        conn.commit()

        cursor.close()
        conn.close()

        return 'Feedback submitted successfully!'

    except Exception as e:
        logger.error('Error storing query and response in MySQL: {}'.format(e))
        return 'Error storing query and response in MySQL: {}'.format(e), 400

@app.route('/api/descriptive_feedback', methods=['POST'])
@jwt_required
def submit_descriptive_feedback(current_user_id):
    try:
        conn = mysql.connector.connect(
            host="localhost",
            port="3306",
            user="root",
            password="admin",
            database="data_insights"
        )
        cursor = conn.cursor()

        query_id = request.form["query_id"]
        prompt = request.form["prompt"]

        query = "UPDATE feedback SET feedback_prompt = %s WHERE query_id = %s"
        values = (prompt, query_id)
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()

        return 'Feedback desciption submitted successfully!'

    except Exception as e:
        logger.error('Error storing query and response in MySQL: {}'.format(e))
        return 'Error storing query and response in MySQL: {}'.format(e), 400


if __name__ == '__main__':
    app.run(debug=True,port='8000')
