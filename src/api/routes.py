"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Task
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

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

#####################################################

@api.route('/auth/signup', methods=['POST'])
def handle_signup():
    signup_data = request.json

    user = User(
        name=signup_data["name"], 
        email=signup_data["email"], 
        password=signup_data["password"])
    
    db.session.add(user)
    db.session.commit()

    return jsonify(success=True)


@api.route('/auth/login', methods=['POST'])
def handle_login():
    try:
        user_data = request.json
        
        # Verificar que los campos necesarios estén presentes
        if not user_data or 'email' not in user_data or 'password' not in user_data:
            return jsonify(error="Datos incompletos"), 400
            
        email = user_data['email']
        password = user_data['password']
        
        # Buscar usuario en la base de datos  por el email
        user = User.query.filter_by(email=email).first()
        
        # Verificar si el usuario existe y la contraseña es correcta
        if user and user.check_password(password):
            # Generar token y devolver datos del usuario
            token = create_access_token(identity=email)
            return jsonify(token=token, user=user.serialize()), 200
        else:
            # Mensaje genérico para no revelar si el email existe o no
            return jsonify(error="Email o contraseña incorrectos"), 401
            
    except Exception as e:
        # Manejo de errores inesperados
        return jsonify(error="Error en el servidor"), 500
    
    
#Esta ruta esta modo lectura, no esta implementada
#Taks esta funcionando solo localmente
@api.route('/tasks', methods=['GET']) 
@jwt_required()  # Este decorador verifica que el token sea válido
def get_tasks():
    # Obtiene el ID del usuario desde el token
    current_user_id = get_jwt_identity()
    
    # Busca el usuario en la base de datos
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404
    
    # Obtiene las tareas del usuario
    tasks = Task.query.filter_by(user_id=current_user_id).all()
    
    # Serializa las tareas para enviarlas como JSON
    tasks_data = [task.serialize() for task in tasks]
    
    return jsonify({"tasks": tasks_data}), 200
    

   
