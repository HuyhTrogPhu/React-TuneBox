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

  // Generate chart data with time-based labels
  const createChartData = (label, data, labels) => ({
    labels,
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
          <Line data={createChartData('Revenue of Day', [0, revenueData.revenueOfDay], ['Start of Day', 'Now'])} />
        </section>
        <section className='col-6'>
          <h6>Revenue of Week: {(revenueData.revenueOfWeek || 'no data').toLocaleString('vi')} VND</h6>
          <Line data={createChartData('Revenue of Week', [0, revenueData.revenueOfWeek / 2, revenueData.revenueOfWeek], ['Start of Week', 'Mid Week', 'Now'])} />
        </section>
        <section className='col-6'>
          <h6>Revenue of Month: {(revenueData.revenueOfMonth || 'no data').toLocaleString('vi')} VND</h6>
          <Line data={createChartData('Revenue of Month', [0, revenueData.revenueOfMonth / 2, revenueData.revenueOfMonth], ['Start of Month', 'Mid Month', 'Now'])} />
        </section>
        <section className='col-6'>
          <h6>Revenue of Year: {(revenueData.revenueOfYear || 'no data').toLocaleString('vi')} VND</h6>
          <Line data={createChartData('Revenue of Year', [0, revenueData.revenueOfYear / 2, revenueData.revenueOfYear], ['Start of Year', 'Mid Year', 'Now'])} />
        </section>
      </div>
    </div>
  );
};

export default RevenueCurrently;
