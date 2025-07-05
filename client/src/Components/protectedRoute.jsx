import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
//   if (loading) return <p>Loading...</p>;
  return currentUser ? children : <Navigate to="/" />;
};


export const RoleBasedRoute = ({ children, requiredRole }) => {
  const { currentUser, userRole, loading } = useAuth();
//   if (loading) return <p>Loading...</p>;
  if (!currentUser) return <Navigate to="/" />;
  return userRole === requiredRole ? children : <Navigate to="/" />;
};

export const PlanBasedRoute = ({ children }) => {
  const { currentUser, plan, loading } = useAuth();
//   if (loading) return <p>Loading...</p>;
  if (!currentUser) return <Navigate to="/" />;
  return plan ? children : <Navigate to="/slectPlanpage" />;
};