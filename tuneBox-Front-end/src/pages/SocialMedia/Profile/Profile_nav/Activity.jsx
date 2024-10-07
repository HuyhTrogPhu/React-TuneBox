import { useEffect, useState } from 'react';
import { images } from '../../../../assets/images/images';
import axios from 'axios';
import { format } from 'date-fns';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Cookies from 'js-cookie';

const Activity = () => {
  const [postContent, setPostContent] = useState('');
  const [postImages, setPostImages] = useState([]);
  const [postImageUrls, setPostImageUrls] = useState([]);
  const [posts, setPosts] = useState([]);
  const [postId, setPostId] = useState(null);
  const userId = Cookies.get("UserID");

  // Phần js để hiện post modal
  useEffect(() => {
    const createPostBtn = document.getElementById('create-post-btn');
    const postModal = document.getElementById('post-modal');
    const closeModal = document.getElementById('close-modal');

    const openModal = () => {
      resetForm();
      setPostId(null);
      postModal.style.display = 'flex';
    };

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
  }, []);

  // Hàm để reset form
  const resetForm = () => {
    setPostContent('');
    setPostImages([]);
    setPostImageUrls([]);
    setPostId(null);
  };

  // Hàm để lấy các bài viết
  const fetchPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/posts/current-user`, {
        params: { userId },
        withCredentials: true,
      });

      console.log('Response data:', response.data);

      // Sắp xếp các bài viết theo thời gian tạo (mới nhất lên đầu)
      const sortedPosts = response.data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setPosts(sortedPosts);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  // Gọi hàm fetchPosts khi component được mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // Hàm để xử lý việc tạo hoặc cập nhật bài viết
  const handleSubmitPost = async () => {
    const formData = new FormData();
    formData.append('content', postContent || '');
    formData.append('userId', userId);

    postImages.forEach((image) => {
      formData.append('images', image);
    });

    try {
      if (postId) {
        await axios.put(`http://localhost:8080/api/posts/${postId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
        console.log('Post updated successfully');
      } else {
        await axios.post('http://localhost:8080/api/posts', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
        console.log('Post created successfully');
      }

      // Đóng modal và reset form sau khi post thành công
      document.getElementById('post-modal').style.display = 'none';
      resetForm();
      fetchPosts();
    } catch (error) {
      console.error('Error creating/updating post:', error.response?.data || error.message);
    }
  };

  // Hàm xử lý thay đổi input file
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setPostImages(files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setPostImageUrls(imageUrls);
  };

  // Hàm xóa bài viết
  const handleDeletePost = async (postId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8080/api/posts/${postId}`, { withCredentials: true });
      console.log('Post deleted successfully');
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error.response?.data || error.message);
    }
  };

  // Hàm chỉnh sửa bài viết
  const handleEditPost = (post) => {
    setPostContent(post.content);
    setPostId(post.id);
    document.getElementById('post-modal').style.display = 'flex';
  };

  return (
    <div>
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

      {/* Modal để tạo hoặc chỉnh sửa bài viết */}
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
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
              <div className="row mt-3">
                <div className="col text-start">
                  <input
                    type="file"
                    multiple
                    onChange={handleImageChange}
                  />
                </div>
                <div className="col text-end">
                  <button id="submit-post" type="button" className="btn btn-secondary" onClick={handleSubmitPost}>Post</button>
                </div>
              </div>
              {/* Hiển thị ảnh đã chọn */}
              {postImageUrls.length > 0 && (
                <div className="selected-images mt-3">
                  {postImageUrls.map((url, index) => (
                    <img key={index} src={url} alt={`Selected ${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '5px' }} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bài viết */}
      <div className="container mt-2 mb-5">
        {posts.map((post) => {
          const createdAt = post.createdAt ? new Date(post.createdAt) : null;
          return (
            <div key={post.id} className="post">
              <div className="post-header">
                <img src="/src/UserImages/Avatar/avt.jpg" className="avatar_small" alt="Avatar" />
                <div>
                  <div className="name">{post.userName || 'Unknown User'}</div>
                  <div className="time">
                    {createdAt && !isNaN(createdAt.getTime()) 
                      ? format(createdAt, 'hh:mm a, dd MMM yyyy') 
                      : 'Invalid date'}
                  </div>
                </div>
                <div className="dropdown">
                  <button 
                    className="btn btn-options dropdown-toggle" 
                    type="button" 
                    id={`dropdownMenuButton-${post.id}`} 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false">
                    ...
                  </button>
                  <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${post.id}`}>
                    <li><button className="dropdown-item" onClick={() => handleEditPost(post)}>Edit</button></li>
                    <li><button className="dropdown-item" onClick={() => handleDeletePost(post.id)}>Delete</button></li>
                  </ul>
                </div>
              </div>
              <div className="post-content">{post.content}</div>
              {post.images && post.images.length > 0 && (
                <div className="post-images">
                  {post.images.map((image, index) => (
                    <img key={index} src={`data:image/jpeg;base64,${image.postImage}`} alt="Post" />
                  ))}
                </div>
              )}
              <div className="interaction-buttons mt-3">
                <button type="button" className="btn">
                  <img src={images.heart} className="btn-icon" alt="Like" />
                  <span>Like</span>
                </button>
              </div>
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
          );
        })}
      </div>
    </div>
  );
};

export default Activity;
