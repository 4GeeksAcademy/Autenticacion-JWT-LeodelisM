import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();

	console.log(store);

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<span className="navbar-brand mb-0 h1">Lista de Tareas</span>
				{store.token ? <div>
					<button onClick={() => dispatch({ type: "logout" })} className="btn btn-outline-primary me-2">
						Cerrar Sesión
					</button>
				</div> : <div className="ml-auto d-flex align-items-center">
					<Link to="/login" className="btn btn-outline-primary me-2">
						Iniciar Sesión
					</Link>
					<Link to="/signup" className="btn btn-outline-success">
						Registrarse
					</Link>
				</div>
				}
			</div>
		</nav>
	);
};