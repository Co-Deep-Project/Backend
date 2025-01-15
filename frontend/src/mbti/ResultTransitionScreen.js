import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ResultTransitionScreen.css';

const ResultTransitionScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scores = location.state.scores;

  const handleContinue = () => {
    navigate('/test/result', { state: { scores } });
  };

  const backgroundStyle = {
    backgroundImage: `url('/images/background1.jpg')`,
    backgroundSize: 'cover', // 배경 이미지를 화면에 꽉 채움
    backgroundPosition: 'center', // 중앙 정렬
    backgroundRepeat: 'no-repeat', // 반복 방지
    width: '100vw', // 화면 너비 100%
    height: '100vh', // 화면 높이 100%
  };

  return (
    <div style={backgroundStyle} className = "total">
      <header id="tracking-header">
        <img
          id="logo"
          src="/images/logo.png"
          alt="PoliTracker"
          onClick={() => navigate("/")}
        />
        <div className="menu">
          <button id="home-button" onClick={() => navigate("/")}>
            Home
          </button>
        </div>
      </header>
      {/* 콘텐츠 박스 */}
      <div className="result-transition-screen">
        <div className="content-box">


          {/* "감사합니다!" */}
          <h1 className="thank-you-text">감사합니다!</h1>

          {/* 본문 텍스트 */}
          <div className="transition-content">
            <p>
              "여러분의 선택이 부엉이 마을에 큰 도움을 주었답니다. 🎉
              <br />
              여러분에게 꼭 맞는 역사적인 인물을 소개해 드릴게요. 준비되셨나요?"
            </p>
          </div>

          {/* 결과 보기 버튼 */}
          <button className="continue-button" onClick={handleContinue}>
            결과 보러 가기 →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultTransitionScreen;
