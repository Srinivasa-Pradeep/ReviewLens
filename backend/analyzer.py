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
api_key = os.getenv("OPENAI_API_KEY")

if api_key:
    client = instructor.from_openai(openai.AsyncOpenAI(api_key=api_key))
else:
    client = None
    print("[Warning] OPENAI_API_KEY environment variable not found. ReviewLens will operate in Mock Generation Mode.")

async def extract_buyer_insights(reviews_text: str, product_name: str = "") -> BuyerModeSchema:
    """Uses LLM structured output to extract Buyer Mode metrics."""
    if not client:
        return generate_mock_buyer_insights(reviews_text, product_name)
        
    prompt = f"""
    You are an expert review analyst. Extract consumer buyer insights for the product "{product_name}" from the following reviews:
    
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
        return generate_mock_buyer_insights(reviews_text, product_name)

async def extract_seller_insights(reviews_text: str, product_name: str = "") -> SellerModeSchema:
    """Uses LLM structured output to extract Seller Mode metrics."""
    if not client:
        return generate_mock_seller_insights(reviews_text, product_name)
        
    prompt = f"""
    You are an expert business and product strategist. Extract ranked complaints, feature requests, clusters, and strategic roadmap suggestions for the product "{product_name}" from the following reviews:
    
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
        return generate_mock_seller_insights(reviews_text, product_name)


# --- Mock Generation Fallbacks for Local Testing ---

def parse_simple_keywords(text: str) -> dict:
    """A helper to detect keywords in the reviews to construct sentiment overview percentages."""
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

def get_mock_reviews_for_url(product_name: str, url: str) -> list:
    combined = (product_name + " " + url).lower()
    
    # 1. Wearables
    if any(k in combined for k in ["watch", "band", "fitbit", "wearable", "tracker", "smartwatch"]):
        return [
            f"The smartwatch purchased from {url} works perfectly. Setup was straightforward.",
            "Beautiful display and design, but the battery drains twice as fast as my old watch.",
            "Excellent price point for a wearable. Material feels premium. Shipping took 4 days.",
            "The companion app keeps dropping Bluetooth pairing. Hope they fix it in a firmware update.",
            "Great tracking quality. Definitely recommend it for anyone looking to monitor steps.",
        ]
    # 2. Kitchen / Brewers
    elif any(k in combined for k in ["coffee", "brewer", "kettle", "maker", "mug", "cooker", "blender", "pot", "grinder", "cook"]):
        return [
            f"The brewer purchased from {url} works perfectly. Heating is extremely fast.",
            "Beautiful stainless finish, but the steaming valve is much louder than my old cooker.",
            "Excellent price point for a coffee maker. Stainless steel feels premium. Shipping took 4 days.",
            "Hard to clean coffee grounds/food residue from the inner crevices, need a custom brush.",
            "Great beverage/cooking quality. Definitely recommend it for anyone looking to save time in the morning.",
        ]
    # 3. Shoes / Clothing / Apparel
    elif any(k in combined for k in ["shoe", "boot", "sneaker", "running", "shirt", "pants", "jacket", "coat", "hoodie", "sock", "apparel", "clothing"]):
        return [
            f"The items purchased from {url} feel extremely comfortable. Walking/wearing comfort is top tier.",
            "Beautiful styling, but the sizing runs small and tight around the front seams.",
            "Excellent price point. Material feels soft and premium. Shipping took 4 days.",
            "The stitching around the collar is thin and began to run after my second use.",
            "Great fabric quality and breathability. Definitely recommend it for running/wearing.",
        ]
    # 4. Keyboards & Input Devices
    elif any(k in combined for k in ["keyboard", "mouse", "trackpad", "keypad", "typing", "keeb"]):
        return [
            f"The keyboard purchased from {url} works beautifully. The keystrokes feel tactile and responsive.",
            "Love the mechanical switch feel, but the spacebar has a bit of rattle.",
            "Excellent price point for a wireless keyboard. RGB lighting looks premium. Shipping took 4 days.",
            "The keycap legends are slightly thin and the backlight does not shine through clearly.",
            "Great wireless typing performance. Definitely recommend it for anyone writing or gaming.",
        ]
    # 5. Audio & Microphones
    elif any(k in combined for k in ["mic", "microphone", "headphone", "headset", "earphone", "earbud", "speaker", "audio", "sound", "voice"]):
        return [
            f"The microphone purchased from {url} works perfectly. The vocal clarity is crisp and clean.",
            "Excellent sound pickup, but the gain knob turns too easily and gets bumped.",
            "Excellent price point for audio gear. Metal body feels premium. Shipping took 4 days.",
            "The desk stand transfers vibration noise whenever I type on my desk.",
            "Great voice recording quality. Definitely recommend it for podcasting or meetings.",
        ]
    # 6. Home / Office / Desk Organizer / Furniture
    elif any(k in combined for k in ["organizer", "organiser", "desk", "chair", "table", "shelf", "furniture", "storage", "rack", "stand", "holder", "riser"]):
        return [
            f"The organizer purchased from {url} helps declutter my desk perfectly. Setup was clean.",
            "Beautiful wood finish, but the assembly guide is confusing with unlabeled screws.",
            "Excellent price point for home storage. Metal frame feels premium. Shipping took 4 days.",
            "The drawer sliders have some friction when loaded with books and accessories.",
            "Great organization capacity and sturdiness. Definitely recommend it for a cleaner workspace.",
        ]
    # 7. Default
    else:
        return [
            f"The items purchased from {url} work perfectly. Onboarding was straightforward.",
            "Beautiful design, but the matte finish collects smudges and fingerprints easily.",
            "Excellent price point. Housing feels premium. Standard shipping took 4 days.",
            "The ABS connector latch is a bit delicate and feels like it might break under pressure.",
            "Great overall quality. Definitely recommend it for anyone looking for standard features.",
        ]

