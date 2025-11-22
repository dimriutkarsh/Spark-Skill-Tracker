import requests
from typing import Dict, Any

class GeminiClient:
    def __init__(self):
        self.api_key = "AIzaSyAbWOLLowSPw1mkBaaFbzdm_9_a0QNzH_o"
        self.api_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
    
    def _make_request(self, prompt: str, max_tokens: int) -> str:
        headers = {
            'Content-Type': 'application/json'
        }
        params = {
            'key': self.api_key
        }
        data = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "temperature": 0.7,
                "topP": 1,
                "maxOutputTokens": max_tokens,
                "stopSequences": []
            }
        }

        try:
            response = requests.post(self.api_url, headers=headers, params=params, json=data)
            response.raise_for_status()
            result = response.json()
            return result['candidates'][0]['content']['parts'][0]['text'].strip()
        except Exception as e:
            print(f"Gemini API Error: {e}")
            return f"I'm experiencing technical difficulties: {str(e)}. Please try again later."

    def generate_response(self, prompt: str, max_tokens: int = 1000) -> str:
        full_prompt = (
            "You are a career guidance counselor for college students. "
            "Provide honest, practical advice about career development and skill building. "
            "Be encouraging but realistic.\n\n" + prompt
        )
        return self._make_request(full_prompt, max_tokens)
    
    def generate_structured_response(self, prompt: str, context: Dict[str, Any] = None, max_tokens: int = 1200) -> str:
        try:
            if context:
                context_str = "\n".join([f"{key}: {value}" for key, value in context.items()])
                full_prompt = f"Student Context:\n{context_str}\n\nRequest:\n{prompt}"
            else:
                full_prompt = prompt

            return self.generate_response(full_prompt, max_tokens)
        except Exception as e:
            print(f"Error in structured response: {e}")
            return f"I'm having trouble processing your request: {str(e)}"
