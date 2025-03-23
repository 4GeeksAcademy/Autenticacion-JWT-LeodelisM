"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

from flask_jwt_extended import create_access_token

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# 🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴
# TODOS LOS ENDPOINTS QUE ESTÁN AQUÍ VAN PRECEDIDOS POR /api
# 🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/auth/signup', methods=['POST'])
def handle_signup():
    signup_data = request.json

    user = User(
        name=signup_data["name"], email=signup_data["email"], password=signup_data["password"])
    db.session.add(user)
    db.session.commit()

    return jsonify(success=True)


@api.route('/auth/login', methods=['POST'])
def handle_login():
    user_data = request.json
    email = user_data['email']
    user = User.get_or_404(email=email)

    if user.check_password(user_data["password"]):
        return jsonify(token=create_access_token(identity=user.id), user=user.serialize()), 201

    return jsonify(error="login failed"), 403
