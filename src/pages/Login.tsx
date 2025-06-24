// src/pages/Login.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../lib/validationSchemas";
import { z } from "zod";
import AuthInput from "../components/AuthInput";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

type LoginForm = z.infer<typeof loginSchema>;

export default function Login(): React.JSX.Element {
    const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
//   const logout = useAuthStore((state) => state.logout);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    try {
        const res = await api.post("/auth/login", data);
        const { user, token } = res.data;
    
        useAuthStore.getState().login(user, token);
        navigate("/dashboard");
      } catch (err) {
        console.error("Login failed:", err);
      }
  };

  return (
    <div className="max-w-sm mx-auto mt-24 bg-white p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <AuthInput label="Email" type="email" {...register("email")} error={errors.email} />
        <AuthInput label="Password" type="password" {...register("password")} error={errors.password} />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-2">Login</button>
      </form>
    </div>
  );
}
