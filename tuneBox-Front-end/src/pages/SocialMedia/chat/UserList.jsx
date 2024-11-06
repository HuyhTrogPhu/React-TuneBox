import React from "react";

const UserList = ({ users, setActiveUser, activeUser }) => {
  return (
    <div className="users-list">
      {users.map((user) => (
        <div
          key={user.id}
          className={`user-item ${activeUser && activeUser.id === user.id ? 'active' : ''}`}
          onClick={() => setActiveUser(user)}
        >
          <div className="user-avatar">{user.username.charAt(0).toUpperCase()}</div>
          <div className="user-info">
            <div className="user-name">{user.username}</div>
            <div className="user-last-message">{user.lastMessage || "Nhấn để bắt đầu trò chuyện"}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;