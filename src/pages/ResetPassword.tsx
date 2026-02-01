import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPasswordConfirm } from "../api";

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [apiMessage, setApiMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setApiMessage("");
    try {
      const data = await resetPasswordConfirm(token, newPassword, confirmPassword);
      setSuccess(true);
      setApiMessage(data.message || "Password reset successfully.");
    } catch (err: any) {
      if (err) {
        setErrors(err);
        if (typeof err === 'string') {
          setApiMessage(err);
        } else if (err.message) {
          setApiMessage(err.message);
        }
      } else {
        setApiMessage("An unexpected error occurred. Try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-green-900 mb-4 text-center">Reset your password</h2>
        {success ? (
          <div className="text-green-700 text-center">
            {apiMessage || "Password has been reset successfully."}
            <Button className="mt-4 w-full" onClick={() => navigate("/login")}>Go to Login</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="hidden" value={token} />
            <div>
              <Label htmlFor="new-password" className="text-green-800 text-base font-semibold">New password</Label>
              <Input
                id="new-password"
                type="password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="bg-green-50 border border-green-300 text-green-900 focus:ring-green-500 focus:border-green-600 rounded-md px-3 py-2 mt-1"
                autoComplete="new-password"
                placeholder="Enter new password"
              />
              {errors.new_password && <div className="text-red-500 text-sm mt-1">{errors.new_password[0]}</div>}
            </div>
            <div>
              <Label htmlFor="confirm-password" className="text-green-800 text-base font-semibold">Confirm password</Label>
              <Input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="bg-green-50 border border-green-300 text-green-900 focus:ring-green-500 focus:border-green-600 rounded-md px-3 py-2 mt-1"
                autoComplete="new-password"
                placeholder="Re-enter new password"
              />
              {errors.new_password2 && <div className="text-red-500 text-sm mt-1">{errors.new_password2[0]}</div>}
            </div>
            {errors.token && <div className="text-red-500 text-sm text-center">{errors.token[0]}</div>}
            {apiMessage && <div className={`text-${success ? "green" : "red"}-700 text-sm text-center`}>{apiMessage}</div>}
            <Button
              type="submit"
              className="w-full py-3 bg-green-700 text-white font-bold text-lg rounded-full hover:bg-green-800 transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
