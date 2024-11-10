import React, { useEffect, useState } from "react";
import { images } from "../../../assets/images/images";
import { useNavigate } from "react-router-dom";
import {
  LoadAllPost,
  LoadAllUser,
} from "../../../service/SocialMediaAdminService";
const Users = () => {
  const [AllUser, setAllUser] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [NewUser, setNewUser] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [postCount, setPostCount] = useState(0);
  const usersPerPage = 5;
  const navigate = useNavigate();
  //bat dau useEffect
  useEffect(() => {
    const fetchData = async () => {
      // Gọi API load all user
      const responseLoadAllUser = await LoadAllUser();
      console.log("All user:", responseLoadAllUser);
      if (responseLoadAllUser.status) {
        setAllUser(responseLoadAllUser.data);
        console.log(AllUser);
        // Lấy 5 user mới nhất
        const lastFiveUsers = AllUser.slice(-5);
        setNewUser(lastFiveUsers);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const calculatePostCounts = async () => {
      const allPosts = await LoadAllPost();
      const usersWithPosts = AllUser.map((user) => {
        const userPostCount = allPosts.data.filter(
          (post) => post.userId === user.id
        ).length;
        return { ...user, totalPosts: userPostCount };
      });
  
      setAllUser(usersWithPosts);
    };
  
    if (AllUser.length > 0) {
      calculatePostCounts();
    }
    const lastFiveUsers = AllUser.slice(-5);
    setNewUser(lastFiveUsers);
  }, [AllUser]);
  
  

  //count cho table all user
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  //loc danh sach all user
  const filteredUsers = AllUser.filter((user) =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  //lay ra user da tim kiem
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container mt-4">
      <div className="row">
        {/* New Users */}
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-dark text-white">
              <h5 className="text-light">New Users</h5>
            </div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Follower</th>
                    <th>Following</th>
                    <th>Total Post</th>
                    <th>Total Track</th>
                    <th>Total Oders</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {NewUser.map((user) => (
                    <tr key={user.id}>
                      <td>{user.userName}</td>
                      <td>{user.followers.length}</td>
                      <td>{user.following.length}</td>
                      <td>{user.totalPosts}</td>
                      <td>{user.tracks.length}</td>
                      <td>{user.orderList.length}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            navigate(`/socialadmin/detailUser/${user.id}`)
                          }
                        >
                          Views
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* ALl USER */}
        <div className="col-md-6">
        <div className="card mb-4">
            <div className="card-header bg-dark text-white">
              <h5 className="text-light">All Users</h5>
            </div>
            <div className="card-body">
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-secondary" style={{ marginTop: 10 }}>
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </div>
              <div>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Follower</th>
                      <th>Following</th>
                      <th>Total Post</th>
                      <th>Total Track</th>
                      <th>Total Oders</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      currentUsers.map((user) => (
                        <tr key={user.id}>
                          <td>{user.userName}</td>
                          <td>{user.followers.length}</td>
                          <td>{user.following.length}</td>
                          <td>{user.totalPosts}</td>
                          <td>{user.tracks.length}</td>
                          <td>{user.orderList.length}</td>
                          <td>
                            <button
                              className="btn btn-danger"
                              onClick={() =>
                                navigate(`/socialadmin/detailUser/${user.id}`)
                              }
                            >
                              Views
                            </button>
                          </td>
                        </tr>
                      ))
}
                  </tbody>
                </table>
                <nav>
                  <ul className="pagination">
                    {pageNumbers.map((page) => (
                      <li
                        key={page}
                        className={`page-item ${
                          page === currentPage ? "active" : ""
                        }`}
                      >
                        <button
                          onClick={() => setCurrentPage(page)}
                          className="page-link"
                        >
                          {page}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
          </div>
      </div>
    </div>
  );
};

export default Users;
