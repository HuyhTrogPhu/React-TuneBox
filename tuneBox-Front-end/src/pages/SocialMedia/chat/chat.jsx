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
  // const currentUserId = parseInt(Cookies.get("UserID"), 10);
  const userIdValue = Cookies.get("userId");
  const currentUserId = userIdValue ? parseInt(userIdValue, 10) : null;
  console.log("currentUserId: ", currentUserId);
  const messagesEndRef = useRef(null);
  const clientRef = useRef(null);
  const [attachment, setAttachment] = useState(null);

  const reconnectOptions = {
    // Thêm các thuộc tính cần thiết cho reconnectOptions
    maxAttempts: 5,
    interval: 1000
};


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

    // Kiểm tra cache trước
    const cachedMessages = localStorage.getItem(
      `messages_${currentUserId}_${activeUser.id}`
    );
    if (cachedMessages) {
      setMessages(JSON.parse(cachedMessages));
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/api/messages/between?userId1=${currentUserId}&userId2=${activeUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      const messagesWithAttachments = response.data.map((msg) => ({
        ...msg,
        attachments: Array.isArray(msg.attachments) ? msg.attachments : [],
      }));

      setMessages(messagesWithAttachments);

      // Cập nhật cache
      localStorage.setItem(
        `messages_${currentUserId}_${activeUser.id}`,
        JSON.stringify(messagesWithAttachments)
      );
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
      // Đảm bảo tin nhắn mới có trường attachments
      const messageWithAttachments = {
        ...newMessage,
        attachments: Array.isArray(newMessage.attachments)
          ? newMessage.attachments
          : [],
      };

      setMessages((prevMessages) => {
        if (
          activeUser &&
          (messageWithAttachments.senderId.id === activeUser.id ||
            messageWithAttachments.receiverId.id === activeUser.id)
        ) {
          return [...prevMessages, messageWithAttachments];
        } else if (
          !activeUser &&
          messageWithAttachments.receiverId.id === currentUserId
        ) {
          return [...prevMessages, messageWithAttachments];
        }
        return prevMessages;
      });

      setUsers((prevUsers) => {
        return prevUsers.map((user) => {
          if (
            user.id === messageWithAttachments.senderId.id ||
            user.id === messageWithAttachments.receiverId.id
          ) {
            return {
              ...user,
              lastMessage: messageWithAttachments.content,
              lastMessageTime: messageWithAttachments.creationDate,
            };
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
      reconnectDelay: reconnectOptions.reconnectDelay,
      maxReconnectAttempts: reconnectOptions.maxReconnectAttempts,
      onReconnect: () => {
        console.log("Attempting to reconnect...");
        // Resend cached messages if needed
      },
      debug: (str) => {
        console.log(str);
      },
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

  // Sửa lại phần handleSendMessage
  const handleSendMessage = async () => {
    if (!newMessage.trim() && !attachment) return;
    if (!activeUser) return;

    try {
      let attachments = [];
      if (attachment) {
        console.log("Uploading attachment:", attachment);
        const formData = new FormData();
        formData.append("file", attachment);

        const uploadResponse = await axios.post(
          "http://localhost:8080/api/messages/upload",
          formData,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Upload response:", uploadResponse.data);

        attachments.push({
          fileName: uploadResponse.data.fileName,
          fileUrl: uploadResponse.data.fileUrl,
          mimeType: uploadResponse.data.type,
          size: parseInt(uploadResponse.data.size),
        });

        console.log("Processed attachment:", attachments[0]);
      }

      const messageData = {
        senderId: { id: currentUserId },
        receiverId: { id: activeUser.id },
        content: newMessage || (attachment ? attachment.name : ""),
        creationDate: new Date().toISOString(),
        attachments: attachments,
      };

      console.log("Sending message data:", messageData);

      if (clientRef.current?.connected) {
        clientRef.current.publish({
          destination: "/app/chat.sendMessage",
          body: JSON.stringify(messageData),
        });

        // Tạo bản sao của messageData để tránh tham chiếu
        const localMessage = {
          ...messageData,
          id: Date.now(),
          attachments: [...attachments],
        };

        console.log("Adding local message:", localMessage);

        setMessages((prevMessages) => {
          const newMessages = [...prevMessages, localMessage];
          console.log("Updated messages state:", newMessages);
          return newMessages;
        });

        setNewMessage("");
        setAttachment(null);

        const fileInput = document.getElementById("file-input");
        if (fileInput) {
          fileInput.value = "";
        }
      } else {
        console.error("WebSocket không được kết nối");
      }
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
      console.error("Error details:", error.response?.data || error);
      alert("Có lỗi xảy ra khi gửi tin nhắn hoặc file");
    }
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setAttachment(file); // Lưu file vào state
  };

  const renderMessageContent = (content) => {
    // Tìm các link URL trong nội dung và chuyển chúng thành thẻ <a>
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return content.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer">
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="z">
    <div className="messenger-container">
      <div className="messenger-sidebar">
        <div className="messenger-header">
          <h4>Chats TuneBox</h4>
        </div>
        <UserList
          users={users}
          setActiveUser={handleSetActiveUser}
          activeUser={activeUser}
        />
      </div>
      <div className="messenger-chat">
        {activeUser ? (
          <>
            <div className="messenger-chat-header">
              <div className="user-avatar">
                {activeUser.userName.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <span className="user-name">{activeUser.userName}</span>
                <span className="user-status">Active Now</span>
              </div>
            </div>
            <div className="messenger-chat-messages" ref={messagesEndRef}>
              {messages.map((msg, index) => {
                console.log(`Rendering message ${index}:`, msg);
                console.log(`Message ${index} attachments:`, msg.attachments);

                return (
                  <div
                    key={index}
                    className={`message ${
                      (typeof msg.senderId === "object"
                        ? msg.senderId.id
                        : msg.senderId) === currentUserId
                        ? "sent"
                        : "received"
                    }`}
                  >
                    <div className="message-bubble">
                      {renderMessageContent(msg.content)}
                      {msg.attachments.map((attachment, idx) => {
                        console.log(`Attachment URL: ${attachment.fileUrl}`);
                        return (
                          <div key={idx} className="attachment">
                            {attachment.mimeType?.startsWith("image/") ? (
                              <img
                                src={attachment.fileUrl}
                                alt={attachment.fileName}
                                style={{
                                  maxWidth: "200px",
                                  maxHeight: "200px",
                                }}
                                onError={(e) => {
                                  console.error(
                                    "Image loading error for:",
                                    attachment.fileUrl
                                  );
                                  e.target.style.display = "none";
                                  // Thêm một phần tử để hiển thị lỗi
                                  const errorElement =
                                    document.createElement("div");
                                  errorElement.textContent =
                                    "Không thể tải hình ảnh";
                                  e.target.parentNode.appendChild(errorElement);
                                }}
                                onLoad={() => {
                                  console.log(
                                    "Image loaded successfully:",
                                    attachment.fileUrl
                                  );
                                }}
                              />
                            ) : (
                              <a
                                href={attachment.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {attachment.fileName}
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="message-time">
                      {formatTimestamp(msg.creationDate)}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="messenger-chat-input">
              <label htmlFor="file-input">
                <i className="fas fa-paperclip attach-icon"></i>
              </label>
              <input
                type="file"
                id="file-input"
                style={{ display: "none" }}
                onChange={handleFileChange} // Hàm xử lý khi chọn file
              />
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
    </div>
  );
};

export default Chat;
