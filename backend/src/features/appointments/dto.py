from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime, date, time

class AppointmentBase(BaseModel):
    full_name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(min_length=5, max_length=20)
    appointment_date: date
    appointment_time: time
    service_type: str = Field(max_length=100)
    notes: Optional[str] = Field(default=None, max_length=500)

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentUpdate(BaseModel):
    full_name: Optional[str] = Field(default=None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(default=None, min_length=5, max_length=20)
    appointment_date: Optional[date] = None
    appointment_time: Optional[time] = None
    service_type: Optional[str] = Field(default=None, max_length=100)
    notes: Optional[str] = Field(default=None, max_length=500)
    status: Optional[str] = Field(default=None, max_length=20)

class AppointmentResponse(AppointmentBase):
    id: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class AppointmentList(BaseModel):
    items: List[AppointmentResponse]
    total: int
    page: int
    size: int
