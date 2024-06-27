import "./Header.scss";
import React from "react";

function Header({
  children,
  description,
  descriptionColor,
  gradientCode,
  backgroundImage,
  color,
}) {
  return (
    <div
      className="header"
      style={{
        backgroundImage: `linear-gradient(${gradientCode}),url(${backgroundImage})`,
        backgroundSize: "cover", // Ensure the background image covers the area
        backgroundPosition: "center", // Center the background image
      }}
    >
      {children}
    </div>
  );
}

export default Header;
