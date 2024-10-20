import React, { useEffect, useState, useRef, useCallback } from "react";
import "../css/chat/chat.css";
import Cookies from "js-cookie";
import UserList from "./UserList";
import axios from "axios";
import dayjs from "dayjs";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const currentUserId = parseInt(Cookies.get("UserID"), 10);
  const messagesEndRef = useRef(null);
  const clientRef = useRef(null);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8080/user", {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      const filteredUsers = response.data.filter(
        (user) => user.id !== currentUserId
      );
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, [currentUserId]);

  const fetchMessages = useCallback(async () => {
    if (!activeUser) return;
    try {
      const response = await axios.get(
        `http://localhost:8080/api/messages/between?userId1=${currentUserId}&userId2=${activeUser.id}`
      );
      setMessages(response.data);
    } catch (error) {
      console.error(
        "Lỗi khi lấy tin nhắn:",
        error.response?.data || error.message
      );
    }
  }, [activeUser, currentUserId]);

  const onMessageReceived = useCallback(
    (message) => {
      const newMessage = JSON.parse(message.body);
      setMessages((prevMessages) => {        
        if (
          activeUser &&
          (newMessage.senderId.id === activeUser.id || newMessage.receiverId.id === activeUser.id)
        ) {
          return [...prevMessages, newMessage];
        } else if (!activeUser && newMessage.receiverId.id === currentUserId) {
          return [...prevMessages, newMessage];
        }
        return prevMessages;
      });
  
      setUsers((prevUsers) => {
        return prevUsers.map((user) => {
          if (user.id === newMessage.senderId.id || user.id === newMessage.receiverId.id) {
            return { ...user, lastMessage: newMessage.content, lastMessageTime: newMessage.creationDate };
          }
          return user;
        });
      });
    },
    [activeUser, currentUserId]
  );

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      connectHeaders: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log("Connected");
      client.subscribe(
        `/user/${currentUserId}/queue/messages`,
        onMessageReceived
      );
    };

    client.onStompError = (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [currentUserId, onMessageReceived]);

  useEffect(() => {
    fetchUsers();

    const storedActiveUser = localStorage.getItem("activeUser");
    if (storedActiveUser) {
      setActiveUser(JSON.parse(storedActiveUser));
    }
  }, [fetchUsers]);

  useEffect(() => {
    if (activeUser) {
      setMessages([]);
      fetchMessages();
    }
  }, [activeUser, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeUser) return;
  
    const messageData = {
      senderId: { id: currentUserId },
      receiverId: { id: activeUser.id },
      content: newMessage,
      creationDate: new Date().toISOString(),
    };
  
    console.log("Sending message:", messageData);
  
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(messageData),
      });
      
      // Thêm tin nhắn vào state messages ngay lập tức
      setMessages(prevMessages => [...prevMessages, messageData]);
    } else {
      console.error("WebSocket not connected, unable to send message");
    }
  
    setNewMessage("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTimestamp = (timestamp) => {
    return dayjs(timestamp).isValid()
      ? dayjs(timestamp).format("HH:mm:ss")
      : "N/A";
  };

  const handleSetActiveUser = (user) => {
    setActiveUser(user);
    localStorage.setItem("activeUser", JSON.stringify(user));
    setMessages([]);
    fetchMessages();
  };


  return (
    <div className="messenger-container">
      <div className="messenger-sidebar">
        <div className="messenger-header">
          <h4>Chats TuneBox</h4>
        </div>
        <UserList users={users} setActiveUser={handleSetActiveUser} activeUser={activeUser} />
      </div>
      <div className="messenger-chat">
        {activeUser ? (
          <>
            <div className="messenger-chat-header">
              <div className="user-avatar">{activeUser.userName.charAt(0).toUpperCase()}</div>
              <div className="user-info">
                <span className="user-name">{activeUser.userName}</span>
                <span className="user-status">Active Now</span>
              </div>
            </div>
            <div className="messenger-chat-messages" ref={messagesEndRef}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${(typeof msg.senderId === "object" ? msg.senderId.id : msg.senderId) === currentUserId ? "sent" : "received"}`}
                >
                  <div className="message-bubble">{msg.content}</div>
                  <div className="message-time">{formatTimestamp(msg.creationDate)}</div>
                </div>
              ))}
            </div>
            <div className="messenger-chat-input">
              <input
                type="text"
                placeholder="Aa"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <p>Choose a person to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
