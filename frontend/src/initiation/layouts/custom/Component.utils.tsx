import {
  ButtonMeta,
  ConditionalMeta,
  evaluateCondition,
  extrapolate,
  getActionRef,
  getTypedValue,
  LayoutComponentDetail,
  StyleMeta,
} from "xingine";
import {
  bindMultipleEvents,
  getAllComponentMap,
  getDefaultInternalComponents,
  IconRenderer,
  toCSSClassName,
  toCSSProperties,
  useXingineContext,
} from "xingine-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Input } from "antd";

export const RenderComponent: React.FC<LayoutComponentDetail> = (component) => {
  const { meta } = component;
  if (!component) return null;

  if (!meta) return null;

  const compMap = getAllComponentMap();

  const Comp = compMap[meta.component];

  return <>{Comp && <Comp {...meta?.properties} />}</>;
};

type DangerousRenderProps = {
  content?: string;
  style?: StyleMeta;
};
export const DangerousRenderer: React.FC<DangerousRenderProps> = ({
  content,
  style,
}) => {
  if (!content) return null;

  const { panelControl } = useXingineContext();
  const { headerActionContext } = panelControl;

  const dangerContent = useMemo(() => {
    return content ? extrapolate(content, headerActionContext) : "";
  }, [content, headerActionContext["userDropdownOpen"]]);

  return (
    <>
      {dangerContent}
      <div dangerouslySetInnerHTML={{ __html: dangerContent }} />
    </>
  );
};

const SvgIcon = () => {
  const content = `<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 100 80"
  width="30"
  height="30"
  role="img"
  aria-label="Menu"
>
  <rect width="100" height="10" rx="8" fill="yellow" />
  <rect y="30" width="100" height="10" rx="8" fill="currentColor" />
  <rect y="60" width="100" height="10" rx="8" fill="yellow" />
</svg>
`;

  return <DangerousRenderer content={content} />;
};

export interface SvgMeta {
  /**
   * The raw SVG markup string.
   * This must be a valid, sanitized SVG starting with `<svg>...</svg>`.
   */
  svg: string;

  /**
   * Optional CSS class name(s) for styling the wrapper.
   */
  className?: string;

  /**
   * Optional inline styles as a record.
   */
  style?: Record<string, unknown>;

  /**
   * Optional title/label for accessibility or tooltip.
   */
  title?: string;

  /**
   * Optional alt text or semantic label (used for a11y enhancement).
   */
  alt?: string;

  /**
   * Optional role, e.g., "img", "presentation", etc.
   */
  role?: string;
}
export const SvgRenderer: React.FC<SvgMeta> = ({
  svg,
  className,
  style,
  title,
  alt,
  role = "img",
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!spanRef.current) return;

    // Clear previous content
    spanRef.current.innerHTML = "";

    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svg.trim(), "image/svg+xml");
    const svgElement = svgDoc.documentElement;

    if (svgElement.nodeName !== "svg") return;

    if (alt) svgElement.setAttribute("aria-label", alt);
    if (title) {
      const titleElement = svgDoc.createElementNS(
        "http://www.w3.org/2000/svg",
        "title",
      );
      titleElement.textContent = title;
      svgElement.prepend(titleElement);
    }

    svgElement.setAttribute("role", role);
    spanRef.current.appendChild(document.importNode(svgElement, true));
  }, [svg, alt, title, role]);

  return (
    <span
      ref={spanRef}
      className={toCSSClassName(className)}
      style={toCSSProperties(style)}
    />
  );
};

export const InputWithIcon = () => (
  <Input
    className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    placeholder="Search..."
    prefix={<SvgIcon />}
  />
);

interface MyMeta {
  content: string;
  className: string;
}
export const MyCustomRenderer: React.FC<MyMeta> = (meta) => {
  const { panelControl } = useXingineContext();
  const { headerActionContext } = panelControl;
  const { content, className } = meta;

  const evaluatedClassName = useMemo(() => {
    return className ? extrapolate(className, headerActionContext) : "";
  }, [className, headerActionContext]);

  //  const combinedScope = {headerActionContext, ...scope};
  // const predicate = evaluateCondition(condition, combinedScope);

  return (
    <div className={evaluatedClassName}>
      <DangerousRenderer content={content} />
    </div>
  );
};

export interface ButtonMetaExtended extends ButtonMeta {
  scope: Record<string, unknown>;
}

export const ButtonRenderer: React.FC<ButtonMetaExtended> = (meta) => {
  const { style, event, name, content, scope, ...props } = meta;
  const { style: innerStyle, className } = style || {};
  return (
    <Button
      type="default"
      name={name}
      style={{ all: "unset" }}
      className={toCSSClassName(className)}
      {...bindMultipleEvents(event, scope)}
      {...props}
    >
      {typeof content === "string" && content ? (
        <DangerousRenderer content={content} />
      ) : content && typeof content === "object" ? (
        <IconRenderer {...content} />
      ) : (
        "Default Button"
      )}
    </Button>
  );
};

export const CleanHeader = () => {
  const { panelControl } = useXingineContext();
  const { darkMode, collapsed, setCollapsed, setDarkMode } = panelControl;
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const toggleDarkMode = () => {
    //setDarkMode(!darkMode);
    getActionRef(
      "setDarkMode",
      panelControl,
    )?.(!getTypedValue<boolean>(panelControl, "darkMode"));
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  return (
    <>
      <div
        className={`h-16 px-4 flex items-center justify-between ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-md hover:${
              darkMode ? "bg-gray-700" : "bg-gray-100"
            } transition-colors`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <button
            className={`p-2 rounded-md hover:${
              darkMode ? "bg-gray-700" : "bg-gray-100"
            } transition-colors`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <svg
                className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-md hover:${
              darkMode ? "bg-gray-700" : "bg-gray-100"
            } transition-colors`}
          >
            {darkMode ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>

          <button
            className={`p-2 rounded-md hover:${
              darkMode ? "bg-gray-700" : "bg-gray-100"
            } transition-colors relative`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-5 5v-5zM15 17H9a6 6 0 01-6-6V9a6 6 0 016-6h6a6 6 0 016 6v2"
              />
            </svg>
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
              3
            </span>
          </button>

          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className={`flex items-center space-x-2 p-2 rounded-md hover:${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              } transition-colors`}
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                U
              </div>
              <svg
                className={`w-4 h-4 transition-transform ${userDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {userDropdownOpen && (
              <div
                className={`absolute right-0 mt-2 w-48 ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                } border rounded-md shadow-lg z-50`}
              >
                <div className="py-1">
                  <a
                    href="#"
                    className={`block px-4 py-2 text-sm hover:${
                      darkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    Profile
                  </a>
                  <a
                    href="#"
                    className={`block px-4 py-2 text-sm hover:${
                      darkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    Settings
                  </a>
                  <hr
                    className={`${darkMode ? "border-gray-700" : "border-gray-200"}`}
                  />
                  <a
                    href="#"
                    className={`block px-4 py-2 text-sm hover:${
                      darkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    Logout
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
