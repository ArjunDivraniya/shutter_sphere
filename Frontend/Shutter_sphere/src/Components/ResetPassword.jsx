import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { resetPassword } from "../utils/authApi";
import { AppButton, Container, SurfaceCard } from "./ui";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const tokenFromQuery = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [token, setToken] = useState(tokenFromQuery);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const data = await resetPassword({ token, password });
      setMessage(data?.message || "Password reset successful");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage(error?.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#071021_0%,#101a2d_100%)] text-white">
      <Container className="grid min-h-screen place-items-center py-10">
        <SurfaceCard className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 p-7">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="mt-2 text-sm text-slate-300">
            Paste your reset token and set a new password.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              rows={3}
              placeholder="Reset token"
              className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 outline-none focus:border-orange-300"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="New password"
              className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 outline-none focus:border-orange-300"
            />

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm password"
              className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 outline-none focus:border-orange-300"
            />

            <AppButton type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Reset Password"}
            </AppButton>
          </form>

          {message && (
            <p className="mt-4 rounded-xl border border-white/10 bg-slate-900/50 p-3 text-sm text-slate-200">
              {message}
            </p>
          )}

          <div className="mt-5 text-sm text-slate-300">
            Back to <Link to="/login" className="text-orange-300 hover:text-orange-200">Login</Link>
          </div>
        </SurfaceCard>
      </Container>
    </div>
  );
};

export default ResetPassword;
