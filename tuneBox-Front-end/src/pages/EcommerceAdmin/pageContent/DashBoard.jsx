import React, { useEffect, useState } from "react";
import { Line } from 'react-chartjs-2';
const Dashboard = ({ revenueData }) => {
  const createChartData = (label, data, labels) => ({
    labels,
    datasets: [
      {
        label,
        data,
        borderColor: 'rgb(233,79,55,1)',
        backgroundColor: 'rgb(233,79,55,0.5)',
        fill: true,
        tension: 0.4,
      },
    ],
  });

  return (
    <div style={{backgroundColor: 'white', padding: '50px'}}>
      <h3 className="text-center">Revenue Overview</h3>
      <div className="row">
        <section className="col-6">
          <h6>Today: <span style={{ color: '#E94F37' }}>{(revenueData.revenueOfDay || 'no data').toLocaleString('vi')} VND</span></h6>
          <Line data={createChartData('Revenue of Day', [0, revenueData.revenueOfDay], ['Start of Day', 'Now'])} />
        </section>
        <section className="col-6">
          <h6>This Week: <span style={{ color: '#E94F37' }}>{(revenueData.revenueOfWeek || 'no data').toLocaleString('vi')} VND</span></h6>
          <Line data={createChartData('Revenue of Week', [0, revenueData.revenueOfWeek / 2, revenueData.revenueOfWeek], ['Start of Week', 'Mid Week', 'Now'])} />
        </section>
        <section className="col-6">
          <h6>This Month: <span style={{ color: '#E94F37' }}>{(revenueData.revenueOfMonth || 'no data').toLocaleString('vi')} VND</span></h6>
          <Line data={createChartData('Revenue of Month', [0, revenueData.revenueOfMonth / 2, revenueData.revenueOfMonth], ['Start of Month', 'Mid Month', 'Now'])} />
        </section>
        <section className="col-6">
          <h6>This Year: <span style={{ color: '#E94F37' }}>{(revenueData.revenueOfYear || 'no data').toLocaleString('vi')} VND</span></h6>
          <Line data={createChartData('Revenue of Year', [0, revenueData.revenueOfYear / 2, revenueData.revenueOfYear], ['Start of Year', 'Mid Year', 'Now'])} />
        </section>
      </div>
    </div>
  );
};


export default Dashboard;
