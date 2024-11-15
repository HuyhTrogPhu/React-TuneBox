import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,LineChart, Line, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#FF7F50', '#FFA07A', '#FF8C00', '#FFD700'];

const DailyPatternsChart = ({ data, CustomTooltip }) => {
  // Transform daily patterns data
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const transformedData = Object.entries(data || {}).map(([day, count]) => ({
    day: daysOfWeek[parseInt(day)],
    posts: count
  })).sort((a, b) => daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={transformedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip content={CustomTooltip} />
        <Line type="monotone" dataKey="posts" stroke="#FF8C00" name="Posts" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DailyPatternsChart;
