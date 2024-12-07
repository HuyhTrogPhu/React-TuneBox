import React, { useEffect, useState, useRef, useCallback } from "react";
import "../css/chat/chat.css";
import Cookies from "js-cookie";
import UserList from "./UserList";
import axios from "axios";
import dayjs from "dayjs";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { Loader2 } from "lucide-react";

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
  const jwtToken = localStorage.getItem("jwtToken"); // Get JWT token
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

  const reconnectOptions = {
    maxAttempts: 5,
    interval: 1000,
  };

  const messagePollingRef = useRef(null);
  const userPollingRef = useRef(null);

  // Polling function messages
  const pollMessages = useCallback(async () => {
    if (!activeUser || !currentUserId) return;

    try {
      const response = await axios.get(
        `http://localhost:8080/api/messages/between?userId1=${currentUserId}&userId2=${activeUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
          withCredentials: true,
        }
      );

      const newMessages = response.data.map((msg) => ({
        ...msg,
        attachments: Array.isArray(msg.attachments) ? msg.attachments : [],
      }));

      // So sánh với messages hiện tại để xem có cập nhật không
      if (JSON.stringify(newMessages) !== JSON.stringify(messages)) {
        setMessages(newMessages);
        scrollToBottom();
      }
    } catch (error) {
      console.error("Error polling messages:", error);
    }
  }, [activeUser, currentUserId, jwtToken, messages]);

  // Polling function users
  const pollUsers = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/messages/friends?userId=${currentUserId}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
          withCredentials: true,
        }
      );

      const friendsList = Array.isArray(response.data) ? response.data : [];
      const formattedUsers = friendsList.map((friend) => ({
        id: friend.id,
        username: friend.username,
        nickName: friend.nickName,
        avatar: friend.avatar,
      }));

      // So sánh với users hiện tại để xem có cập nhật không
      if (JSON.stringify(formattedUsers) !== JSON.stringify(users)) {
        setUsers(formattedUsers);
      }
    } catch (error) {
      console.error("Error polling users:", error);
    }
  }, [currentUserId, jwtToken, users]);

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

  const connectWebSocket = useCallback(() => {
    if (clientRef.current?.active) return;

    const client = new Client({
      webSocketFactory: () => {
        const socket = new SockJS("http://localhost:8080/ws");
        socket.onopen = () => {
          console.log("WebSocket connected");
          setIsConnected(true);
        };
        socket.onclose = () => {
          console.log("WebSocket disconnected");
          setIsConnected(false);
          // Thử kết nối lại sau 5 giây
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
        };
        return socket;
      },
      connectHeaders: {
        Authorization: `Bearer ${jwtToken}`,
      },
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      setIsConnected(true);
      client.subscribe(
        `/user/${currentUserId}/queue/messages`,
        (message) => {
          const newMessage = JSON.parse(message.body);
          handleNewMessage(newMessage);
          // Trigger immediate polls when receiving new message
          pollMessages();
          pollUsers();
        },
        {
          Authorization: `Bearer ${jwtToken}`,
        }
      );
    };

    client.onStompError = (frame) => {
      console.error("STOMP error:", frame);
      setIsConnected(false);
    };

    client.activate();
    clientRef.current = client;
  }, [currentUserId, jwtToken, pollMessages, pollUsers]);

  const handleNewMessage = useCallback((newMessage) => {
    const messageWithAttachments = {
      ...newMessage,
      attachments: Array.isArray(newMessage.attachments)
        ? newMessage.attachments
        : [],
    };

    setMessages((prevMessages) => {
      // Kiểm tra xem tin nhắn đã tồn tại chưa
      const messageExists = prevMessages.some(
        (msg) => msg.id === messageWithAttachments.id
      );
      if (messageExists) return prevMessages;
      return [...prevMessages, messageWithAttachments];
    });
  }, []);

  useEffect(() => {
    connectWebSocket();

    // Set up polling intervals
    messagePollingRef.current = setInterval(pollMessages, 1000);
    userPollingRef.current = setInterval(pollUsers, 1000);

    return () => {
      // Cleanup
      if (clientRef.current?.active) {
        clientRef.current.deactivate();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (messagePollingRef.current) {
        clearInterval(messagePollingRef.current);
      }
      if (userPollingRef.current) {
        clearInterval(userPollingRef.current);
      }
    };
  }, [connectWebSocket, pollMessages, pollUsers]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Sửa lại phần handleSendMessage
  const handleSendMessage = async () => {
    if (!newMessage.trim() && !attachment) return;
    if (!activeUser) return;

    if (uploadError) {
      alert(uploadError);
      return;
    }

    try {
      let attachments = [];
      if (attachment) {
        setIsUploading(true);
        setUploadProgress(0);

        console.log("Uploading attachment:", attachment);
        const formData = new FormData();
        formData.append("file", attachment);

        const uploadResponse = await axios.post(
          "http://localhost:8080/api/messages/upload",
          formData,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(progress);
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
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        // Tạo bản sao của messageData để tránh tham chiếu
        const localMessage = {
          ...messageData,
          id: Date.now(),
          attachments: [...attachments],
        };

        console.log("Adding local message:", localMessage);

        setMessages((prevMessages) => [...prevMessages, localMessage]);
        setNewMessage("");
        setAttachment(null);
        setUploadError("");

        const fileInput = document.getElementById("file-input");
        if (fileInput) {
          fileInput.value = "";
        }
      } else {
        console.error("WebSocket không được kết nối");
      }
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
      setUploadError("Có lỗi xảy ra khi tải file lên. Vui lòng thử lại.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
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
    pollMessages();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.size > MAX_FILE_SIZE) {
      setUploadError("File quá lớn. Vui lòng chọn file nhỏ hơn 100MB");
      setAttachment(null);
      event.target.value = "";
      return;
    }
    setUploadError("");
    setAttachment(file);
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

  const handleRevokeMessage = async (messageId) => {
    if (!currentUserId) return;

    try {
      const response = await axios.delete(
        `http://localhost:8080/api/messages/${messageId}?userId=${currentUserId}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.status === 200) {
        // Cập nhật state messages
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  content: "Tin nhắn đã được thu hồi",
                  status: "REVOKED",
                }
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Error revoking message:", error);
      alert(error.response?.data || "Không thể thu hồi tin nhắn");
    }
  };

  return (
    <div className="z pt-5" style={{marginTop: '20px'}}>
      <div className="messenger-container">
        <div className="messenger-sidebar">
          <div className="messenger-header" style={{backgroundColor: '#E94F37'}}>
            <h4>Chat TuneBox</h4>
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
                  {activeUser.avatar ? (
                    <img
                      src={activeUser.avatar}
                      alt={activeUser.username}
                      className="avatar-image"
                    />
                  ) : (
                    activeUser.username.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="user-info">
                  <span className="user-name">{activeUser.nickName}</span>
                  <span className="user-status">Active Now</span>
                </div>
              </div>
              <div className="messenger-chat-messages" ref={messagesEndRef}>
                {messages.map((msg, index) => (
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
                      {msg.status === "REVOKED" ? (
                        <em className="revoked-message">
                          Tin nhắn đã được thu hồi
                        </em>
                      ) : (
                        <>
                          {renderMessageContent(msg.content)}
                          {msg.attachments?.map((attachment, idx) => (
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
                                    const errorElement =
                                      document.createElement("div");
                                    errorElement.textContent =
                                      "Không thể tải hình ảnh";
                                    e.target.parentNode.appendChild(
                                      errorElement
                                    );
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
                          ))}

                          {/* Add revoke button for sender's messages within 5 minutes */}
                          {(typeof msg.senderId === "object"
                            ? msg.senderId.id
                            : msg.senderId) === currentUserId &&
                            Date.now() - new Date(msg.creationDate).getTime() <=
                              5 * 60 * 1000 && (
                              <button
                                className="revoke-button"
                                onClick={() => handleRevokeMessage(msg.id)}
                              >
                                Thu hồi
                              </button>
                            )}
                        </>
                      )}
                    </div>
                    <div className="message-time">
                      {formatTimestamp(msg.creationDate)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="messenger-chat-input">
                <label htmlFor="file-input">
                  <i className="fas fa-paperclip attach-icon"></i>
                </label>
                <input
                  type="file"
                  id="file-input"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                {uploadError && (
                  <Alert variant="destructive" className="mb-2">
                    <AlertDescription>{uploadError}</AlertDescription>
                  </Alert>
                )}
                {isUploading && (
                  <div className="flex items-center gap-2 mb-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">
                      Đang tải lên... {uploadProgress}%
                    </span>
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Aa"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && !isUploading && handleSendMessage()
                  }
                  disabled={isUploading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isUploading}
                  className={isUploading ? "opacity-50 cursor-not-allowed" : ""}
                >
                  Send
                </button>
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