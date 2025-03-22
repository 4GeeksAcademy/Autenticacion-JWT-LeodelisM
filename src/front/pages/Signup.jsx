import React from "react";
import { Link } from "react-router-dom";

export const Signup = () => {

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Crear Cuenta</h2>
                            <form onSubmit>
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

                                <div className="mb-3">
                                    <label htmlFor="confirmPassword" className="form-label">
                                        Confirmar Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="confirmPassword"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"    
                                > Registrarse
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