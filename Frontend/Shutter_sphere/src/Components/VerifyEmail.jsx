import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../utils/authApi";
import { Container, SurfaceCard } from "./ui";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const run = async () => {
      if (!token) {
        setStatus("Verification token missing.");
        return;
      }

      try {
        const data = await verifyEmail(token);
        setStatus(data?.message || "Email verified successfully.");
      } catch (error) {
        setStatus(error?.response?.data?.message || "Email verification failed.");
      }
    };

    run();
  }, [token]);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#071021_0%,#101a2d_100%)] text-white">
      <Container className="grid min-h-screen place-items-center py-10">
        <SurfaceCard className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 p-7">
          <h1 className="text-2xl font-bold">Email Verification</h1>
          <p className="mt-4 rounded-xl border border-white/10 bg-slate-900/50 p-3 text-sm text-slate-200">
            {status}
          </p>
          <div className="mt-5 text-sm text-slate-300">
            Continue to <Link to="/login" className="text-orange-300 hover:text-orange-200">Login</Link>
          </div>
        </SurfaceCard>
      </Container>
    </div>
  );
};

export default VerifyEmail;
