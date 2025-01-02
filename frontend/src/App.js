import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Yunji from "./yunji/yunji";
import SelectRegion from "./gahyun/SelectRegion"; // 새로운 페이지 임포트
import Mbti from "./mbti/Mbti";
import Seoin from "./seoin/Seoin";
import Home from "./Home";
import Chatbot from "./chatbot/Chatbot";
import ResultScreen from "./mbti/ResultScreen";
import StartScreen from "./mbti/StartScreen";
import QuestionScreen from "./mbti/QuestionScreen";
import Stroy from "./mbti/Story";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/yunji",
    element: <Yunji />,
  },
  {
    path: "seoin",
    element: <Seoin />,
  },
  {
    path: "/select-region", // 새로운 경로 추가
    element: <SelectRegion />, // SelectRegion 컴포넌트 연결
  },
  {
    path: "/mbti", // 새로운 경로 추가
    element: <Mbti />, // SelectRegion 컴포넌트 연결
  },
  {
    path: "/chatbot",
    element: <Chatbot />,
  },
  {
    path: "/result",
    element: <ResultScreen />
  },
  {
    path: "/start",
    element: <StartScreen />
  },
  {
    path: "/question",
    element: <QuestionScreen />
  },
  {
    path: "/story",
    element: <Story />
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
