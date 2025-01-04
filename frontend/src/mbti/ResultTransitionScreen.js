import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ResultTransitionScreen.css';

const ResultTransitionScreen = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/result');
  };

  return (
    <div className="result-transition-screen">
        <div>
      <img
        src="/images/character.jpg"
        alt="감사 인사를 하는 부엉이"
        className="thank-owl-image"
      />
      </div>
      <div>
      {/* 맨 위의 "감사합니다" */}
      <h1 className="thank-you-text">감사합니다!</h1>
      </div>


      {/* 부엉이 아래 텍스트 */}
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
  );
};

export default ResultTransitionScreen;
