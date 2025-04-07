
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HealthMetric } from '@/lib/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface HealthMetricsChartProps {
  metrics: HealthMetric[];
  title: string;
  type: string;
  color: string;
}

const HealthMetricsChart: React.FC<HealthMetricsChartProps> = ({
  metrics,
  title,
  type,
  color
}) => {
  // Filter metrics by type and sort by timestamp
  const filteredMetrics = metrics
    .filter(metric => metric.type === type)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Format data for the chart
  const chartData = filteredMetrics.map(metric => ({
    date: new Date(metric.timestamp).toLocaleDateString(),
    value: metric.value,
    unit: metric.unit
  }));

  // Function to format Y-axis ticks
  const formatYAxis = (value: number) => `${value}`;

  if (filteredMetrics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No data available for {title.toLowerCase()}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={formatYAxis}
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <Tooltip
              formatter={(value: number, name: string, props: any) => [`${value} ${props.payload.unit}`, title]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              activeDot={{ r: 8 }}
              name={title}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default HealthMetricsChart;
