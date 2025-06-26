import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../lib/validationSchemas";
import { z } from "zod";
import AuthInput from "../components/AuthInput";
import api from "../services/api";
import { Link } from "react-router-dom";
import LogoHeader from "../components/LogoHeader";

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register(): React.JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterForm) => {
    try {
      const res = await api.post("/auth/register", data);
      console.log("Registration success:", res.data);
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500">
      <div className="w-full max-w-md bg-white/90 p-8 rounded-2xl shadow-2xl border border-blue-100">
        <LogoHeader />
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6 tracking-tight">
          Create your account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <AuthInput label="Name" {...register("name") } error={errors.name} />
          <AuthInput label="Email" type="email" {...register("email") } error={errors.email} />
          <AuthInput label="Password" type="password" {...register("password") } error={errors.password} />
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg shadow hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400">
            Register
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/" className="text-blue-600 hover:underline font-medium">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
