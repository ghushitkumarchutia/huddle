import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = () => {
  const { user } = useAuthStore();
  const { isRestoring } = useAuth();

  if (isRestoring) {
    return (
      <div className='min-h-screen bg-[#121212] flex items-center justify-center'>
        <div className='w-8 h-8 rounded-full border-[3px] border-zinc-700 border-t-zinc-300 animate-spin'></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to='/login' replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
