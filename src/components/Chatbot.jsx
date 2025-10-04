import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!sessionId) {
      setSessionId(Math.random().toString(36).substring(7));
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
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={toggleChat}
        className="group relative bg-gradient-to-br from-gray-900 via-gray-800 to-black border-2 border-gray-600 text-gray-200 rounded-full w-16 h-16 flex items-center justify-center shadow-2xl hover:shadow-gray-700/50 hover:border-gray-400 transition-all duration-300 hover:scale-110"
        style={{
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(156, 163, 175, 0.3)'
        }}
      >
        {isOpen ? (
          <X className="w-7 h-7 text-gray-300 group-hover:text-white transition-colors" />
        ) : (
          <MessageCircle className="w-7 h-7 text-gray-300 group-hover:text-white transition-colors" />
        )}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>

      {isOpen && (
        <div 
          className="absolute bottom-20 right-0 w-96 h-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 50%, #000000 100%)',
            border: '1px solid rgba(156, 163, 175, 0.3)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(156, 163, 175, 0.2)'
          }}
        >
          {/* Header */}
          <div 
            className="p-4 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
              borderBottom: '2px solid rgba(156, 163, 175, 0.3)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/10 to-transparent"></div>
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-100 to-gray-300 relative z-10">
              Cabio Chat
            </h3>
            <div className="text-xs text-gray-400 mt-1 relative z-10">AI Assistant</div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4" style={{ background: 'rgba(10, 10, 10, 0.8)' }}>
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-20">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-sm">Start a conversation...</p>
              </div>
            )}
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-gray-100 shadow-lg' 
                      : 'bg-gradient-to-br from-gray-800 via-gray-900 to-black text-gray-200 shadow-lg'
                  }`}
                  style={{
                    border: msg.sender === 'user' 
                      ? '1px solid rgba(156, 163, 175, 0.4)' 
                      : '1px solid rgba(107, 114, 128, 0.3)',
                    boxShadow: msg.sender === 'user'
                      ? '0 4px 15px rgba(75, 85, 99, 0.4)'
                      : '0 4px 15px rgba(0, 0, 0, 0.6)'
                  }}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div 
            className="p-4 border-t"
            style={{
              background: 'linear-gradient(135deg, #1f1f1f 0%, #0a0a0a 100%)',
              borderTop: '1px solid rgba(156, 163, 175, 0.2)'
            }}
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 px-4 py-3 rounded-full text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
                style={{
                  background: 'rgba(31, 41, 55, 0.6)',
                  border: '1px solid rgba(156, 163, 175, 0.3)',
                  backdropFilter: 'blur(10px)'
                }}
                placeholder="Type your message..."
              />
              <button 
                onClick={handleSend}
                className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-gray-200 p-3 rounded-full hover:from-gray-600 hover:via-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-gray-700/50 hover:scale-105 border border-gray-600"
                style={{
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)'
                }}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
