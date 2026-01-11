from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from datetime import datetime, date
from src.features.appointments.models import Appointment
from src.features.appointments.repository import AppointmentRepository
from src.features.appointments.dto import AppointmentCreate, AppointmentUpdate, LocationData
from src.core.exceptions import NotFoundException

class AppointmentService:
    def __init__(self, session: AsyncSession):
        self.repository = AppointmentRepository(session)

    @staticmethod
    def location_to_wkt(location: Optional[LocationData]) -> Optional[str]:
        """Convert LocationData to WKT (Well-Known Text) format for PostGIS"""
        if not location:
            return None
        return f'SRID=4326;POINT({location.longitude} {location.latitude})'

    @staticmethod
    def wkt_to_location(wkt: Optional[str]) -> Optional[LocationData]:
        """Convert WKT from PostGIS to LocationData"""
        if not wkt:
            return None
        try:
            # Parse WKT format: "POINT(longitude latitude)" or "SRID=4326;POINT(longitude latitude)"
            if isinstance(wkt, str):
                point_str = wkt.split('POINT(')[1].rstrip(')')
                lon, lat = point_str.split()
                return LocationData(latitude=float(lat), longitude=float(lon))
        except (IndexError, ValueError):
            return None
        return None

    async def create_appointment(self, data: AppointmentCreate, user_id: Optional[int] = None) -> Appointment:
        appointment_data = data.model_dump(exclude={'location'})
        # Convert location coordinates to PostGIS format
        if data.location:
            appointment_data['location'] = self.location_to_wkt(data.location)
        # Add user_id if provided
        if user_id:
            appointment_data['user_id'] = user_id
        appointment = Appointment(**appointment_data)
        return await self.repository.create(appointment)

    async def get_appointment(self, appointment_id: int) -> Appointment:
        appointment = await self.repository.get(appointment_id)
        if not appointment:
            raise NotFoundException(f"Appointment {appointment_id} not found")
        return appointment

    async def update_appointment(self, appointment_id: int, data: AppointmentUpdate) -> Appointment:
        updated_data = data.model_dump(exclude_unset=True, exclude={'location'})
        updated_data['updated_at'] = datetime.now()
        # Convert location coordinates to PostGIS format if provided
        if 'location' in data.model_dump(exclude_unset=True) and data.location:
            updated_data['location'] = self.location_to_wkt(data.location)
        elif 'location' in data.model_dump(exclude_unset=True) and data.location is None:
            updated_data['location'] = None
        updated = await self.repository.update(appointment_id, updated_data)
        if not updated:
            raise NotFoundException(f"Appointment {appointment_id} not found")
        return updated

    async def delete_appointment(self, appointment_id: int) -> bool:
        return await self.repository.delete(appointment_id)

    async def get_all_appointments(self, skip: int = 0, limit: int = 100) -> List[Appointment]:
        return await self.repository.get_multi(skip=skip, limit=limit)

    async def get_appointments_by_date(self, appointment_date: date) -> List[Appointment]:
        return await self.repository.get_by_date(appointment_date)

    async def get_appointments_by_status(self, status: str) -> List[Appointment]:
        return await self.repository.get_by_status(status)

    async def search_appointments_by_name(self, name: str) -> List[Appointment]:
        return await self.repository.search_by_name(name)

    async def get_user_appointments(self, user_id: int, skip: int = 0, limit: int = 100) -> List[Appointment]:
        """Get all appointments for a specific user"""
        return await self.repository.get_by_user(user_id, skip, limit)
