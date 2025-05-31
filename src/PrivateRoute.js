import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    const user = sessionStorage.getItem("user"); // Vérifie si l'utilisateur est authentifié

    return user ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
