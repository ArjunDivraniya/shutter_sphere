import { FaArrowLeft } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const GlobalBackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/") {
    return null;
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    const role = localStorage.getItem("role");
    if (role === "photographer") {
      navigate("/photographer-dashboard");
      return;
    }

    if (role === "client") {
      navigate("/client-dashboard");
      return;
    }

    navigate("/");
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="fixed left-4 top-4 z-[999] inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text)] shadow-[0_10px_25px_rgba(0,0,0,0.2)] transition hover:translate-x-[-2px] hover:border-[#ff7a45]/50"
      aria-label="Go back"
    >
      <FaArrowLeft />
      Back
    </button>
  );
};

export default GlobalBackButton;
