from datetime import datetime

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'user'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(
        String(100), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(256), nullable=False)
    registration_date: Mapped[int] = mapped_column(
        DateTime(), default=datetime.now(), nullable=False)
    is_active: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=True)

    # Relationship
    tasks = relationship("Task", back_populates="user",
                         cascade="all, delete-orphan")

    # Constructor para la clase User que inicializa con email y password
    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.set_password(password)
        self.is_active = True

    # Método para establecer la contraseña (hasheada)
    # generate_password_hash crea un hash unidireccional (no se puede revertir)
    def set_password(self, password):
        self.password = generate_password_hash(password)

    # Método para verificar si una contraseña coincide con el hash almacenado
    # check_password_hash compara la contraseña proporcionada con el hash almacenado
    def check_password(self, password):
        return check_password_hash(self.password, password)

    # Método para convertir el objeto a diccionario (JSON)
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "registration_date": self.registration_date.isoformat(),
            "is_active": self.is_active
        }


class Task(db.Model):
    __tablename__ = 'task'

    id: Mapped[int] = mapped_column(primary_key=True)
    description: Mapped[str] = mapped_column(String(100), nullable=False)
    # urgente, importante, delegar, programar
    priority: Mapped[str] = mapped_column(String(20), nullable=False)
    creation_date: Mapped[int] = mapped_column(
        DateTime(), default=datetime.now(), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey('user.id'), nullable=False)

    # Relationship
    user = relationship("User", back_populates="tasks")

    def serialize(self):
        return {
            'id': self.id,
            'description': self.description,
            'priority': self.priority,
            'creation_date': self.creation_date.isoformat(),
            'user_id': self.user_id
        }
