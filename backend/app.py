from flask import Flask, Blueprint
from flask_migrate import Migrate
from flask_cors import CORS
from src.models import db
from settings import DEBUG, DB_CONFIG
from src.apis import users_blueprint

## App Config ##
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{DB_CONFIG['user']}:{DB_CONFIG['password']}@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}"

CORS(app) # Enable CORS
db.init_app(app) # Initialize db
migrate = Migrate(app, db) # Perform migrations

## Blueprints ##
api_v1 = Blueprint('api', __name__, url_prefix='/api/v1')
api_v1.register_blueprint(users_blueprint)
app.register_blueprint(api_v1)


if __name__ == '__main__':
    app.run(debug=DEBUG)