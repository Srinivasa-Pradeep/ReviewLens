import os
import random
import openai
import instructor
from schemas import (
    BuyerModeSchema, SellerModeSchema, SentimentOverview, FrequencyItem, 
    ThematicScore, ReviewHighlight, VerdictEnum, ComplaintItem, SeverityEnum, 
    TimelineEvent, FeatureRequest, ClusterItem, ClusterCategory
)

# Initialize OpenAI client with instructor
# Instructor handles schema validation and parsing automatically
api_key = os.getenv("OPENAI_API_KEY")

if api_key:
    client = instructor.from_openai(openai.AsyncOpenAI(api_key=api_key))
else:
    client = None
    print("[Warning] OPENAI_API_KEY environment variable not found. ReviewLens will operate in Mock Generation Mode.")

async def extract_buyer_insights(reviews_text: str) -> BuyerModeSchema:
    """Uses LLM structured output to extract Buyer Mode metrics."""
    if not client:
        return generate_mock_buyer_insights(reviews_text)
        
    prompt = f"""
    You are an expert review analyst. Extract consumer buyer insights from the following reviews:
    
    {reviews_text}
    """
    
    try:
        result = await client.chat.completions.create(
            model="gpt-4o-mini",
            response_model=BuyerModeSchema,
            messages=[
                {"role": "system", "content": "You are a customer review analytics agent. Always return structured insights about reviews for buyers."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2
        )
        return result
    except Exception as e:
        print(f"Error in OpenAI Buyer Extraction: {str(e)}. Falling back to mock generator.")
        return generate_mock_buyer_insights(reviews_text)

async def extract_seller_insights(reviews_text: str) -> SellerModeSchema:
    """Uses LLM structured output to extract Seller Mode metrics."""
    if not client:
        return generate_mock_seller_insights(reviews_text)
        
    prompt = f"""
    You are an expert business and product strategist. Extract ranked complaints, feature requests, clusters, and strategic roadmap suggestions from the following reviews:
    
    {reviews_text}
    """
    
    try:
        result = await client.chat.completions.create(
            model="gpt-4o-mini",
            response_model=SellerModeSchema,
            messages=[
                {"role": "system", "content": "You are a business analytics agent. Extract structured improvement points for product sellers."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2
        )
        return result
    except Exception as e:
        print(f"Error in OpenAI Seller Extraction: {str(e)}. Falling back to mock generator.")
        return generate_mock_seller_insights(reviews_text)


# --- Mock Generation Fallbacks for Local Testing ---

def parse_simple_keywords(text: str) -> dict:
    """A helper to detect keywords in the reviews to construct sensible mock insights."""
    text_lower = text.lower()
    
    indicators = {
        "battery": ["battery", "charge", "power", "drain"],
        "price": ["price", "expensive", "cheap", "cost", "money", "worth"],
        "quality": ["quality", "cheaply", "break", "broke", "robust", "durable", "material"],
        "shipping": ["shipping", "delivery", "arrived", "delay", "packaged", "box"],
        "ui": ["screen", "button", "app", "ui", "software", "connect", "bluetooth", "wifi", "design"],
        "service": ["service", "support", "help", "chat", "representative", "refund"]
    }
    
    hits = {}
    for category, kws in indicators.items():
        count = sum(text_lower.count(kw) for kw in kws)
        hits[category] = count
        
    # Sentiment simple classifier
    pos_words = ["good", "great", "excellent", "love", "amazing", "perfect", "awesome", "easy", "satisfied"]
    neg_words = ["bad", "poor", "terrible", "hate", "worst", "broken", "fail", "difficult", "disappointed", "refund"]
    
    pos_count = sum(text_lower.count(w) for w in pos_words) + 1
    neg_count = sum(text_lower.count(w) for w in neg_words) + 1
    
    total = pos_count + neg_count
    pos_pct = round((pos_count / total) * 100)
    neg_pct = round((neg_count / total) * 100)
    neutral_pct = 100 - pos_pct - neg_pct
    if neutral_pct < 0:
        pos_pct += neutral_pct
        neutral_pct = 0
        
    return {
        "hits": hits,
        "sentiment": {"pos": pos_pct, "neg": neg_pct, "neu": neutral_pct}
    }

def generate_mock_buyer_insights(text: str) -> BuyerModeSchema:
    kw_data = parse_simple_keywords(text)
    sentiment = kw_data["sentiment"]
    hits = kw_data["hits"]
    
    # Determine verdict based on sentiment
    pos_pct = sentiment["pos"]
    if pos_pct >= 75:
        verdict = VerdictEnum.STRONG_BUY
        explanation = "The reviews reflect outstanding satisfaction, with praise for build quality and performance far outweighing minor complaints."
    elif pos_pct >= 55:
        verdict = VerdictEnum.BUY_WITH_CAUTION
        explanation = "Solid overall feedback, but buyers note potential concerns that might require review prior to purchasing."
    elif pos_pct >= 35:
        verdict = VerdictEnum.ONLY_BUY_ON_DISCOUNT
        explanation = "The product delivers acceptable value but has enough drawbacks that it's best purchased on sale."
    else:
        verdict = VerdictEnum.AVOID
        explanation = "Frequent reports of functional defects, shipping issues, or bad customer service suggest looking for alternatives."

    # Assemble pros & cons
    all_pros = [
        FrequencyItem(term="Design & Build", count=max(hits.get("quality", 2) * 2, 4), percentage=68.5),
        FrequencyItem(term="Battery Performance", count=max(hits.get("battery", 1) * 3, 5), percentage=72.0),
        FrequencyItem(term="Interface Layout", count=max(hits.get("ui", 1) * 2, 3), percentage=55.0),
        FrequencyItem(term="Cost/Value Balance", count=max(hits.get("price", 2), 2), percentage=48.0)
    ]
    all_cons = [
        FrequencyItem(term="Setup Friction", count=max(hits.get("ui", 1), 3), percentage=40.0),
        FrequencyItem(term="Packaging Durability", count=max(hits.get("shipping", 1) * 2, 4), percentage=32.0),
        FrequencyItem(term="Customer Support Delays", count=max(hits.get("service", 1) * 2, 3), percentage=25.0)
    ]
    
    # Custom thematic scores
    thematic = [
        ThematicScore(category="Value for Money", score=round(sentiment["pos"] / 20, 1)),
        ThematicScore(category="Build Quality", score=3.8 if hits.get("quality", 0) < 5 else 2.9),
        ThematicScore(category="Ease of Use", score=4.2 if hits.get("ui", 0) < 3 else 3.1),
        ThematicScore(category="Reliability", score=3.9 if hits.get("battery", 0) < 4 else 3.0)
    ]
    
    # Categorized highlights
    highlights = [
        ReviewHighlight(
            category="Performance",
            quote="Honestly, the day-to-day usability is stellar. Battery lasts much longer than competitors.",
            sentiment="Positive"
        ),
        ReviewHighlight(
            category="Customer Service",
            quote="Had issues with delivery, and the response was slow. Took 5 days to resolve.",
            sentiment="Negative"
        )
    ]

    return BuyerModeSchema(
        verdict=verdict,
        verdict_explanation=explanation,
        ai_summary="Reviewers are generally pleased with the product's performance and design. The battery holds up well under heavy usage, and it represents a clean modern aesthetic. However, there are recurring complaints regarding initial software configuration steps and long shipping times. Support answers are occasionally delayed.",
        sentiment_overview=SentimentOverview(
            positive_percentage=sentiment["pos"],
            neutral_percentage=sentiment["neu"],
            negative_percentage=sentiment["neg"]
        ),
        top_pros=sorted(all_pros, key=lambda x: x.count, reverse=True),
        top_cons=sorted(all_cons, key=lambda x: x.count, reverse=True),
        thematic_scores=thematic,
        comparison_insights="Compared to other market options in this segment, this device leads on raw hardware battery capacity but falls slightly behind on immediate software integration out of the box.",
        categorized_highlights=highlights
    )

def generate_mock_seller_insights(text: str) -> SellerModeSchema:
    kw_data = parse_simple_keywords(text)
    hits = kw_data["hits"]
    
    # Ranked complaints
    complaints = [
        ComplaintItem(
            issue="Initial Connection/Software Pairing Failures",
            impact_score=8,
            volume=max(hits.get("ui", 1) * 3, 12),
            severity=SeverityEnum.HIGH,
            root_cause="Outdated firmware or weak Bluetooth module validation during device startup."
        ),
        ComplaintItem(
            issue="Shipping Delivery Package Damaged",
            impact_score=5,
            volume=max(hits.get("shipping", 1) * 2, 7),
            severity=SeverityEnum.MEDIUM,
            root_cause="Inadequate cushioning inside structural cardboard shipping sleeves."
        ),
        ComplaintItem(
            issue="Battery Degradation After Fast Charges",
            impact_score=7,
            volume=max(hits.get("battery", 1) * 2, 5),
            severity=SeverityEnum.HIGH,
            root_cause="Thermal throttling failure in quick-charge power distribution chips."
        )
    ]
    
    timeline = [
        TimelineEvent(stage_or_time="Day 1 (Unboxing)", issue="Bluetooth sync failed on Android", diagnostic="Firmware handshake takes too long and times out on modern Android operating systems."),
        TimelineEvent(stage_or_time="Week 2", issue="Minor scratches visible on cover plate", diagnostic="Slight friction during standard desk storage scrapes the soft matte plastic coating."),
        TimelineEvent(stage_or_time="Month 3", issue="Battery capacity drops 10%", diagnostic="Heat management is sub-optimal when charging with high-wattage power blocks.")
    ]
    
    requests = [
        FeatureRequest(feature="Provide dedicated protective travel case", count=14, sample_quote="I would gladly pay $10 more for a solid carry pouch to prevent scratches."),
        FeatureRequest(feature="Implement quick toggle widget on home screen", count=8, sample_quote="Opening the app to turn on active modes is annoying. Needs a desktop widget.")
    ]
    
    clusters = [
        ClusterItem(category=ClusterCategory.QUALITY, issue="Outer housing scratches easily", frequency=11),
        ClusterItem(category=ClusterCategory.UX, issue="App pairing timeout loops", frequency=14),
        ClusterItem(category=ClusterCategory.DELIVERY, issue="Delayed shipping box arrived crushed", frequency=8),
        ClusterItem(category=ClusterCategory.SERVICE, issue="Refund requests take several follow-ups", frequency=6),
        ClusterItem(category=ClusterCategory.PRICING, issue="High standard price point", frequency=5)
    ]
    
    return SellerModeSchema(
        ranked_complaints=sorted(complaints, key=lambda x: x.impact_score, reverse=True),
        root_cause_timeline=timeline,
        extracted_feature_requests=requests,
        clustered_feedback=clusters,
        immediate_fixes=[
            "Revise firmware build #412 to increase Bluetooth connection timeout threshold.",
            "Instruct shipping partners to wrap boxes in dual-bubble envelopes."
        ],
        short_term_improvements=[
            "Ship a premium cloth carrying bag with the standard box configuration.",
            "Update onboarding flow in iOS and Android application UI."
        ],
        long_term_roadmap=[
            "Evaluate scratch-resistant aluminum outer shell for the next-generation device.",
            "Design custom energy-management controller to lower charging temperatures."
        ],
        competitor_gaps=[
            "Competitors offer native integrations with smart-home systems which we lack.",
            "Our battery runtime beats the leading alternative by 20%, representing a major marketing opportunity."
        ]
    )
