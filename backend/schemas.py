from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

# --- Shared & Common Schemas ---

class SentimentOverview(BaseModel):
    positive_percentage: float = Field(..., description="Percentage of positive reviews (0 to 100)")
    neutral_percentage: float = Field(..., description="Percentage of neutral reviews (0 to 100)")
    negative_percentage: float = Field(..., description="Percentage of negative reviews (0 to 100)")

class FrequencyItem(BaseModel):
    term: str = Field(..., description="The key phrase or feature discussed")
    count: int = Field(..., description="Frequency of mention in the reviews")
    percentage: float = Field(..., description="Percentage of reviews mentioning this term")

class ThematicScore(BaseModel):
    category: str = Field(..., description="The thematic dimension (e.g. Value, Build Quality, Ease of Use)")
    score: float = Field(..., description="Score out of 5.0")

class ReviewHighlight(BaseModel):
    category: str = Field(..., description="Category label for the highlight (e.g. 'Battery Life', 'Setup Complexity')")
    quote: str = Field(..., description="Exact or highly representative quote from reviews")
    sentiment: str = Field(..., description="Positive, Negative, or Neutral")


# --- Buyer Mode Schemas ---

class VerdictEnum(str, Enum):
    STRONG_BUY = "Strong Buy"
    BUY_WITH_CAUTION = "Buy with Caution"
    ONLY_BUY_ON_DISCOUNT = "Only Buy on Discount"
    AVOID = "Avoid"

class BuyerModeSchema(BaseModel):
    verdict: VerdictEnum = Field(..., description="The definitive buying verdict for a consumer")
    verdict_explanation: str = Field(..., description="Brief 1-2 sentence justification for the verdict")
    ai_summary: str = Field(..., description="Consolidated review summary highlighting key takeaways for buyers")
    sentiment_overview: SentimentOverview = Field(..., description="Overall sentiment distribution")
    top_pros: List[FrequencyItem] = Field(..., description="List of top positive highlights with frequencies")
    top_cons: List[FrequencyItem] = Field(..., description="List of top negative highlights with frequencies")
    thematic_scores: List[ThematicScore] = Field(..., description="Scores for different dimensions out of 5")
    comparison_insights: str = Field(..., description="Insights on how this compares to market standards or alternatives")
    categorized_highlights: List[ReviewHighlight] = Field(..., description="Specific highlights and quotes from the reviews")


# --- Seller Mode Schemas ---

class SeverityEnum(str, Enum):
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"

class ComplaintItem(BaseModel):
    issue: str = Field(..., description="The issue or pain point")
    impact_score: int = Field(..., description="Business/Customer impact score (1-10, 10 being severe)")
    volume: int = Field(..., description="Number of reviews raising this issue")
    severity: SeverityEnum = Field(..., description="Severity level: High, Medium, or Low")
    root_cause: str = Field(..., description="Inferred root cause of the complaint")

class TimelineEvent(BaseModel):
    stage_or_time: str = Field(..., description="The stage or point in time (e.g. 'Unboxing', 'First Week', 'After 3 Months')")
    issue: str = Field(..., description="The typical issue encountered at this stage")
    diagnostic: str = Field(..., description="Detailed diagnostic and explanation of the issue")

class FeatureRequest(BaseModel):
    feature: str = Field(..., description="The requested feature or modification")
    count: int = Field(..., description="Number of reviews requesting this")
    sample_quote: str = Field(..., description="Representative review quote requesting this feature")

class ClusterCategory(str, Enum):
    QUALITY = "Product Quality"
    PACKAGING = "Packaging"
    SERVICE = "Customer Service"
    DELIVERY = "Delivery"
    PRICING = "Pricing"
    UX = "User Experience"

class ClusterItem(BaseModel):
    category: ClusterCategory = Field(..., description="The clustering bucket for this issue")
    issue: str = Field(..., description="The issue or feedback detail")
    frequency: int = Field(..., description="Frequency of mentions within this cluster")

class SellerModeSchema(BaseModel):
    ranked_complaints: List[ComplaintItem] = Field(..., description="List of ranked customer complaints and pain points")
    root_cause_timeline: List[TimelineEvent] = Field(..., description="Diagnostics of complaints organized chronologically along the customer journey")
    extracted_feature_requests: List[FeatureRequest] = Field(..., description="Product improvements and feature requests extracted from reviews")
    clustered_feedback: List[ClusterItem] = Field(..., description="Review items clustered into Product Quality, Packaging, Customer Service, Delivery, Pricing, or UX")
    immediate_fixes: List[str] = Field(..., description="Actionable things the seller needs to fix immediately")
    short_term_improvements: List[str] = Field(..., description="Product improvements to make in the next product iteration")
    long_term_roadmap: List[str] = Field(..., description="Long-term features and strategic ideas for the roadmap")
    competitor_gaps: List[str] = Field(..., description="Gaps identified compared to competitors where the seller can win")


# --- Ingestion Web Schemas ---

class TextPasteRequest(BaseModel):
    name: str = Field(..., description="A friendly name for this dataset")
    text: str = Field(..., description="Raw text of reviews pasted by user")

class UrlAnalyzeRequest(BaseModel):
    name: Optional[str] = Field(None, description="A friendly name for this dataset")
    url: str = Field(..., description="Product URL to analyze")

class DatasetResponse(BaseModel):
    id: int
    name: str
    source_type: str
    created_at: str

class FullAnalysisResponse(BaseModel):
    dataset_id: int
    name: str
    source_type: str
    buyer_insights: BuyerModeSchema
    seller_insights: SellerModeSchema
    created_at: str
