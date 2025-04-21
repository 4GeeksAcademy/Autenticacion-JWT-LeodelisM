import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import apiClient from '../api';
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Login = () => {
    const { store, dispatch } = useGlobalReducer();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (store.token) {
            navigate("/tasks");
        }
    }, [store.token, navigate]);


    // verificar que tanto el email como la contraseña no estén vacíos 
    // después de eliminar los espacios en blanco al inicio y final
    const valid = email.trim() !== "" && password.trim() !== "";

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!valid) return;

        setError(null);
        setIsLoading(true);

        try {
            const token = await apiClient.login(email, password);

            if (token) {
                dispatch({
                    type: "set_token",
                    payload: {
                        token: token.token,
                        user: token.user,
                    }
                });
                navigate('/tasks');
            }

        } catch (err) {
            setError("Error al iniciar sesión. Verifica tus credenciales.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Iniciar Sesión</h2>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
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
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-secondary w-100"
                                    disabled={!valid || isLoading}
                                >
                                    {isLoading ? "Cargando..." : "Iniciar Sesión"}
                                </button>
                            </form>
                            <div className="mt-3 text-center">
                                <p>
                                    ¿No tienes cuenta? <Link to="/signup">Regístrate</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};