def get_mock_data_for_product(product_name: str, reviews_text: str = "") -> dict:
    """Returns product category-specific structured mock datasets depending on name or URL keywords."""
    combined = (product_name + " " + reviews_text).lower()
    
    # Category 1: Smartwatches / Wearables
    if any(k in combined for k in ["watch", "band", "fitbit", "wearable", "tracker", "smartwatch"]):
        return {
            "summary": f"Reviewers of {product_name} are generally pleased with its fitness tracking capabilities and modern design. The AMOLED screen is bright, and notifications are reliable. However, the heart-rate sensor occasionally lags during high-intensity training, and the proprietary charger is easy to misplace.",
            "pros": [
                {"term": "Heart Rate Tracking", "count": 22, "percentage": 82.0},
                {"term": "Vibrant AMOLED Display", "count": 18, "percentage": 75.0},
                {"term": "Activity Goals Setup", "count": 14, "percentage": 60.0},
                {"term": "Sleek Straps Style", "count": 11, "percentage": 45.0}
            ],
            "cons": [
                {"term": "Heart-Rate Sensor Lag", "count": 16, "percentage": 52.0},
                {"term": "Proprietary Charging Cable", "count": 12, "percentage": 40.0},
                {"term": "Sleep Analysis Glitches", "count": 8, "percentage": 28.0}
            ],
            "thematic": [
                {"category": "Value for Money", "score": 4.1},
                {"category": "Build Quality", "score": 4.5},
                {"category": "Ease of Use", "score": 3.8},
                {"category": "Reliability", "score": 4.0}
            ],
            "comparison": f"Compared to similar fitness trackers, the {product_name} excels in screen brightness but the companion app is slightly less refined than leading competitors.",
            "highlights": [
                {"category": "Display", "quote": "The display is absolutely gorgeous, even under direct sunlight during outdoor runs.", "sentiment": "Positive"},
                {"category": "Battery", "quote": "Battery lasts about 4 days, which is decent but I expected more.", "sentiment": "Neutral"},
                {"category": "Connectivity", "quote": "Keeps disconnecting from my phone every couple of days. Annoying to resync.", "sentiment": "Negative"}
            ],
            "complaints": [
                {"issue": "Sleep Tracking Accuracy Failures", "impact_score": 7, "volume": 14, "severity": SeverityEnum.MEDIUM, "root_cause": "Glitches in motion sensor algorithm when user is restless."},
                {"issue": "Heart Rate Sync Latency", "impact_score": 8, "volume": 19, "severity": SeverityEnum.HIGH, "root_cause": "Suboptimal PPG sensor frequency during active workout modes."},
                {"issue": "Proprietary Charger Easy to Lose", "impact_score": 5, "volume": 12, "severity": SeverityEnum.LOW, "root_cause": "Non-standard magnetic pin connection instead of USB-C."}
            ],
            "timeline": [
                {"stage_or_time": "Day 1 (Unboxing)", "issue": "Stiff silicone band", "diagnostic": "Matte silicone requires a few days of wear to become flexible and comfortable."},
                {"stage_or_time": "Week 2", "issue": "Heart-rate spikes during runs", "diagnostic": "Sensor loses tight wrist contact due to strap sliding with sweat."},
                {"stage_or_time": "Month 3", "issue": "Magnetic pins charging connection weakens", "diagnostic": "Sweat residue corrodes copper pins on the back of the watch face."}
            ],
            "requests": [
                {"feature": "Standard USB-C Charging Port", "count": 18, "sample_quote": "Please just let me charge it with my phone cable instead of carrying this custom dock."},
                {"feature": "More Custom Watch Face Layouts", "count": 11, "sample_quote": "The default faces are boring. Need more widgets for weather and active calories."}
            ],
            "clusters": [
                {"category": ClusterCategory.QUALITY, "issue": "PPG sensor cover scratches", "frequency": 9},
                {"category": ClusterCategory.UX, "issue": "App pairing sync drops", "frequency": 15},
                {"category": ClusterCategory.DELIVERY, "issue": "Delivered in damaged box", "frequency": 4},
                {"category": ClusterCategory.SERVICE, "issue": "Support takes days to email back", "frequency": 5},
                {"category": ClusterCategory.PRICING, "issue": "Accessory bands are overpriced", "frequency": 8}
            ],
            "fixes": [
                "Deploy firmware update 1.2 to optimize PPG sensor polling rate.",
                "Redesign buckle style to prevent watch slippage during high-movement activities."
            ],
            "improvements": [
                "Provide alternative fabric strap in the basic retail packaging box.",
                "Redesign companion app homepage for quicker syncing response."
            ],
            "roadmap": [
                "Research scratch-resistant sapphire glass options for watch screen cover.",
                "Build standard Qi wireless charging support into future editions."
            ],
            "gaps": [
                "Our step accuracy matches leading brands, but we lack standard smart-assistant voice commands.",
                "Product excels at screen refresh rates compared to cheap trackers."
            ]
        }

    # Category 2: Kitchen Devices / Brewers
    elif any(k in combined for k in ["coffee", "brewer", "kettle", "maker", "mug", "cooker", "blender", "pot", "grinder", "cook"]):
        return {
            "summary": f"Reviews for {product_name} emphasize its ease of use and consistent results. Coffee/meals are prepared quickly and maintain excellent temperature. However, the cleaning process is tedious due to non-removable base plates, and the steam valve is noisy.",
            "pros": [
                {"term": "Consistent Temperature", "count": 25, "percentage": 85.0},
                {"term": "Fast Brew/Cook Time", "count": 20, "percentage": 78.0},
                {"term": "Compact Desk Footprint", "count": 15, "percentage": 62.0},
                {"term": "Premium Stainless Finish", "count": 10, "percentage": 42.0}
            ],
            "cons": [
                {"term": "Difficult to Deep Clean", "count": 18, "percentage": 50.0},
                {"term": "Loud Steaming / Valve noise", "count": 12, "percentage": 35.0},
                {"term": "Short Power Cord Length", "count": 9, "percentage": 25.0}
            ],
            "thematic": [
                {"category": "Value for Money", "score": 4.3},
                {"category": "Build Quality", "score": 4.2},
                {"category": "Ease of Use", "score": 4.6},
                {"category": "Reliability", "score": 4.4}
            ],
            "comparison": f"The {product_name} heats faster than traditional heating pots, but lacks the granular temperature controls found in professional barista tools.",
            "highlights": [
                {"category": "Speed", "quote": "Heats up water in under 90 seconds. Absolute lifesaver for busy mornings.", "sentiment": "Positive"},
                {"category": "Design", "quote": "The stainless steel look fits nicely on my kitchen counter.", "sentiment": "Positive"},
                {"category": "Cleaning", "quote": "Getting coffee grounds out of the inner rim is almost impossible without a brush.", "sentiment": "Negative"}
            ],
            "complaints": [
                {"issue": "Cleaning Grounds / Food Residue Build-up", "impact_score": 8, "volume": 18, "severity": SeverityEnum.HIGH, "root_cause": "Non-removable inner basket leaves small crevices where moisture gathers."},
                {"issue": "Steam Valve Screeching Noise", "impact_score": 6, "volume": 12, "severity": SeverityEnum.MEDIUM, "root_cause": "High pressure release through a narrow metal gasket."},
                {"issue": "Power Cord Does Not Reach Outlets", "impact_score": 4, "volume": 9, "severity": SeverityEnum.LOW, "root_cause": "Safety regulation compliance limits cord length to under 3 feet."}
            ],
            "timeline": [
                {"stage_or_time": "Day 1 (Unboxing)", "issue": "Plastic taste in first brew", "diagnostic": "Manufacturing sealants require at least 2 full flush cycles to wash out entirely."},
                {"stage_or_time": "Week 2", "issue": "Lid lock mechanism stiffens", "diagnostic": "Heat expansion of plastic latch causes friction during closure."},
                {"stage_or_time": "Month 3", "issue": "Scaling visible on bottom plate", "diagnostic": "Mineral deposits from tap water build up on the steel heating element."}
            ],
            "requests": [
                {"feature": "Removable Dishwasher-Safe Inner pot", "count": 22, "sample_quote": "Washing this by hand under the sink without getting the plug wet is stressful."},
                {"feature": "Variable Temperature Selection Dial", "count": 14, "sample_quote": "I want to set it specifically to 195 degrees for pour-overs instead of just boil."}
            ],
            "clusters": [
                {"category": ClusterCategory.QUALITY, "issue": "Inner coating wears off", "frequency": 7},
                {"category": ClusterCategory.UX, "issue": "Control panel buttons stick", "frequency": 8},
                {"category": ClusterCategory.DELIVERY, "issue": "Box arrived dented", "frequency": 5},
                {"category": ClusterCategory.SERVICE, "issue": "Helpful support replaced unit", "frequency": 12},
                {"category": ClusterCategory.PRICING, "issue": "Fair value for quality", "frequency": 15}
            ],
            "fixes": [
                "Redesign lid seal with heat-resistant food-grade silicone.",
                "Include a custom cleaning brush with all future shipments."
            ],
            "improvements": [
                "Increase power cable length from 30 inches to 45 inches.",
                "Add rubber dampeners to the steam exhaust pipe to deaden sound."
            ],
            "roadmap": [
                "Integrate smart phone controls to schedule water heating in the morning.",
                "Explore dual-chamber designs for brewing multiple items simultaneously."
            ],
            "gaps": [
                "Our unit is 30% faster than standard pots, which is our core competitive advantage.",
                "Unlike competitors, we do not offer preset selections for green or black teas."
            ]
        }

    # Category 3: Shoes / Clothing / Apparel
    elif any(k in combined for k in ["shoe", "boot", "sneaker", "running", "shirt", "pants", "jacket", "coat", "hoodie", "sock", "apparel", "clothing"]):
        return {
            "summary": f"Reviewers find the {product_name} highly comfortable and stylish for everyday wear. The fabric/material feels soft and holds up well in standard weather. However, the sizing runs noticeably small, and the stitching around the seams feels thin.",
            "pros": [
                {"term": "Exceptional Cushion/Comfort", "count": 30, "percentage": 88.0},
                {"term": "Modern Style Aesthetics", "count": 24, "percentage": 80.0},
                {"term": "Breathable Lightweight Feel", "count": 18, "percentage": 65.0},
                {"term": "Flexible Sole / Fabric", "count": 14, "percentage": 50.0}
            ],
            "cons": [
                {"term": "Sizing Runs Small/Narrow", "count": 22, "percentage": 58.0},
                {"term": "Stitching Pulls Out Easily", "count": 14, "percentage": 38.0},
                {"term": "Lacks Arch Support", "count": 10, "percentage": 28.0}
            ],
            "thematic": [
                {"category": "Value for Money", "score": 3.9},
                {"category": "Build Quality", "score": 3.5},
                {"category": "Ease of Use", "score": 4.8},
                {"category": "Reliability", "score": 3.7}
            ],
            "comparison": f"While more comfortable than traditional structured products, the {product_name} has lower durability for active trail use or heavy washing cycles.",
            "highlights": [
                {"category": "Comfort", "quote": "Feels like walking on clouds. Excellent memory foam/fabric softness.", "sentiment": "Positive"},
                {"category": "Sizing", "quote": "Order at least a half size up. They run very narrow in the toe box.", "sentiment": "Negative"},
                {"category": "Quality", "quote": "Stitching near the cuff started unraveling after my second run.", "sentiment": "Negative"}
            ],
            "complaints": [
                {"issue": "Sizing Inconsistencies / Runs Small", "impact_score": 8, "volume": 22, "severity": SeverityEnum.HIGH, "root_cause": "Narrow foot molds used during factory lasting process."},
                {"issue": "Weak Stitching at High-Stress Joints", "impact_score": 7, "volume": 14, "severity": SeverityEnum.MEDIUM, "root_cause": "Single-thread chain stitch used instead of lockstitch construction."},
                {"issue": "Heel Slippage during Wear", "impact_score": 5, "volume": 10, "severity": SeverityEnum.MEDIUM, "root_cause": "Shallow heel cup design does not lock the foot in place."}
            ],
            "timeline": [
                {"stage_or_time": "Day 1 (Unboxing)", "issue": "Stiff heel collar scrapes ankle", "diagnostic": "The rigid synthetic lining rubs against the skin until broken in."},
                {"stage_or_time": "Week 2", "issue": "Insole slides forward", "diagnostic": "Adhesive backing is weak and fails when exposed to warmth/moisture."},
                {"stage_or_time": "Month 3", "issue": "Fabric/Sole wearing flat", "diagnostic": "Low-density EVA foam compresses permanently after 100 miles of walking."}
            ],
            "requests": [
                {"feature": "Offer Wide-Width (EE) Options", "count": 26, "sample_quote": "I love the style but my toes are completely squished. Please sell wide versions."},
                {"feature": "Removable Insole for Orthotics", "count": 12, "sample_quote": "The glued-in insole is hard to pull out without tearing the base shoe material."}
            ],
            "clusters": [
                {"category": ClusterCategory.QUALITY, "issue": "Thread runs on outer seams", "frequency": 14},
                {"category": ClusterCategory.UX, "issue": "Narrow toe box pressure points", "frequency": 22},
                {"category": ClusterCategory.DELIVERY, "issue": "Fast shipping but package torn", "frequency": 6},
                {"category": ClusterCategory.SERVICE, "issue": "Free exchanges was smooth", "frequency": 18},
                {"category": ClusterCategory.PRICING, "issue": "Slightly expensive for durability", "frequency": 11}
            ],
            "fixes": [
                "Update online sizing chart to explicitly recommend buying one size larger.",
                "Reinforce heel cuff collar padding with soft microfiber linings."
            ],
            "improvements": [
                "Implement double-stitching along the high-pressure side seams.",
                "Upgrade insole adhesive to water-resistant bonding agents."
            ],
            "roadmap": [
                "Evaluate recycled ocean plastic yarn constructs for the next edition.",
                "Partner with orthopedic designers to engineer custom high-arch support bases."
            ],
            "gaps": [
                "Our cushioning outclasses competitors by 15%, but we lag in water-resistance capabilities.",
                "Competitors offer custom colorways which our product catalog currently lacks."
            ]
        }

    # Category 4: Keyboards & Input Devices
    elif any(k in combined for k in ["keyboard", "mouse", "trackpad", "keypad", "typing", "keeb"]):
        return {
            "summary": f"Reviewers of {product_name} are highly satisfied with its typing comfort, tactile switch feedback, and sleek layout. The wireless connectivity is responsive with low latency. However, some complain about key stabilizer rattle on the spacebar and the lack of shine-through keycaps.",
            "pros": [
                {"term": "Tactile Switch Feedback", "count": 25, "percentage": 85.0},
                {"term": "Responsive Wireless Latency", "count": 20, "percentage": 75.0},
                {"term": "Sleek Compact Layout", "count": 15, "percentage": 60.0},
                {"term": "Long Rechargeable Battery", "count": 11, "percentage": 45.0}
            ],
            "cons": [
                {"term": "Spacebar Stabilizer Rattle", "count": 16, "percentage": 50.0},
                {"term": "Non-Shine-Through Keycaps", "count": 11, "percentage": 35.0},
                {"term": "Confusing Custom Software", "count": 7, "percentage": 22.0}
            ],
            "thematic": [
                {"category": "Value for Money", "score": 4.2},
                {"category": "Build Quality", "score": 4.1},
                {"category": "Ease of Use", "score": 4.5},
                {"category": "Reliability", "score": 4.3}
            ],
            "comparison": f"Compared to standard membrane keyboards, the {product_name} offers a far superior mechanical typing experience, though the key stabilizers feel less premium than custom-built alternatives.",
            "highlights": [
                {"category": "Typing", "quote": "The key switches feel extremely smooth and satisfying for long coding sessions.", "sentiment": "Positive"},
                {"category": "Stabilizers", "quote": "The larger keys like Enter and Spacebar rattle loudly and feel loose.", "sentiment": "Negative"},
                {"category": "Lighting", "quote": "RGB effects are cool, but the keys are hard to read in the dark.", "sentiment": "Neutral"}
            ],
            "complaints": [
                {"issue": "Spacebar & Enter Stabilizer Rattle", "impact_score": 6, "volume": 16, "severity": SeverityEnum.MEDIUM, "root_cause": "Dry stabilizer stems and loose wire clips in the plate mount."},
                {"issue": "Backlight Blocked by Keycap Material", "impact_score": 5, "volume": 12, "severity": SeverityEnum.LOW, "root_cause": "Opaque ABS double-shot injection without clear legends."},
                {"issue": "Customization Software Crashes", "impact_score": 7, "volume": 9, "severity": SeverityEnum.HIGH, "root_cause": "Outdated desktop companion app driver compatibilities with macOS."}
            ],
            "timeline": [
                {"stage_or_time": "Day 1 (Setup)", "issue": "Quick pairing connection", "diagnostic": "Quick pairing over Bluetooth and 2.4GHz receiver. Typing felt immediately responsive."},
                {"stage_or_time": "Week 2", "issue": "Double typing key chattering", "diagnostic": "Noticed keys chatter or double-type occasionally when battery falls below 10%."},
                {"stage_or_time": "Month 3", "issue": "Keycap texture shines out", "diagnostic": "Matte texture on keycaps begins to shine from finger grease."}
            ],
            "requests": [
                {"feature": "Include Lubricated Screw-in Stabilizers", "count": 18, "sample_quote": "Please lube the stabilizers in the factory to stop the annoying rattle."},
                {"feature": "PBT Shine-Through Keycaps Pack", "count": 11, "sample_quote": "Wish the keycaps let the RGB light pass through so I can type in the dark."}
            ],
            "clusters": [
                {"category": ClusterCategory.QUALITY, "issue": "Key chatter on double keystrokes", "frequency": 9},
                {"category": ClusterCategory.UX, "issue": "Software profile syncing errors", "frequency": 15},
                {"category": ClusterCategory.DELIVERY, "issue": "Keycap puller tool missing from box", "frequency": 4},
                {"category": ClusterCategory.SERVICE, "issue": "Responsive customer support sent replacement switches", "frequency": 12},
                {"category": ClusterCategory.PRICING, "issue": "Affordable hot-swappable board", "frequency": 18}
            ],
            "fixes": [
                "Pre-lubricate stabilizer housings and wires during factory assembly.",
                "Fix memory leaks in the macOS driver version of customization software."
            ],
            "improvements": [
                "Upgrade stock keycaps to high-durability textured PBT material.",
                "Include a dedicated keycap and switch puller tool in the retail pack."
            ],
            "roadmap": [
                "Develop a custom web-based configurator (VIAL/QMK) to eliminate native app dependencies.",
                "Offer quiet linear silent switch variants for office environments."
            ],
            "gaps": [
                "Our hot-swappability allows users to swap switches easily, which matches enthusiast boards.",
                "We lack standard gasket mounting, which makes the typing feel stiffer than premium custom keyboards."
            ]
        }

    # Category 5: Audio & Microphones
    elif any(k in combined for k in ["mic", "microphone", "headphone", "headset", "earphone", "earbud", "speaker", "audio", "sound", "voice"]):
        return {
            "summary": f"Reviewers praise the {product_name} for its excellent vocal clarity, robust metal construction, and plug-and-play simplicity. It captures audio with minimal self-noise. However, users report that the desk stand picks up desk vibrations easily and the gain control dial is too loose.",
            "pros": [
                {"term": "Crisp Vocal Clarity", "count": 28, "percentage": 88.0},
                {"term": "Plug-and-Play USB Setup", "count": 22, "percentage": 78.0},
                {"term": "Solid Metal Construction", "count": 18, "percentage": 65.0},
                {"term": "Low Internal Noise Floor", "count": 12, "percentage": 50.0}
            ],
            "cons": [
                {"term": "Transfers Desk Vibrations", "count": 18, "percentage": 55.0},
                {"term": "Loose Gain Dial Control", "count": 12, "percentage": 38.0},
                {"term": "Sensitive to Pop Plosives", "count": 8, "percentage": 28.0}
            ],
            "thematic": [
                {"category": "Value for Money", "score": 4.5},
                {"category": "Build Quality", "score": 4.4},
                {"category": "Ease of Use", "score": 4.7},
                {"category": "Reliability", "score": 4.2}
            ],
            "comparison": f"Compared to built-in laptop microphones, the {product_name} provides professional broadcast-quality sound, though it requires a shock mount to match studio setups.",
            "highlights": [
                {"category": "Sound", "quote": "Vocals sound professional and rich. Great for voiceovers and Zoom calls.", "sentiment": "Positive"},
                {"category": "Mounting", "quote": "The heavy stand is nice, but it transmits every keyboard tap directly into the recording.", "sentiment": "Negative"},
                {"category": "Controls", "quote": "Mute button is handy, but I wish it didn't make a loud click sound when pressed.", "sentiment": "Neutral"}
            ],
            "complaints": [
                {"issue": "Vibration & Typing Noise Ingestion", "impact_score": 7, "volume": 18, "severity": SeverityEnum.MEDIUM, "root_cause": "Rigid metal connection without rubber dampening in the desk stand."},
                {"issue": "Oversensitive Gain Control Dial", "impact_score": 5, "volume": 11, "severity": SeverityEnum.LOW, "root_cause": "Lack of detents or physical resistance in the potentiometer."},
                {"issue": "Loud Physical Click on Mute Button", "impact_score": 6, "volume": 8, "severity": SeverityEnum.MEDIUM, "root_cause": "Tactile dome switch used instead of a silent capacitive sensor."}
            ],
            "timeline": [
                {"stage_or_time": "Day 1 (Setup)", "issue": "Instant USB detection", "diagnostic": "Plugged it in and it was instantly recognized. Volume output was excellent."},
                {"stage_or_time": "Week 2", "issue": "Clipping on plosive letters", "diagnostic": "Bought a foam windscreen because my 'P' and 'B' sounds were clipping."},
                {"stage_or_time": "Month 3", "issue": "Slightly loose USB port", "diagnostic": "The USB connection port on the mic base feels slightly loose."}
            ],
            "requests": [
                {"feature": "Include Elastic Band Shock Mount", "count": 22, "sample_quote": "Please bundle a shock mount to stop the thumping noise from typing."},
                {"feature": "Add Silent Mute Touch Sensor", "count": 14, "sample_quote": "Replace the clicky button with a touch pad so I can mute silently during calls."}
            ],
            "clusters": [
                {"category": ClusterCategory.QUALITY, "issue": "USB connection drops", "frequency": 8},
                {"category": ClusterCategory.UX, "issue": "Gain dial bumps easily", "frequency": 12},
                {"category": ClusterCategory.DELIVERY, "issue": "Box arrived slightly squished", "frequency": 4},
                {"category": ClusterCategory.SERVICE, "issue": "Support sent replacement cable", "frequency": 10},
                {"category": ClusterCategory.PRICING, "issue": "Incredible value compared to brand name mics", "frequency": 22}
            ],
            "fixes": [
                "Add rubber vibration isolation rings to the mounting threads.",
                "Replace physical click mute button with a silent capacitive touch sensor."
            ],
            "improvements": [
                "Stiffen the gain dial rotation resistance to avoid accidental changes.",
                "Provide a complimentary pop filter cover in the packaging."
            ],
            "roadmap": [
                "Release a dual XLR/USB model to target both beginner and professional setups.",
                "Integrate an internal analog limiter to prevent audio clipping on loud sounds."
            ],
            "gaps": [
                "Our audio resolution is 24-bit/96kHz which is top-tier, but we don't have headphone mixing software.",
                "Competitors bundle full virtual soundboards, which our companion app currently lacks."
            ]
        }

    # Category 6: Home / Office / Desk Organizer / Furniture
    elif any(k in combined for k in ["organizer", "organiser", "desk", "chair", "table", "shelf", "furniture", "storage", "rack", "stand", "holder", "riser"]):
        return {
            "summary": f"Reviewers of {product_name} are extremely pleased with its organizational capacity and sleek aesthetic. It declutters work spaces effectively and the metal/wood parts feel sturdy. However, the assembly instructions can be hard to follow, and the drawer tracks feel slightly loose over time.",
            "pros": [
                {"term": "Exceptional Storage Space", "count": 28, "percentage": 86.0},
                {"term": "Sturdy Metal/Wood Build", "count": 22, "percentage": 78.0},
                {"term": "Modern Desk Aesthetics", "count": 18, "percentage": 68.0},
                {"term": "Easy to Wipe Clean", "count": 12, "percentage": 48.0}
            ],
            "cons": [
                {"term": "Vague Assembly Guide", "count": 18, "percentage": 52.0},
                {"term": "Loose Drawer Tracks", "count": 12, "percentage": 38.0},
                {"term": "Slight Chemical Odor Initially", "count": 8, "percentage": 24.0}
            ],
            "thematic": [
                {"category": "Value for Money", "score": 4.4},
                {"category": "Build Quality", "score": 4.2},
                {"category": "Ease of Use", "score": 3.9},
                {"category": "Reliability", "score": 4.3}
            ],
            "comparison": f"Compared to cheap plastic trays, the {product_name} offers superior structural rigidity, though it occupies slightly more desk area than standard models.",
            "highlights": [
                {"category": "Storage", "quote": "Fits my dual monitor setup and holds all my pens, notebooks, and cables perfectly.", "sentiment": "Positive"},
                {"category": "Assembly", "quote": "The screws weren't labeled properly in the manual. Spent 45 minutes trying to figure it out.", "sentiment": "Negative"},
                {"category": "Finish", "quote": "The matte coat matches my desk, but scratch resistance could be slightly better.", "sentiment": "Neutral"}
            ],
            "complaints": [
                {"issue": "Confusing Manual & Unlabeled Screws", "impact_score": 7, "volume": 15, "severity": SeverityEnum.MEDIUM, "root_cause": "Lack of exploded view diagrams and part labelling in retail booklet."},
                {"issue": "Wobbly Joints / Loose Fit", "impact_score": 8, "volume": 11, "severity": SeverityEnum.HIGH, "root_cause": "Pre-drilled holes are slightly oversized, leading to play in the dowels."},
                {"issue": "Drawer Sliding Friction", "impact_score": 5, "volume": 9, "severity": SeverityEnum.LOW, "root_cause": "Lack of ball-bearing tracks or pre-lubricated guide rails."}
            ],
            "timeline": [
                {"stage_or_time": "Day 1 (Assembly)", "issue": "Struggled with board alignment", "diagnostic": "The side panel slots have very tight tolerances making manual insertion tricky."},
                {"stage_or_time": "Week 2", "issue": "Drawer starts sticking when loaded", "diagnostic": "Static wood joints absorb ambient moisture and expand slightly causing friction."},
                {"stage_or_time": "Month 3", "issue": "Bottom rubber pads slide off", "diagnostic": "Thermal changes dry out the cheap adhesive layer under the protective footers."}
            ],
            "requests": [
                {"feature": "Numbered Assembly Screws Pack", "count": 19, "sample_quote": "Please separate the screws into labeled bags instead of one big mix."},
                {"feature": "Include Cable Management Clips", "count": 12, "sample_quote": "Adding slot cutouts or clips on the back would help hide messy wires."}
            ],
            "clusters": [
                {"category": ClusterCategory.QUALITY, "issue": "Screw holes stripping out", "frequency": 11},
                {"category": ClusterCategory.UX, "issue": "Drawer sticking issues", "frequency": 14},
                {"category": ClusterCategory.DELIVERY, "issue": "Corners chipped during transit", "frequency": 5},
                {"category": ClusterCategory.SERVICE, "issue": "Responsive support sent replacement board", "frequency": 15},
                {"category": ClusterCategory.PRICING, "issue": "Very reasonable price for wood finish", "frequency": 20}
            ],
            "fixes": [
                "Label screw packs with matching step numbers (A, B, C).",
                "Apply stronger thermal adhesive to bottom rubber feet."
            ],
            "improvements": [
                "Include adhesive-backed cable management clips in the box.",
                "Increase pre-drill depth for main support dowels by 2mm."
            ],
            "roadmap": [
                "Design an adjustable-height extension riser for dual monitor support.",
                "Offer bamboo and walnut wood finishes to match premium desks."
            ],
            "gaps": [
                "Our load-bearing capacity is 40% higher than plastic organizers, but we lack built-in charging ports.",
                "Competitors include built-in wireless charging pads in their premium risers."
            ]
        }

    # Default Category: Generic Tech / Gadgets
    else:
        return {
            "summary": f"Users rate the {product_name} highly for its robust features and modern aesthetic. Operation is straightforward, and the primary functions work exactly as advertised. However, initial setup can be confusing, and the outer shell collects dust easily.",
            "pros": [
                {"term": "Feature Versatility", "count": 20, "percentage": 78.0},
                {"term": "Modern Style Aesthetics", "count": 16, "percentage": 70.0},
                {"term": "Responsive Interface", "count": 12, "percentage": 55.0},
                {"term": "Good Packaging Quality", "count": 9, "percentage": 40.0}
            ],
            "cons": [
                {"term": "Confusing Setup Flow", "count": 15, "percentage": 48.0},
                {"term": "Housing Collects Dust / Smudges", "count": 10, "percentage": 32.0},
                {"term": "Delicate Connector Latch", "count": 7, "percentage": 22.0}
            ],
            "thematic": [
                {"category": "Value for Money", "score": 4.0},
                {"category": "Build Quality", "score": 3.7},
                {"category": "Ease of Use", "score": 3.9},
                {"category": "Reliability", "score": 4.1}
            ],
            "comparison": f"The {product_name} provides robust features that match high-end models, though it misses minor luxury details seen in elite alternatives.",
            "highlights": [
                {"category": "Features", "quote": "The capability list is impressive. Performs the core job flawlessly.", "sentiment": "Positive"},
                {"category": "Setup", "quote": "The manual had tiny print and the onboarding instructions were confusing.", "sentiment": "Negative"},
                {"category": "Finish", "quote": "Love the matte black, but it shows oily fingerprints instantly.", "sentiment": "Neutral"}
            ],
            "complaints": [
                {"issue": "Complex Initial Setup and Onboarding", "impact_score": 7, "volume": 15, "severity": SeverityEnum.MEDIUM, "root_cause": "Undocumented firmware pairing steps in quick-start guide."},
                {"issue": "Outer Finish Attracts Smudges Easily", "impact_score": 4, "volume": 10, "severity": SeverityEnum.LOW, "root_cause": "Static-conductive matte plastic coating attracts particles."},
                {"issue": "Delicate Latch break reports", "impact_score": 8, "volume": 7, "severity": SeverityEnum.HIGH, "root_cause": "Brittle ABS plastic latches used in structural connections."}
            ],
            "timeline": [
                {"stage_or_time": "Day 1 (Unboxing)", "issue": "Confusing hardware initialization", "diagnostic": "Status LED blink codes are not explained in quick-start pamphlets."},
                {"stage_or_time": "Week 2", "issue": "Connector latch feels loose", "diagnostic": "Repetitive clicking shifts the delicate plastic catch out of line."},
                {"stage_or_time": "Month 3", "issue": "Minor system hiccups", "diagnostic": "Cache memory fills up and requires manual power cycles to clear."}
            ],
            "requests": [
                {"feature": "Simplified Mobile Setup Guide", "count": 16, "sample_quote": "Give me a QR code to scan instead of making me search through text guides."},
                {"feature": "Provide Carrying Case", "count": 9, "sample_quote": "The matte finish gets scuffed easily in bags. Needs a protective sleeve."}
            ],
            "clusters": [
                {"category": ClusterCategory.QUALITY, "issue": "ABS plastic hinges break", "frequency": 7},
                {"category": ClusterCategory.UX, "issue": "Setup instructions vague", "frequency": 15},
                {"category": ClusterCategory.DELIVERY, "issue": "Delivered box was damp", "frequency": 3},
                {"category": ClusterCategory.SERVICE, "issue": "Customer support resolved quickly", "frequency": 11},
                {"category": ClusterCategory.PRICING, "issue": "Great features for the price", "frequency": 14}
            ],
            "fixes": [
                "Update quick start guide with a QR link pointing to video setup steps.",
                "Replace brittle ABS latch pins with glass-filled nylon constructs."
            ],
            "improvements": [
                "Apply oleophobic coating to matte outer panels to resist smudges.",
                "Include a soft-cloth pouch in the standard packaging."
            ],
            "roadmap": [
                "Investigate cloud synchronization features for future product lines.",
                "Design a wireless solar-charging module for continuous power."
            ],
            "gaps": [
                "Our core performance is equal to leading brands at a 30% lower cost structure.",
                "Unlike alternatives, we do not support native smart home connections yet."
            ]
        }

