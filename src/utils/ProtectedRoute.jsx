// ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import useUserStore from "../Store/UserStore/userStore";
const ProtectedRoute = ({ children, redirectPath = "/" }) => {
  const user = useUserStore((state) => state.user);
  const location = useLocation();

  const isAuthenticated = !!user?.token; 

  if (!isAuthenticated) {
     
    return <Navigate to={redirectPath} replace  state={{ from: location, unauthorized: true }} />;
  }


  return children ?? null;
};

export default ProtectedRoute;
