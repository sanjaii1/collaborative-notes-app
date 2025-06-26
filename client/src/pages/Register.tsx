// src/pages/Register.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../lib/validationSchemas";
import { z } from "zod";
import AuthInput from "../components/AuthInput";
import api from "../services/api";

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
    <div className="max-w-sm mx-auto mt-24 bg-white p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <AuthInput label="Name" {...register("name")} error={errors.name} />
        <AuthInput label="Email" type="email" {...register("email")} error={errors.email} />
        <AuthInput label="Password" type="password" {...register("password")} error={errors.password} />
        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mt-2">Register</button>
      </form>
    </div>
  );
}
