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
} from "recharts";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ChartConfig,
  ChartMeta,
} from "xingine/dist/core/component/component-meta-map";

const renderChart = (chart: ChartConfig, index: number) => {
  const { type, title, labels = [], datasets = [] } = chart;

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

  return (
    <div key={index} style={{ marginBottom: 48 }}>
      {title && <h3>{title}</h3>}
      {type === "bar" && (
        <BarChart width={600} height={300} data={data}>
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
      )}
      {type === "line" && (
        <LineChart width={600} height={300} data={data}>
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
      )}
      {type === "pie" && (
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            dataKey={datasets[0].label}
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#82ca9d"
            label
          />
          <Tooltip />
        </PieChart>
      )}
      {type === "scatter" && (
        <ScatterChart width={600} height={300}>
          <XAxis dataKey="x" />
          <YAxis dataKey="y" />
          <Tooltip />
          <Scatter name="Data" data={scatterData} fill="#8884d8" />
        </ScatterChart>
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

  return <div>{charts.map(renderChart)}</div>;
};
