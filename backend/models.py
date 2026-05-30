import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base

class ProductDataset(Base):
    __tablename__ = "product_datasets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    source_type = Column(String)  # "text", "csv", "url"
    raw_content = Column(Text)    # Pasted reviews or CSV records
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    analyses = relationship("AnalysisResult", back_populates="dataset", cascade="all, delete-orphan")

class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer, ForeignKey("product_datasets.id", ondelete="CASCADE"), nullable=False)
    buyer_insights = Column(JSON, nullable=False)  # JSON structure matching BuyerModeSchema
    seller_insights = Column(JSON, nullable=False) # JSON structure matching SellerModeSchema
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    dataset = relationship("ProductDataset", back_populates="analyses")
