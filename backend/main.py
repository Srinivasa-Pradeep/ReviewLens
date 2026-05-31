import os
import json
from fastapi import FastAPI, Depends, UploadFile, File, Form, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional

from database import engine, Base, get_db
import models
import schemas
import ingestion
import analyzer

app = FastAPI(
    title="ReviewLens API",
    description="AI-powered review analytics ingestion and structured analysis layer.",
    version="1.0.0"
)

# Configure CORS for Next.js frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify front-end domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_cache_control_header(request: Request, call_next):
    response = await call_next(request)
    if request.url.path.startswith("/api/"):
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
    return response

@app.on_event("startup")
async def startup_event():
    # Automatically create tables in SQLite/Postgres on startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Database tables initialized successfully.")

@app.get("/")
def read_root():
    return {"name": "ReviewLens API", "status": "operational", "mock_mode": analyzer.client is None}


# --- OAuth Simulator ---

@app.get("/api/auth/mock-login/{provider}")
def mock_login(provider: str, email: str = "demo@reviewlens.io"):
    """Simulates a secure OAuth response for frontend consumption."""
    if provider not in ["google", "github"]:
        raise HTTPException(status_code=400, detail="Unsupported auth provider")
        
    return {
        "user": {
            "name": f"Premium User ({provider.capitalize()})",
            "email": email,
            "avatar": f"https://api.dicebear.com/7.x/adventurer/svg?seed={email}",
            "tier": "Premium Partner",
            "provider": provider
        },
        "token": "simulated-jwt-token-reviewlens-secret"
    }


# --- Review Ingestion & Analysis Enpoints ---

@app.post("/api/ingest/text", response_model=schemas.FullAnalysisResponse)
async def ingest_text(
    name: str = Form(...),
    text: str = Form(...),
    db: AsyncSession = Depends(get_db)
):
    if not text.strip():
        raise HTTPException(status_code=400, detail="Review text content cannot be empty.")

    # Clean and token-safe check
    cleaned_reviews = [ingestion.clean_review_text(r) for r in text.split("\n") if r.strip()]
    if not cleaned_reviews:
        raise HTTPException(status_code=400, detail="No readable reviews found in text.")

    final_payload = ingestion.process_and_budget_reviews(cleaned_reviews)

    # 1. Create dataset entry
    dataset = models.ProductDataset(
        name=name,
        source_type="text",
        raw_content=final_payload
    )
    db.add(dataset)
    await db.flush()

    # 2. Run Structured analysis concurrently
    buyer_data = await analyzer.extract_buyer_insights(final_payload, name)
    seller_data = await analyzer.extract_seller_insights(final_payload, name)

    # Convert Pydantic schemas to standard JSON/dict for SQLAlchemy JSON columns
    buyer_dict = json.loads(buyer_data.model_dump_json())
    seller_dict = json.loads(seller_data.model_dump_json())

    # 3. Save analysis results
    analysis = models.AnalysisResult(
        dataset_id=dataset.id,
        buyer_insights=buyer_dict,
        seller_insights=seller_dict
    )
    db.add(analysis)
    await db.commit()
    await db.refresh(dataset)
    await db.refresh(analysis)

    return schemas.FullAnalysisResponse(
        dataset_id=dataset.id,
        name=dataset.name,
        source_type=dataset.source_type,
        buyer_insights=buyer_data,
        seller_insights=seller_data,
        created_at=dataset.created_at.isoformat()
    )


