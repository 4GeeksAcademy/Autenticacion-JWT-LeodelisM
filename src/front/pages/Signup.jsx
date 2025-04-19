import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import apiClient from '../api';

export const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    // Nuevos estados para errores específicos
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const navigate = useNavigate();

    // Función de validación mejorada
    const validateForm = () => {
        let isValid = true;

        // Resetear errores
        setEmailError("");
        setPasswordError("");
        setConfirmPasswordError("");

        // Validar email
        if (!email.trim()) {
            setEmailError("El email es obligatorio");
            isValid = false;
        } else if (!email.endsWith("@gmail.com")) {
            setEmailError("El email debe ser una cuenta de Gmail");
            isValid = false;
        }

        // Validar contraseña
        if (!password.trim()) {
            setPasswordError("La contraseña es obligatoria");
            isValid = false;
        } else if (password.length < 8) {
            setPasswordError("La contraseña debe tener al menos 8 caracteres");
            isValid = false;
        }

        // Validar confirmación de contraseña
        if (password !== confirmPassword) {
            setConfirmPasswordError("Las contraseñas no coinciden");
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Usar la nueva función de validación
        if (!validateForm()) {
            return;
        }

        setError("");

        try {
            const success = await apiClient.signUp(name, email, password);
            if (success) {
                navigate('/tasks');
            }
        } catch (error) {
            setError("Error al crear la cuenta");
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Crear Cuenta</h2>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="ejemplo@gmail.com"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    {emailError && <div className="text-danger small mt-1">{emailError}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">
                                        Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <small className="text-muted">La contraseña debe tener al menos 8 caracteres</small>
                                    {passwordError && <div className="text-danger small mt-1">{passwordError}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="confirmPassword" className="form-label">
                                        Confirmar Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    {confirmPasswordError && <div className="text-danger small mt-1">{confirmPasswordError}</div>}
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-secondary w-100"
                                >
                                    Registrarse
                                </button>
                            </form>
                            <div className="mt-3 text-center">
                                <p>
                                    ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}