import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import apiClient from '../api';
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Login = () => {
    const { store, dispatch } = useGlobalReducer();

    const navigate = useNavigate();

    if (store.token) {
        navigate("/tasks");
    }

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const valid = email !== "" && password !== "";


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await apiClient.login(email, password);
            if (token) {
                dispatch({
                    type: "set_token",
                    payload: token
                })
                navigate('/tasks');
            }
        } catch (err) {
            console.error("Log In Error", err);
            setError("Log In Error");
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Iniciar Sesión</h2>
                            {error ? <div clasName="bg-danger">{error}</div> : null}
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
                                    className="btn btn-primary w-100"
                                    disabled={!valid}
                                >
                                    Iniciar Sesion
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