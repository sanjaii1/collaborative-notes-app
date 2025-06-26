// src/pages/Dashboard.tsx
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";


export default function Dashboard(): React.JSX.Element {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();
  
    const handleLogout = () => {
      logout();
      navigate("/");
    };

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.name} 🎉</h1>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
    );
  }
  