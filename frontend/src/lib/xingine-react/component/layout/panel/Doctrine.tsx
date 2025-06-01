import React from "react";

const Doctrine: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="doctrine-footer">
      <div className="footer-content">
        <span>© {currentYear} Initiation</span>
        <span className="footer-links">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/contact">Contact</a>
        </span>
      </div>
    </footer>
  );
};
export default Doctrine;
