from openai import OpenAI
import os

client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),  # This is the default and can be omitted
)

def generate_response(prompt):
    """
    OpenAI ChatGPT API를 호출하여 응답을 생성합니다.
    """
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # OpenAI의 최신 모델 사용
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error occurred while calling OpenAI API: {e}")
        return "An error occurred while generating a response."
