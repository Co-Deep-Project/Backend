from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.news_utils import search_news, format_news_results
from utils.openai_utils import generate_response

import os

app = Flask(__name__)
CORS(app)  # React와의 CORS 문제 해결

# 환경 변수 로그 추가 (추가된 부분)
print("NAVER_CLIENT_ID:", os.getenv("NAVER_CLIENT_ID"))
print("NAVER_CLIENT_SECRET:", os.getenv("NAVER_CLIENT_SECRET"))
print("OPENAI_API_KEY:", os.getenv("OPENAI_API_KEY"))

@app.route("/chat", methods=["POST"])
def chat():
    user_query = request.json.get("query")
    if not user_query:
        print("No query provided in /chat request")
        return jsonify({"error": "No query provided"}), 400

    print(f"Received /chat request with query: {user_query}")
    response_text = generate_response(user_query)  # OpenAI 응답 생성 함수 호출
    print(f"Generated response for /chat: {response_text}")
    return jsonify({"response": response_text})

@app.route("/news", methods=["GET"])
def news():
    keyword = request.args.get("keyword", "정치")
    print(f"Received /news request with keyword: {keyword}")
    news_results = search_news(keyword)
    formatted_results = format_news_results(news_results)
    print(f"Formatted news results: {formatted_results}")
    return jsonify({"news": formatted_results})

if __name__ == "__main__":
    print("Starting Flask server...")
    app.run(port=5000, debug=True)

