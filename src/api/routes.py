"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Task
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime

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

    if not signup_data or not signup_data.get('email') or not signup_data.get('password') or not signup_data.get('name'):
        return jsonify({"Todos los datos son requeridos"}), 400

    existing_user_email = User.query.filter_by(
        email=signup_data.get('email')).first()

    if existing_user_email:
        return jsonify({"Usurio ya existente"}), 403

    new_user = User(
        name=signup_data["name"],
        email=signup_data["email"],
        password=signup_data["password"]
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify("Usuario Creado"), 201


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
            token = create_access_token(identity=str(user.id))
            return jsonify({"token":token, "user":user.serialize()}), 200
        else:
            # Mensaje genérico para no revelar si el email existe o no
            return jsonify(error="Email o contraseña incorrectos"), 401

    except Exception as e:
        # Manejo de errores inesperados
        return jsonify(error="Error en el servidor"), 500


# Esta ruta esta modo lectura, no esta implementada
# Taks esta funcionando solo localmente
@api.route('/tasks', methods=['GET'])
@jwt_required()
def get_tasks():
    current_user_id = get_jwt_identity()

    # Buscar al usuario por  ID
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    
    # Obtener todas las tareas del usuario actual
    tasks = Task.query.filter_by(user_id=current_user_id).all()
    
    # Convertir a formato JSON
    tasks_list = [task.serialize_task() for task in tasks]
    
    return jsonify(tasks_list), 200

@api.route('/tasks', methods=['POST'])
@jwt_required()
def create_task():
    current_user_id = get_jwt_identity() 
    
    # Buscar al usuario por  ID
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    
    data = request.get_json()
    
    # Validación que se proporcionaron todos los campos necesarios
    if not data or not data.get('description') or not data.get('priority'):
        return jsonify({"msg": "Se requiere escribir una tarea y su prioridad"}), 400
    
    # Usar el ID numérico del usuario
    new_task = Task(
        description=data['description'],
        priority=data['priority'].lower(),
        user_id=current_user_id,  
        creation_date=datetime.now()
    )
    
    db.session.add(new_task)
    db.session.commit()
    
    return jsonify(new_task.serialize_task()), 201




@api.route('/tasks/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    current_user_id = get_jwt_identity()

    try:
        tasks = Task.query.filter_by(
            id=task_id, user_id=current_user_id).first()

        if not tasks:
            return jsonify({"msg": "Registro no encontrado"}), 404

        db.session.delete(tasks)
        db.session.commit()

        return jsonify({"msg": "Tarea eliminada con éxito"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al eliminar tarea", "error": str(e)}), 500
    
@api.route('/tasks/<int:task_id>', methods=['PATCH'])
@jwt_required()
def patch_task(task_id):
    # Obtenemos el ID del usuario actual desde el token JWT
    current_user_id = get_jwt_identity()
    
    # Obtenemos los datos enviados en la petición
    data = request.get_json()
    
    # Verificamos que los datos necesarios estén presentes
    if not data:
        return jsonify({"msg": "No se proporcionaron datos para actualizar"}), 400
    
    try:
        # Buscamos la tarea por ID y usuario (para asegurar que pertenece al usuario actual)
        task = Task.query.filter_by(id=task_id, user_id=current_user_id).first()
        
        # Si no se encuentra la tarea
        if not task:
            return jsonify({"msg": "Tarea no encontrada o no tienes permiso para modificarla"}), 404
        
        # Actualizamos solo los campos que se enviaron en la petición
        campos_actualizables = ['description', 'priority']
        for campo in campos_actualizables:
            if campo in data:
                # Validación especial para el campo priority
                if campo == 'priority':
                    allowed_priorities = ['urgente', 'importante', 'delegar', 'programar']
                    if data[campo] not in allowed_priorities:
                        return jsonify({"msg": f"Valor de {campo} no válido"}), 400
                
                # Actualizamos el campo
                setattr(task, campo, data[campo])
        
        # Guardamos los cambios en la base de datos
        db.session.commit()
        
        # Devolvemos la tarea actualizada
        return jsonify({"msg": "Tarea actualizada con éxito", "task": task.serialize_task()}), 200
        
    except Exception as e:
        # Si ocurre algún error, hacemos rollback y devolvemos un mensaje de error
        db.session.rollback()
        return jsonify({"msg": "Error al actualizar la tarea", "error": str(e)}), 500