from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from datetime import date
from geoalchemy2.shape import to_shape
from shapely.geometry import Point

from src.core.database import get_session
from src.features.appointments.service import AppointmentService
from src.features.appointments.dto import (
    AppointmentCreate,
    AppointmentUpdate,
    AppointmentList,
    AppointmentResponse,
    LocationData
)
from src.features.appointments.models import Appointment

router = APIRouter(prefix="/appointments", tags=["appointments"])

async def get_appointment_service(session: AsyncSession = Depends(get_session)) -> AppointmentService:
    return AppointmentService(session)

def serialize_appointment(appointment: Appointment) -> dict:
    """Convert Appointment model to dict with location conversion"""
    data = {
        "id": appointment.id,
        "full_name": appointment.full_name,
        "email": appointment.email,
        "phone": appointment.phone,
        "appointment_date": appointment.appointment_date,
        "appointment_time": appointment.appointment_time,
        "service_type": appointment.service_type,
        "notes": appointment.notes,
        "status": appointment.status,
        "location_address": appointment.location_address,
        "created_at": appointment.created_at,
        "updated_at": appointment.updated_at,
        "location": None
    }

    # Convert PostGIS geometry to LocationData
    if appointment.location:
        try:
            point = to_shape(appointment.location)
            data["location"] = LocationData(
                latitude=point.y,
                longitude=point.x
            )
        except Exception:
            data["location"] = None

    return data

@router.post("/create", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED)
async def create_appointment(
    data: AppointmentCreate,
    service: AppointmentService = Depends(get_appointment_service),
):
    """Create a new appointment"""
    appointment = await service.create_appointment(data)
    return serialize_appointment(appointment)

@router.get("/get/{appointment_id}", response_model=AppointmentResponse)
async def get_appointment(
    appointment_id: int,
    service: AppointmentService = Depends(get_appointment_service),
):
    """Get a single appointment by ID"""
    appointment = await service.get_appointment(appointment_id)
    return serialize_appointment(appointment)

@router.patch("/update/{appointment_id}", response_model=AppointmentResponse)
async def update_appointment(
    appointment_id: int,
    data: AppointmentUpdate,
    service: AppointmentService = Depends(get_appointment_service),
):
    """Update an appointment"""
    appointment = await service.update_appointment(appointment_id, data)
    return serialize_appointment(appointment)

@router.delete("/delete/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_appointment(
    appointment_id: int,
    service: AppointmentService = Depends(get_appointment_service)
):
    """Delete an appointment"""
    await service.delete_appointment(appointment_id)
    return None

@router.get("/all", response_model=AppointmentList)
async def get_all_appointments(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    service: AppointmentService = Depends(get_appointment_service)
):
    """Get all appointments with pagination"""
    appointments = await service.get_all_appointments(skip=skip, limit=limit)
    total = await service.repository.count()

    return AppointmentList(
        items=[serialize_appointment(apt) for apt in appointments],
        total=total,
        page=skip // limit + 1,
        size=limit
    )

@router.get("/by-date/{appointment_date}", response_model=List[AppointmentResponse])
async def get_appointments_by_date(
    appointment_date: date,
    service: AppointmentService = Depends(get_appointment_service)
):
    """Get all appointments for a specific date"""
    appointments = await service.get_appointments_by_date(appointment_date)
    return [serialize_appointment(apt) for apt in appointments]

@router.get("/by-status/{status}", response_model=List[AppointmentResponse])
async def get_appointments_by_status(
    status: str,
    service: AppointmentService = Depends(get_appointment_service)
):
    """Get all appointments by status"""
    appointments = await service.get_appointments_by_status(status)
    return [serialize_appointment(apt) for apt in appointments]

@router.get("/search", response_model=List[AppointmentResponse])
async def search_appointments(
    name: str = Query(..., min_length=2),
    service: AppointmentService = Depends(get_appointment_service)
):
    """Search appointments by name"""
    appointments = await service.search_appointments_by_name(name)
    return [serialize_appointment(apt) for apt in appointments]
