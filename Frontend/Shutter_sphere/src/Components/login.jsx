import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../utils/apiBase";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCheckCircle, FaCameraRetro, FaLock, FaUserTie } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { AppButton, Container, SurfaceCard } from "./ui";

const LoginSignup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const showToast = (message, type) => {
    toast[type](message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      theme: "colored",
    });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || (!isLogin && (!formData.name || !formData.role))) {
      showToast("All fields are required!", "error");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      showToast("Invalid email format!", "error");
      return false;
    }
    if (formData.password.length < 6) {
      showToast("Password must be at least 6 characters!", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const endpoint = isLogin ? `${API_BASE_URL}/api/login` : `${API_BASE_URL}/api/signup`;
      const response = await axios.post(endpoint, formData);

      if (response.status === 200 || response.status === 201) {
        const { role, token } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("email", response.data.email || formData.email);
        localStorage.setItem("userName", response.data.name || formData.name || "");

        if (isLogin) {
          showToast("Login successful!", "success");
          if (role === "photographer") navigate("/photographer-dashboard");
          else if (role === "client") navigate("/client-dashboard");
          else navigate("/search");
        } else {
          showToast(`Welcome, ${formData.name}!`, "success");
          setIsLogin(true);
          setFormData({ name: "", email: "", password: "", role: "" });
        }
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Something went wrong!", "error");
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    {
      value: "client",
      label: "Client",
      icon: FaUserTie,
      description: "Book trusted photographers with confidence.",
    },
    {
      value: "photographer",
      label: "Photographer",
      icon: FaCameraRetro,
      description: "Get discovered and manage bookings.",
    },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(255,184,77,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,122,69,0.18),transparent_28%),linear-gradient(180deg,#08111f_0%,#0d1728_100%)] text-white">
      <ToastContainer />
      <Container className="grid min-h-screen items-center py-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 max-w-2xl lg:mb-0"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-orange-100 backdrop-blur-sm">
            <FaLock className="text-orange-300" /> Secure JWT auth, clean flow, less friction
          </div>

          <h1 className="max-w-xl text-4xl font-black leading-tight md:text-6xl">
            {isLogin ? "Welcome back to FrameBook" : "Create your FrameBook account"}
          </h1>

          <p className="mt-5 max-w-xl text-base leading-8 text-slate-300 md:text-lg">
            {isLogin
              ? "Sign in to continue searching, booking, and managing photographers in one place."
              : "Join as a client or photographer and start using the booking workflow right away."}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              "Fast login and signup",
              "Role-based access",
              "Protected routes with JWT",
              "Mobile-friendly layout",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
              >
                <FaCheckCircle className="text-[#ffb84d]" />
                <span className="text-sm text-slate-200">{item}</span>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <SurfaceCard className="mx-auto w-full max-w-xl overflow-hidden rounded-[22px] border border-white/10 bg-[linear-gradient(160deg,#0d182b_0%,#121f35_48%,#0e1a2e_100%)] p-0 shadow-[0_24px_60px_rgba(0,0,0,0.35)] ring-1 ring-inset ring-white/5">
            <div className="relative rounded-t-[22px] border-b border-white/10 bg-[radial-gradient(circle_at_88%_0%,rgba(255,184,77,0.22),transparent_42%),radial-gradient(circle_at_0%_90%,rgba(90,151,255,0.14),transparent_40%),linear-gradient(130deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02))] px-6 py-5 backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#0f1b31]/70 to-transparent" />
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-orange-300">Account Access</p>
                  <h2 className="mt-1 text-2xl font-bold text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)]">{isLogin ? "Login" : "Signup"}</h2>
                </div>
                <div className="rounded-full border border-white/20 bg-[#1a2740]/75 px-3 py-1 text-xs text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]">
                  Secure session
                </div>
              </div>

              <div className="relative mt-5 grid grid-cols-2 rounded-full border border-white/10 bg-slate-900/45 p-[3px] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute left-[3px] top-[3px] h-10 w-[calc(50%-6px)] rounded-full bg-gradient-to-r from-[#ffb84d] to-[#ffa74a] shadow-[0_8px_18px_rgba(255,184,77,0.35)]"
                  initial={false}
                  animate={{ x: isLogin ? "0%" : "100%" }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className={`relative z-10 h-10 rounded-full px-4 text-sm font-semibold transition duration-300 ${isLogin ? "text-slate-950" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className={`relative z-10 h-10 rounded-full px-4 text-sm font-semibold transition duration-300 ${!isLogin ? "text-slate-950" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}
                >
                  Signup
                </button>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <AnimatePresence initial={false} mode="wait">
                  {!isLogin && (
                    <motion.div
                      key="signup-extra-fields"
                      className="space-y-5 overflow-hidden"
                      initial={{ opacity: 0, height: 0, y: -8 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -8 }}
                      transition={{ duration: 0.26, ease: "easeOut" }}
                    >
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-200">{t("signup.name")}</label>
                        <input
                          type="text"
                          name="name"
                          placeholder={t("signup.name_placeholder")}
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-[#ffb84d] focus:bg-white/10"
                        />
                      </div>

                      <div>
                        <label className="mb-3 block text-sm font-medium text-slate-200">Select your account type</label>
                        <div className="grid gap-2.5 sm:grid-cols-2">
                          {roleOptions.map((option) => {
                            const Icon = option.icon;
                            const active = formData.role === option.value;

                            return (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => setFormData((current) => ({ ...current, role: option.value }))}
                                className={`group relative flex min-h-[126px] flex-col overflow-hidden rounded-2xl border p-3.5 text-left transition duration-300 ${
                                  active
                                    ? "border-[#ffb84d] bg-gradient-to-br from-[#ffb84d]/22 via-[#ff9d5f]/10 to-transparent shadow-[0_0_0_1px_rgba(255,184,77,0.35),0_0_24px_rgba(255,184,77,0.32),0_12px_24px_rgba(255,184,77,0.20)]"
                                    : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.08]"
                                }`}
                              >
                                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />

                                <div className="flex items-start gap-2">
                                  <div
                                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[13px] text-slate-950 transition duration-300 ${
                                      active
                                        ? "bg-gradient-to-br from-[#ffb84d] to-[#ff7a45]"
                                        : "bg-white/15 text-white group-hover:bg-gradient-to-br group-hover:from-[#ffb84d] group-hover:to-[#ff7a45] group-hover:text-slate-900"
                                    }`}
                                  >
                                    <Icon />
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <p className="text-[17px] font-bold leading-none text-white">{option.label}</p>
                                    <p className="mt-2 max-w-[24ch] text-[12px] leading-5 text-slate-300">
                                      {option.description}
                                    </p>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">{t("login.email")}</label>
                  <input
                    type="email"
                    name="email"
                    placeholder={t("login.email_placeholder")}
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-[#ffb84d] focus:bg-white/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">{t("login.password")}</label>
                  <input
                    type="password"
                    name="password"
                    placeholder={t("login.password_placeholder")}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-[#ffb84d] focus:bg-white/10"
                  />
                </div>

                <AppButton type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? "Please wait..." : isLogin ? t("login.button") : t("signup.button")}
                </AppButton>
              </form>

              <p className="mt-6 text-center text-sm text-slate-300">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-semibold text-[#ffb84d] underline-offset-4 hover:underline"
                >
                  {isLogin ? "Create one" : "Login"}
                </button>
              </p>
            </div>
          </SurfaceCard>
        </motion.div>
      </Container>
    </div>
  );
};

export default LoginSignup;
