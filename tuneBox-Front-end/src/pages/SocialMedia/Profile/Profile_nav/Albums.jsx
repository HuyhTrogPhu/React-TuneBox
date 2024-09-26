import React from 'react';
import { Link } from 'react-router-dom';

const Albums = () => {
  return (
<div className="post-header-track">
  <div style={{backgroundColor: 'rgb(124, 134, 134)', padding: 40, marginRight: 20, borderRadius: 15}}>
    <i className="bi bi-play-circle" />
  </div>
  <div className="info">
    <div className="name">Cong an vao cuoc</div>
    <div className="author">Pham Xuan Truong</div>
    <div className="author">1 post 1 like</div>
  </div>
  <div style={{marginLeft: 25}}>
    <Link to={'/'} style={{color: 'black'}}>
      <i className="bi bi-three-dots" />
    </Link>
  </div>
</div>
  );
};

export default Albums;
