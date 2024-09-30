import React, { useEffect, useState } from 'react';
import { images } from "../../assets/images/images";
import axios from 'axios';

import "./css/mxh/style.css"
import "./css/mxh/post.css"
import "./css/mxh/modal-create-post.css"
import "./css/profile.css"
import "./css/mxh/comment.css"
import "./css/mxh/button.css"


const HomeFeed = () => {
  const [postContent, setPostContent] = useState(''); // State cho nội dung bài viết
  const [postImages, setPostImages] = useState([]); // State cho ảnh bài viết
  const [posts, setPosts] = useState([]); // State để lưu các bài viết
  // Phần js để hiện post modal
  useEffect(() => {
    const createPostBtn = document.getElementById('create-post-btn');
    const postModal = document.getElementById('post-modal');
    const closeModal = document.getElementById('close-modal');

    const openModal = () => postModal.style.display = 'flex';
    const closePostModal = () => {
      postModal.style.display = 'none';
      resetForm();
    };

    if (createPostBtn && postModal && closeModal) {
      createPostBtn.addEventListener('click', openModal);
      closeModal.addEventListener('click', closePostModal);

      return () => {
        createPostBtn.removeEventListener('click', openModal);
        closeModal.removeEventListener('click', closePostModal);
      };
    } else {
      console.error('One or more elements not found');
    }
  }, []); // Chạy effect một lần khi component mount

  // Hàm để reset form
  const resetForm = () => {
    setPostContent('');
    setPostImages([]);
  };

  // Hàm để lấy các bài viết
  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/posts', {
        withCredentials: true,
      });
      setPosts(response.data); // Chỉ lưu các bài viết của người dùng hiện tại
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  // Gọi hàm fetchPosts khi component được mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // Hàm để xử lý việc tạo bài viết
  const handleSubmitPost = async () => {
    const formData = new FormData();
    formData.append('content', postContent);

    // Thêm các tệp ảnh vào formData
    postImages.forEach((image) => {
      formData.append('images', image); // Tên trường 'images' phải trùng với backend
    });

    try {
      const response = await axios.post('http://localhost:8080/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, // Nếu cần dùng session
      });

      console.log('Post created successfully:', response.data);

      // Đóng modal và reset form sau khi post thành công
      document.getElementById('post-modal').style.display = 'none';
      resetForm();

      // Fetch lại các bài viết mới
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error.response?.data || error.message);
    }
  };


  // end js hiện post model
  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          {/* Left Sidebar */}
          <div className="col-3 sidebar bg-light p-4">
            <ul className="list-unstyled">
              <li className="left mb-4">
                <a href="/#" className="d-flex align-items-center " style={{ textAlign: 'center' }}>
                  <img src={images.web_content} alt='icon' width={20} className="me-2" />
                  <span className='fw-bold'>Bản tin</span>
                </a>
              </li>
              <li className="left mb-4">
                <a href="/#" className="d-flex align-items-center">
                  <img src={images.followers} alt='icon' width={20} className="me-2" />
                  <span className='fw-bold'>Đang theo dõi</span>
                </a>
              </li>

              <li className="left mb-4">
                <a href="/#" className="d-flex align-items-center">
                  <img src={images.feedback} alt='icon' width={20} className="me-2" />
                  <span className='fw-bold'>Bài viết đã thích</span>
                </a>
              </li>
              <li className="left mb-4">
                <a href="/#" className="d-flex align-items-center">
                  <img src={images.music} alt='icon' width={20} className="me-2" />
                  <span className='fw-bold'>Albums đã thích</span>
                </a>
              </li>
              <li className="left mb-4">
                <a href="/#" className="d-flex align-items-center">
                  <img src={images.playlist} alt='icon' width={20} className="me-2 " />
                  <span className='fw-bold'>Playlist đã thích</span>
                </a>
              </li>
            </ul>
          </div>
          {/* Main Content */}
          <div className="col-6 content p-4">
            {/* Post  */}
            <div>
        {/* Nút tạo bài */}
        <div className="container mt-2 mb-5">
          <div className="row align-items-center">
            <div className="col-auto post-header">
              <img src={images.ava} className="avatar_small" alt='avatar' />
            </div>
            <div className="col">
              <button id="create-post-btn" type="button" className="btn text-start" style={{ backgroundColor: 'rgba(64, 102, 128, 0.078)', width: '85%', height: 50 }}>
                Bạn đang nghĩ gì vậy?
              </button>
            </div>
          </div>
        </div>
        {/* Modal để tạo bài viết */}
        <div id="post-modal" className="modal-overlay" style={{ display: 'none' }}>
          <div className="modal-content">
            <div>
              <div className="post-header">
                <img src={images.ava} className="avatar_small" alt="Avatar" />
                <div>
                  <div className="name">Phạm Xuân Trường</div>
                  <div className="time">Posting to Feed</div>
                </div>
                <button id="close-modal" type="button" className="btn btn-close"></button>
              </div>
              <div className="col">
                <textarea
                  id="post-textarea"
                  className="form-control"
                  rows={3}
                  placeholder="Write your post here..."
                  value={postContent} // Liên kết state với textarea
                  onChange={(e) => setPostContent(e.target.value)} // Cập nhật nội dung khi người dùng nhập
                />
                <div className="row mt-3">
                  <div className="col text-start">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => setPostImages(Array.from(e.target.files))} // Cập nhật postImages với các file đã chọn
                    />
                  </div>
                  <div className="col text-end">
                    <button id="submit-post" type="button" className="btn btn-secondary" onClick={handleSubmitPost}>Post</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Bài viết */}
        <div className="container mt-2 mb-5">
  {posts.map((post) => (
    <div key={post.id} className="post">
      <div className="post-header">
        <img src="/src/UserImages/Avatar/avt.jpg" className="avatar_small" alt="Avatar" />
        <div>
          <div className="name">{post.userName}</div> {/* Hiển thị tên người dùng */}
          <div className="time">11:42 PM, 7 Sep 2024</div> 
        </div>
      </div>
      <div className="post-content">
        {post.content} {/* Hiện nội dung bài viết */}
      </div>
      {/* Hiện hình ảnh nếu có */}
      {post.images && post.images.length > 0 && (
        <div className="post-images">
          {post.images.map((image, index) => (
            <img key={index} src={`data:image/jpeg;base64,${image.postImage}`} alt="Post" />
          ))}
        </div>
      )}
      {/* Phần nút Like và Comment */}
      <div className="interaction-buttons mt-3">
        <button type="button" className="btn">
          <img src={images.heart} className="btn-icon" alt="Like" />
          <span>Like</span>
        </button>
      </div>

      {/* Phần comment-section */}
      <div className="comment-section mt-4">
        <textarea className="comment-input" style={{ resize: 'none' }} rows={3} placeholder="Write a comment..." defaultValue={""} />
        <div className="row">
          <div className="col text-start">
            <a href="/#" className="text-black text-decoration-none">View Comment</a>
          </div>
          <div className="col text-end">
            <span>1 Comment</span>
          </div>
        </div>
        <div className="comment mt-2">
          <img src={images.ava} alt="Commenter" />
          <div className="comment-content">
            <div className="comment-author">Huynh Trong Phu</div>
            <div className="comment-time">12:00 AM, 8 Sep 2024</div>
            <p>Chao em nhe nguoi dep!</p>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

      </div>

          </div>
          {/* Right Sidebar */}
          <div className="col-3 sidebar bg-light p-4">
            <ul className="list-unstyled">
              <h6>Gợi ý theo dõi</h6>
              <li className=" mb-4">
                <a href="/#" className style={{ marginLeft: 30 }}>
                  <div className="d-flex align-items-center post-header " style={{ marginLeft: 25 }}>
                    <img src={images.ava} className alt="Avatar" />
                    <div>
                      <div className="name">Phạm Xuân Trường</div>
                      <div className="title">Posting to Feed</div>
                    </div>
                    <img src={images.plus} alt="icon" style={{ marginLeft: 100, width: '10%', height: '10%' }} />
                  </div>
                </a>
              </li>
              <li className=" mb-4">
                <a href="/#" className style={{ marginLeft: 30 }}>
                  <div className="d-flex align-items-center post-header " style={{ marginLeft: 25 }}>
                    <img src={images.ava} className alt="Avatar" />
                    <div>
                      <div className="name">Phạm Xuân Trường</div>
                      <div className="title">Posting to Feed</div>
                    </div>
                    <img src={images.plus} alt="icon" style={{ marginLeft: 100, width: '10%', height: '10%' }} />
                  </div>
                </a>
              </li>
              <li className=" mb-4">
                <a href="/#" className style={{ marginLeft: 30 }}>
                  <div className="d-flex align-items-center post-header " style={{ marginLeft: 25 }}>
                    <img src={images.ava} className alt="Avatar" />
                    <div>
                      <div className="name">Phạm Xuân Trường</div>
                      <div className="title">Posting to Feed</div>
                    </div>
                    <img src={images.plus} alt="icon" style={{ marginLeft: 100, width: '10%', height: '10%' }} />
                  </div>
                </a>
              </li>
              <li className=" mb-4">
                <a href="/#" className style={{ marginLeft: 30 }}>
                  <div className="d-flex align-items-center post-header " style={{ marginLeft: 25 }}>
                    <img src={images.ava} className alt="Avatar" />
                    <div>
                      <div className="name">Phạm Xuân Trường</div>
                      <div className="title">Posting to Feed</div>
                    </div>
                    <img src={images.plus} alt="icon" style={{ marginLeft: 100, width: '10%', height: '10%' }} />
                  </div>
                </a>
              </li>
            </ul>
            <div className="advertisement mt-5">
              <a href>  <img src={images.bannerpre} alt="Banner quảng cáo" className="img-fluid" width="80%" style={{ marginLeft: 30 }} /></a>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default HomeFeed