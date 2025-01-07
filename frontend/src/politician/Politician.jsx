import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Politician = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const districtName = location.state?.district || "알 수 없음";
    console.log(districtName);

    return (
        <div className="desktop">
            <header id="tracking-header">
                <img
                id="logo"
                src="/images/logo.png"
                alt="PoliTracker"
                onClick={() => navigate("/")}
                />
                <div id="button-container">
                <button id="region-button" onClick={() => navigate("/select-region")}>
                    구
                </button>
                <button id="home-button" onClick={() => navigate("/")}>
                    Home
                </button>
                </div>
            </header>
            <h1>{districtName} 국회의원 조회</h1>
        </div>
    );
};

export default Politician;
