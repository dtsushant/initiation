import React from "react";
import {
  BulbOutlined,
  HomeOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useXingineContext } from "/src/lib/xingine-react/context/ContextBureau.tsx";

const Presidium: React.FC = () => {
  const { panelControl } = useXingineContext();
  const { darkMode, setDarkMode, toggleMobileMenu } = panelControl;

  return (
    <header
      className={`
      ${
        darkMode
          ? "bg-gray-900 border-gray-700 text-gray-300"
          : "bg-white border-gray-200 text-gray-600"
      }
  order-last
  md:order-first
  fixed md:relative bottom-0 md:bottom-auto
   h-16
  max-h-screen // Will not exceed 100% of viewport height
  overflow-y-auto // Add scroll if content exceeds max-height
  md:overflow-visible // Remove overflow-y on medium screens and up
  px-4 sm:px-8 md:px-4 // px-4 (16px) on mobile, px-6 (24px) from sm, px-8 (32px) from md
  
  py-2
  w-full z-30
  flex items-center justify-between flex-wrap
  shadow
`}
    >
      <div className={``}>
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
