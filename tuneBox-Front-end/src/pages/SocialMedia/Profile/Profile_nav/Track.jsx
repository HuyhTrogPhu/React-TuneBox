import { useEffect, useState } from 'react';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Cookies from 'js-cookie';



const Track = () => {
  const [tracks, setTracks] = useState([]); // State để lưu các Track
  const [userName, setUserName] = useState(""); // State cho username
  const userId = Cookies.get("UserID");

  // Hàm để lấy các Track
  const fetchTrack = async () => {
    try {
      if (!userId) throw new Error("User ID not found.");

      const response = await axios.get(`http://localhost:8080/tracks/user/${userId}`, { 
        withCredentials: true 
      });

      const sortedTrack = response.data.sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
      setTracks(sortedTrack);
    } catch (error) {
      console.error('Error fetching Track:', error.response?.data || error.message);
    }
  };

  // Hàm để xóa Track
  const deleteTrack = async (trackId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this Track?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8080/tracks/${trackId}`, { withCredentials: true });
      console.log('Track deleted successfully');
      fetchTrack(); // Cập nhật danh sách track sau khi xóa
    } catch (error) {
      console.error('Error deleting track:', error.response?.data || error.message);
    }
  };

  // Gọi hàm fetchTrack khi component được mount
  useEffect(() => {
    fetchTrack();
  }, []);

  // Hàm để lấy thông tin người dùng từ API
  const fetchUserName = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/user/current`, {
        params: { userId },
        withCredentials: true,
      });
      console.log('Response track user:', response.data);
      return response.data.userName; 
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  // Gọi fetchUserName khi component được mount
  useEffect(() => {
    const getUserName = async () => {
      try {
        const name = await fetchUserName();
        setUserName(name); 
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };

    getUserName();
  }, []);

  return (
    <div>
      {tracks.map((track) => {
        return (
          track.status && (
            <div key={track.id} className="post-header-track">
              <img src={track.trackImage || "/src/UserImages/Avatar/avt.jpg"} className="avatar_small" alt="Avatar" />
              <div className="info">
                <div className="name">{track.name || 'Unknown Track'}</div>
                <div className="author">{userName || 'Unknown userName'}</div>
              </div>
              <div className='btn-group' style={{ marginLeft: 25 }}>
                <button className="btn dropdown-toggle no-border" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>
                <ul className="dropdown-menu dropdown-menu-lg-end">
                  <li><a className="dropdown-item" href="#">Edit</a></li>
                  <li><a className="dropdown-item" onClick={() => deleteTrack(track.id)}>Delete</a></li>
                </ul>
              </div>
            </div>
          )
        );
      })}
    </div>
  );
};

export default Track;
