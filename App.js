import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState(
    localStorage.getItem('chatUsername') || ''
  );
  const socketRef = useRef();
  const messagesEndRef = useRef();

  useEffect(() => {
    // Connect to server
    socketRef.current = io('http://localhost:5000');

    // Load message history
    socketRef.current.on('messageHistory', (history) => {
      setMessages(history);
    });

    // Listen for new messages
    socketRef.current.on('newMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socketRef.current.disconnect();
  }, []);

  // Auto-scroll to newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !username) return;
    
    socketRef.current.emit('sendMessage', {
      sender: username,
      content: input.trim()
    });
    setInput('');
  };

  return (
    <div className="app">
      <div className="chat-container">
        <div className="messages">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`message ${msg.sender === username ? 'own' : ''}`}
            >
              <div className="meta">
                <span className="sender">{msg.sender}</span>
                <span className="time">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="content">{msg.content}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>

        <div className="username">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={() => localStorage.setItem('chatUsername', username)}
            placeholder="Your username"
          />
        </div>
      </div>
    </div>
  );
}

export default App;