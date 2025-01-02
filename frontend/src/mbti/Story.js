import React from "react";
import "./Story.css";
import { useNavigate } from "react-router-dom";
import logo from "../assets/polilogo.png";

const Story = () => {
  const navigate = useNavigate();

  const onNext = () => {
    navigate("/question"); // 질문 화면으로 이동
  };

  const handleHomeClick = () => {
    if (window.confirm("진행 중인 작업이 저장되지 않습니다. 그래도 나가시겠습니까?")) {
      navigate("/"); // 홈으로 이동
    }
  };

  return (
    <div className="story-container">
      <div className="logo-container">
        <img src={logo} alt="PoliTracker Logo" onClick={handleHomeClick} className="poliLogo" />
      </div>
      <div className="menu">
        <button onClick={handleHomeClick}>Home</button>
      </div>
      <div className="story-content">
        <img src="/images/character.jpg" alt="Character" className="story-image" />
        <p className="story-text">
          옛날 옛적에 부엉이 마을이 있었어요. 이 마을은 오순도순 살다가 이웃 국가인 토끼 마을과 호랑이 마을과 싸움이 일어나게 되었죠.
        </p>
        <button className="story-button" onClick={onNext}>
          다음으로
        </button>
      </div>
    </div>
  );
};

export default Story;
