import os
import json
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

# --- LEADINTELAI KNOWLEDGE BASE ---
KNOWLEDGE_BASE = """
LeadintelAI Overview:
- India's biggest B2B lead generation platform.
- Founder: Gaurav Yadav.
- Services: B2B Data Selling, WhatsApp Business API (Chatbots), Mass Mailing, Powerful CRM (Coming Soon).

B2B Data Selling:
- High-quality leads with Phone Numbers, Email IDs, and decision-maker titles (HR, CIO, CXO, CTO).
- Pricing: Starts at ₹9,999/mo for standard data packages.
- Competitive Advantage: Higher accuracy, decision-maker direct contacts, daily fresh leads (subscription).

WhatsApp Business API:
- Connect with leads in < 1 second.
- 24/7 automated assistance with AI Chatbots.
- Official API usage ensuring zero number blocking risks.
- Pricing: Starts at ₹4,999/mo + Meta conversation charges.
- Competitive Advantage vs Apollo/Aisensy: Native integration with lead data, lower platform fees, dedicated Indian market focus.

Mass Mailing:
- Reach thousands of leads instantly.
- Personalized outreach with high deliverability.

Comparisons:
- vs Apollo.io: LeadintelAI provides more accurate Indian market data and direct WhatsApp integration.
- vs Aisensy/Wati: LeadintelAI is a full-stack sales platform (Data + API + Mailing) whereas they are just API providers.
"""

async def generate_chat_response(message: str, system_prompt: str, agent_name: str, tone: str) -> str:
    """Generates a contextual chat response using the official OpenAI SDK."""
    client = AsyncOpenAI(
        base_url="https://integrate.api.nvidia.com/v1",
        api_key=os.getenv("NVIDIA_API_KEY")
    )

    full_system_instruction = f"""
    {system_prompt}
    You are an AI assistant named {agent_name} for LeadintelAI. Your tone is {tone}.
    Use the following KNOWLEDGE BASE for accurate info about LeadintelAI:
    {KNOWLEDGE_BASE}
    
    CRITICAL: If a user is interested in a product, offer to register their details. 
    Collect their full name, email, and interest area.
    Once you have all three, you can confirm registration.
    """
    
    tools = [
        {
            "type": "function",
            "function": {
                "name": "register_interest",
                "description": "Register a user's interest in a product or service.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "full_name": {"type": "string", "description": "The full name of the user."},
                        "email": {"type": "string", "description": "The business email."},
                        "interest_area": {
                            "type": "string",
                            "enum": ["B2B Data", "WhatsApp API", "Mass Mailing", "CRM"],
                            "description": "The area of interest."
                        },
                        "notes": {"type": "string", "description": "Any additional context."}
                    },
                    "required": ["full_name", "email", "interest_area"]
                }
            }
        }
    ]
    
    try:
        response = await client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {"role": "system", "content": full_system_instruction},
                {"role": "user", "content": message}
            ],
            tools=tools
        )
        
        response_message = response.choices[0].message
        
        if response_message.tool_calls:
            for tool_call in response_message.tool_calls:
                if tool_call.function.name == "register_interest":
                    arguments = json.loads(tool_call.function.arguments)
                    return json.dumps({
                        "action": "register_interest",
                        "data": arguments,
                        "reply": f"Perfect, I've noted down your interest in {arguments.get('interest_area', 'our services')}. Our team will contact you at {arguments.get('email', 'the email provided')} soon!"
                    })
        
        return response_message.content
        
    except Exception as e:
        print(f"Error generating chat response (SDK): {e}")
        return "I'm sorry, I'm having trouble processing your request right now. Please try again later."

async def generate_campaign_content(product_name: str, target_audience: str, key_benefits: str, tone: str) -> list[str]:
    """Generates compelling WhatsApp message templates for a campaign."""
    client = AsyncOpenAI(
        base_url="https://integrate.api.nvidia.com/v1",
        api_key=os.getenv("NVIDIA_API_KEY")
    )

    prompt = f"""
    Generate 3 high-converting WhatsApp marketing message templates for the following product.
    
    Product/Service: {product_name}
    Target Audience: {target_audience}
    Key Benefits: {key_benefits}
    Tone: {tone}
    
    The messages should be concise, use emojis appropriately, and include a clear call to action (CTA).
    Return ONLY the 3 templates, separated by "---".
    """
    
    try:
        response = await client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        text = response.choices[0].message.content
        templates = [t.strip() for t in text.split("---") if t.strip()]
        return templates
    except Exception as e:
        print(f"Error generating campaign content (SDK): {e}")
        return []

async def score_lead(industry: str, job_title: str, company: str) -> dict:
    """Evaluates a lead and returns a score, summary, and recommendations."""
    client = AsyncOpenAI(
        base_url="https://integrate.api.nvidia.com/v1",
        api_key=os.getenv("NVIDIA_API_KEY")
    )

    prompt = f"""
    Evaluate the following B2B lead for potential B2B SaaS/Services sales.
    
    Industry: {industry}
    Job Title: {job_title}
    Company: {company}
    
    Analyze the lead and provide:
    1. A lead score between 1 and 100 (100 being highly qualified decision maker).
    2. A brief 2-sentence summary of why this score was given.
    3. 3 specific recommendations for cold outreach or next steps.
    
    Format the output strictly as JSON with this structure:
    {{
        "score": 85,
        "summary": "...",
        "recommendations": ["...", "...", "..."]
    }}
    """
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            response_format={"type": "json_object"},
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        result = json.loads(response.choices[0].message.content)
        return result
    except Exception as e:
        print(f"Error scoring lead (SDK): {e}")
        return {
            "score": 50,
            "summary": "AI scoring failed. Default score applied.",
            "recommendations": ["Review manually."]
        }
