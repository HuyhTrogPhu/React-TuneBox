import React from 'react';
import { BarChart, Bar,AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#FF7F50', '#FFA07A', '#FF8C00', '#FFD700'];

const HourlyPatternsChart = ({ data, primaryColor, CustomTooltip }) => {
  // Transform hourly patterns data
  const transformedData = Object.entries(data || {}).map(([hour, count]) => ({
    hour: `${hour}:00`,
    posts: count
  })).sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={transformedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" />
        <YAxis />
        <Tooltip content={CustomTooltip} />
        <Area type="monotone" dataKey="posts" stroke={primaryColor} fill={primaryColor} name="Posts" />
      </AreaChart>
    </ResponsiveContainer>
  );
};


export default HourlyPatternsChart;
