import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { register as apiRegister } from "@/api.jsx";
// import { useAuth } from "./AuthContext";

const signupSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  password2: z.string().min(8, { message: "Password must be at least 8 characters" }),
}).refine((data) => data.password === data.password2, {
  message: "Passwords do not match",
  path: ["password2"],
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess?: () => void;
}

export const SignupForm = ({ onSuccess }: SignupFormProps) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const { startVerification } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setError("");
    setIsSubmitting(true);
    try {
      // Map frontend fields to backend schema
      // Using email as username; password2 is confirm password
      await apiRegister(
        data.email, // username
        data.password,
        data.password2, // password2 (confirm password)
        data.email,
        "",
        ""
      );
      // // Keep existing UI flow: trigger verification modal and return to Layout
      // startVerification(data.email);
      // navigate("/");
      // Redirect to login page after successful signup
      navigate("/login");
    } catch (e: unknown) {
      const message = typeof e === "string" ? e : "Signup failed. Please review your details and try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-white mb-8 text-center" style={{fontFamily: 'inherit'}}>Your investing journey awaits you!</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-white text-base font-semibold">Email*</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            className="bg-white border-0 text-black text-base rounded-md px-3 py-2 mt-1"
            autoComplete="email"
          />
          {errors.email && <div className="text-red-300 text-sm mt-1">{errors.email.message}</div>}
        </div>
        <div>
          <Label htmlFor="password" className="text-white text-base font-semibold">Password*</Label>
          <div className="text-xs text-white/60 mb-1">8 characters minimum</div>
          <Input
            id="password"
            type="password"
            {...register("password")}
            className="bg-white border-0 text-black text-base rounded-md px-3 py-2 mt-1"
            autoComplete="new-password"
          />
          {errors.password && <div className="text-red-300 text-sm mt-1">{errors.password.message}</div>}
        </div>
        <div>
          <Label htmlFor="password2" className="text-white text-base font-semibold">Confirm Password*</Label>
          <div className="text-xs text-white/60 mb-1">must match password</div>
          <Input
            id="password2"
            type="password"
            {...register("password2")}
            className="bg-white border-0 text-black text-base rounded-md px-3 py-2 mt-1"
            autoComplete="new-password"
          />
          {errors.password2 && <div className="text-red-300 text-sm mt-1">{errors.password2.message}</div>}
        </div>
        {error && <div className="text-red-300 text-sm text-center">{error}</div>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-black text-[#19d94b] font-bold text-lg rounded-full hover:bg-gray-900 transition mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{fontFamily: 'inherit', boxShadow: 'none'}}>
          {isSubmitting ? "Creating account..." : "Sign up now"}
        </button>
        <p className="text-xs text-white/80 text-center mt-2">
          By signing up, I confirm I have read and agreed to all terms & conditions set by Quantinfinium Holdings OÜ.
        </p>
      </form>
    </>
  );
};

export default SignupForm; 