def generate_mock_buyer_insights(text: str, product_name: str = "") -> BuyerModeSchema:
    kw_data = parse_simple_keywords(text)
    sentiment = kw_data["sentiment"]
    
    if not product_name:
        product_name = "Smart Product"
        
    mock_db = get_mock_data_for_product(product_name, text)
    
    # Determine verdict based on sentiment
    pos_pct = sentiment["pos"]
    if pos_pct >= 75:
        verdict = VerdictEnum.STRONG_BUY
        explanation = f"The reviews for {product_name} reflect outstanding satisfaction, with praise for build quality and performance far outweighing minor complaints."
    elif pos_pct >= 55:
        verdict = VerdictEnum.BUY_WITH_CAUTION
        explanation = f"Solid overall feedback for {product_name}, but buyers note potential concerns that might require review prior to purchasing."
    elif pos_pct >= 35:
        verdict = VerdictEnum.ONLY_BUY_ON_DISCOUNT
        explanation = f"The {product_name} delivers acceptable value but has enough drawbacks that it's best purchased on sale."
    else:
        verdict = VerdictEnum.AVOID
        explanation = f"Frequent reports of functional defects, shipping issues, or bad customer service for {product_name} suggest looking for alternatives."

    pros_list = [FrequencyItem(**item) for item in mock_db["pros"]]
    cons_list = [FrequencyItem(**item) for item in mock_db["cons"]]
    thematic = [ThematicScore(**item) for item in mock_db["thematic"]]
    highlights = [ReviewHighlight(**item) for item in mock_db["highlights"]]

    return BuyerModeSchema(
        verdict=verdict,
        verdict_explanation=explanation,
        ai_summary=mock_db["summary"],
        sentiment_overview=SentimentOverview(
            positive_percentage=sentiment["pos"],
            neutral_percentage=sentiment["neu"],
            negative_percentage=sentiment["neg"]
        ),
        top_pros=pros_list,
        top_cons=cons_list,
        thematic_scores=thematic,
        comparison_insights=mock_db["comparison"],
        categorized_highlights=highlights
    )

def generate_mock_seller_insights(text: str, product_name: str = "") -> SellerModeSchema:
    if not product_name:
        product_name = "Smart Product"
        
    mock_db = get_mock_data_for_product(product_name, text)
    
    complaints = [ComplaintItem(**item) for item in mock_db["complaints"]]
    timeline = [TimelineEvent(**item) for item in mock_db["timeline"]]
    requests = [FeatureRequest(**item) for item in mock_db["requests"]]
    clusters = [ClusterItem(**item) for item in mock_db["clusters"]]

    return SellerModeSchema(
        ranked_complaints=sorted(complaints, key=lambda x: x.impact_score, reverse=True),
        root_cause_timeline=timeline,
        extracted_feature_requests=requests,
        clustered_feedback=clusters,
        immediate_fixes=mock_db["fixes"],
        short_term_improvements=mock_db["improvements"],
        long_term_roadmap=mock_db["roadmap"],
        competitor_gaps=mock_db["gaps"]
    )
