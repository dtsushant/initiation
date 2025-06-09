import { ChartMeta } from 'xingine/dist/core/component/component-meta-map';

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function extractChartMetaFromDirective(dtoClass: Function): ChartMeta {
  // TODO: enhance this to read metadata from decorators like @ChartField
  return {
    charts: [
      {
        type: 'bar',
        title: 'Monthly Revenue',
        labels: ['Jan', 'Feb', 'Mar'],
        datasets: [
          { label: 'Revenue', data: [120, 150, 170] },
          { label: 'Expenses', data: [80, 100, 120] },
        ],
      },
      {
        type: 'pie',
        title: 'User Roles Distribution',
        labels: ['Admin', 'User', 'Guest'],
        datasets: [{ label: 'Users', data: [10, 50, 20] }],
      },
      {
        type: 'line',
        title: 'Weekly User Signups',
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          { label: 'Organic', data: [40, 60, 75, 90], borderColor: '#1890ff' },
          { label: 'Referral', data: [20, 30, 50, 65], borderColor: '#f5222d' },
        ],
      },
      {
        type: 'scatter',
        title: 'Load vs Response Time',
        datasets: [
          {
            label: 'Performance',
            data: [
              { x: 10, y: 150 },
              { x: 20, y: 180 },
              { x: 30, y: 200 },
              { x: 40, y: 240 },
              { x: 50, y: 300 },
            ],
            backgroundColor: '#52c41a',
          },
        ],
      },
    ],
  };
}
