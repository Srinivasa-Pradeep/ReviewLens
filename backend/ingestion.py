import re
import pandas as pd
import io
import tiktoken
from typing import List, Dict, Any, Tuple

# We'll target a max token size for the LLM payload to prevent context window overflow (e.g., ~40,000 tokens)
MAX_TOKEN_BUDGET = 40000
ENCODING_NAME = "cl100k_base"

def count_tokens(text: str) -> int:
    """Counts the number of tokens in a text string using tiktoken."""
    try:
        encoding = tiktoken.get_encoding(ENCODING_NAME)
        return len(encoding.encode(text))
    except Exception:
        # Simple word count approximation fallback if tiktoken fails
        return len(text.split())

def clean_review_text(text: str) -> str:
    """Cleans raw review text, stripping HTML, resolving whitespace issues, etc."""
    if not isinstance(text, str):
        return ""
    # Strip HTML tags
    text = re.sub(r"<[^>]*>", " ", text)
    # Normalize multiple whitespace characters to a single space
    text = re.sub(r"\s+", " ", text).strip()
    return text

def parse_csv_reviews(file_bytes: bytes) -> Tuple[List[str], str]:
    """
    Parses a CSV file containing reviews. 
    Attempts to identify rating and review columns dynamically.
    Returns:
        - List of formatted review strings
        - Short status message
    """
    try:
        df = pd.read_csv(io.BytesIO(file_bytes))
    except Exception as e:
        raise ValueError(f"Could not parse CSV file: {str(e)}")

    if df.empty:
        raise ValueError("The uploaded CSV is empty.")

    # Lowercase columns for easier match
    cols = {col.lower(): col for col in df.columns}
    
    # Try to find the review body column
    body_keywords = ["review", "body", "text", "content", "comments", "comment", "message", "description"]
    body_col = None
    for kw in body_keywords:
        matching_cols = [c for c in cols if kw in c]
        if matching_cols:
            body_col = cols[matching_cols[0]]
            break
            
    if not body_col:
        # Fallback to the first column with the longest strings on average
        string_cols = [col for col in df.columns if df[col].dtype == object]
        if string_cols:
            body_col = max(string_cols, key=lambda c: df[c].astype(str).str.len().mean())
        else:
            # Absolute fallback
            body_col = df.columns[0]

    # Try to find a rating column for sentiment stratification
    rating_keywords = ["rating", "score", "stars", "star"]
    rating_col = None
    for kw in rating_keywords:
        matching_cols = [c for c in cols if kw in c]
        if matching_cols:
            rating_col = cols[matching_cols[0]]
            break

    # Clean and extract review records
    reviews = []
    for idx, row in df.iterrows():
        body_text = clean_review_text(str(row[body_col]))
        if not body_text:
            continue
            
        rating_info = f" [Rating: {row[rating_col]}/5]" if rating_col and pd.notna(row[rating_col]) else ""
        formatted_review = f"- {body_text}{rating_info}"
        reviews.append(formatted_review)
        
    status = f"Successfully parsed {len(reviews)} reviews from column '{body_col}'."
    if rating_col:
        status += f" Extracted ratings from column '{rating_col}'."
        
    return reviews, status

def process_and_budget_reviews(reviews: List[str]) -> str:
    """
    Combines reviews into a single text payload while ensuring it fits
    comfortably within the MAX_TOKEN_BUDGET.
    If the review content is too large, it performs representative sampling
    to preserve data integrity.
    """
    # Quick count for the whole set joined
    full_payload = "\n".join(reviews)
    token_count = count_tokens(full_payload)
    
    if token_count <= MAX_TOKEN_BUDGET:
        return full_payload

    # If it exceeds the budget, we must sample.
    # We will sample uniformly or attempt to distribute evenly.
    print(f"Token count ({token_count}) exceeds budget ({MAX_TOKEN_BUDGET}). Sampling reviews...")
    
    # Calculate approximate target reviews count
    avg_tokens_per_review = token_count / len(reviews)
    target_count = int(MAX_TOKEN_BUDGET / avg_tokens_per_review)
    target_count = max(10, min(target_count, len(reviews) - 1))
    
    # Sample uniformly across the index list
    step = len(reviews) / target_count
    sampled_reviews = []
    for i in range(target_count):
        idx = int(i * step)
        if idx < len(reviews):
            sampled_reviews.append(reviews[idx])
            
    final_payload = "\n".join(sampled_reviews)
    print(f"Sampled {len(sampled_reviews)} reviews down to {count_tokens(final_payload)} tokens.")
    return final_payload
