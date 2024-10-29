import React, { useEffect, useState } from "react"
import Header from '../components/Header/Header'
import { Link,Route, Routes } from 'react-router-dom'
import ManagerBrand      from './EcommerceAdmin/pageContent/MangerBrand'
import ManagerCategories from './EcommerceAdmin/pageContent/ManagerCategories'
import ManagerInstrument from './EcommerceAdmin/pageContent/ManagerInstrument'
import Dashboard         from './EcommerceAdmin/pageContent/DashBoard'
import MangerUser        from './EcommerceAdmin/pageContent/MangerUser'
import DetailUser        from './EcommerceAdmin/pageContent/ManagerCustomerDetail';

const EcommerceAdmin = () => {


  return (
    <div>
        <div className="row">
        <div className="sidebar21 col-lg-2 col-md-3 vh-100">
      {/* Logo */}
      <div className="logo p-3">
        <a href="#">
          <img src="admin.png" alt="" width="100%" />
        </a>
      </div>
      {/* Menu */}
      <div className="menu21">
        <ul className="list-unstyled ">
          <li className="p-3" >
            <i className="fa-solid fa-house" />
            <Link to={'/ecomadmin/Dashboard'} className="text-white">
            Dashboard
            </Link>
          </li>
          <li className="p-3">
            <i className="fa-solid fa-user" />
            <Link to={'/ecomadmin/MangerUser'} className="text-white">
            Customer
            </Link>

          </li>
          <li className="p-3">
            <i className="fa-solid fa-music" />
            <Link to={'/ecomadmin/Categories'} className="text-white">
              Categories
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
            <a href="/ecomadmin/Bill" className="text-white">
              Bill
            </a>
          </li>
          <li className="p-3">
            <i className="fa-solid fa-chart-simple" />
            <a href="/ecomadmin/Statistical" className="text-white">
              Statistical
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div className="col-10">
        <Header />
        <Routes>
      <Route path='Brand' element={<ManagerBrand />} />
      <Route path='Categories' element={<ManagerCategories />} />
      <Route path='Instrument' element={<ManagerInstrument/>} />
      <Route path='Dashboard' element={<Dashboard/>} />
      <Route path='MangerUser' element={<MangerUser/>} />
      <Route path='detailUser/:id' element={<DetailUser />} /> 
    </Routes>
    </div>
        </div>
        


    </div>
  )
}

export default EcommerceAdmin