@app.post("/api/ingest/csv", response_model=schemas.FullAnalysisResponse)
async def ingest_csv(
    name: str = Form(...),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    try:
        file_bytes = await file.read()
        reviews, message = ingestion.parse_csv_reviews(file_bytes)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    if not reviews:
        raise HTTPException(status_code=400, detail="No reviews could be parsed from the CSV file.")

    final_payload = ingestion.process_and_budget_reviews(reviews)

    # 1. Create dataset entry
    dataset = models.ProductDataset(
        name=name,
        source_type="csv",
        raw_content=final_payload
    )
    db.add(dataset)
    await db.flush()

    # 2. Extract buyer and seller insights
    buyer_data = await analyzer.extract_buyer_insights(final_payload, name)
    seller_data = await analyzer.extract_seller_insights(final_payload, name)

    # 3. Save analysis results
    analysis = models.AnalysisResult(
        dataset_id=dataset.id,
        buyer_insights=json.loads(buyer_data.model_dump_json()),
        seller_insights=json.loads(seller_data.model_dump_json())
    )
    db.add(analysis)
    await db.commit()
    await db.refresh(dataset)
    await db.refresh(analysis)

    return schemas.FullAnalysisResponse(
        dataset_id=dataset.id,
        name=dataset.name,
        source_type=dataset.source_type,
        buyer_insights=buyer_data,
        seller_insights=seller_data,
        created_at=dataset.created_at.isoformat()
    )


@app.post("/api/ingest/url", response_model=schemas.FullAnalysisResponse)
async def ingest_url(
    request: schemas.UrlAnalyzeRequest,
    db: AsyncSession = Depends(get_db)
):
    # Extract product name from URL if possible to avoid stale name field from front-end
    url_name = analyzer.extract_product_name_from_url(request.url)
    display_name = url_name if url_name else (request.name if request.name.strip() else "Analyzed Product")

    # Dynamically generate category-appropriate mock reviews based on url / dataset name keywords
    mock_reviews = analyzer.get_mock_reviews_for_url(display_name, request.url)
    
    final_payload = ingestion.process_and_budget_reviews(mock_reviews)

    # 1. Create dataset entry
    dataset = models.ProductDataset(
        name=display_name,
        source_type="url",
        raw_content=final_payload
    )
    db.add(dataset)
    await db.flush()

    # 2. Extract buyer and seller insights
    buyer_data = await analyzer.extract_buyer_insights(final_payload, display_name)
    seller_data = await analyzer.extract_seller_insights(final_payload, display_name)

    # 3. Save analysis results
    analysis = models.AnalysisResult(
        dataset_id=dataset.id,
        buyer_insights=json.loads(buyer_data.model_dump_json()),
        seller_insights=json.loads(seller_data.model_dump_json())
    )
    db.add(analysis)
    await db.commit()
    await db.refresh(dataset)
    await db.refresh(analysis)

    return schemas.FullAnalysisResponse(
        dataset_id=dataset.id,
        name=dataset.name,
        source_type=dataset.source_type,
        buyer_insights=buyer_data,
        seller_insights=seller_data,
        created_at=dataset.created_at.isoformat()
    )


@app.get("/api/datasets", response_model=List[schemas.DatasetResponse])
async def list_datasets(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.ProductDataset).order_by(models.ProductDataset.created_at.desc()))
    datasets = result.scalars().all()
    return [
        schemas.DatasetResponse(
            id=d.id,
            name=d.name,
            source_type=d.source_type,
            created_at=d.created_at.isoformat()
        ) for d in datasets
    ]


@app.get("/api/datasets/{dataset_id}", response_model=schemas.FullAnalysisResponse)
async def get_dataset_analysis(dataset_id: int, db: AsyncSession = Depends(get_db)):
    # Load dataset
    result = await db.execute(select(models.ProductDataset).where(models.ProductDataset.id == dataset_id))
    dataset = result.scalar_one_or_none()
    
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")

    # Load corresponding analysis
    analysis_result = await db.execute(select(models.AnalysisResult).where(models.AnalysisResult.dataset_id == dataset_id))
    analysis = analysis_result.scalar_one_or_none()

    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis results not found for this dataset")

    # The JSON columns map directly to dicts, which validate against schemas
    return schemas.FullAnalysisResponse(
        dataset_id=dataset.id,
        name=dataset.name,
        source_type=dataset.source_type,
        buyer_insights=schemas.BuyerModeSchema(**analysis.buyer_insights),
        seller_insights=schemas.SellerModeSchema(**analysis.seller_insights),
        created_at=dataset.created_at.isoformat()
    )


@app.delete("/api/datasets/{dataset_id}")
async def delete_dataset(dataset_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.ProductDataset).where(models.ProductDataset.id == dataset_id))
    dataset = result.scalar_one_or_none()
    
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
        
    await db.delete(dataset)
    await db.commit()
    return {"message": f"Dataset {dataset_id} deleted successfully"}
