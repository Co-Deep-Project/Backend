import React, { useState } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]); 
  const [inputValue, setInputValue] = useState(""); 

  const toggleChatbot = () => {
    setIsOpen(!isOpen);

    // 챗봇이 열릴 때 초기 메시지 설정
    if (!isOpen) {
      setMessages([
        ...messages,
        { sender: "bot", text: "안녕하세요!👋 POLITRACKER 챗봇입니다. 궁금한 점을 물어보세요☺️" },
        { sender: "bot", text: "예: '종로구 뉴스', '곽상언 관련 법안' 등을 입력해보세요." }
      ]);
    }
  }; 

  const handleSend = async () => {
    console.log("API URL:", `${process.env.REACT_APP_BACKEND_URL}/chatbot`);

    if (inputValue.trim() === "") return;

    const userMessage = { sender: "user", text: inputValue };
    setMessages((prev) => [...prev, userMessage]);

    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/chatbot`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: inputValue }),
        });
      

        const data = await response.json();
        const botMessage = { sender: "bot", text: data.response };
        setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
        console.error("Error communicating with chatbot:", error);
        const errorMessage = { sender: "bot", text: "서버와의 연결에 문제가 발생했습니다." };
        setMessages((prev) => [...prev, errorMessage]);
    }

    setInputValue(""); 
  };

  const renderMessageContent = (message) => {
    if (message.sender === "bot" && message.text.includes("제목:")) {
      // 뉴스 데이터를 파싱하여 렌더링
      const newsItems = message.text.split("\n\n"); // 뉴스 항목 구분
      return (
        <div>
          {newsItems.map((item, index) => {
            const [titleLine, linkLine] = item.split("\n");
            const title = titleLine.replace("제목: ", "").trim();
            const link = linkLine.replace("링크: ", "").trim();
            return (
              <div key={index} className="news-item">
                <strong>최신뉴스 {index + 1}:</strong> <br />
                <strong className="news-title">{title}</strong> <br />
                <a href={link} target="_blank" rel="noopener noreferrer" className="news-link">
                  {link}
                </a>
                <br />
              </div>
            );
          })}
        </div>
      );
    }
    return <span>{message.text}</span>;
  };

  return (
    <div className="chatbot-container">
      {!isOpen && (
        <div className="chatbot-button" onClick={toggleChatbot}>
          💬
        </div>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>POLITRACKER Chatbot</span>
            <button className="close-button" onClick={toggleChatbot}>
              ✖
            </button>
          </div>
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chatbot-message ${message.sender === "user" ? "user" : "bot"}`}
              >
                {renderMessageContent(message)}
              </div>
            ))}
          </div>
          <div className="chatbot-input-container">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="chatbot-input"
            />
            <button onClick={handleSend} className="send-button">
              전송
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
