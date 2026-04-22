import React from "react";

const Container = ({ children, className = "" }) => {
  return (
    <div className={`mx-auto w-full max-w-7xl px-6 lg:px-10 ${className}`.trim()}>
      {children}
    </div>
  );
};

export default Container;