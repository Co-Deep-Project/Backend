# Co-Deep Project Frontend
`npm start`로 실행됨.

실행 경로 : `cd frontend`

## Co-Deep Project backend
- FastAPI 서버 실행 명령: `uvicorn backend.server:app --reload`

## 기존과 다른 점
- 원래 서버가 3개였음.<br>
① backend/server.py<br>
② Frontend/co-deep-frontend(Final)/src/seoin/server1.js<br>
③ Frontend/co-deep-frontend(Final)/src/seoin/server2.js <br>
근데 나중에 배포하고 유지보수하기 쉽게 서버를 하나로 합쳐야될 것 같아서 backend/server.py 로 합침

## 수정해야되는 부분
- 국회의원 페이지 "의안 투표 추적" 부분에서 찬성, 반대, 기권 버튼 누르면 그것에 해당하는 의안들만 나올 수 있도록 하는 것도 좋을 것 같음.
- server.py 서버 로직 바꿔야됨.
- 현재 문제 <br>
① http://localhost:3000 에 접속해서 home 화면이 나타나고 자동적으로 server가 실행이 안됨. 그래서 http://localhost:3000/seoin 이 페이지에 접속했을 때 서버가 작동되기 시작함.<br>
② 근데 "의안 투표 추적"과 "발의 현황 추적" API 를 같은 파일에 넣어놔서 그런지 "의안 투표 추적" 데이터가 다 안 불러와지면 "발의 현황 추적" 데이터도 안 불러와짐. 즉 둘다 '데이터 불러오는 중' 상태가 유지됨. 빨리 빨리 안 불러와짐. 생각보다 데이터 불러오는 데 시간이 오래 걸림.<br>
③ 데이터가 오래 걸려서 chatbot 페이지로 넘어갔더니 "의안 투표 추적"데이터가 다 불러와지고 난 다음에 Post가 처리됨. 하여튼 그래서 그 앞선 데이터들이 다 처리가 안되면 chatbot 기능도 못 씀.<br>
④ 어찌어찌 해서 다시 /seoin 페이지로 넘어가면 또 처음부터 데이터 불러오는 작업을 다시 시작함. 

