from sqlmodel import SQLModel, Field, Column, Relationship
from sqlalchemy import ForeignKey
from geoalchemy2 import Geometry
from typing import Optional, TYPE_CHECKING
from datetime import datetime, date, time

if TYPE_CHECKING:
    from src.features.accounts.models import User

class Appointment(SQLModel, table=True):
    __tablename__ = "appointments"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[int] = Field(default=None, sa_column=Column(ForeignKey("users.id", ondelete="SET NULL")))
    full_name: str = Field(max_length=100)
    email: str = Field(max_length=100)
    phone: str = Field(max_length=20)
    appointment_date: date
    appointment_time: time
    service_type: str = Field(max_length=100)
    notes: Optional[str] = Field(default=None, max_length=500)
    status: str = Field(default="pending", max_length=20)  # pending, confirmed, cancelled, completed

    # Location as PostGIS geometry (POINT with WGS84 coordinate system)
    location: Optional[str] = Field(
        default=None,
        sa_column=Column(Geometry(geometry_type='POINT', srid=4326), nullable=True)
    )
    location_address: Optional[str] = Field(default=None, max_length=300)  # Readable address from reverse geocoding

    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    # Relationship
    user: Optional["User"] = Relationship(back_populates="appointments")
