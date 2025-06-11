import { Navigate, useLocation } from "react-router-dom";
import { tokenService } from "../services/tokenService";

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();

    if (!tokenService.hasValidToken()) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
};

export default RequireAuth;