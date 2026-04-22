import React from "react";

const buttonStyles = {
  primary:
    "bg-gradient-to-r from-[#ffb84d] to-[#ff7a45] text-slate-950 shadow-[0_18px_40px_rgba(255,122,69,0.28)] hover:shadow-[0_22px_48px_rgba(255,122,69,0.36)]",
  secondary:
    "border border-white/15 bg-white/5 text-white hover:bg-white/10",
  ghost:
    "bg-transparent text-white hover:bg-white/5",
};

const sizeStyles = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-3 text-sm",
  lg: "px-6 py-4 text-base",
};

const AppButton = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}) => {
  const classes = [
    "app-button inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb84d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08111f]",
    buttonStyles[variant] || buttonStyles.primary,
    sizeStyles[size] || sizeStyles.md,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
};

export default AppButton;