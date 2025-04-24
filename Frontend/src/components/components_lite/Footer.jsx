

import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      {/* Footer for the current page */}
      <div
        style={{
          textAlign: "center",
          padding: "20px",
          background: "linear-gradient(to right,rgb(45, 2, 76),rgb(28, 50, 13))",
          color: "#ffffff",
        }}
      >
        <p>© 2025 Hireline. All rights reserved.</p>
        <p>
          Powered by <a href="" target="_blank" style={{ color: "#3498db" }}>HireLine.co</a>
        </p>
        <p>
          <Link to={"/PrivacyPolicy"} style={{ color: "#3498db" }}>Privacy Policy</Link> |
          <Link to={"/TermsofService"} style={{ color: "#3498db" }}> Terms of Service</Link>
        </p>
      </div>
    </div>
  );
};

export default Footer;
