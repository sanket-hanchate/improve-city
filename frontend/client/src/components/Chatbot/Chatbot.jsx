import React, { useState, useEffect } from "react";
import './index.css';
// Inline SVG for the Send icon (Cyan themed)
const SendIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

// Inline SVG for a basic loading spinner
const SpinnerIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hello! I'm CivicFlow's Status Bot. I can help you check the progress of your service requests. Try asking: **'What is the status of ID 1?'** or **'Check complaint 2.'**",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Ref for auto-scrolling
  const messagesEndRef = React.useRef(null);

  // Scroll to the latest message whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);


  // Helper to safely render Markdown content (like bold text)
  const renderMessage = (text) => {
    // Basic markdown for **bold** text
    const parts = text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-semibold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
    return <>{parts}</>;
  };

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    // 1. Add user message
    const userMsg = { from: "user", text: trimmedInput };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const idMatch = trimmedInput.match(/\b\d+\b/); // find any number typed
    let botReply =
      "I'm sorry, I need a complaint ID to check the status. Please try phrasing it like: 'What is the status for ID 42?'";

    if (idMatch) {
      const id = idMatch[0];
      try {
        // --- Mocking the response for this single-file environment ---
        // In a real application, replace this with your actual fetch call:
        // const res = await fetch(`http://localhost:5000/api/complaints/${id}`);
        
        let data = {};
        if (id === '1') {
             data = { status: "Resolved", description: "Pothole repair completed." };
        } else if (id === '2') {
             data = { status: "In Progress", description: "Awaiting inspection by field team." };
        } else if (id === '42') {
             data = { status: "Pending", description: "Complaint filed, waiting for assignment." };
        } else {
             throw new Error("Complaint not found");
        }
        // -----------------------------------------------------------
        
        botReply = `Success! Complaint **#${id}** is currently **${data.status}**. Details: *${data.description}*`;

      } catch (error) {
        // Handle network errors or mock 'not found' error
        botReply = `We couldn't locate complaint ID **#${id}** in our system. Please ensure the number is correct.`;
      } 
    }
    
    // 2. Add bot reply after a short delay
    setTimeout(() => {
        setIsLoading(false);
        setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
    }, 800);
  };

  return (
    <>
      <div className="app-container">
        <div className="chat-card">
          
          {/* Header */}
          <div className="chat-header">
            <div className="icon-container">
              <SendIcon className="header-icon" />
            </div>
            <h2 className="header-title">
              CivicFlow Status Bot
            </h2>
          </div>

          {/* Chat History Container */}
          <div className="chat-history">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`message-row ${
                  m.from === "bot" ? "bot" : "user"
                }`}
              >
                {/* Message Bubble */}
                <div
                  className={`message-bubble ${
                    m.from === "bot" ? "bot-bubble" : "user-bubble"
                  }`}
                >
                  {renderMessage(m.text)}
                </div>
              </div>
            ))}

            {/* Loading Indicator Bubble */}
            {isLoading && (
              <div className="message-row bot">
                  <div className="message-bubble bot-bubble">
                      <div className="loading-indicator">
                          <SpinnerIcon className="spinner-icon" />
                          <span>Bot is checking status...</span>
                      </div>
                  </div>
              </div>
            )}
            
            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="input-area">
            <input
              className="input-field"
              placeholder="Type a complaint ID (e.g., ID 1)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="send-button"
            >
              <SendIcon className="send-icon" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
