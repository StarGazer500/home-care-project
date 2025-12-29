from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime, date, time

class Appointment(SQLModel, table=True):
    __tablename__ = "appointments"

    id: Optional[int] = Field(default=None, primary_key=True)
    full_name: str = Field(max_length=100)
    email: str = Field(max_length=100)
    phone: str = Field(max_length=20)
    appointment_date: date
    appointment_time: time
    service_type: str = Field(max_length=100)
    notes: Optional[str] = Field(default=None, max_length=500)
    status: str = Field(default="pending", max_length=20)  # pending, confirmed, cancelled, completed
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
