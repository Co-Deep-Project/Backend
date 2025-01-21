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
import Layout from "./Layout"; // Layout 가져오기

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: "/mayor",
    element: (
      <Layout>
        <Yunji />
      </Layout>
    ),
  },
  {
    path: "/congressman",
    element: (
      <Layout>
        <Seoin />
      </Layout>
    ),
  },
  {
    path: "/select-region",
    element: (
      <Layout>
        <SelectRegion />
      </Layout>
    ),
  },
  {
    path: "/politician",
    element: (
      <Layout>
        <Politician />
      </Layout>
    ),
  },
  {
    path: "/test",
    element: (
      <Layout>
        <Mbti />
      </Layout>
    ),
  },
  {
    path: "/chatbot",
    element: (
      <Layout>
        <Chatbot />
      </Layout>
    ),
  },
  {
    path: "/test/result",
    element: (
      <Layout>
        <ResultScreen />
      </Layout>
    ),
  },
  {
    path: "/start",
    element: (
      <Layout>
        <StartScreen />
      </Layout>
    ),
  },
  {
    path: "/test/question",
    element: (
      <Layout>
        <QuestionScreen />
      </Layout>
    ),
  },
  {
    path: "/test/story",
    element: (
      <Layout>
        <Story />
      </Layout>
    ),
  },
  {
    path: "/test/result-transition",
    element: (
      <Layout>
        <ResultTransitionScreen />
      </Layout>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
