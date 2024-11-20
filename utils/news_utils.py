import requests
import html
import os

# 환경 변수에서 API 키 가져오기
NAVER_CLIENT_ID = os.getenv("NAVER_CLIENT_ID")
NAVER_CLIENT_SECRET = os.getenv("NAVER_CLIENT_SECRET")

def search_news(query, display=5, sort='sim'):
    """
    네이버 뉴스 검색 API를 호출하여 뉴스 데이터를 검색합니다.
    """
    url = "https://openapi.naver.com/v1/search/news.json"
    headers = {
        "X-Naver-Client-Id": NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": NAVER_CLIENT_SECRET
    }
    params = {"query": query, "display": display, "sort": sort}
    response = requests.get(url, headers=headers, params=params)

    if response.status_code == 200:
        return response.json()
    else:
        return {"error": response.status_code, "message": response.text}

def format_news_results(news_results):
    """
    뉴스 검색 결과를 포맷팅하여 사용자에게 표시할 텍스트로 변환합니다.
    """
    if not news_results or "items" not in news_results:
        return "검색 결과를 찾을 수 없습니다."
    
    formatted_results = []
    for item in news_results['items']:
        title = html.unescape(item['title']).replace("<b>", "").replace("</b>", "")
        description = html.unescape(item['description']).replace("<b>", "").replace("</b>", "")
        link = item['originallink']
        formatted_results.append(f"제목: {title}\n설명: {description}\n링크: {link}\n")
    
    return "\n".join(formatted_results)
