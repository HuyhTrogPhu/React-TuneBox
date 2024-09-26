import React from 'react';
import { Link } from 'react-router-dom';

const Track = () => {
  return (
    <div>
    <div className="post-header-track">
      <img src="/src/UserImages/Avatar/avt.jpg" className="avatar_small" alt="Avatar" />
      <div className="info">
        <div className="name">Cong an vao cuoc</div>
        <div className="author">Pham Xuan Truong</div>
      </div>
      <div className="time">1:30</div>
      <div style={{marginLeft: 25}}>
        <Link to={'/'} style={{color: 'black'}}>
          <i className="bi bi-three-dots" />
        </Link>
      </div>
    </div>
    </div>
    );
}
export default Track;
