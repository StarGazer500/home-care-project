from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime, date, time

class LocationData(BaseModel):
    """Location coordinates for mapping"""
    latitude: float = Field(ge=-90, le=90, description="Latitude coordinate")
    longitude: float = Field(ge=-180, le=180, description="Longitude coordinate")

class AppointmentBase(BaseModel):
    full_name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(min_length=5, max_length=20)
    appointment_date: date
    appointment_time: time
    service_type: str = Field(max_length=100)
    notes: Optional[str] = Field(default=None, max_length=500)
    location: Optional[LocationData] = None
    location_address: Optional[str] = Field(default=None, max_length=300)

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
    location: Optional[LocationData] = None
    location_address: Optional[str] = Field(default=None, max_length=300)

class AppointmentResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str
    appointment_date: date
    appointment_time: time
    service_type: str
    notes: Optional[str]
    status: str
    location: Optional[LocationData] = None
    location_address: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class AppointmentList(BaseModel):
    items: List[AppointmentResponse]
    total: int
    page: int
    size: int
