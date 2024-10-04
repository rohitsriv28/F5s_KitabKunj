import React from 'react';
import "./ChatBubble.css"

const ChatBubble = ({ onClick }) => {
  const handleClick = (e) => {
    e.preventDefault();
    onClick();
  };

  return (
    <div className="chat-bubble-container">
      <div className="chat-bubble-icon" onClick={handleClick}>
        🗨️
      </div>
    </div>
  );
};

export default ChatBubble;
