import React from "react";

const UserList = ({ users, setActiveUser, activeUser }) => {
  return (
    <div className="user-list">
      {users.map((user) => (
        <div
          key={user.id}
          className={`user-item ${activeUser?.id === user.id ? 'active' : ''}`}
          onClick={() => setActiveUser(user)}
        >
          <div className="user-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={user.username} className="avatar-image" />
            ) : (
              user.username.charAt(0).toUpperCase()
            )}
          </div>
          <div className="user-details">
            <span className="user-name">{user.nickName || user.username}</span>
            {/* Thêm các thông tin khác nếu cần */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;