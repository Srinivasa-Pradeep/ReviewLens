import { NextResponse } from 'next/server';
import { 
  extractProductNameFromUrl, 
  getMockReviewsForUrl, 
  generateMockBuyerInsights, 
  generateMockSellerInsights 
} from '@/lib/analyzer';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url || !url.trim()) {
      return NextResponse.json({ detail: "Product URL is required" }, { status: 400 });
    }

    const cleanedUrl = url.trim();
    // 1. Scrape product name from the URL
    const urlName = await extractProductNameFromUrl(cleanedUrl);
    const displayName = urlName || "Analyzed Product";

    // 2. Generate category-appropriate reviews
    const mockReviews = getMockReviewsForUrl(displayName, cleanedUrl);
    const reviewsText = mockReviews.join('\n');

    // 3. Extract mock buyer & seller insights
    const buyerInsights = generateMockBuyerInsights(reviewsText, displayName);
    const sellerInsights = generateMockSellerInsights(reviewsText, displayName);

    return NextResponse.json({
      name: displayName,
      source_type: 'url',
      buyer_insights: buyerInsights,
      seller_insights: sellerInsights
    });
  } catch (err: any) {
    console.error("Error in serverless URL ingest API route:", err);
    return NextResponse.json({ detail: err.message || "Failed to process URL analysis" }, { status: 500 });
  }
}
