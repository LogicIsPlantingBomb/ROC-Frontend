
import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!sessionId) {
      setSessionId(uuidv4());
    }
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: 'user' };
      setMessages([...messages, userMessage]);
      setInput('');

      try {
        const response = await fetch('http://localhost:8000/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question: input, session_id: sessionId }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const botMessage = { text: data.response, sender: 'bot' };
        setMessages(prevMessages => [...prevMessages, botMessage]);
      } catch (error) {
        console.error('Error fetching chatbot response:', error);
        const errorMessage = { text: 'Sorry, I am having trouble connecting. Please try again later.', sender: 'bot' };
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      }
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
      <button
        onClick={toggleChat}
        style={{
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <span>&#129302;</span>
      </button>
      {isOpen && (
        <div style={{
          width: '350px',
          height: '500px',
          background: 'white',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'absolute',
          bottom: '80px',
          right: '0',
        }}>
          <div style={{
            padding: '10px',
            background: '#007bff',
            color: 'white',
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
            Cabio Chat
          </div>
          <div style={{ flex: 1, padding: '10px', overflowY: 'auto', background: '#f9f9f9' }}>
            {messages.map((msg, index) => (
              <div key={index} style={{
                textAlign: msg.sender === 'user' ? 'right' : 'left',
                marginBottom: '10px',
              }}>
                <div style={{
                  display: 'inline-block',
                  padding: '8px 12px',
                  borderRadius: '15px',
                  background: msg.sender === 'user' ? '#007bff' : '#e9e9eb',
                  color: msg.sender === 'user' ? 'white' : 'black',
                  maxWidth: '80%',
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div style={{ padding: '10px', display: 'flex', borderTop: '1px solid #ccc' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '20px',
                border: '1px solid #ccc',
                marginRight: '10px',
              }}
              placeholder="Ask me anything..."
            />
            <button onClick={handleSend} style={{
              padding: '10px 15px',
              borderRadius: '20px',
              border: 'none',
              background: '#007bff',
              color: 'white',
              cursor: 'pointer',
            }}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
