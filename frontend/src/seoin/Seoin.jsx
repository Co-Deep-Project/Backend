import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./seoin_style.css";
import "./VoteFilter.css";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const Congressman = () => {
  const navigate = useNavigate();
  const [votes, setVotes] = useState([]);
  const [allVotes, setAllVotes] = useState([]); // 추가
  const [bills, setBills] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [activeTab, setActiveTab] = useState("votes");
  const [votesLoading, setVotesLoading] = useState(true);
  const [billsLoading, setBillsLoading] = useState(true);
  const [voteFilter, setVoteFilter] = useState("all");
  const [billFilter, setBillFilter] = useState("all");

  const ITEMS_PER_PAGE = 3;
  const memberName = "곽상언";

  // ✅ 서버에 한 번만 데이터를 요청하는 useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 상태 체크
        const statusResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/status`);
        const status = await statusResponse.json();
        console.log("서버 상태 확인:", status);

        if (status.vote_data_loaded && status.bills_data_loaded) {
          console.log("모든 데이터 로드 완료");

          // ✅ 투표 데이터와 법안 데이터 fetch
          await fetchVotesFromServer();
          await fetchBillsFromServer();
        } else {
          console.log("데이터가 아직 로드되지 않았습니다.");
        }
      } catch (error) {
        console.error("데이터 로드 중 오류 발생:", error);
      }
    };

    // ✅ 컴포넌트가 로드될 때 한 번만 fetch 실행
    fetchData();
  }, []);

  const handleVoteFilter = (filterType) => {
    setVoteFilter(filterType);
    setExpanded({});
    let filteredVotes;
    
    if (filterType === "all") {
      filteredVotes = votes.filter(vote => vote.RESULT_VOTE_MOD !== "불참");
    } else {
      filteredVotes = votes.filter(vote => vote.RESULT_VOTE_MOD === filterType);
    }
    
    setDisplayData(filteredVotes.slice(0, ITEMS_PER_PAGE));
  };
  
  const handleBillFilter = (filterType) => {
    setBillFilter(filterType);
    setExpanded({});
    let filteredBills;
    
    if (filterType === "all") {
      filteredBills = bills;
    } else {
      filteredBills = bills.filter(bill => bill.type === filterType);
    }
    
    setDisplayData(filteredBills.slice(0, ITEMS_PER_PAGE));
  };

  // ✅ Votes 데이터 Fetch 함수
  const fetchVotesFromServer = async () => {
    setVotesLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/vote_data?member_name=${memberName}`
      );
      const data = await response.json();
      console.log("Received votes data:", data);
      setAllVotes(data);
      const filteredData = data.filter((vote) => vote.RESULT_VOTE_MOD !== "불참");
      setVotes(filteredData);

      // ✅ 초기 표시 데이터 설정 (최대 3개)
      if (activeTab === "votes") {
        setDisplayData(filteredData.slice(0, ITEMS_PER_PAGE));
      }
    } catch (error) {
      console.error("서버 요청 오류:", error);
    }
    setVotesLoading(false);
  };




  // ✅ Bills 데이터 Fetch 함수
  const fetchBillsFromServer = async () => {
    setBillsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/bills_combined?member_name=${memberName}`
      );
      const data = await response.json();
      console.log("Received bills data:", data);
      const sortedBills = data.sort(
        (a, b) => new Date(b.propose_date) - new Date(a.propose_date)
      );
      setBills(sortedBills);
      if (activeTab === "bills") {
        setDisplayData(sortedBills.slice(0, ITEMS_PER_PAGE));
      }
    } catch (error) {
      console.error("서버 요청 오류:", error);
    }
    setBillsLoading(false);
  };


// 그래프 추가
const groupByCommittee = (bills) => {
  const committeeCount = {};

  bills.forEach((bill) => {
    // 소관위원회별로 카운트 (대표발의/공동발의 구분 제거)
    const committee = bill.committee || "미분류";
    committeeCount[committee] = (committeeCount[committee] || 0) + 1;
  });

  // 카운트를 기준으로 내림차순 정렬
  const sortedCommittees = Object.entries(committeeCount).sort(
    (a, b) => b[1] - a[1]
  );

  return Object.fromEntries(sortedCommittees);
};

const prepareChartData = (committeeCount) => {
  const labels = Object.keys(committeeCount);
  const data = Object.values(committeeCount);

  return {
    labels,
    datasets: [
      {
        label: "소관위원회별 법안 분포",
        data,
        backgroundColor: [
          "#cfc2e9",
          "#b6a9d4",
          "#8a81a9",
          "#67646c",
          "#3b383e",
          "#9c9c9c",
          "#d3d3d3",
          "#ececec",
          "#7f7f7f",
          "#5a5a5a",
        ],
        hoverOffset: 4,
      },
    ],
  };
};

const CommitteePieChart = ({ bills }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // ✅ 화면 크기 변경 시 isMobile 상태 업데이트
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // ✅ resize 이벤트 리스너 추가
    window.addEventListener("resize", handleResize);

    // ✅ 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const committeeCount = useMemo(() => groupByCommittee(bills), [bills]);
  const chartData = useMemo(() => prepareChartData(committeeCount), [committeeCount]);

  const options = {
    plugins: {
      legend: {
        display: isMobile, // 모바일에서는 legend 활성화
        position: "top",
        labels: {
          boxWidth: 12,
          padding: 10,
          font: {
            size: 12,
          },
          generateLabels: (chart) => {
            const data = chart.data;
            return data.labels
              .map((label, index) => {
                const value = data.datasets[0].data[index];
                const total = data.datasets[0].data.reduce((sum, val) => sum + val, 0);
                const percentage = ((value / total) * 100).toFixed(1);
  
                if (percentage > 5) {
                  return {
                    text: `${label} (${percentage}%)`.replace(/(.{20})/g, "$1\n"),
                    fillStyle: data.datasets[0].backgroundColor[index],
                  };
                }
                return null;
              })
              .filter(Boolean); // null 값 제거
          },
        },
      },
      datalabels: {
        color: isMobile ? "transparent" : "#000", // 모바일에서는 투명하게 처리
        font: {
          size: 10,
        },
        formatter: (value, context) => {
          const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
          const percentage = ((value / total) * 100).toFixed(1);
  
          if (percentage > 5) {
            return `${context.chart.data.labels[context.dataIndex]} (${percentage}%)`;
          }
          return "";
        },
        anchor: "end",
        align: "end",
        offset: 10,
        padding: {
          top: 12,
          bottom: 12,
        },
        overlap: false,
        clamp: true,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
  };  

  const chartWidth = isMobile ? "100%" : "800px";
  const chartHeight = isMobile ? "250px" : "350px";

  return (
    <div
      style={{
        width: chartWidth,
        height: chartHeight,
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflowX: "auto",
        overflowY: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      <Pie data={chartData} options={options} />
    </div>
  );
};

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setExpanded({});
    if (tab === "votes") {
      const filteredVotes = votes.filter((vote) => vote.RESULT_VOTE_MOD !== "불참");
      setDisplayData(filteredVotes.slice(0, ITEMS_PER_PAGE));
    } else if (tab === "bills") {
      setDisplayData(bills.slice(0, ITEMS_PER_PAGE));
    }
  };

  const loadMore = () => {
    if (activeTab === "votes") {
      // 현재 필터에 맞는 데이터만 가져옵니다
      let filteredVotes;
      if (voteFilter === "all") {
        filteredVotes = votes.filter(vote => vote.RESULT_VOTE_MOD !== "불참");
      } else {
        filteredVotes = votes.filter(vote => vote.RESULT_VOTE_MOD === voteFilter);
      }
      
      // 필터링된 데이터에서 추가로 표시할 항목을 가져옵니다
      const newDisplayData = filteredVotes.slice(0, displayData.length + ITEMS_PER_PAGE);
      setDisplayData(newDisplayData);
    } else {
      // bills 탭의 경우 기존 로직 유지
      let filteredBills;
      if (billFilter === "all") {
        filteredBills = bills;
      } else {
        filteredBills = bills.filter(bill => bill.type === billFilter);
      }
      
      const newDisplayData = filteredBills.slice(0, displayData.length + ITEMS_PER_PAGE);
      setDisplayData(newDisplayData);
    }
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    fetchVotesFromServer();
    fetchBillsFromServer();
  }, []);

  const isLoading = activeTab === "votes" ? votesLoading : billsLoading;
  const filteredVotes = displayData.filter(
    (vote) => vote.RESULT_VOTE_MOD !== "불참"
  );

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
            구 선택
          </button>
          <button id="home-button" onClick={() => navigate("/")}>
            Home
          </button>
        </div>
      </header>

      <div className="card-profile">
        <div className="profile-container">
          <div className="left">
            <h1 className="profile-name">곽상언</h1>
            <div>
              <p className="profile-details">- 소속: 더불어민주당</p>
              <p className="profile-details">- 출생: 1971. 11. 18 서울특별시</p>
              <p className="profile-details">- 학력: 서울대학교 법과대학 법학 석사</p>
              <p className="profile-details">
                - 경력: <br />
                2024.05~ 제22대 국회의원 (서울 종로구/더불어민주당)
                <br />
                2024.05~ 대법원민주당 원내부대표
              </p>
            </div>
          </div>
          <div className="right">
            <img
              src="https://search.pstatic.net/common?type=b&size=3000&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2FprofileImg%2F3676da74-ffdf-481d-b7ca-a0853d27685b.png"
              alt="Profile Image"
              className="profile-image"
            />
            <div className="button-container">
              <a
                href="https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&mra=bjky&x_csa=%7B%22fromUi%22%3A%22kb%22%7D&pkid=1&os=168175&qvt=0&query=%EA%B3%BD%EC%83%81%EC%96%B8%20%EC%84%A0%EA%B1%B0%EC%9D%B4%EB%A0%A5"
                target="_blank"
                className="button"
              >
                선거이력
              </a>
              <a
                href="https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&mra=bjky&x_csa=%7B%22fromUi%22%3A%22kb%22%7D&pkid=1&os=168175&qvt=0&query=%EA%B3%BD%EC%83%81%EC%96%B8%20%EC%B5%9C%EA%B7%BC%ED%99%9C%EB%8F%99"
                target="_blank"
                className="button"
              >
                최근활동
              </a>
            </div>
          </div>
        </div>
      </div>

      <main className="main-layout">
        <div className="tab-container">
          <button
            className={`tab-button ${activeTab === "votes" ? "active" : ""}`}
            onClick={() => handleTabChange("votes")}
          >
            의안 투표 추적
          </button>
          <button
            className={`tab-button ${activeTab === "bills" ? "active" : ""}`}
            onClick={() => handleTabChange("bills")}
          >
            발의 법률 추적
          </button>
        </div>

        <div id="process-block" className="process-block">
          {activeTab === "bills" && (
            <div className="chart-container">
              <h2>소관위원회별 법안 분포</h2>
              <CommitteePieChart bills={bills} />
            </div>
          )}
          {activeTab === "votes" && (
            <div className="vote-filter-container">
              <div className="vote-filter-buttons">  {/* 버튼들을 감싸는 div 추가 */}
                <button 
                  className={`vote-filter-btn ${voteFilter === "all" ? "active" : ""}`}
                  onClick={() => handleVoteFilter("all")}
                >
                  전체
                </button>
                <button 
                  className={`vote-filter-btn approve ${voteFilter === "찬성" ? "active" : ""}`}
                  onClick={() => handleVoteFilter("찬성")}
                >
                  찬성
                </button>
                <button 
                  className={`vote-filter-btn against ${voteFilter === "반대" ? "active" : ""}`}
                  onClick={() => handleVoteFilter("반대")}
                >
                  반대
                </button>
                <button 
                  className={`vote-filter-btn abstain ${voteFilter === "기권" ? "active" : ""}`}
                  onClick={() => handleVoteFilter("기권")}
                >
                  기권
                </button>
              </div>
              <div className="vote-progress">
                <div className="vote-progress-bar">
                  <div 
                    className="vote-progress-fill"
                    style={{ 
                      width: "97.3%"
                    }}
                  />
                </div>
                <div className="vote-progress-stats">
                  <span>
                  </span>
                  <span>
                    본회의 출석률: 97.30%
                  </span>
                </div>
              </div>
            </div>
          )} {activeTab === "bills" && (
            <div className="bills-filter-container">
              <div className="bills-filter-buttons">
                <button 
                  className={`vote-filter-btn ${billFilter === "all" ? "active" : ""}`}
                  onClick={() => handleBillFilter("all")}
                >
                  전체
                </button>
                <button 
                  className={`vote-filter-btn approve ${billFilter === "대표발의" ? "active" : ""}`}
                  onClick={() => handleBillFilter("대표발의")}
                >
                  대표발의 의안
                </button>
                <button 
                  className={`vote-filter-btn against ${billFilter === "공동발의" ? "active" : ""}`}
                  onClick={() => handleBillFilter("공동발의")}
                >
                  공동발의 의안
                </button>
              </div>
              <div className="bills-progress">
                <div className="bills-progress-bar">
                <div 
                    className="bills-progress-fill"
                    style={{ 
                      width: `${(bills.filter(bill => bill.type === "대표발의").length / bills.length * 100)}%`
                    }}
                  />
                </div>
                <div className="bills-progress-stats">
                  <span>
                    대표발의 {bills.filter(bill => bill.type === "대표발의").length}건 
                    ({(bills.filter(bill => bill.type === "대표발의").length / bills.length * 100).toFixed(2)}%)
                  </span>
                  <span>
                    공동발의 {bills.filter(bill => bill.type === "공동발의").length}건
                    ({(bills.filter(bill => bill.type === "공동발의").length / bills.length * 100).toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          )}
            {isLoading ? (
              <p>데이터를 불러오는 중...</p>  // 로딩 중일 때는 무조건 이 메시지 출력
            ) : filteredVotes.length === 0 && !isLoading ? (
              <p>데이터가 없습니다.</p>  // 로딩이 끝났고 데이터가 없을 때만 이 메시지 출력
            ) : activeTab === "votes" ? (
              filteredVotes.map((vote, index) => {

                const totalFilteredVotes = voteFilter === "all" 
                ? votes.filter(v => v.RESULT_VOTE_MOD !== "불참")
                : votes.filter(v => v.RESULT_VOTE_MOD === voteFilter);

                let allFilteredVotes;
                if (voteFilter === "all") {
                  allFilteredVotes = votes.filter(v => v.RESULT_VOTE_MOD !== "불참");
                } else {
                  allFilteredVotes = votes.filter(v => v.RESULT_VOTE_MOD === voteFilter);
                }
                const displayNumber = totalFilteredVotes.length - index;
                return (
                  <div
                    key={index}
                    className={`vote-card ${
                      vote.RESULT_VOTE_MOD === "찬성"
                        ? "approve"
                        : vote.RESULT_VOTE_MOD === "반대"
                        ? "against"
                        : vote.RESULT_VOTE_MOD === "기권"
                        ? "abstain"
                        : ""
                    }`}
                  >
                  <div className="vote-header">
                    <span>{displayNumber}</span>
                    <a 
                        href={vote.BILL_URL} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="tooltip-link"
                      >
                        {vote.BILL_NAME}
                        <span className="tooltip">클릭하면 상세정보로 이동합니다.</span>
                      </a>
                    <button onClick={() => toggleExpand(index)}>
                      {expanded[index] ? "-" : "+"}
                    </button>
                  </div>
                  {expanded[index] && (
                    <div className="vote-details">
                      <p><span className="bold">• 의안 번호 : </span> {vote.BILL_NO}</p>
                      <p><span className="bold">• 의결일자 : </span> {vote.VOTE_DATE}</p>
                      <p><span className="bold">• 소관위원회 : </span> {vote.CURR_COMMITTEE}</p>
                      <p><span className="bold">• 제안이유 및 주요내용 요약: </span></p>
                      <br />
                      <p
                        dangerouslySetInnerHTML={{
                          __html: vote.DETAILS.summary
                            ? vote.DETAILS.summary
                                .replace(/\n{2,3}/g, '\n')
                                .replace(/\n/g, '<br/>')
                            : "내용이 없습니다."
                        }}
                      ></p>

                    </div>
                  )}
                </div>
              );
            })
          ) : (
            displayData.map((bill, index) => {
              const totalFilteredBills = billFilter === "all" 
                ? bills
                : bills.filter(b => b.type === billFilter);
              const displayNumber = totalFilteredBills.length - index;
              return (
                <div
                key={index}
                className={`bill-card ${
                  bill.type === "대표발의" ? "approve" : "against"
                }`}
                >
                  <div className="bill-header">
                    <span>{displayNumber}</span>
                    <a 
                      href={bill.bill_link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="tooltip-link"
                    >
                      {bill.bill_name}
                      <span className="tooltip">클릭하면 상세정보로 이동합니다.</span>
                    </a>
                    <button onClick={() => toggleExpand(index)}>
                      {expanded[index] ? "-" : "+"}
                    </button>
                  </div>
                  {expanded[index] && (
                    <div className="bill-details">
                      <p><span className="bold">• 제안일자 : </span> {bill.propose_date}</p>
                      <p><span className="bold">• 제안자 : </span> {bill.proposer}</p>
                      {/* <p><span className="bold">• 공동발의자 : </span> {bill.co_proposer}</p>
                      <p><span className="bold">• 의안 번호 : </span> {bill.bill_no}</p> */}
                      <p><span className="bold">• 소관위원회 : </span> {bill.committee}</p>
                      <p><span className="bold">• 제안이유 및 주요내용 요약: </span></p>
                      <br />
                      <p
                        dangerouslySetInnerHTML={{
                          __html: (bill.DETAILS?.summary || bill.SUMMARY)  // 두 가지 경우 모두 처리
                            ? (bill.DETAILS?.summary || bill.SUMMARY)
                                .replace(/\n{2,3}/g, '\n')
                                .replace(/\n/g, '<br/>')
                            : "요약 정보를 불러오는 중 오류가 발생했습니다."
                        }}
                      ></p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {activeTab === "votes" ? (
          displayData.length < (
            voteFilter === "all" 
              ? votes.filter(v => v.RESULT_VOTE_MOD !== "불참").length
              : votes.filter(v => v.RESULT_VOTE_MOD === voteFilter).length
          ) && (
            <button className="load-more" onClick={loadMore}>
              더보기
            </button>
          )
        ) : (
          displayData.length < (
            billFilter === "all" 
              ? bills.length
              : bills.filter(b => b.type === billFilter).length
          ) && (
            <button className="load-more" onClick={loadMore}>
              더보기
            </button>
          )
        )}
      </main>

      <footer className="footer">
        <p>성균관대학교 트래커스꾸</p>
        <p>서울특별시 종로구 성균관로 25-2</p>
        <p>trackerskku@g.skku.edu</p>
      </footer>
    </div>
  );
};

export default Congressman;