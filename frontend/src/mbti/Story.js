import React from "react";
import "./Story.css"; 
import logo from '../assets/polilogo.png';

const Story = () => {
  const navigate = useNavigate(); // 컴포넌트 내부에서 useNavigate 호출

  const onNext = () => {
    navigate('/question'); 
  }
  return (
    <div className="story-header">
      <div className="logo-container">
          <img src={logo} alt="PoliTracker Logo" onClick = {handleHomeClick} className="poliLogo" />
      </div>
      <div className="menu">
          <button onClick={handleHomeClick}>Home</button>
      </div>
      </div>
      )
}