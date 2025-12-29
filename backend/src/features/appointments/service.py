from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from datetime import datetime, date
from src.features.appointments.models import Appointment
from src.features.appointments.repository import AppointmentRepository
from src.features.appointments.dto import AppointmentCreate, AppointmentUpdate
from src.core.exceptions import NotFoundException

class AppointmentService:
    def __init__(self, session: AsyncSession):
        self.repository = AppointmentRepository(session)

    async def create_appointment(self, data: AppointmentCreate) -> Appointment:
        appointment = Appointment(**data.model_dump())
        return await self.repository.create(appointment)

    async def get_appointment(self, appointment_id: int) -> Appointment:
        appointment = await self.repository.get(appointment_id)
        if not appointment:
            raise NotFoundException(f"Appointment {appointment_id} not found")
        return appointment

    async def update_appointment(self, appointment_id: int, data: AppointmentUpdate) -> Appointment:
        updated_data = data.model_dump(exclude_unset=True)
        updated_data['updated_at'] = datetime.now()
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
