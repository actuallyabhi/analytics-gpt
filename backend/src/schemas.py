from marshmallow import Schema, fields, validate

class RegisterRequestSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=3))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))

class LoginRequestSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))

class AddDatabaseRequestSchema(Schema):
    type = fields.Int(required=True, validate=validate.OneOf([1, 2]))
    host = fields.Str(required=True)
    port = fields.Int(required=True)
    username = fields.Str(required=True)
    password = fields.Str(required=True)
    database_name = fields.Str(required=True)
