import React from "react";
import {
  BulbOutlined,
  HomeOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useLayoutContext } from "../context/LayoutContext";

const Presidium: React.FC = () => {
  const { darkMode, setDarkMode, toggleMobileMenu } = useLayoutContext();

  return (
    <header
      className={`
    fixed md:static bottom-0 md:top-0 w-full z-40
    h-14
    flex items-center justify-between
    px-4 py-2
    bg-white dark:bg-gray-900 text-black dark:text-white
    shadow
  `}
    >
      <div className={`px-4`}>
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="text-lg flex items-center gap-1"
        >
          <BulbOutlined
            className={darkMode ? "text-yellow-400 glow" : "text-gray-500"}
          />
          <span className="hidden md:inline">
            {darkMode ? "Light" : "Dark"} Mode
          </span>
        </button>
      </div>

      {/* Navigation Icons */}
      <nav className="flex gap-4">
        <button onClick={toggleMobileMenu}>
          <HomeOutlined />
        </button>
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
