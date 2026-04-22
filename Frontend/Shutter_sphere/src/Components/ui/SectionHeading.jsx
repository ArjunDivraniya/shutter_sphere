import React from "react";

const SectionHeading = ({ eyebrow, title, description, align = "left" }) => {
  const alignClass = align === "center" ? "mx-auto text-center" : "text-left";

  return (
    <div className={`max-w-3xl ${alignClass}`}>
      {eyebrow ? (
        <p className="section-eyebrow mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#ffb84d]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="section-title text-3xl font-bold text-white md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="section-description mt-4 text-base leading-8 text-slate-300 md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
};

export default SectionHeading;