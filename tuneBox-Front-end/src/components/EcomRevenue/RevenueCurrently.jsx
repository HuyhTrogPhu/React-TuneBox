import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { getRevenueCurrently } from '../../service/EcommerceStatistical';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RevenueCurrently = () => {
  const [revenueData, setRevenueData] = useState({
    revenueOfDay: 0,
    revenueOfWeek: 0,
    revenueOfMonth: 0,
    revenueOfYear: 0,
  });

  useEffect(() => {
    getRevenueCurrently().then((response) => {
      setRevenueData(response.data);
    }).catch((error) => console.error("Error fetching revenue data:", error));
  }, []);

  // Configurations for each line chart
  const createChartData = (label, data) => ({
    labels: ['Start', 'Current'],
    datasets: [
      {
        label,
        data,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  });

  return (
    <div>
      <h3>Revenue Overview</h3>
      <div className='row'>
        <section className='col-6'>
          <h6>Revenue of Day: {(revenueData.revenueOfDay || 'no data').toLocaleString('vi')} VND</h6>
          <Line data={createChartData('Revenue of Day', [0, revenueData.revenueOfDay])} />
        </section>
        <section className='col-6'>
          <h6>Revenue of Week: {(revenueData.revenueOfWeek || 'no data').toLocaleString('vi')} VND</h6>
          <Line data={createChartData('Revenue of Week', [0, revenueData.revenueOfWeek])} />
        </section>
        <section className='col-6'>
          <h6>Revenue of Month: {(revenueData.revenueOfMonth || 'no data').toLocaleString('vi')} VND</h6>
          <Line data={createChartData('Revenue of Month', [0, revenueData.revenueOfMonth])} />
        </section>
        <section className='col-6'>
          <h6>Revenue of Year: {(revenueData.revenueOfYear || 'no data').toLocaleString('vi')} VND</h6>
          <Line data={createChartData('Revenue of Year', [0, revenueData.revenueOfYear])} />
        </section>
      </div>
    </div>
  );
};

export default RevenueCurrently;
