import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { images } from '../../../../assets/images/images';
import axios from 'axios';

const Activity = () => {
  const [postContent, setPostContent] = useState(''); // State cho nội dung bài viết
  const [postImages, setPostImages] = useState([]); // State cho ảnh bài viết
  const [posts, setPosts] = useState([]); // State để lưu các bài viết

  // Phần js để hiện post modal
  useEffect(() => {
    const createPostBtn = document.getElementById('create-post-btn');
    const postModal = document.getElementById('post-modal');
    const closeModal = document.getElementById('close-modal');

    if (createPostBtn && postModal && closeModal) {
      createPostBtn.addEventListener('click', () => {
        postModal.style.display = 'flex';
      });

      closeModal.addEventListener('click', () => {
        postModal.style.display = 'none';
        resetForm(); // Reset form khi đóng modal
      });

      return () => {
        createPostBtn.removeEventListener('click', () => { });
        closeModal.removeEventListener('click', () => { });
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
            const response = await axios.get('http://localhost:8080/api/posts');
            setPosts(response.data); // Lưu dữ liệu vào state
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };    
        // Gọi hàm fetchPosts khi component được mount
        useEffect(() => {
          fetchPosts();
      }, []);

  // Hàm để xử lý việc tạo bài viết
  const handleSubmitPost = async () => {
    const formData = new FormData();
    formData.append('content', postContent); // Đảm bảo 'content' đúng với API

    // Thêm các ảnh vào formData
    for (const element of postImages) {
        formData.append('images', element); // 'images' phải trùng với tên trong API
    }

    try {
        const response = await axios.post('http://localhost:8080/api/posts', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Post created successfully:', response.data);
    } catch (error) {
        console.error('Error creating post:', error.response?.data || error.message);
    }
};
  

  return (
    <div>
      <div>
        {/* Nút tạo bài */}
        <div className="container mt-2 mb-5">
          <div className="row align-items-center">
            <div className="col-auto post-header">
              <img src={images.ava} className="avatar_small" alt='avatar' />
            </div>
            <div className="col">
              <button id="create-post-btn" type="button" className="btn text-start" style={{ backgroundColor: 'rgba(64, 102, 128, 0.078)', width: '85%', height: 50 }}>
                Ban dang nghi gi vay?
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
                    <button id="post-image" type="button" className="btn" style={{ backgroundColor: 'rgba(64, 102, 128, 0.078)' }}>Photo/video</button>
                  </div>
                  <div className="col text-end">
                    <button id="submit-post" type="button" className="btn btn-secondary" onClick={handleSubmitPost}>Post</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Bài viết mẫu */}
        {/* Phần bài viết mẫu */}
        <div className="container mt-2 mb-5">
                {posts.map((post) => (
                    <div key={post.id} className="post">
                        <div className="post-header">
                            <img src="/src/UserImages/Avatar/avt.jpg" className="avatar_small" alt="Avatar" />
                            <div>
                                <div className="name">Phạm Xuân Trường</div>
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
                    </div>
                ))}
            </div>
      </div>
    </div>
  );
};

export default Activity;
