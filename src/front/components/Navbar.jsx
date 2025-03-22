import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<span className="navbar-brand mb-0 h1">Lista de Tareas</span>
				<div className="ml-auto d-flex align-items-center">
					<Link to="/login" className="btn btn-outline-primary me-2">
						Iniciar Sesión
					</Link>
					<Link to="/signup" className="btn btn-outline-success">
						Registrarse
					</Link>
					</div>
				</div>
		</nav>
	);
};