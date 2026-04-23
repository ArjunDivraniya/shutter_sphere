import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../utils/authApi";
import { AppButton, Container, SurfaceCard } from "./ui";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = await forgotPassword(email);
      const tokenHint = data?.resetToken ? `\nDev reset token: ${data.resetToken}` : "";
      setMessage((data?.message || "If the email exists, reset instructions have been sent.") + tokenHint);
    } catch (error) {
      setMessage(error?.response?.data?.message || "Failed to process your request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#071021_0%,#101a2d_100%)] text-white">
      <Container className="grid min-h-screen place-items-center py-10">
        <SurfaceCard className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 p-7">
          <h1 className="text-2xl font-bold">Forgot Password</h1>
          <p className="mt-2 text-sm text-slate-300">
            Enter your email and we will generate a reset token flow.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 outline-none focus:border-orange-300"
            />

            <AppButton type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Send Reset Request"}
            </AppButton>
          </form>

          {message && (
            <pre className="mt-4 whitespace-pre-wrap rounded-xl border border-white/10 bg-slate-900/50 p-3 text-xs text-slate-200">
              {message}
            </pre>
          )}

          <div className="mt-5 text-sm text-slate-300">
            Back to <Link to="/login" className="text-orange-300 hover:text-orange-200">Login</Link>
          </div>
        </SurfaceCard>
      </Container>
    </div>
  );
};

export default ForgotPassword;
