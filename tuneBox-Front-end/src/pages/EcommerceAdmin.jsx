import React from 'react';
import Header from '../components/Header/Header';
import { Link, Route, Routes } from 'react-router-dom';
import ManagerBrand from './EcommerceAdmin/pageContent/MangerBrand';
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

const EcommerceAdmin = () => {
  return (
    <div>
      <div className="row">
        <div className="sidebar21 col-lg-2 col-md-3 vh-100">
          {/* Logo */}
          <div className="logo p-3">
            <a href="#" style={{}}>
              <img src={images.logoAdmin} alt="" width="100%" style={{paddingLeft: '50px'}} />
            </a>
          </div>
          {/* Menu */}
          <div className="menu21">
            <ul className="list-unstyled ">
              <li className="p-3">
                <i className="fa-solid fa-house" />
                <a href="/ecomadmin" className="text-white">
                  Dashboard
                </a>
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

            <Route path='Statistical/statistical-instrument' element={<StatisticalInstrument />} />

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
