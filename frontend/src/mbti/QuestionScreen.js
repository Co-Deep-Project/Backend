import React, { useState, useEffect } from "react";
import "./QuestionScreen.css";
import logo from '../assets/polilogo.png';
import { useNavigate } from 'react-router-dom';

const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  const backgroundStyle = {
    backgroundImage: `url('/images/onepage.jpg')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    width: "100vw",
    height: "70vh",
  };

const QuestionScreen = ({ onComplete }) => {
    const navigate = useNavigate();
    const handleHomeClick = () => {
      if (window.confirm("진행 중인 작업이 저장되지 않습니다. 그래도 나가시겠습니까?")) {
        navigate("/"); // 사용자가 '확인'을 클릭하면 홈 페이지로 이동
      }
      // 사용자가 '취소'를 클릭하면 현재 페이지에 머무름
    };
    
    const questions = [
      {
          question: "1. 부엉이 마을의 농부들이 '생계가 너무 어려워요'라며 호소하고 있어요. 당신이라면 어떻게 하고 싶으신가요?",
          answers: [
              { text: "부엉이 마을의 농부들이 더 나은 삶을 살 수 있도록, 임금을 올려야 한다고 생각해요.", scoreType: "economicProgressive" },
              { text: "부엉이 마을의 농부들은 더 열심히 일하고, 자립적으로 생계를 꾸려나가야 한다고 생각해요.", scoreType: "economicConservative" },
          ]
      },
      {
          question: "2. 부엉이 마을에서는 땅값이 너무 비싸서 집을 구하지 못하는 이웃들이 늘어나고 있어요. 당신이라면 어떻게 이 문제를 해결하고 싶으신가요?",
          answers: [
              { text: "지도자로서 부엉이 마을의 규칙을 조정해 땅값을 낮추고, 모두가 집을 가질 수 있도록 돕고 싶어요.", scoreType: "economicProgressive" },
              { text: "아무리 지도자여도 땅값에 간섭할 권리는 없다고 생각하고, 자연스럽게 시장에 맡겨야 한다고 생각해요.", scoreType: "economicConservative" },
          ]
      },
      {
          question: "3. 돈이 많은 부엉이들과 가난한 부엉이들 사이의 격차가 점점 커지고 있습니다. 이때 당신이라면 어떻게 하고 싶으신가요?",
          answers: [
              { text: "지도자가 돈이 더 많은 부엉이들에게 더 많은 세금을 거둬 가난한 부엉이들을 돕는 데 사용해야 한다고 생각해요.", scoreType: "economicProgressive" },
              { text: "부엉이들 간의 금전 차이는 자연스러운 것이며, 지도자가 이를 따로 조정할 필요는 없다고 생각해요.", scoreType: "economicConservative" },
          ]
      },
      {
          question: "4. 많은 부엉이들이 일거리를 찾지 못해 힘들어하고 있습니다. 당신이라면 어떻게 하고 싶으신가요?",
          answers: [
              { text: "지도자가 직접 나서서 농업이나 토목 사업 등을 시작해 부엉이들에게 일할 기회를 만들어야 한다고 생각해요.", scoreType: "economicProgressive" },
              { text: "지도자는 부엉이들이 스스로 생업을 찾아 해결하도록 두고, 필요한 최소한의 여건만 마련해야 한다고 생각해요.", scoreType: "economicConservative" },
          ]
      },
      {
          question: "5. 부엉이 마을에는 깃털 장수가 있어요. 인간 세상으로 따지면 상인이 되겠네요. 당신이라면 깃털 장수들을 도우실 것인가요?",
          answers: [
              { text: "지도자는 깃털 장수들의 거래가 공정하게 이루어지도록 관리하고, 국가의 이익을 위해 깃털 장수들이 번성할 수 있도록 도와야 해요.", scoreType: "economicProgressive" },
              { text: "지도자는 깃털 장수들의 일에 간섭하지 말고, 깃털 장수들이 자유롭게 무역을 하고 활동할 수 있도록 해야 돼요.", scoreType: "economicConservative" },
          ]
      },
      {
          question: "6. 부엉이 마을, 토끼 마을, 호랑이 마을이 사실 원래 하나의 동물 마을이었다는 사실을 알고 있으셨나요? 이들은 세 나라로 나뉜 후에 서로 사이가 좋지 않아 대립하고 있습니다. 이를 해결하기 위해 당신이라면 어떻게 하실 것인가요?",
          answers: [
              { text: "세 마을들을 하나로 통일하여 동물들이 전처럼 평화롭게 살 수 있도록 노력해야 해요.", scoreType: "diplomaticProgressive" },
              { text: "각 마을들은 독립적으로 존재해야 하며, 통일을 위해 힘쓸 필요는 없다고 생각해요.", scoreType: "diplomaticConservative" },
          ]
      },
      {
          question: "7. 지도자인 당신 주위에서 군사력이 강한 호랑이 나라와 군사 동맹을 맺어야 한다는 의견이 많아요. 이에 대해 당신이라면 어떻게 하실 것인가요?",
          answers: [
              { text: "호랑이 마을과의 동맹을 강화하고, 협력을 통해 나라를 더 안전하게 만들어야 해요.", scoreType: "diplomaticProgressive" },
              { text: "동맹을 맺되, 부엉이 마을이 불리한 조건을 받지 않도록 신중히 접근해야 해요.", scoreType: "diplomaticConservative" },
          ]
      },
      {
          question: "8. 최근 부엉이 마을의 산림이 자주 훼손되고 있습니다. 당신은 이를 어떻게 해결하실 것인가요?",
          answers: [
              { text: "산림 보호는 매우 중요하기 때문에, 이를 위한 강력한 정책을 지금 당장 시행해야 해요.", scoreType: "diplomaticProgressive" },
              { text: "지나친 규제는 부엉이 주민들에게 부담을 줄 수 있으므로, 너무 엄격한 규제는 피해야 해요.", scoreType: "diplomaticConservative" },
          ]
      },
      {
          question: "9. 호랑이 마을이 전쟁으로 피폐해지거나, 토끼 마을이 가뭄에 시달릴 경우, 어떻게 해야 할까요?",
          answers: [
              { text: "다른 마을이 어려움에 처했을 때, 우리 부엉이들이 힘을 합쳐 돕는 것이 중요하므로, 돕는 것이 옳아요.", scoreType: "diplomaticProgressive" },
              { text: "우리 부엉이들도 어려운 시기이기 때문에, 우리 마을에 더 많은 신경을 써야 해요.", scoreType: "diplomaticConservative" },
          ]
      },
      {
          question: "10. 토끼 마을과 호랑이 마을의 싸움이 커져서 부엉이 마을에도 영향을 미쳤을 때, 응징을 해야 할까요?",
          answers: [
              { text: "외부 마을과의 충돌을 피하고, 협상과 대화를 통해 문제를 평화적으로 해결하는 것이 중요해요.", scoreType: "diplomaticProgressive" },
              { text: "부엉이 마을의 안전을 지키기 위해서는 외부 마을에 대한 단호한 처벌이 필요해요.", scoreType: "diplomaticConservative" },
          ]
      },
      {
          question: "11. 부엉이 마을은 도시 부엉이들과 시골 부엉이들로 이루어져 있습니다. 시골 부엉이들은 도시 부엉이들에 비해 공부할 수 있는 기회가 많이 없어요. 당신이라면 이때 어떻게 하실 것인가요?",
          answers: [
              { text: "시골 부엉이들도 도시 부엉이들과 똑같이 배워야 합니다. 그러므로 지도자는 시골 부엉이들에게 더 많은 교육 기회를 제공해야 해요.", scoreType: "socialProgressive" },
              { text: "시골 부엉이들도 도움이 필요하지만, 그렇다고 시골 부엉이들에게 추가로 기회를 주는 것은 역차별이 될 수 있으므로 더 많은 혜택을 주는 것은 옳지 않습니다.", scoreType: "socialConservative" },
          ]
      },
      {
          question: "12. 엄중한 범죄를 저지른 부엉이에게 사형이라는 형벌을 내려도 될까요?",
          answers: [
              { text: "아니요. 범죄를 저지른 부엉이를 교화할 수 있는 처벌이 필요해요.", scoreType: "socialProgressive" },
              { text: "네. 범죄를 막기 위해서는 엄격한 처벌이 필요해요.", scoreType: "socialConservative" },
          ]
      },
      {
          question: "13. 살다보니 엄마 부엉이가 원치않게 임신을 할때가 있던데, 이럴때 낙태를 허용해야할까요?",
          answers: [
              { text: "네! 엄마 부엉이가 선택할 수 있어야 해요.", scoreType: "socialProgressive" },
              { text: "아기 부엉이도 소중한 생명이기 때문에 낙태는 안 돼요.", scoreType: "socialConservative" },
          ]
      },
      {
          question: "14. 하인 부엉이의 근무 시간과 임금을 누가 정해야 할까요?",
          answers: [
              { text: "지도자가 규칙을 만들어 규제하여 하인 부엉이들의 권리를 보호하고, 그들의 삶을 보장해야 해요.", scoreType: "socialProgressive" },
              { text: "주인 부엉이가 자유롭게 운영할 수 있어야 해요.", scoreType: "socialConservative" },
          ]
      },
      {
          question: "15. 부엉이가 전통적인 혼인 규범을 벗어나 다른 동물과 결혼하는 것에 대해 어떻게 생각하시나요?",
          answers: [
              { text: "결혼은 사랑에 따라 자유롭게 이루어져야 해요.", scoreType: "socialProgressive" },
              { text: "전통적인 규범을 지키는 것이 중요한 것 같아요.", scoreType: "socialConservative" },
          ]
      }
  ];
  

  const totalQuestions = questions.length;
  const [shuffledQuestions] = useState(
    questions.map((q) => ({
      ...q,
      answers: shuffleArray(q.answers),
    }))
  );

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [scores, setScores] = useState({
    economicProgressive: 0,
    economicConservative: 0,
    diplomaticProgressive: 0,
    diplomaticConservative: 0,
    socialProgressive: 0,
    socialConservative: 0,
  });
  const [answers, setAnswers] = useState(Array(totalQuestions).fill(null)); // 각 질문의 선택값 기록
  const [isFlipping, setIsFlipping] = useState(false);
  const generateRandomKey = () => Math.random().toString(36).substring(2, 10);


  const [answerHistory, setAnswerHistory] = useState([]);
  const [animationState, setAnimationState] = useState("");
  const [randomKey] = useState(() => generateRandomKey());

  const handleNext = () => {
    if (selectedAnswer === null) {
      alert("선지를 선택해주세요!");
      return;
    }
  
    setAnimationState("flipping-out"); // 애니메이션 상태 설정
  
    const currentQ = shuffledQuestions[currentQuestion];
    const selectedScoreType = currentQ.answers[selectedAnswer].scoreType;
  
    // 마지막 질문인지 확인
    if (currentQuestion < totalQuestions - 1) {
      // 선택값 반영
      const updatedScores = {
        ...scores,
        [selectedScoreType]: scores[selectedScoreType] + 1,
      };
  
      setScores(updatedScores); // 상태 업데이트
      console.log(`업데이트된 점수:`, updatedScores);

      setAnswers((prevAnswers) => {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[currentQuestion] = selectedAnswer;
        return updatedAnswers;
      });
  
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null); // 선택 초기화
        setAnimationState(""); // 애니메이션 상태 초기화
      }, 800); // 애니메이션 지속 시간
    } else {
      // 마지막 질문일 경우 결과로 이동 전에 선택값 반영
      const finalScores = {
        ...scores,
        [selectedScoreType]: scores[selectedScoreType] + 1,
      };
      
  console.log(`최종 점수:`, finalScores);
      const queryParams = new URLSearchParams(finalScores).toString();
      navigate(`/test/result-transition?${queryParams}`);
    }
  };
  


  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setIsFlipping(true); // 애니메이션 시작
  
      const previousQuestionIndex = currentQuestion - 1;
      const previousAnswerIndex = answers[previousQuestionIndex]; // 이전 답변 인덱스 사용
      const previousScoreType = previousAnswerIndex !== null ? shuffledQuestions[previousQuestionIndex].answers[previousAnswerIndex].scoreType : null;
  
      // 점수 감소 및 콘솔 로그 출력
      if (previousScoreType && scores[previousScoreType] > 0) {
        const newScore = scores[previousScoreType] - 1;
        setScores({
          ...scores,
          [previousScoreType]: newScore,
        });
        console.log(`점수 감소: ${previousScoreType} from ${scores[previousScoreType]} to ${newScore}`);
      }
  
      setTimeout(() => {
        setCurrentQuestion(previousQuestionIndex);
        setSelectedAnswer(previousAnswerIndex); // 이전에 선택된 답변을 다시 선택 상태로 설정
        setIsFlipping(false); // 애니메이션 종료
        console.log(`현재 질문: ${previousQuestionIndex}, 선택된 답변: ${previousAnswerIndex}`);
      }, 800); // 애니메이션 지속 시간
    }
  };
  

  const handleAnswerClick = (index) => {
    setSelectedAnswer(index);  // 사용자가 선택한 답변 인덱스를 상태에 저장
};
  return (
    <div>
      <div className="question-header">
        <div className="logo-container">
          <img
            src="/images/logo.png"
            alt="PoliTracker"
            onClick={handleHomeClick}
            className="logo"
          />
        </div>
        <div className="menu">
          <button id="home-button" onClick={handleHomeClick}>
            Home
          </button>
        </div>
      </div>

      <div  style={backgroundStyle} className={`question-box ${animationState}`}>
        <div className="page">
          <div className="front">
            <div className="progress-wrapper">
              <p className="progress-text">
                {currentQuestion + 1} / {totalQuestions}
              </p>
              <div className="status-bar">
                <div
                  className="status-bar-fill"
                  style={{
                    width: `${((currentQuestion + 1) / totalQuestions) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="qBox">
              <h2>{shuffledQuestions[currentQuestion].question}</h2>
            </div>
            <div className="answerBox">
              {shuffledQuestions[currentQuestion].answers.map((answer, index) => (
                <button
                  key={index}
                  className={`answer-button ${
                    selectedAnswer === index ? "selected" : ""
                  }`}
                  onClick={() => handleAnswerClick(index)}
                >
                  {answer.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      

      <div className="button-container">
        <button
          className="prev-button"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          이전
        </button>
        <button className="next-button" onClick={handleNext}>
          다음
        </button>
      </div>
      </div>
      <footer className="footer">
        <p>
          성균관대학교 트래커스꾸
          <br />
          서울특별시 종로구 성균관로 25-2
          <br />
          trackerskku@g.skku.edu
        </p>
      </footer>
    </div>
   
  );
};

export default QuestionScreen;