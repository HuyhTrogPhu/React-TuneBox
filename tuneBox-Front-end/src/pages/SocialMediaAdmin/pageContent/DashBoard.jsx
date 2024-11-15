import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
  const [countUser, setcountUser] = useState(0);
  const [postData, setPostData] = useState([]);
  const [sortedUsers, setSortedUsers] = useState([]);
  const [AllUser, setAllUser] = useState([]);
  const [track, setTrack] = useState([]);
  const navigate = useNavigate();
  //count User API
  const LoadCount = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8082/SocialAdmin/static/countUser`,
        { withCredentials: true }
      );
      const data = response.data;
      console.log("CountUser:", data);
      return data;
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  //get all post API
  const LoadAllPost = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8082/SocialAdmin/static/getAllpost`,
        { withCredentials: true }
      );
      const data = response.data;
      console.log("AllPost:", data);
      return data;
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  //get by ID UserAPI
  const LoadUserbyID = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:8082/SocialAdmin/static/getUs/${userId}`,
        { withCredentials: true }
      );
      const data = response.data;
      console.log("user:", data);
      return data;
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  //get all User API
  const LoadAllUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8082/SocialAdmin/static/getAllUser`,
        { withCredentials: true }
      );
      const data = response.data;
      return data;
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };


  const LoadAllTrack = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8082/SocialAdmin/static/getAllTrack`,
        { withCredentials: true }
      );
      const data = response.data;
      return data;
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  //bat dau useEffect
  useEffect(() => {
    const fetchData = async () => {
      // Gọi API load số user
      const responseLoadCount = await LoadCount();
      console.log("Tổng số user:", responseLoadCount);
      if (responseLoadCount.status) {
        setcountUser(responseLoadCount.data);
        
      }
       //goi API reported
      const responseReported = await LoadAllTrack();
      console.log("Tổng số user reported:", responseReported);
      if (responseReported.status) {
        setTrack(responseReported.data);
      }

      // Gọi API load all user
      const responseLoadAllUser = await LoadAllUser();
      console.log("All user:", responseLoadAllUser);
      if (responseLoadCount.status) {
        setAllUser(LoadAllUser.data);
        console.log(countUser);
      }

      // Gọi API load tất cả post
      const responseLoadAllPost = await LoadAllPost();
      console.log("AllPost:", responseLoadAllPost);
      const data = responseLoadAllPost.data;
      console.warn(data);
      if (responseLoadAllPost.status) {
        setPostData(data);

        // count
        const userPostCount = data.reduce((acc, post) => {
          const { userId } = post;
          if (!acc[userId]) {
            acc[userId] = { userId, postCount: 0, userName: null };
          }
          acc[userId].postCount += 1;
          return acc;
        }, {});

        // lay thong tin tu API
        const userPostCountArray = Object.values(userPostCount);
        const userInfoPromises = userPostCountArray.map(async (user) => {
          const userData = await LoadUserbyID(user.userId); // Gọi API lấy thông tin user
          return { ...user, userName: userData.userName }; // Cập nhật userName
        });

        // Promise đợi API xong
        const updatedUserPostCount = await Promise.all(userInfoPromises);

        // sort
        const sortedUsersArray = updatedUserPostCount.sort(
          (a, b) => b.postCount - a.postCount
        );
        setSortedUsers(sortedUsersArray);
        console.log("Người dùng được sắp xếp:", sortedUsersArray);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mt-4">
      {/* Top Statistics */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center bg-dark text-white">
            <div className="card-body">
              <h5 className="text-light">Total Users</h5>
              <h2 className="text-light">{countUser}</h2>
               
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center bg-dark text-white">
            <div className="card-body">
              <h5 className="text-light">Total Post</h5>
              <h2 className="text-light">{postData.length}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center bg-dark text-white">
            <div className="card-body">
              <h5 className="text-light">Total track</h5>
              <h2 className="text-light">{track.length}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
