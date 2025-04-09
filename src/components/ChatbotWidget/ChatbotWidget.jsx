import React, { useState } from 'react';
import './ChatbotWidget.css';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [popupWindow, setPopupWindow] = useState(null);

  const openChatbot = () => {
    if (isOpen) {
      if (popupWindow && !popupWindow.closed) {
        popupWindow.close();
        setPopupWindow(null);
      }
      setIsOpen(false);
    } else {
      const width = 400;
      const height = 600;
      const left = window.screen.width - width - 20;
      const top = 100;
      
      try {
        const newWindow = window.open(
          'https://vaidyamedibot-murex.vercel.app/',
          'MedAccessChatbot',
          `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes,status=no,location=no,menubar=no,toolbar=no`
        );
        
        if (newWindow) {
          setPopupWindow(newWindow);
          setIsOpen(true);
          
          // Check if window was closed
          const checkWindowClosed = setInterval(() => {
            if (newWindow.closed) {
              clearInterval(checkWindowClosed);
              setIsOpen(false);
              setPopupWindow(null);
            }
          }, 1000);
        } else {
          alert("Please allow popups for this website to use the chatbot.");
        }
      } catch (error) {
        console.error("Error opening chatbot:", error);
        alert("There was an error opening the chatbot. Please make sure popups are allowed.");
      }
    }
  };

  return (
    <div className="chatbot-widget-container">
      <button 
        className={`chatbot-widget-button ${isOpen ? 'chatbot-widget-button-active' : ''}`}
        onClick={openChatbot}
        aria-label="Chat with us"
      >
        <div className="chatbot-widget-button-icon">
          {isOpen ? (
            <span>✕</span>
          ) : (
            <span>💬</span>
          )}
        </div>
        {!isOpen && <span className="chatbot-widget-button-text">Chat with Vaidya</span>}
      </button>
    </div>
  );
};

export default ChatbotWidget; 