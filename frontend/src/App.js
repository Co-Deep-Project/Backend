import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Yunji from "./yunji/yunji";
import SelectRegion from "./gahyun/SelectRegion"; 
import Mbti from "./mbti/Mbti";
import Seoin from "./seoin/Seoin";
import Home from "./Home";
import Chatbot from "./chatbot/Chatbot";
import ResultScreen from "./mbti/ResultScreen";
import StartScreen from "./mbti/StartScreen";
import QuestionScreen from "./mbti/QuestionScreen";
import Story from "./mbti/Story";
import ResultTransitionScreen from "./mbti/ResultTransitionScreen";
import Politician from "./politician/Politician";

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
    path: "/select-region",
    element: <SelectRegion />, 
  },
  {
    path: "/politician", 
    element: <Politician />, 
  },
  {
    path: "/mbti", 
    element: <Mbti />,
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
  },
  {
  path: "/result-transition",
  element: <ResultTransitionScreen /> }
])


function App() {
  return <RouterProvider router={router} />;
}

export default App;


