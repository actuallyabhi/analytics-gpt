from src.models import db, Database_type

def seed_data():
    # Create instances of your models
    mysql = Database_type(name='MySQL', description='MySQL is an open-source relational database management system.')
    postgres = Database_type(name='PostgreSQL', description='PostgreSQL is a powerful, open-source object-relational database system.')

    # Add them to the session
    db.session.add(mysql)
    db.session.add(postgres)

    # Commit the session
    db.session.commit()
