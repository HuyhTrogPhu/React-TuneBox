import React from 'react'
import './Header.css'
import { images } from '../../assets/images/images';
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const Header = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    
    Cookies.remove("TokenADMIN");
    navigate("/ecomadminlogin");
  };


  return (
    <div className="topbar d-flex justify-content-end align-items-center p-3 bg-light border-bottom">
      <div className="dropdown">
        <a
          href="#"
          className="dropdown-toggle"
          id="userDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          User name
          <img
            src={images.avt}
            className="rounded-pill ms-2"
            alt="User Image"
            style={{ width: 30, height: 30 }}
          />
        </a>
        <ul
          className="dropdown-menu dropdown-menu-end"
          aria-labelledby="userDropdown"
        >
          <li>
            <a className="dropdown-item" href="#">
              Profile
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#" onClick={handleLogout}> 
              Log Out
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Header
