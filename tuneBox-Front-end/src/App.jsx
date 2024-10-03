import React, { useState } from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Ecommerce/Home/Home";
import Shop from "./pages/Ecommerce/Shop/Shop";
import HomeFeed from "./pages/SocialMedia/Feed";
import ProfileUser from "./pages/SocialMedia/Profile/ProfileUser";
import ProfileSetting from "./pages/SocialMedia/Profile/ProfileSetting";
import SoThich from "./pages/GioiThieu/SoThich";
import CreateUsername from "./pages/GioiThieu/CreateUsername";
import SignUp from "./pages/GioiThieu/SignUp";
import Login from "./pages/GioiThieu/Login";
import GioiThieu from "./pages/GioiThieu/GioiThieu";
import Cart from "./pages/Ecommerce/Cart/Cart";
import CartDetail from "./pages/Ecommerce/Cart/Cart_detail";
import DetailProduct from "./components/Sellwell/DetailProduct";
import NgheSiYeuThich from "./pages/GioiThieu/NgheSiYeuThich";
import TheLoaiNhacYeuThich from "./pages/GioiThieu/TheLoaiNhacYeuThich";
<<<<<<< HEAD
import EcommerceAdmin from './pages/EcommerceAdmin'
import PostAudio from "./pages/SocialMedia/Profile/Profile_nav/PostAudio";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
=======
import EcommerceAdmin from "./pages/EcommerceAdmin";
import ResetPassword from "./pages/GioiThieu/ResetPassword";
import ForgotPassword from "./pages/GioiThieu/ForgotPassword";

>>>>>>> Gia-Bao
// Layout có Header
function LayoutWithHeader() {
  return (
    <>
      <Navbar />
      <Outlet /> {/* Nơi các component con sẽ được render */}
    </>
  );
}
function LayoutWithoutHeader() {
  return (
    <>
      <Outlet /> {/* Chỉ render component con mà không có Header */}
    </>
  );
}


function App() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userName: "",
    userNickname:"",
    listInspiredBy: [], // Chứa danh sách
    listTalent: [],
    genreBy: [], 
  });

  const updateFormData = (data) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, ...data };
      console.warn(formData);
      return updatedData;
    });
  };

  return (
    <div>
      <div className="">
        <Routes>
          {/* Các route có Header */}
          <Route element={<LayoutWithHeader />}>
            <Route path="/" element={<HomeFeed />} />
            <Route path="/HomeEcommerce" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/profileUser" element={<ProfileUser />} />
            <Route path="/profileSetting" element={<ProfileSetting />} />
            <Route path="/CartDetail" element={<CartDetail />} />
<<<<<<< HEAD
            <Route path="cart" element={<Cart />} />
            <Route path="postAudio" element={<PostAudio />} />
=======
            <Route path="/cart" element={<Cart />} />
>>>>>>> Gia-Bao
            <Route path="/DetailProduct" element={<DetailProduct />} />
          </Route>

          {/* Các route không có Header */}
          <Route element={<LayoutWithoutHeader />}>
            <Route path="/gioithieu" element={<GioiThieu />} />
            <Route path="/signup" element={<SignUp updateFormData={updateFormData}/>} />
            <Route path="/login" element={<Login />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="/createusername" element={<CreateUsername updateFormData={updateFormData} formData={formData} />} />
            <Route path="/talent" element={<SoThich updateFormData={updateFormData} formData={formData}/>} />
            <Route path="/artist" element={<NgheSiYeuThich updateFormData={updateFormData}/>} />
            <Route path="/categorymusic" element={<TheLoaiNhacYeuThich updateFormData={updateFormData}/>} />

            {/* admin start */}
            <Route path="/ecomadmin/*" element={<EcommerceAdmin />} />
            {/* admin end */}
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
