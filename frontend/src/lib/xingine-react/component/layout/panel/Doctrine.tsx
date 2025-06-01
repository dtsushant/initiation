import React from "react";
import { useLayoutContext } from "../context/LayoutContext";

const Doctrine: React.FC = () => {
  const { darkMode } = useLayoutContext();

  return (
    <footer
      className={`text-center py-4 mt-auto border-t ${
        darkMode
          ? "bg-gray-900 border-gray-700 text-gray-300"
          : "bg-white border-gray-200 text-gray-600"
      }`}
    >
      © 2025 My Company. All rights reserved.
    </footer>
  );
};

export default Doctrine;
