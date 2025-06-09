import { Card } from "antd";
import { Link } from "react-router-dom";
import React from "react";
import { ModuleProperties } from "xingine";

export const ModuleHome: React.FC<ModuleProperties> = (module) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {module.uiComponent?.map((comp, idx) => (
        <Link to={comp.path} key={idx}>
          <Card
            hoverable
            className="flex flex-col items-center justify-center text-center shadow"
          >
            <div className="text-2xl mb-2">{comp.icon || "🔧"}</div>
            <div className="text-sm font-semibold">{comp.component}</div>
          </Card>
        </Link>
      ))}
    </div>
  );
};
