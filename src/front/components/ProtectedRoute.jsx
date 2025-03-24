import { Navigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

// Componente para proteger rutas privadas
export const ProtectedRoute = ({ children }) => {
  const { store } = useGlobalReducer();

  // Si no hay token, redirigir a login
  if (!store.token) {
    return <Navigate to="/login" replace />;
  }

  // Si hay token, mostrar la ruta protegida
  return children;
};