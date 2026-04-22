import React from "react";

const SurfaceCard = ({ children, className = "", padding = "p-6" }) => {
  return (
    <div className={`surface-card ${padding} ${className}`.trim()}>
      {children}
    </div>
  );
};

export default SurfaceCard;