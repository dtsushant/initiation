import { SvgMeta } from "xingine";
import React, { JSX, useEffect, useRef, useState } from "react";
import { toCSSClassName, toCSSProperties } from "xingine-react";

function ensureXmlns(svg: string): string {
  // Only add xmlns if it's missing and the root tag is <svg>
  const hasXmlns = /<svg[^>]*xmlns=/.test(svg);
  if (!hasXmlns) {
    return svg.replace(
      /<svg([\s>])/,
      '<svg xmlns="http://www.w3.org/2000/svg"$1',
    );
  }
  return svg;
}

export const SvgRenderer: React.FC<SvgMeta> = ({ svg, style, title, alt }) => {
  if (!svg) return null;
  //return svgFromString(svg.trim());

  try {
    const svgWithNs = ensureXmlns(svg.trim());
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgWithNs, "image/svg+xml");
    const svgEl = svgDoc.documentElement;

    if (svgEl.nodeName !== "svg") return null;

    // Extract all attributes
    const attrs: Record<string, string> = {};
    for (const attr of svgEl.attributes) {
      attrs[attr.name] = attr.value;
    }

    if (alt) attrs["aria-label"] = alt;
    if (style?.className) attrs["className"] = toCSSClassName(style.className);

    const innerHtml = svgEl.innerHTML;
    const innerTitle = title ? `<title>${title}</title>` : "";

    return (
      <svg
        {...attrs}
        style={toCSSProperties(style?.style)}
        dangerouslySetInnerHTML={{
          __html: `${innerTitle}${innerHtml}`,
        }}
      />
    );
  } catch (e) {
    console.warn("Invalid SVG passed to SvgRenderer:", e);
    return null;
  }
};
