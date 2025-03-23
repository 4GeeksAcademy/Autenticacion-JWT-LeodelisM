import React from "react";
import { Link } from "react-router-dom";

export const Login = () => {

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Iniciar Sesión</h2>
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
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
                                        required
                                    />
                                </div>
                                <Link
                                    to="/TodoList"
                                    className="btn btn-primary w-100"
                                >
                                    Iniciar Sesion
                                </Link>
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






