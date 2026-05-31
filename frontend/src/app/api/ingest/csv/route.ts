import { NextResponse } from 'next/server';
import { 
  generateMockBuyerInsights, 
  generateMockSellerInsights 
} from '@/lib/analyzer';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = (formData.get('name') as string) || "CSV Product Dataset";
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ detail: "CSV file is required." }, { status: 400 });
    }

    const fileContent = await file.text();
    if (!fileContent.trim()) {
      return NextResponse.json({ detail: "The uploaded CSV file is empty." }, { status: 400 });
    }

    // Split CSV into rows (handling basic comma splitting for simplicity)
    const rows = fileContent
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    if (rows.length < 2) {
      return NextResponse.json({ detail: "CSV file must contain a header row and at least one review row." }, { status: 400 });
    }

    // Parse headers (strip quotes)
    const headers = rows[0].split(',').map(h => h.replace(/^["']|["']$/g, '').trim().toLowerCase());
    
    // Attempt to identify the reviews column
    const reviewKeywords = ["review", "body", "text", "content", "comments", "comment", "message", "description"];
    let reviewColIndex = -1;
    for (const kw of reviewKeywords) {
      reviewColIndex = headers.findIndex(h => h.includes(kw));
      if (reviewColIndex !== -1) break;
    }

    // Default to first column if no keyword matches
    if (reviewColIndex === -1) {
      reviewColIndex = 0;
    }

    const cleanedReviews: string[] = [];
    for (let i = 1; i < rows.length; i++) {
      const columns = rows[i].split(',');
      if (columns.length > reviewColIndex) {
        let text = columns[reviewColIndex].replace(/^["']|["']$/g, '').trim();
        // Simple HTML stripping
        text = text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
        if (text) {
          cleanedReviews.push("- " + text);
        }
      }
    }

    if (cleanedReviews.length === 0) {
      return NextResponse.json({ detail: "No reviews could be parsed from the CSV file." }, { status: 400 });
    }

    const reviewsText = cleanedReviews.join('\n');

    // Run mock engines
    const buyerInsights = generateMockBuyerInsights(reviewsText, name);
    const sellerInsights = generateMockSellerInsights(reviewsText, name);

    return NextResponse.json({
      name: name,
      source_type: 'csv',
      buyer_insights: buyerInsights,
      seller_insights: sellerInsights
    });
  } catch (err: any) {
    console.error("Error in serverless CSV ingest API route:", err);
    return NextResponse.json({ detail: err.message || "Failed to process CSV analysis" }, { status: 500 });
  }
}
