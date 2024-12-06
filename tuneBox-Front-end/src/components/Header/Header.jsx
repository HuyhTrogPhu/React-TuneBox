import React, { useEffect, useState } from 'react';
import './Header.css';
import { images } from '../../assets/images/images';
import { getUserInfo } from '../../service/UserService'; // Hàm gọi API để lấy thông tin người dùng
import Cookies from "js-cookie";
const Header = () => {
  const [username, setUsername] = useState(''); 
  const userIdCookie = Cookies.get("userId");
  const [userData, setUserData] = useState({});

  // Hàm lấy userID từ cookie
  const getUserIDFromCookie = () => {
    const match = document.cookie.match(new RegExp('(^| )userID=([^;]+)'));
    return match ? match[2] : null;
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (userIdCookie) {
          try {
              const userData = await getUserInfo(userIdCookie);
              setUserData(userData);
              console.log("User data fetched from API:", userData);
  
              // Lấy số lượng bạn bè
              const count = await getFriendCount(userIdCookie);
              console.log('Fetched friend count:', count); // Log giá trị friend count
              setFriendCount(count); // Cập nhật số lượng bạn bè
              console.log('Updated friend count state:', count); // Log trạng thái bạn bè
          } catch (error) {
              console.error("Error fetching user", error);
          }
      }
  };  
  
    fetchUser();
  }, [userIdCookie]);

  return (
    <div className="topbar d-flex justify-content-end align-items-center p-3 bg-light border-bottom">
      <div className="">
        <a
          href="#"
          
          id="userDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
         {userData.name}
          <img
            src={userData.avatar}
            className="rounded-pill ms-2"
            alt="User Image"
            style={{ width: 30, height: 30 }}
          />
        </a>
      
       
      </div>
    </div>
  );
};

export default Header;
