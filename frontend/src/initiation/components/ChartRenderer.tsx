import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChartConfig, ChartMeta } from "xingine";
import { Renderer } from "xingine";
import { toCSSClassName, toCSSProperties } from "xingine-react";

// Helper function to apply renderer configuration to chart container styles
const applyRendererStyles = (renderer?: Renderer): React.CSSProperties => {
  if (!renderer) return {};

  const styles: React.CSSProperties = {};

  // Layout configuration
  if (renderer.layout) {
    if (renderer.layout.display) {
      styles.display = renderer.layout.display;
    }
    if (renderer.layout.spacing) {
      styles.margin = renderer.layout.spacing;
    }
    if (renderer.layout.alignment) {
      styles.textAlign = renderer.layout.alignment as any;
    }
  }

  // Display configuration
  if (renderer.display) {
    if (renderer.display.showBorder) {
      styles.border = "1px solid #d9d9d9";
    }
    if (renderer.display.showShadow) {
      styles.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
    }
    if (renderer.display.backgroundColor) {
      styles.backgroundColor = renderer.display.backgroundColor;
    }
    if (renderer.display.textColor) {
      styles.color = renderer.display.textColor;
    }
    if (renderer.display.borderRadius) {
      styles.borderRadius = renderer.display.borderRadius;
    }
    if (renderer.display.opacity !== undefined) {
      styles.opacity = renderer.display.opacity;
    }
  }

  // Animation configuration
  if (renderer.animation) {
    if (renderer.animation.duration) {
      styles.transition = `all ${renderer.animation.duration}ms ${renderer.animation.easing || "ease"}`;
    }
  }

  // Custom styles (highest priority)
  if (renderer.customStyles) {
    Object.assign(styles, renderer.customStyles);
  }

  return styles;
};

// Helper function to get chart dimensions based on renderer configuration
const getChartDimensions = (
  renderer?: Renderer,
  defaultWidth = 600,
  defaultHeight = 300,
) => {
  let width = defaultWidth;
  let height = defaultHeight;
  if (renderer?.customStyles) {
    if (renderer.customStyles.width) {
      width =
        typeof renderer.customStyles.width === "number"
          ? renderer.customStyles.width
          : parseInt(renderer.customStyles.width.toString(), 10) ||
            defaultWidth;
    }
    if (renderer.customStyles.height) {
      height =
        typeof renderer.customStyles.height === "number"
          ? renderer.customStyles.height
          : parseInt(renderer.customStyles.height.toString(), 10) ||
            defaultHeight;
    }
  }

  return { width, height };
};

