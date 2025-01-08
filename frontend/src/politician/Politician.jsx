import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./politician.css"; 

const API_KEY = process.env.REACT_APP_API_KEY;

const Politician = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const district = location.state?.district || "알 수 없음";
    const districtName = "서울 " + district;

    const [politicians, setPoliticians] = useState([]);
    const decodeHTMLEntities = (text) => {
        const doc = new DOMParser().parseFromString(text, "text/html");
        return doc.documentElement.textContent;
    };
    
    const parseXMLtoJSON = (xml) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, "text/xml");
        const rows = xmlDoc.getElementsByTagName("row");

        const result = [];
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            result.push({
                HG_NM: row.getElementsByTagName("HG_NM")[0]?.textContent || "정보가 제공되지 않습니다.",
                POLY_NM: row.getElementsByTagName("POLY_NM")[0]?.textContent || "정보가 제공되지 않습니다.",
                UNITS: row.getElementsByTagName("UNITS")[0]?.textContent || "정보가 제공되지 않습니다.",
                ORIG_NM: row.getElementsByTagName("ORIG_NM")[0]?.textContent || "정보가 제공되지 않습니다.",
                E_MAIL: row.getElementsByTagName("E_MAIL")[0]?.textContent || "정보가 제공되지 않습니다.",
                MEM_TITLE: row.getElementsByTagName("MEM_TITLE")[0]?.textContent || "정보가 제공되지 않습니다.",
            });
        }
        console.log(result);
        return result;
    };

    useEffect(() => {
        const fetchPoliticians = async () => {
            try {
                const response = await fetch(
                    `https://open.assembly.go.kr/portal/openapi/nwvrqwxyaytdsfvhu?KEY=${API_KEY}&TYPE=xml&ORIG_NM=${encodeURIComponent(districtName)}`
                );
                const xmlData = await response.text();
                const jsonData = parseXMLtoJSON(xmlData);
                setPoliticians(jsonData);
            } catch (error) {
                console.error("Error fetching politicians:", error);
            }
        };

        fetchPoliticians();
    }, [districtName]);

// 카드 클릭 핸들러
    const handleCardClick = () => {
        if (districtName === "종로구") {
            navigate("/seoin");
        } else {
            alert("현재 지원하는 국회의원 정보가 아닙니다.\n구버튼을 클릭하여 다시 구를 선택하세요.\n(현재는 종로구만 지원중입니다.)");
        }
    };

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
                    <button id="region-button" onClick={() => navigate("/select-region")}>구 선택</button>
                    <button id="home-button" onClick={() => navigate("/")}>Home</button>
                </div>
            </header>

            <h1 className="constituency-name">{districtName} 국회의원</h1>

            <div className="profile-list">
                {politicians.length > 0 ? (
                    politicians.map((politician, index) => (
                        <div
                            className="politician-profile"
                            key={index}
                            onClick={handleCardClick}
                        >
                            <h2>{politician.HG_NM}</h2>
                            <p><strong>정당:</strong> {politician.POLY_NM}</p>
                            <p><strong>당선:</strong> {politician.UNITS}</p>
                            <p><strong>선거구:</strong> {politician.ORIG_NM}</p>
                            <p><strong>이메일:</strong> {politician.E_MAIL}</p>
                            <p><strong>학력 및 경력:</strong></p>
                            <ul>
                                {politician.MEM_TITLE.split("\n")
                                    .filter((item) => item.trim() !== "")
                                    .slice(0, 6)
                                    .map((item, idx) => (
                                        <li key={idx}>{decodeHTMLEntities(item.trim())}</li> 
                                    ))}
                                {politician.MEM_TITLE.split("\n").filter((item) => item.trim() !== "").length > 5 && (
                                    <li>⋮</li>
                                )}
                            </ul>
                        </div>
                    ))
                ) : (
                    <p>해당 지역구의 국회의원 정보를 불러오는 중입니다...</p>
                )}
            </div>

            <footer className="footer">
                <p>성균관대학교 트래커스꾸</p>
                <p>서울특별시 종로구 성균관로 25-2</p>
                <p>trackerskku@g.skku.edu</p>
            </footer>
        </div>
    );
};

export default Politician;