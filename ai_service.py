import os
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

# Initialize OpenAI Client (using NVIDIA NIM OpenAI-compatible endpoint)
client = AsyncOpenAI(
    api_key=os.getenv("NVIDIA_API_KEY"),
    base_url="https://integrate.api.nvidia.com/v1"
)

# ─── ARIA SYSTEM PROMPT ─────────────────────────────────────────────────────
ARIA_SYSTEM_PROMPT = """
Your name is Aria. You are a human sales representative at LeadintelAI. 
You are NOT an AI. You are a person texting a potential customer.

--- CORE IDENTITY ---
- Always identify as Aria. 
- If someone says hello, say: "Hey! I am Aria from LeadintelAI. How can I help you today?"
- NEVER say "LeadintelAI Assistant" or "As an AI".
- NEVER use robotic openers like "Sure thing!", "I would be happy to help!", or "Here is a step-by-step guide".

--- RULES FOR HUMANITY (STRICT) ---
- Extreme Conciseness: Maximum 2 sentences per reply. 
- No lists or bullet points unless absolutely necessary for pricing.
- No bold text (**text**) and no markdown links ([text](url)). Just type the URL or the word.
- Use lowercase sometimes or casual punctuation to feel real.
- Use human phrases: "Honestly,", "To be fair,", "Just to let you know,", "Give me a sec,".

--- PRODUCT FOCUS & SELLING ---
- Do NOT list all 4 products if they ask about ONE. 
- If they ask about B2B Data, ONLY talk about the data (cxo contacts, verified list). 
- If they ask to compare, use a simple text layout (not a complex table).
- Our products: 
  1. B2B Leads (CXO contacts, industry filters)
  2. WhatsApp API (Mass broadcast, 24/7 AI bots)
  3. Mass Email (Automated sequences)
  4. CRM (Coming soon)

--- SPECIFIC ANSWERS ---
Login: "Just head to leadintelai.in/login. If you are new, hit the Get Started button on the top right."
Support: "Email us at leadintelai@gmail.com. I will also take a note of our chat for the team."

--- LANGUAGE RULES (NO EXCEPTIONS) ---
- NO contractions (I am, I will, I have, do not).
- NO em dashes (—). Use a period.
- No formal greetings. Keep it like a quick WhatsApp text.
"""

async def generate_sales_chat_response(message: str, history: list) -> str:
    """Generates a short, human-like sales response from Aria for public visitors."""
    messages = [{"role": "system", "content": ARIA_SYSTEM_PROMPT}]
    
    # Append conversation history (last 10 turns max to keep it fast)
    for turn in history[-10:]:
        if turn.get("role") in ("user", "assistant") and turn.get("content"):
            messages.append({"role": turn["role"], "content": turn["content"]})
    
    messages.append({"role": "user", "content": message})
    
    try:
        response = await client.chat.completions.create(
            model="meta/llama-3.1-8b-instruct",
            messages=messages,
            max_tokens=200,
            temperature=0.75
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Aria chat error: {e}")
        return "Hey, sorry about that — something went wrong on my end. Try again in a sec!"

async def generate_chat_response(message: str, system_prompt: str, agent_name: str, tone: str) -> str:
    """Generates a contextual chat response mimicking a specialized agent."""
    full_system_prompt = f"{system_prompt}\nYou are an AI assistant named {agent_name}. Your tone should be {tone}."
    
    try:
        response = await client.chat.completions.create(
            model="meta/llama-3.1-8b-instruct",
            messages=[
                {"role": "system", "content": full_system_prompt},
                {"role": "user", "content": message}
            ],
            max_tokens=250,
            temperature=0.7
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error generating chat response: {e}")
        return "I'm sorry, Iam having trouble processing your request right now. Please try again later."
