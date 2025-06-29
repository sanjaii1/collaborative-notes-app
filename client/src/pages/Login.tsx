import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../lib/validationSchemas";
import { z } from "zod";
import AuthInput from "../components/AuthInput";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import LogoHeader from "../components/LogoHeader";
import { toast } from "react-toastify";
import type { FieldError } from "react-hook-form";
import { connectSocket } from "../services/socket";


type LoginForm = z.infer<typeof loginSchema>;

export default function Login(): React.JSX.Element {
    const navigate = useNavigate();


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });


    const onSubmit = async (data: LoginForm) => {
        try {
          const res = await api.post("/auth/login", data);

          const { token, _id, name, email } = res.data;
          const user = { id: _id, name, email };

          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("token", token);

          useAuthStore.getState().login(user, token);
          toast.success("Login successful!");
          navigate("/dashboard");
          connectSocket(user.id);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Login failed");
        }
      };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500 px-2 sm:px-4">
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-white/90 p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl border border-blue-100">
                <LogoHeader />
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-blue-700 mb-4 sm:mb-6">
                    Sign in to your account
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                    <AuthInput
                        label="Email"
                        type="email"
                        {...register("email")}
                        error={("type" in (errors.email ?? {})) ? (errors.email as FieldError) : undefined}
                    />
                    <AuthInput
                        label="Password"
                        type="password"
                        {...register("password")}
                        error={("type" in (errors.password ?? {})) ? (errors.password as FieldError) : undefined}
                    />
                    <button
                        className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-lg font-semibold text-base sm:text-lg shadow hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Login
                    </button>
                    <div className="text-right mt-1 sm:mt-2">
                        <a href="/forgot-password" className="text-blue-600 hover:underline text-xs sm:text-sm">
                            Forgot password?
                        </a>
                    </div>
                </form>
                <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-500">
                    Don&apos;t have an account?{" "}
                    <a href="/register" className="text-blue-600 hover:underline font-medium">
                        Register
                    </a>
                </div>
            </div>
        </div>
    );
}
