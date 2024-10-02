import { useEffect, useState } from 'react';
import axios from "axios";
// import { format } from 'date-fns';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Track = () => {
  const[tracks, setTracks] = useState([]); // State để lưu các Track
  const [userName, setUserName] = useState(""); // State cho username

   // Hàm để lấy các bài viết
   const fetchTrack = async () => {
    try {
      const response = await axios.get('http://localhost:8080/profileUser/track/getAll', {
        withCredentials: true,
      });
      console.log('Response data:', response.data);
  
      // Sắp xếp các Track theo thời gian tạo (mới nhất lên đầu)
      const sortedTrack = response.data.sort((a, b) => {
        // Chuyển đổi createDate sang định dạng có thể so sánh
        const dateA = new Date(a.createDate[0], a.createDate[1] - 1, a.createDate[2], a.createDate[3], a.createDate[4], a.createDate[5]);
        const dateB = new Date(b.createDate[0], b.createDate[1] - 1, b.createDate[2], b.createDate[3], b.createDate[4], b.createDate[5]);
  
        return dateB - dateA; // Sắp xếp từ mới đến cũ
      });
  
      setTracks(sortedTrack); // Chỉ lưu các TRack đã được sắp xếp
    } catch (error) {
      console.error('Error fetching Track:', error);
    }
  };

  // Gọi hàm fetchTrack khi component được mount
  useEffect(() => {
    fetchTrack();
  }, []);


  // Hàm để lấy thông tin người dùng từ API
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('http://localhost:8080/User/current', { withCredentials: true });
      setUserName(response.data.userName); // Giả sử response.data chứa tên người dùng

    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  // Gọi fetchUserInfo khi component được mount
  useEffect(() => {
    fetchUserInfo();
  }, []);


   // Hàm xóa TRack
  const DeleteTrack = async (trackId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this Track?'); // Xác nhận xóa
    if (!confirmDelete) return; // Nếu người dùng không xác nhận, dừng lại

    try {
      await axios.delete(`http://localhost:8080/profileUser/track/${trackId}`, { withCredentials: true });
      console.log('Post deleted successfully');
      fetchTrack(); // Cập nhật danh sách track sau khi xóa
    } catch (error) {
      console.error('Error deleting track:', error.response?.data || error.message);
    }
  };
  
  return (
    <div>
        {tracks.map((track) => {
       
            // Chuyển đổi createdDate về định dạng Date
            {/* const createdDate = track.createDate
                ? new Date(track.createDate[0], track.createDate[1] - 1, track.createDate[2], 
                            track.createDate[3] || 0, track.createDate[4] || 0, track.createDate[5] || 0)
                : null; */}
            return (
              track.status && (
                <div key={track.id} className="post-header-track">
                    <img src={track.trackImage || "/src/UserImages/Avatar/avt.jpg"} className="avatar_small" alt="Avatar" />
                    <div className="info">
                        <div className="name">{track.name || 'Unknown Track'}</div>
                        <div className="author">{userName || 'Unknown userName'}</div>
                    </div>
                    {/* <div className="time">
                        {createdDate ? format(createdDate, 'hh:mm a, dd MMM yyyy') : 'Invalid date'}
                    </div> */}
                    <div className='btn-group' style={{ marginLeft: 25 }}>
                        <button className="btn dropdown-toggle no-border" type="button" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
                        </button>
                          <ul className="dropdown-menu dropdown-menu-lg-end">
                           <li><a className="dropdown-item" href="#">Edit</a></li>
                           <li><a className="dropdown-item" onClick={() => DeleteTrack(track.id)}>Delete</a></li>
                          </ul>
              
                    </div>
                    
                </div>
              )
            );
        })}
    </div>
  );

}
export default Track;
