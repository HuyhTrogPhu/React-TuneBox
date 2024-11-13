import axios from 'axios';
import React, { useState } from 'react';

const TrackAI = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSendMessage = async () => {
    if (input.trim() === '') {
      return;
    }

    try {
      // Gửi yêu cầu đến API Suno để tạo bài hát từ lyric
      const response = await axios.post(
        'https://api.sunoapi.com/api/v2/suno/v3.0/custom/create-lyrics-song',
        {
          prompt: input, // Lyric gửi từ người dùng
          tags: "epic reggae",
          negative_tags: "man voice",
          title: "Electric Dreams"
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Cập nhật lịch sử trò chuyện với phản hồi từ API Suno
      setMessages([...messages, { text: input, type: 'user' }]);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: response.data.song_url || 'Bài hát được tạo thành công!', type: 'ai' },
      ]);
      setInput('');
    } catch (error) {
      console.error("Error generating song:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'Có lỗi xảy ra khi tạo bài hát.', type: 'error' },
      ]);
    }
  };

  return (
    <div className='row container'>
      <div className='col-12'>
        {messages.map((message, index) => (
          <div key={index} className={message.type}>
            {message.text}
          </div>
        ))}
      </div>
      <div className='col-12'>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập lyric của bạn..."
        />
        <button onClick={handleSendMessage}>Tạo bài hát</button>
      </div>
    </div>
  );
};

export default TrackAI;
