import { Navigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-t-[#2b0e15] border-gray-300 rounded-full animate-spin"></div>
      </div>
    );
  }
  if (!user) {
    return <Navigate to={"/login"} replace />;
  }
  return children;
};

export default ProtectedRoute;
