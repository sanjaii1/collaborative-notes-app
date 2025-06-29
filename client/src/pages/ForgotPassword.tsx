import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Link } from "react-router-dom";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword(): React.JSX.Element {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (data: ForgotPasswordForm) => {
    console.log(data)
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500">
      <div className="w-full max-w-md bg-white/90 p-8 rounded-2xl shadow-2xl border border-blue-100">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Forgot Password</h2>
        {submitted ? (
          <>
            <div className="text-green-700 text-center">
              If this email exists, a reset link has been sent.
            </div>
            <div className="mt-6 text-center text-sm text-gray-500">
              <Link to="/" className="text-blue-600 hover:underline font-medium">
                Back to Login
              </Link>
            </div>
          </>
        ) : (
          <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border p-2 rounded"
                  placeholder="Enter your email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>
              <button
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg shadow hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Send Reset Link
              </button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-500">
              <Link to="/" className="text-blue-600 hover:underline font-medium">
                Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
