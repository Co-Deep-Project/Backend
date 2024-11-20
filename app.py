from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.news_utils import search_news, format_news_results
from utils.openai_utils import generate_response

app = Flask(__name__)
CORS(app)  # React와의 CORS 문제 해결

@app.route("/chat", methods=["POST"])
def chat():
    user_query = request.json.get("query")
    if not user_query:
        return jsonify({"error": "No query provided"}), 400

    response_text = generate_response(user_query)  # OpenAI 응답 생성 함수 호출
    return jsonify({"response": response_text})

@app.route("/news", methods=["GET"])
def news():
    keyword = request.args.get("keyword", "정치")
    news_results = search_news(keyword)
    formatted_results = format_news_results(news_results)
    return jsonify({"news": formatted_results})

if __name__ == "__main__":
    app.run(port=5000, debug=True)

