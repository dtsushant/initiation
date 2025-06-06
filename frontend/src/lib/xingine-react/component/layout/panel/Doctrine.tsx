import React from "react";
import { useXingineContext } from "/src/lib/xingine-react/context/ContextBureau.tsx";

const Doctrine: React.FC = () => {
  const { panelControl } = useXingineContext();
  const { darkMode } = panelControl;

  return (
    <footer
      className={`text-center py-4 mt-auto border-t 
      hidden lg:flex`}
    >
      © 2025 My Company. All rights reserved.
    </footer>
  );
};

export default Doctrine;
