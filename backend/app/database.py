from sqlalchemy import create_engine, Column, String, Integer, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from datetime import datetime, timezone
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./roamagent.db")

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class BookingModel(Base):
    __tablename__ = "bookings"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=True) # For future auth
    status = Column(String, default="PENDING") # PENDING, CONFIRMED, CANCELLED
    amount = Column(Float)
    currency = Column(String, default="INR")
    payment_id = Column(String, nullable=True)
    payment_status = Column(String, nullable=True)
    travel_date = Column(String)
    origin = Column(String)
    destination = Column(String)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Snapshot of the itinerary (can be json string or separate tables, we'll store JSON for simplicity of full snapshot)
    itinerary_snapshot = Column(String) # JSON string
    
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

Base.metadata.create_all(bind=engine)
