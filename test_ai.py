import asyncio
import os
import sys

# Add current directory to path so we can import models and ai_service
sys.path.append("D:/leadintel back 14-3-26")

from ai_service import generate_chat_response

async def test_ai():
    print("Testing AI Response...")
    try:
        reply = await generate_chat_response(
            message="Hello, test message",
            system_prompt="You are a helpful assistant.",
            agent_name="TestBot",
            tone="professional"
        )
        print(f"Reply: {reply}")
    except Exception as e:
        print(f"FAILED: {e}")

if __name__ == "__main__":
    asyncio.run(test_ai())
