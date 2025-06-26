import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../lib/validationSchemas";
import { z } from "zod";
import AuthInput from "../components/AuthInput";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import LogoHeader from "../components/LogoHeader";
// import api from "../lib/axios";

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
        const dummyUser = {
            id: "1",
            name: "Demo User",
            email: "demo@example.com"
        };
        const dummyToken = "dummy-token-123";

        if (data.email === "demo@example.com" && data.password === "password") {
            useAuthStore.getState().login(dummyUser, dummyToken);
            navigate("/dashboard");
        } else {
            alert("Invalid credentials. Try demo@example.com / password");
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500">
            <div className="w-full max-w-md bg-white/90 p-8 rounded-2xl shadow-2xl border border-blue-100">
                <LogoHeader />
                <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
                    Sign in to your account
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <AuthInput
                        label="Email"
                        type="email"
                        {...register("email")}
                        error={errors.email}
                    />
                    <AuthInput
                        label="Password"
                        type="password"
                        {...register("password")}
                        error={errors.password}
                    />
                    <button
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg shadow hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Login
                    </button>
                    <div className="text-right mt-2">
                        <a href="/forgot-password" className="text-blue-600 hover:underline text-sm">
                            Forgot password?
                        </a>
                    </div>
                </form>
                <div className="mt-6 text-center text-sm text-gray-500">
                    Don&apos;t have an account?{" "}
                    <a href="/register" className="text-blue-600 hover:underline font-medium">
                        Register
                    </a>
                </div>
            </div>
        </div>
    );
}
