import React, { useEffect } from 'react'
import { images } from "../../assets/images/images";

import "./css/mxh/style.css"
import "./css/mxh/post.css"
import "./css/mxh/modal-create-post.css"
import "./css/profile.css"
import "./css/mxh/comment.css"
import "./css/mxh/button.css"
import i18n from "../../i18n/i18n.js";


import { useTranslation } from "react-i18next";

const HomeFeed = () => {
  const { t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // Hàm thay đổi ngôn ngữ
  };
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
        createPostBtn.removeEventListener('click', () => {});
        closeModal.removeEventListener('click', () => {});
      };
    } else {
      console.error('One or more elements not found');
    }
  }, []); // Chạy effect một lần khi component mount

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
                  <span className='fw-bold'>{t('news_feed')}</span>
                </a>
              </li>
              <li className="left mb-4">
                <a href="/#" className="d-flex align-items-center">
                  <img src={images.followers} alt='icon' width={20} className="me-2" />
                  <span className='fw-bold'>{t('following')}</span>
                </a>
              </li>

              <li className="left mb-4">
                <a href="/#" className="d-flex align-items-center">
                  <img src={images.feedback} alt='icon' width={20} className="me-2" />
                  <span className='fw-bold'>{t('liked_posts')}</span>
                </a>
              </li>
              <li className="left mb-4">
                <a href="/#" className="d-flex align-items-center">
                  <img src={images.music} alt='icon' width={20} className="me-2" />
                  <span className='fw-bold'>{t('liked_albums')}</span>
                </a>
              </li>
              <li className="left mb-4">
                <a href="/#" className="d-flex align-items-center">
                  <img src={images.playlist} alt='icon' width={20} className="me-2 " />
                  <span className='fw-bold'>{t('liked_playlists')}</span>
                </a>
              </li>
            </ul>
          </div>
          {/* Main Content */}
          <div className="col-6 content p-4">
            {/* Post  */}
            <div>
              <div className="post">
                <div className="container mt-2 mb-5">
                  <div className="row align-items-center">
                    <div className="col-auto post-header">
                      <img src={images.ava} className="avatar_small" alt='avatar' />
                    </div>
                    <div className="col">
                      <button id="create-post-btn" type="button" className="btn text-start" style={{ backgroundColor: 'rgba(64, 102, 128, 0.078)', width: '85%', height: 50 }}>
                      {t('placeholder_post')}
                      </button>
                    </div>
                  </div>
                </div>
                <div id="post-modal" className="modal-overlay" style={{ display: 'none' }}> {/* Đặt style display ở đây để bắt đầu ẩn */}
                  <div className="modal-content">
                    <div>
                      <div className="post-header">
                        <img src={images.ava} className="avatar_small" alt="Avatar" />
                        <div>
                          <div className="name">Phạm Xuân Trường</div>
                          <div className="time">{t('user_greeting')}</div>
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
                          <button id="submit-post" type="button" className="btn btn-secondary">{t('post')}</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Post 1 */}
            <div className="post">
              <div className="d-flex justify-content-between">
                <div className="d-flex align-items-center post-header ">
                  <img src={images.ava} className alt="Avatar" />
                  <div>
                    <div className="name">Phạm Xuân Trường</div>
                    <div className="title">{t('user_greeting')}</div>
                  </div>
                </div>
                <img src={images.plus} alt="icon" style={{ marginLeft: 100, width: '5%', height: '5%' }} />
              </div>
              {/* Nội dung bài viết */}
              <div className="post-content">
              {t('user_greeting')}  
              </div>
              {/* kết thúc nội dung bài viết */}
              <div className="my-3">
                <div className="hero" style={{}}>
                  <div className="music" style={{ width: '100%', padding: 30, boxSizing: 'border-box', background: '#f0f3f5', display: 'flex' }}>
                    <img src={images.ava} alt="icon" width="300px" />
                    <div className="info" style={{ color: '#212529', marginLeft: 30, flex: 1 }}>
                      <h1>
                        Gọi đò ơi
                      </h1>
                      <p style={{ fontSize: 20, margin: '10px 0 60px' }}>
                        Albums void 2
                      </p>
                      <div id="waveform">
                        {/* the waveform will be rendered here */}
                        <div className="controls" style={{ marginTop: 40, display: 'flex', alignItems: 'center' }}>
                          <img style={{ width: 20, marginRight: 20, cursor: 'pointer' }} src={images.play1} alt="icon" id="playBtn" />
                          <img style={{ width: 20, marginRight: 20, cursor: 'pointer' }} src={images.pause} alt="icon" id="stopBtn" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* 2 nút tương tác */}
              <div className="mt-3">
                {/* nút tim bài viết */}
                <button type="button" className="btn ">
                  <img src={images.image} className="btn-icon" alt="Heart" />
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
                <textarea className="comment-input" style={{ resize: 'none' }} rows={3} placeholder="Write a comment..." defaultValue={""} />
                <div className="row">
                  <div className=" col text-start">
                    <a href="/#" className="text-black text-decoration-none">View Comment</a>
                  </div>
                  <div className=" col text-end">
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
            {/* post 2 */}
            <div className="post mt-5">
              <div className="d-flex justify-content-between">
                <div className="d-flex align-items-center post-header ">
                  <img src={images.ava} className alt="Avatar" />
                  <div>
                    <div className="name">Phạm Xuân Trường</div>
                    <div className="title">Posting to Feed</div>
                  </div>
                </div>
                <img src={images.plus} alt="icon" style={{ marginLeft: 100, width: '5%', height: '5%' }} />
              </div>
              {/* Nội dung bài viết */}
              <div className="post-content">
                Xin chao moi nguoi da den voi trang cua minh hihi minh la Pham
                Xuan Truong day hihi
              </div>
              {/* kết thúc nội dung bài viết */}
              <div className="audio-player my-3">
                <audio controls>
                  <source src="audio-file.mp3" type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
              {/* 2 nút tương tác */}
              <div className="mt-3">
                {/* nút tim bài viết */}
                <button type="button" className="btn ">
                  <img src={images.image} className="btn-icon" alt="Heart" />
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
                <textarea className="comment-input" style={{ resize: 'none' }} rows={3} placeholder="Write a comment..." defaultValue={""} />
                <div className="row">
                  <div className=" col text-start">
                    <a href="/#" className="text-black text-decoration-none">View Comment</a>
                  </div>
                  <div className=" col text-end">
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
            {/* end post2 */}
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