const renderChart = (
  chart: ChartConfig,
  index: number,
  globalRenderer?: Renderer,
) => {
  const {
    type,
    height: h,
    width: w,
    title,
    labels = [],
    datasets = [],
    renderer: chartRenderer,
    style,
  } = chart;

  // Merge global and chart-specific renderer configurations
  // Chart-specific configuration takes precedence
  const effectiveRenderer = chartRenderer || globalRenderer;

  const data =
    labels.map((label, i) => ({
      name: label,
      ...Object.fromEntries(
        datasets.map((ds) => [
          ds.label,
          Array.isArray(ds.data) ? ds.data[i] : 0,
        ]),
      ),
    })) || [];

  const scatterData = datasets[0]?.data as { x: number | string; y: number }[];

  // Apply renderer styles to container
  const containerStyles: React.CSSProperties = {
    marginBottom: 48,
    ...applyRendererStyles(effectiveRenderer),
  };

  // Get chart dimensions from renderer
  const { width, height } = getChartDimensions(effectiveRenderer, w, h);

  // Apply interaction styles
  const interactionProps: React.HTMLAttributes<HTMLDivElement> = {};
  if (effectiveRenderer?.interaction?.clickable) {
    interactionProps.style = {
      ...containerStyles,
      cursor: "pointer",
    };
    interactionProps.onClick = () => {
      console.log(`Chart ${index} clicked:`, chart.title);
    };
  }

  if (effectiveRenderer?.interaction?.hoverable) {
    interactionProps.onMouseEnter = () => {
      console.log(`Chart ${index} hovered:`, chart.title);
    };
  }

  // Apply accessibility attributes
  const accessibilityProps: React.HTMLAttributes<HTMLDivElement> = {};
  if (effectiveRenderer?.accessibility) {
    if (effectiveRenderer.accessibility.role) {
      accessibilityProps.role = effectiveRenderer.accessibility.role;
    }
    if (effectiveRenderer.accessibility.ariaLabel) {
      accessibilityProps["aria-label"] =
        effectiveRenderer.accessibility.ariaLabel;
    }
    if (effectiveRenderer.accessibility.ariaDescription) {
      accessibilityProps["aria-description"] =
        effectiveRenderer.accessibility.ariaDescription;
    }
    if (effectiveRenderer.accessibility.tabIndex !== undefined) {
      accessibilityProps.tabIndex = effectiveRenderer.accessibility.tabIndex;
    }
  }

  // Apply CSS classes
  const cssClasses = effectiveRenderer?.cssClasses || [];
  const className = cssClasses.join(" ");

  return (
    <div
      key={index}
      style={toCSSProperties(style?.style)}
      className={toCSSClassName(style?.className)}
      {...interactionProps}
      {...accessibilityProps}
    >
      {title && <h3>{title}</h3>}
      {type === "bar" && (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {datasets.map((ds) => (
              <Bar
                key={ds.label}
                dataKey={ds.label}
                fill={ds.backgroundColor || "#8884d8"}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
      {type === "line" && (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Tooltip />
            <Legend />
            {datasets.map((ds) => (
              <Line
                key={ds.label}
                dataKey={ds.label}
                stroke={ds.borderColor || "#8884d8"}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
      {type === "pie" && (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey={datasets[0].label}
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={Math.min(width, height) / 6}
              fill="#82ca9d"
              label
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )}
      {type === "scatter" && (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <XAxis dataKey="x" />
            <YAxis dataKey="y" />
            <Tooltip />
            <Scatter name="Data" data={scatterData} fill="#8884d8" />
          </ScatterChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export const ChartRenderer: React.FC<ChartMeta> = (meta) => {
  const [charts, setCharts] = useState<ChartConfig[]>(meta.charts);

  useEffect(() => {
    const fetchLiveCharts = async () => {
      const liveCharts = await Promise.all(
        meta.charts.map(async (chart) => {
          if (!chart.dataSourceUrl) return chart;

          try {
            const { data } = await axios.get(chart.dataSourceUrl);
            return {
              ...chart,
              labels: data.labels ?? chart.labels,
              datasets: data.datasets ?? chart.datasets,
            };
          } catch (err) {
            console.error(`Failed to load chart: ${chart.title}`, err);
            return chart;
          }
        }),
      );

      setCharts(liveCharts);
    };

    fetchLiveCharts();
  }, [meta]);

  // Apply global renderer configuration to the container
  const globalRenderer = meta.renderer;
  const containerStyles = applyRendererStyles(globalRenderer);

  // Handle grid layout for multiple charts
  let gridStyles: React.CSSProperties = {};
  if (
    globalRenderer?.layout?.display === "grid" &&
    globalRenderer?.layout?.columns
  ) {
    gridStyles = {
      display: "grid",
      gridTemplateColumns: `repeat(${globalRenderer.layout.columns}, 1fr)`,
      gap: globalRenderer.layout.spacing || "16px",
    };
  }

  const finalContainerStyles: React.CSSProperties = {
    ...containerStyles,
    ...gridStyles,
  };

  // Apply accessibility to container
  const containerAccessibilityProps: React.HTMLAttributes<HTMLDivElement> = {};
  if (globalRenderer?.accessibility) {
    if (globalRenderer.accessibility.role) {
      containerAccessibilityProps.role = globalRenderer.accessibility.role;
    }
    if (globalRenderer.accessibility.ariaLabel) {
      containerAccessibilityProps["aria-label"] =
        globalRenderer.accessibility.ariaLabel;
    }
  }

  // Apply CSS classes to container
  const containerCssClasses = globalRenderer?.cssClasses || [];
  const containerClassName = containerCssClasses.join(" ");

  return (
    <>
      {charts.map((chart, index) => renderChart(chart, index, globalRenderer))}
    </>
  );
};
