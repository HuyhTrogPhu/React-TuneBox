import React from "react";
import { Route, Routes, Outlet, useParams, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Ecommerce/Home/Home";
import Shop from "./pages/Ecommerce/Shop/Shop";
import HomeFeed from "./pages/SocialMedia/Feed";
import ProfileUser from "./pages/SocialMedia/Profile/ProfileUser";
import ProfileSetting from "./pages/SocialMedia/Profile/ProfileSetting";
import Talent from "./pages/GioiThieu/Talent";
import UserInfomation from "./pages/GioiThieu/UserInformation";
import SignUp from "./pages/GioiThieu/SignUp";
import Login from "./pages/GioiThieu/Login";
import Introduce from "./pages/GioiThieu/Introduce";
import Cart from "./pages/Ecommerce/Cart/Cart";
import CartDetail from "./pages/Ecommerce/Cart/Cart_detail";
import DetailProduct from "./pages/Ecommerce/ShopDetail/DetailProduct";
import InspiredBy from "./pages/GioiThieu/InspiredBy";
import Genre from "./pages/GioiThieu/Genre";
import EcommerceAdmin from "./pages/EcommerceAdmin";
import BrandPage from "./pages/Ecommerce/BrandPage/BrandPage";
import CategoryPage from "./pages/Ecommerce/CategoryPage/CategoryPage";
import BrandDetail from "./pages/Ecommerce/BrandPage/BrandDetail";
import CategoryPageDetail from "./pages/Ecommerce/CategoryPage/CategoryPageDetail";
import OtherUserProfile from "./pages/SocialMedia/Profile/OtherUserProfile";
import WelcomeUser from "./pages/GioiThieu/WelcomeUser";
import ResetPassword from "./pages/GioiThieu/ResetPassword";
import ForgotPassword from "./pages/GioiThieu/ForgotPassword";
import { FollowProvider } from "./pages/SocialMedia/Profile/FollowContext";
import TrackDetail from "./pages/SocialMedia/Profile/Profile_nav/TrackDetail";

import AlbumNew from "./pages/SocialMedia/Profile/Profile_nav/AlbumNew";
import AlbumEdit from "./pages/SocialMedia/Profile/Profile_nav/AlbumEdit";
import AlbumDetail from "./pages/SocialMedia/Profile/Profile_nav/AlbumDetail";
import LikePost from "./pages/SocialMedia/Profile/Profile_nav/LikePost";
import LikeAlbums from "./pages/SocialMedia/Profile/Profile_nav/likeAlbums";
import LikePlaylists from "./pages/SocialMedia/Profile/Profile_nav/likePlaylist";
import PlayListDetail from "./pages/SocialMedia/Profile/Profile_nav/PlaylistDetail";

import SearchForm from "./pages/SocialMedia/Profile/SearchForm";

import CheckOut from "./pages/Ecommerce/CheckOut/CheckOut";
import OrderDetail from "./pages/Ecommerce/order/OrderDetail";
import ThanhCong from "./pages/Ecommerce/order/doneOr";
//import UserDetail from "./components/UserDetail/UserDetail";
import Post from "./pages/SocialMedia/Post";
import FriendRequests from "./pages/SocialMedia/FriendRequests";
import FriendList from "./pages/SocialMedia/FriendList";
import FollowersPage from "./pages/SocialMedia/FollowersPage";
import FollowingPage from "./pages/SocialMedia/FollowingPage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { getUserRole, isUserRole } from './service/auth';
import Chat from "./pages/SocialMedia/chat/chat";
import SocialMediaAdmin from "./pages/SocialMediaAdmin";
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
  const { orderId } = useParams();

  return (
    <FollowProvider>
      {" "}
      {/* Đặt FollowProvider ở đây */}
      <div>
        <div className="">
          <Routes>
            {/* Các route có Header */}
            <Route element={<LayoutWithHeader />}>
              <Route path="/" element={<HomeFeed />} />
              <Route path="/HomeEcommerce" element={<Home />} />
              <Route path="/Shop" element={<Shop />} />
              <Route path="/profileUser/*" element={<ProfileUser />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/profileUser" element={<ProfileUser />} />
              <Route path="/profileSetting" element={<ProfileSetting />} />
              <Route path="/CartDetail" element={<CartDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/DetailProduct/:id" element={<DetailProduct />} />
              <Route path="/BrandPage" element={<BrandPage />} />
              <Route path="/brand-detail" element={<BrandDetail />} />
              <Route path="/albums/create-newAlbum" element={<AlbumNew />} />
              <Route path="/chat" element={<Chat />} />
              <Route
                path="/albums/album-Edit/:albumId"
                element={<AlbumEdit />}
              />
              <Route path="/album/:id" element={<AlbumDetail />} />
              <Route
                path="/InstrumentBelongCategory"
                element={<CategoryPageDetail />}
              />
              <Route path="/profile/:id/*" element={<OtherUserProfile />} />
              <Route path="/track/:id" element={<TrackDetail />} />
              <Route path="/checkOut" element={<CheckOut />} />
              <Route path="/orderDetail/:orderId" element={<OrderDetail />} />
              <Route path="/doneorder" element={<ThanhCong />} />
              <Route path="/post/:postIdurl" element={<Post />} />
              <Route path="/FriendRequests" element={<FriendRequests />} />
              <Route path="/FriendList/:userId" element={<FriendList />} />
              <Route path="/Follower/:userId" element={<FollowersPage />} />
              <Route path="/Following/:userId" element={<FollowingPage />} />
              <Route path="/likepost" element={<LikePost />} />
              <Route path="/likeAlbums" element={<LikeAlbums />} />
              <Route path="/likePlaylist" element={<LikePlaylists />} />
              <Route path="/playlist/:id" element={<PlayListDetail />} />
              <Route path="/search" element={<SearchForm />} />
            </Route>

            {/* Các route không có Header */}
            <Route element={<LayoutWithoutHeader />}>
              <Route path="/introduce" element={<Introduce />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/userInfor" element={<UserInfomation />} />
              <Route path="/talent" element={<Talent />} />
              <Route path="/inspiredBy" element={<InspiredBy />} />
              <Route path="/genre" element={<Genre />} />
              <Route path="/welcome" element={<WelcomeUser />} />
              {/* admin start */}
              {/* Route bảo vệ với quyền 'EcomAdmin' */}
              <Route element={<ProtectedRoute allowedRole="ECOMADMIN" />}>
                <Route path="/ecomadmin/*" element={<EcommerceAdmin />} />
              </Route>
              {/* admin end */}
              <Route path="/socialadmin/*" element={<SocialMediaAdmin />} />

            </Route>
          </Routes>
        </div>
      </div>
    </FollowProvider>
  );
}

export default App;