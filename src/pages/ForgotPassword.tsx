import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { requestPasswordReset } from "../api";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      await requestPasswordReset(email);
      setSuccess(true);
    } catch {
      // Show success regardless (requirement)
      setSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg relative z-10">
        <h2 className="text-2xl font-bold text-green-900 mb-4 text-center">Forgot your password?</h2>
        {success ? (
          <div className="text-green-700 text-center">
            If an account exists with this email, a password reset link has been sent.<br />
            <Button className="mt-4 w-full" onClick={() => navigate("/login")}>Return to Login</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="fp-email" className="text-green-800 text-base font-semibold">Email address</Label>
              <Input
                id="fp-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-green-50 border border-green-300 text-green-900 focus:ring-green-500 focus:border-green-600 rounded-md px-3 py-2 mt-1"
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <Button
              type="submit"
              className="w-full py-3 bg-green-700 text-white font-bold text-lg rounded-full hover:bg-green-800 transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </Button>
            <div className="text-xs text-center mt-4">
              <a href="/login" className="text-green-700 hover:underline">Back to login</a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
