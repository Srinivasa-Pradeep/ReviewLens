import { NextResponse } from 'next/server';
import { 
  generateMockBuyerInsights, 
  generateMockSellerInsights 
} from '@/lib/analyzer';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = (formData.get('name') as string) || "Pasted Product Dataset";
    const text = formData.get('text') as string;

    if (!text || !text.trim()) {
      return NextResponse.json({ detail: "Review text content cannot be empty." }, { status: 400 });
    }

    // Clean and split lines
    const cleanedReviews = text
      .split('\n')
      .map(r => r.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim())
      .filter(Boolean);

    if (cleanedReviews.length === 0) {
      return NextResponse.json({ detail: "No readable reviews found in text." }, { status: 400 });
    }

    const reviewsText = cleanedReviews.join('\n');

    // Run structured analysis mock engines
    const buyerInsights = generateMockBuyerInsights(reviewsText, name);
    const sellerInsights = generateMockSellerInsights(reviewsText, name);

    return NextResponse.json({
      name: name,
      source_type: 'text',
      buyer_insights: buyerInsights,
      seller_insights: sellerInsights
    });
  } catch (err: any) {
    console.error("Error in serverless text ingest API route:", err);
    return NextResponse.json({ detail: err.message || "Failed to process text analysis" }, { status: 500 });
  }
}
