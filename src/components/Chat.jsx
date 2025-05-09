import React, { useState, useEffect } from 'react';
import { FiMessageSquare, FiSend, FiX } from 'react-icons/fi';
import axios from 'axios';

const Chat = ({ currentUser }) => {
  const [chatState, setChatState] = useState({
    isOpen: false,
    activeChat: null,
    unreadCounts: {}
  });

  const [conversations, setConversations] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/chat/conversations', {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      setConversations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
    }
  };

  const handleOpenChat = (conversationId) => {
    setChatState(prev => ({
      ...prev,
      isOpen: true,
      activeChat: conversationId
    }));
  };

  const handleCloseChat = () => {
    setChatState(prev => ({
      ...prev,
      isOpen: false,
      activeChat: null
    }));
  };

  const handleSendMessage = async (conversationId) => {
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post(
        'http://localhost:5000/api/chat/messages',
        {
          conversationId,
          content: newMessage
        },
        {
          headers: { Authorization: `Bearer ${currentUser.token}` }
        }
      );

      setConversations(prev => prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: [...conv.messages, response.data]
          };
        }
        return conv;
      }));

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderChatList = () => (
    <div className="chat-list">
      <div className="chat-header">
        <h3>Messages</h3>
        <button className="new-chat-btn">
          <FiMessageSquare /> New Message
        </button>
      </div>
      <div className="conversations-list">
        {loading ? (
          <div className="loading">Loading conversations...</div>
        ) : conversations.length === 0 ? (
          <div className="no-conversations">No conversations yet</div>
        ) : (
          conversations.map(conv => (
            <div 
              key={conv.id} 
              className={`conversation-item ${chatState.activeChat === conv.id ? 'active' : ''}`}
              onClick={() => handleOpenChat(conv.id)}
            >
              <div className="user-status">
                <div className={`avatar-sm ${conv.user.online ? 'online' : ''}`}>
                  {conv.user.initials}
                </div>
              </div>
              <div className="conversation-info">
                <div className="conversation-header">
                  <h4>{conv.user.name}</h4>
                  <span className="last-seen">{conv.user.lastSeen}</span>
                </div>
                <p className="last-message">
                  {conv.messages[conv.messages.length - 1]?.content}
                </p>
              </div>
              {chatState.unreadCounts[conv.id] > 0 && (
                <div className="unread-badge">
                  {chatState.unreadCounts[conv.id]}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderChatWindow = () => {
    const activeConversation = conversations.find(conv => conv.id === chatState.activeChat);
    if (!activeConversation) return null;

    return (
      <div className="chat-window">
        <div className="chat-header">
          <div className="chat-user-info">
            <div className={`avatar-sm ${activeConversation.user.online ? 'online' : ''}`}>
              {activeConversation.user.initials}
            </div>
            <div>
              <h3>{activeConversation.user.name}</h3>
              <span className="status">
                {activeConversation.user.online ? 'Online' : `Last seen ${activeConversation.user.lastSeen}`}
              </span>
            </div>
          </div>
          <button className="close-chat-btn" onClick={handleCloseChat}>
            <FiX />
          </button>
        </div>
        
        <div className="messages-container">
          {activeConversation.messages.map(message => (
            <div 
              key={message.id} 
              className={`message ${message.senderId === currentUser.id ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                <p>{message.content}</p>
                <span className="message-time">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {message.senderId === currentUser.id && (
                  <span className="message-status">{message.status}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="message-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(activeConversation.id)}
          />
          <button 
            className="send-btn"
            onClick={() => handleSendMessage(activeConversation.id)}
          >
            <FiSend />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="messages-section">
      {renderChatList()}
      {chatState.isOpen && renderChatWindow()}
    </div>
  );
};

export default Chat; 