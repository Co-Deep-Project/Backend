import os
import sys
import requests
import openai
import html
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import Client
from fuzzywuzzy import fuzz
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from fastapi import FastAPI, HTTPException, Response



load_dotenv()

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://backend-three-theta-46.vercel.app", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"], 
    allow_headers=["Content-Type", "Authorization", "Accept"],  
)

class QueryRequest(BaseModel):
    query: str

# 네이버 뉴스 검색 API 정보
NAVER_CLIENT_ID = os.getenv("NAVER_CLIENT_ID")
NAVER_CLIENT_SECRET = os.getenv("NAVER_CLIENT_SECRET")

# OpenAI API 키
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
openai.api_key = OPENAI_API_KEY

# 글로벌 컨텍스트
session_context = {}

def search_news(query, display=50, sort='sim'):
    """
    네이버 뉴스 검색 API를 호출하여 뉴스 데이터를 검색하고
    제목 유사도를 비교하여 중복된 뉴스를 필터링합니다.
    """
    url = "https://openapi.naver.com/v1/search/news.json"
    headers = {
        "X-Naver-Client-Id": NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": NAVER_CLIENT_SECRET
    }
    params = {"query": query, "display": display, "sort": sort}

    try:
        response = requests.get(url, headers=headers, params=params, timeout=10)
        response.raise_for_status()

        news_items = response.json().get("items", [])
        
        # 키워드 필터링: 제목 또는 내용에 키워드 포함 여부 확인
        filtered_news = [
            item for item in news_items
            if query.lower() in item["title"].lower() or query.lower() in item.get("description", "").lower()
        ]

        # 유사도 비교를 통해 중복 뉴스 제거
        unique_news = []
        for item in filtered_news:
            title = html.unescape(item["title"]).replace("<b>", "").replace("</b>", "")
            if not any(fuzz.ratio(title, existing["headline"]) > 30 for existing in unique_news):
                unique_news.append({
                    "headline": title,
                    "url": item["originallink"] or item["link"]
                })

        return unique_news[:4]  # 최대 4개 반환

    except requests.exceptions.RequestException as e:
        print(f"Error during news search: {e}")
        return []


def format_news_results(news_results):
    """
    뉴스 검색 결과를 포맷팅하여 사용자에게 표시할 텍스트로 변환합니다.
    :param news_results: 뉴스 검색 결과 JSON
    :return: 포맷팅된 텍스트
    """
    if not news_results or "items" not in news_results:
        return "검색 결과를 찾을 수 없습니다."
    
    formatted_results = []
    for item in news_results['items']:
        title = html.unescape(item['title']).replace("<b>", "").replace("</b>", "")
        # description = html.unescape(item['description']).replace("<b>", "").replace("</b>", "")
        link = item['originallink']
        formatted_results.append(f"제목: {title}\n링크: {link}\n")
    
    return "\n".join(formatted_results)


client = Client(api_key=OPENAI_API_KEY)

def generate_response(prompt):
    """
    OpenAI ChatGPT API를 호출하여 응답을 생성합니다.
    :param prompt: 사용자 입력 프롬프트
    :return: ChatGPT의 응답
    """
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7
    )
    return response.choices[0].message.content


async def handle_query(user_query):
    """
    사용자 쿼리를 처리하여 적절한 응답을 반환합니다.
    :param user_query: 사용자 입력 쿼리
    :return: 처리 결과
    """
    global session_context

    if "뉴스" in user_query:
        keyword = user_query.replace("뉴스", "").strip()
        news_results = search_news(keyword)
        formatted_results = format_news_results(news_results)
        session_context["last_search"] = keyword  # 맥락 저장
        return formatted_results

    elif "last_search" in session_context:
        keyword = session_context["last_search"]
        prompt = f"{keyword}와 관련된 뉴스에 대해 질문: {user_query}"
        return generate_response(prompt)

    else:
        return generate_response(user_query)
     


@app.get("/")
def root():
    return {"message": "Hello from chatbot server!"}

@app.options("/{path:path}")
async def options_handler(path: str):
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "https://backend-three-theta-46.vercel.app",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
            "Access-Control-Allow-Credentials": "true",
        }
    )

# @app.options("/search_news")
# async def options_search_news():
#     """
#     OPTIONS preflight 요청을 처리하는 엔드포인트
#     """
#     return JSONResponse(content={}, status_code=200)


@app.post("/search_news")
async def search_news_endpoint(request: QueryRequest):
    keyword = request.query.replace("뉴스", "").strip()
    news_results = search_news(keyword)
    
    if not news_results:
        raise HTTPException(status_code=404, detail="No news found")
    
    # formatted_results = []
    # for item in news_results.get("items", []):
    #     formatted_results.append({
    #         "title": html.unescape(item["title"]).replace("<b>", "").replace("</b>", ""),
    #         "description": html.unescape(item["description"]).replace("<b>", "").replace("</b>", ""),
    #         "link": item["originallink"]
    #     })
    return {"response": news_results}

@app.post("/ask_gpt")
async def ask_gpt_endpoint(request: QueryRequest):
    try:
        answer = generate_response(request.query)
        return {"response": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chatbot")
async def chatbot_endpoint(request: QueryRequest):
    user_query = request.query.lower()
    
    if "뉴스" in user_query:
        keyword = user_query.replace("뉴스", "").strip()
        news_results = search_news(keyword)
        formatted_results = format_news_results(news_results)
        return {"response": formatted_results}

    return {"response": generate_response(user_query)}