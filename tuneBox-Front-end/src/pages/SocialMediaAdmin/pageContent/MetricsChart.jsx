import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const MetricsChart = ({ userData }) => {
  // Transform the metrics data into the format needed for the chart
  const metricsData = [
    {
      name: 'Total Users',
      value: userData.totalUsers,
      color: '#0088FE'
    },
    {
      name: 'Active Users',
      value: userData.activeLikers,
      color: '#00C49F'
    },
    {
      name: 'Engagement Rate',
      value: userData.engagementStats.engagementRate,
      color: '#8884d8'
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>User Metrics Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={metricsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => {
                return name === 'Engagement Rate' ? `${value}%` : value;
              }}
            />
            <Bar
              dataKey="value"
              radius={[4, 4, 0, 0]}
            >
              {metricsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MetricsChart;