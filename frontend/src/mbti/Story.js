import React, { useState } from "react";
import "./Story.css"; // 추가 CSS
import { useNavigate } from "react-router-dom";

const Story = () => {
  const navigate = useNavigate();

  const storyLines = [
    "옛날 옛적, 푸른 숲과 맑은 강으로 둘러싸인 부엉이 마을이 있었어요.",
    "부엉이 마을은 지혜롭고 평화로운 부엉이들이 모여 사는 곳으로, 모두가 협력하며 행복하게 살고 있었답니다.",
    "하지만 어느 날, 이웃한 토끼 마을과 호랑이 마을 사이에 갈등이 생기기 시작했어요.",
    "토끼 마을은 더 많은 농지를 원했고, 호랑이 마을은 강한 힘으로 모든 것을 지배하려 했죠.",
    "부엉이 마을은 이 갈등 속에서 중재자 역할을 하며 평화를 지키려 노력했지만, 점차 이웃들과의 다툼에 휘말리게 되었답니다.",
    "여러분은 지금부터 부엉이 마을의 지도자가 되어 현명한 선택으로 마을을 이끌어야 해요.",
    "어떻게 하면 부엉이 마을이 평화를 되찾고 번영할 수 있을까요?",
  ];

  const [currentLine, setCurrentLine] = useState(0);

  const handleNext = () => {
    if (currentLine < storyLines.length - 1) {
      setCurrentLine(currentLine + 1);
    } else {
      navigate("/question"); // 모든 문장이 끝나면 질문 화면으로 이동
    }
  };

  const handleHomeClick = () => {
    if (window.confirm("진행 중인 작업이 저장되지 않습니다. 그래도 나가시겠습니까?")) {
      navigate("/");
    }
  };

  const backgroundStyle = {
    backgroundImage: `url('/images/background1.jpg')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100vh",
  };

  return (
    <div style={backgroundStyle}>
      <div className="story-header">
        <div className="logo-container">
          <img
            src="/images/logo.png"
            alt="PoliTracker Logo"
            onClick={handleHomeClick}
            className="poliLogo"
          />
        </div>
        <div className="menu">
          <button onClick={handleHomeClick}>Home</button>
        </div>
      </div>
      <div className="story-screen">
      <img
            src="/images/character.jpg"
            alt="부엉이"
            className="owl-image"
          />
        <div className="story-content">
 
          <div className="story-text">
            <p>{storyLines[currentLine]}</p>
          </div>
        </div>
        <button onClick={handleNext} className="story-next-button">
          {currentLine < storyLines.length - 1 ? "다음" : "시작하기"}
        </button>
      </div>
    </div>
  );
};

export default Story;
