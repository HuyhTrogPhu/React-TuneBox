import React, { useEffect }  from 'react';
import { Link } from 'react-router-dom';
import { images } from '../../../../assets/images/images';

const Activity = () => {
  // phần js để hiện post modal
  useEffect(() => {
    const createPostBtn = document.getElementById('create-post-btn');
    const postModal = document.getElementById('post-modal');
    const postTextarea = document.getElementById('post-textarea');
    const closeModal = document.getElementById('close-modal');

    if (createPostBtn && postModal && postTextarea && closeModal) {
      createPostBtn.addEventListener('click', () => {
        postModal.style.display = 'flex';
      });

      closeModal.addEventListener('click', () => {
        postModal.style.display = 'none';
      });

      return () => {
        createPostBtn.removeEventListener('click', () => { });
        closeModal.removeEventListener('click', () => { });
      };
    } else {
      console.error('One or more elements not found');
    }
  }, []); // Chạy effect một lần khi component mount
  return <div>
    <div>
      {/* nút tạo bài */}
      <div className="container mt-2 mb-5">
                  <div className="row align-items-center">
                    <div className="col-auto post-header">
                      <img src={images.ava} className="avatar_small" alt='avatar' />
                    </div>
                    <div className="col">
                      <button id="create-post-btn" type="button" className="btn text-start" style={{ backgroundColor: 'rgba(64, 102, 128, 0.078)', width: '85%', height: 50 }}>Ban dang nghi gi vay?</button>
                    </div>
                  </div>
                </div>
      {/* Modal để tạo bài viết */}
      <div id="post-modal" className="modal-overlay" style={{ display: 'none' }}> {/* Đặt style display ở đây để bắt đầu ẩn */}
                  <div className="modal-content">
                    <div>
                      <div className="post-header">
                        <img src={images.ava} className="avatar_small" alt="Avatar" />
                        <div>
                          <div className="name">Phạm Xuân Trường</div>
                          <div className="time">Posting to Feed</div>
                        </div>
                        <button id="close-modal" type="button" className="btn btn-close">×</button>
                      </div>
                      <div className="col">
                        <textarea id="post-textarea" className="form-control" rows={3} placeholder="Write your post here..." defaultValue={""} />
                        <div className="row mt-3">
                          <div className="col text-start">
                            <button id="post-image" type="button" className="btn" style={{ backgroundColor: 'rgba(64, 102, 128, 0.078)' }}><i className="bi bi-card-image" /> Photo/video</button>
                          </div>
                          <div className="col text-end">
                            <button id="submit-post" type="button" className="btn btn-secondary">Post</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
      {/* Bài viết mẫu */}
      <div className="container mt-2 mb-5">
        {/* bắt đầu 1 bài post */}
        <div className="post">
          {/* phần header của bài viết */}
          <div className="post-header">
            {/* Phần avatar */}
            <img src="/src/UserImages/Avatar/avt.jpg" className="avatar_small" alt="Avatar" />
            {/* Phần thông tin gồm tên và giờ đăng bài */}
            <div>
              <div className="name">Phạm Xuân Trường</div>
              <div className="time">11:42 PM, 7 Sep 2024</div>
            </div>
            {/* kết thúc Phần thông tin gồm tên và giờ đăng bài */}
          </div>
          {/* Kết thúc header bài viết */}
          {/* Nội dung bài viết */}
          <div className="post-content">
            Xin chao moi nguoi da den voi trang cua minh hihi minh la Pham
            Xuan Truong day hihi
          </div>
          {/* kết thúc nội dung bài viết */}
          {/* 2 nút tương tác */}
          <div className="mt-3">
            {/* nút tim bài viết */}
            <button type="button" className="btn ">
              <img src={images.heart} className="btn-icon" alt="Heart" />
              <span>Like</span>
            </button>
            {/* nút share bài viết */}
            <button type="button" className="btn ">
              <img src={images.share} className="btn-icon" alt="Share" />
              <span>Share</span>
            </button>
          </div>
          {/* Kết thúc 2 nút */}
          {/* Phần comment bài viết */}
          <div className="comment-section mt-4">
            {/* Phần viết comment của người xem */}
            <textarea className="comment-input" style={{ resize: 'none' }} rows={3} placeholder="Write a comment..." defaultValue={""} />
            <div className="row">
              {/* nút xem comment */}
              <div className=" col text-start">
                <Link href="#" className="text-black text-decoration-none">View Comment</Link>
              </div>
              {/* đếm lượt comment */}
              <div className=" col text-end">
                <span>1 Comment</span>
              </div>
            </div>
            {/* Phần xem comment bài viết  */}
            <div className="comment mt-2">
              <img src="/src/UserImages/Avatar/avt.jpg" alt="Commenter" />
              <div className="comment-content">
                <div className="comment-author">Huynh Trong Phu</div>
                <div className="comment-time">12:00 AM, 8 Sep 2024</div>
                <p>Chao em nhe nguoi dep!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>;
};

export default Activity;
