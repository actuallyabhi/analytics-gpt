from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return '<User %r>' % self.name
    
    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def exists(self):
        return User.query.filter_by(email=self.email).first() is not None
    
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email
        }
class Database_type(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    description = db.Column(db.String(120), nullable=False)
class Database_credentials(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    database_type = db.Column(db.Integer, db.ForeignKey('database_type.id'), nullable=False)
    host = db.Column(db.String(80), nullable=False)
    port = db.Column(db.Integer, nullable=False)
    username = db.Column(db.String(80), nullable=False)
    password = db.Column(db.String(80), nullable=False)
    database_name = db.Column(db.String(80), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return '<Database_credentials %r>' % self.name
    
    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def exists(self):
        return Database_credentials.query.filter_by(id=self.id).first() is not None
    
    def serialize(self):
        return {
            'id': self.id,
            'created_by': self.created_by,
            'type': {
                'id': self.database_type,
                'name': Database_type.query.filter_by(id=self.database_type).first().name    
            },
            'host': self.host,
            'port': self.port,
            'username': self.username,
            'password': self.password,
            'database_name': self.database_name
        }
    
