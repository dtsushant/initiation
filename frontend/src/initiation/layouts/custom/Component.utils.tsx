import { ButtonMeta, LayoutComponentDetail, StyleMeta } from "xingine";
import {
  bindMultipleEvents,
  ButtonMetaExtended,
  DangerousRenderer,
  getDefaultInternalComponents,
  IconRenderer,
  toCSSClassName,
  toCSSProperties,
} from "xingine-react";
import React, { useEffect, useRef } from "react";
import { Button, Input } from "antd";

export const RenderComponent: React.FC<LayoutComponentDetail> = (component) => {
  if (!component) return null;
  const compMap = getDefaultInternalComponents();

  const Comp = compMap[component.component];
  console.debug(component.component);
  console.info(JSON.stringify(component, null, 2));
  return (
    <>
      {component.content && (
        <DangerousRenderer
          style={component.contentStyle}
          content={component.content}
        />
      )}
      {Comp && <Comp {...component.meta?.properties} />}
    </>
  );
};

export const ButtonRenderer: React.FC<ButtonMetaExtended> = (meta) => {
  const { style, event, name, content, scope, ...props } = meta;
  const { style: innerStyle, className } = style || {};
  return (
    <Button
      name={name}
      style={toCSSProperties(innerStyle)}
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
    <span ref={spanRef} className={className} style={toCSSProperties(style)} />
  );
};

export const InputWithIcon = () => (
  <Input
    className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    placeholder="Search..."
    prefix={<SvgIcon />}
  />
);
