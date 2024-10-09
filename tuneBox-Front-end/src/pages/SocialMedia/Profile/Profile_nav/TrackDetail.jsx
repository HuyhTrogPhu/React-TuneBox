import React from "react";
import "./css/Trackdetail.css";

function Trackdetail() {
  return (
    <div className="container">
      <div className="container track-page-header">
        <div className="adaptive-content">
          <div className="track-page-player ">
            <img
              src="/src/UserImages/Avatar/avt.jpg"
              className="avatar_small"
              alt="Avatar"
            />
            <div className="track-page-player-titles">
              <div className="track-page-player-titles">
                <h4 className="track-page-player-title-name text-truncate">
                  Title of a longer featured blog post
                </h4>
              </div>
              <div>
                <span>
                  <a href="/#">Tommy & the Wave Crashers</a>
                </span>
                <span className="hide-for-medium-down">·</span>
                <time
                  className="hide-for-medium-down"
                  dateTime="2024-09-18T18:24:02Z"
                >
                  Sep 19, 2024
                </time>
                <div>01:02</div>
              </div>
            </div>
          </div>
        </div>
        <div className="adaptive-content track-player-actions">
          <div className="track-player-actions-column">
            <button className="btn">
              <img
                src="/src/UserImages/Avatar/avt.jpg"
                width={22}
                height={22}
                alt="heart"
              />
            </button>
            <button className="btn">
              <img
                src="/src/UserImages/Avatar/avt.jpg"
                width={22}
                height={22}
                alt="heart"
              />
              share
            </button>
          </div>
          <div className="track-player-actions-column">
            <button className="btn">...</button>
          </div>
        </div>
      </div>
      <div className="row mb-2 mt-3">
        <div className="col-md-7 border rounded">
          <div>
            <nav className="nav flex-column flex-md-row p-5">
              <a href="/#" className="nav-link">
                Comment(4)
              </a>
              <a href="/#" className="nav-link">
                Lyric
              </a>
            </nav>
          </div>

          <div className="mb-2">
            <div className="comment-section">
              <textarea
                className="comment-input"
                style={{ resize: "none" }}
                rows={1}
                placeholder="Write a comment..."
                defaultValue={""}
              />
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
        <div className="col-md-4 border rounded ms-5">
          <div className="row align-items-center">
            <div className="col-auto post-header">
              <img
                src="/src/UserImages/Avatar/avt.jpg"
                className="avatar_small"
                alt="avatar"
              />
              <span>PXT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Trackdetail;
