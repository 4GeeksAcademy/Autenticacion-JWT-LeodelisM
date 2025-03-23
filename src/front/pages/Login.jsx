import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";

import apiClient from '../api';

export const Login = () => {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    const valid = email !== "" && password !== "";

    const navigate = useNavigate()

    const handleSubmit = async () => {
        try {
            const success = await apiClient.login(email, password);
            if (success) {
                navigate('/tasks');
            }
        } catch {
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






