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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

import Header from '../components/Header/Header';
import { Link, Route, Routes } from 'react-router-dom';
import ManagerBrand from './EcommerceAdmin/pageContent/ManagerBrand';
import ManagerCategories from './EcommerceAdmin/pageContent/ManagerCategories';
import ManagerInstrument from './EcommerceAdmin/pageContent/ManagerInstrument';
import ManagerCustomer from './EcommerceAdmin/pageContent/ManagerCustomer';
import UserDetail from '../components/UserDetail/UserDetail';
import ManagerOrder from './EcommerceAdmin/pageContent/ManagerOrder';
import OrderDetail from '../components/OrderDetail/OrderDetail';
import Statistical from './EcommerceAdmin/pageContent/Statistical';
import UserSellTheMost from '../components/EcomStatisticalUser/UserSellTheMost';
import UserSellTheLeast from '../components/EcomStatisticalUser/UserSellTheLeast';
import UserNotSell from '../components/EcomStatisticalUser/UserNotSell';
import RevenueCurrently from '../components/EcomRevenue/RevenueCurrently';
import StatisticalInstrument from '../components/EcomStatisticalInstrument/StatisticalInstrument';
import { images } from '../assets/images/images';
import StatisticalRevenueTime from '../components/EcomRevenueTime/StatisticalRevenueTime';
import StatisticalOrder from '../components/EcomStatisticalOrder/StatisticalOrder';
import StatisticalBrand from '../components/EcomStatisticalBrand/StatisticalBrand';
import StatisticalCategory from '../components/EcomStatisticalCategory/StatisticalCategory';
import { getRevenueCurrently } from '../service/EcommerceStatistical';
import '../pages/EcommerceAdmin/css/Sidebar.css';

const EcommerceAdmin = () => {

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
      <div className="row">
        <div className="sidebar-ecommerce col-lg-2 col-md-3 vh-100">
          {/* Logo */}
          <div className="logo p-3">
            <Link to={"/ecomadmin"}>
              <img src={images.logoAdmin} alt="" width="100%" style={{ paddingLeft: '50px' }} />
            </Link>
          </div>
          {/* Menu */}
          <div className="menu-ecommerce">
            <ul className="">
              <li className="p-3">
                <i className="fa-solid fa-house" />
                <Link to={"/ecomadmin"} className="text-white">
                  Dashboard
                </Link>
              </li>
              <li className="p-3">
                <i className="fa-solid fa-user" />
                <Link to={'/ecomadmin/Customer'} className="text-white">
                  Customer
                </Link>
              </li>
              <li className="p-3">
                <i className="fa-solid fa-music" />
                <Link to={'/ecomadmin/Categories'} className="text-white">
                  Category
                </Link>
              </li>
              <li className="p-3">
                <i className="fa-solid fa-newspaper" />
                <Link to={'/ecomadmin/Brand'} className="text-white">
                  Brand
                </Link>
              </li>
              <li className="p-3">
                <i className="fa-solid fa-headphones" />
                <Link to={'/ecomadmin/Instrument'} className="text-white">
                  Instrument
                </Link>
              </li>
              <li className="p-3">
                <i className="fa-solid fa-circle-play" />
                <Link to={'/ecomadmin/Order'} className="text-white">
                  Order
                </Link>
              </li>
              <li className="p-3">
                <i className="fa-solid fa-chart-simple" />
                <Link to={'/ecomadmin/Statistical'} className="text-white">
                  Statistical
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-10">
          <Header />
          <Routes>
            <Route path='Customer' element={<ManagerCustomer />} />
            <Route path="Customer/detail/:userId" element={<UserDetail />} />

            <Route path='Order' element={<ManagerOrder />} />
            <Route path='Order/detail/:orderId' element={<OrderDetail />} />

            <Route path='Statistical' element={<Statistical />} />
            <Route path='Statistical/sell-the-most' element={<UserSellTheMost />} />
            <Route path='Statistical/sell-the-least' element={<UserSellTheLeast />} />
            <Route path='Statistical/user-not-sell' element={<UserNotSell />} />

            <Route path='Statistical/revenue-currently' element={<RevenueCurrently />} />

            <Route path='Statistical/revenue-according-date/:date' element={<StatisticalRevenueTime />} />
            <Route path='Statistical/revenue-between-date/:startDate/:endDate' element={<StatisticalRevenueTime />} />

            <Route path='Statistical/revenue-by-week/:selectedWeek' element={<StatisticalRevenueTime />} />
            <Route path='Statistical/revenue-between-weeks/:startDate/:endDate' element={<StatisticalRevenueTime />} />

            <Route path='Statistical/revenue-by-month/:year/:month' element={<StatisticalRevenueTime />} />
            <Route path='Statistical/revenue-between-months/:year/:startMonth/:endMonth' element={<StatisticalRevenueTime />} />

            <Route path='Statistical/revenue-by-year/:year' element={<StatisticalRevenueTime />} />
            <Route path='Statistical/revenue-between-years/:startYear/:endYear' element={<StatisticalRevenueTime />} />

            <Route path="Statistical/statistical-order/:type" element={<StatisticalOrder />} />
            <Route path="Statistical/statistical-order/:type" element={<StatisticalOrder />} />
            <Route path="Statistical/statistical-order/:type" element={<StatisticalOrder />} />
            <Route path="Statistical/statistical-order/:type" element={<StatisticalOrder />} />
            <Route path="Statistical/statistical-order/:type" element={<StatisticalOrder />} />
            <Route path="Statistical/statistical-order/:type" element={<StatisticalOrder />} />
            <Route path="Statistical/statistical-order/:type" element={<StatisticalOrder />} />
            <Route path="Statistical/statistical-order/:type" element={<StatisticalOrder />} />
            <Route path="Statistical/statistical-order/:type" element={<StatisticalOrder />} />
            <Route path="Statistical/statistical-order/:type" element={<StatisticalOrder />} />

            <Route path='Statistical/statistical-instrument' element={<StatisticalInstrument />} />
            <Route path='Statistical/statistical-brand' element={<StatisticalBrand />} />
            <Route path='Statistical/statistical-category' element={<StatisticalCategory />} />

            <Route path='Brand' element={<ManagerBrand />} />
            <Route path='Categories' element={<ManagerCategories />} />
            <Route path='Instrument' element={<ManagerInstrument />} />
          </Routes>

          
        </div>
      </div>
    </div>
  );
};

export default EcommerceAdmin;
