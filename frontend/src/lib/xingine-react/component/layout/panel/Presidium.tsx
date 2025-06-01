import React, { useState } from "react";
import {
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
  BulbOutlined,
  MenuOutlined,
} from "@ant-design/icons";

const Presidium: React.FC<{
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}> = ({ onToggleMenu, darkMode, setDarkMode }) => {
  return (
    <header className={`presidium-header ${darkMode ? "dark" : "light"}`}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button
          className="toggle-mode"
          onClick={() => setDarkMode((prev) => !prev)}
        >
          <BulbOutlined className={`bulb-icon ${darkMode ? "glow" : ""}`} />
        </button>
      </div>
      <nav className="presidium-nav">
        <a href="/">
          <HomeOutlined />
        </a>
        <a href="/profile">
          <UserOutlined />
        </a>
        <a href="/logout">
          <LogoutOutlined />
        </a>
      </nav>
    </header>
  );
};

export default Presidium;
