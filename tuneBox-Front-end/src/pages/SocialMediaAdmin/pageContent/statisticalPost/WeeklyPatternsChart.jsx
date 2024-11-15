import React from 'react';
import { AreaChart, Area,BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const WeeklyPatternsChart = ({ data, secondaryColor, CustomTooltip }) => {
  // Transform weekly patterns data
  const transformedData = Object.entries(data || {}).map(([week, count]) => ({
    week: `Week ${week}`,
    posts: count
  })).sort((a, b) => parseInt(a.week.split(' ')[1]) - parseInt(b.week.split(' ')[1]));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={transformedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" />
        <YAxis />
        <Tooltip content={CustomTooltip} />
        <Bar dataKey="posts" fill={secondaryColor} name="Posts" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WeeklyPatternsChart;
