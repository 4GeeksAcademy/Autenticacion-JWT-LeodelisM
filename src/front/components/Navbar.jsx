import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();
	const { user, token } = store;
	const navigate = useNavigate();

	// Función de logout que limpia localStorage
	const handleLogout = () => {
		//Limpiar localStorage
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		localStorage.removeItem('tareas');

		// Actualizar el estado global
		dispatch({ type: "logout" });

		// Redirigir al login
		navigate('/login');
	};
	
	return (
		<nav className="navbar navbar-custom">
			<div className="container">
				<Link to="/tasks">
					<span className="navbar-brand">WebApp Mi Lista de Tareas</span>
				</Link>
				{store.token ? (
					<div>
						<span className="m-1">¡Hola, {user?.name || 'Usuario'}!</span>
						<button 
							onClick={handleLogout} 
							className="btn btn-light me-2"
						>
							Cerrar Sesión
						</button>
					</div>
				) : (
					<div className="ml-auto d-flex align-items-center">
						<Link to="/login" className="btn btn-light me-2">
							Iniciar Sesión
						</Link>
						<Link to="/signup" className="btn btn btn-secondary">
							Registrarse
						</Link>
					</div>
				)}
			</div>
		</nav>
	);
};