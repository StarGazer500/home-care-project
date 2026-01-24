from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional, List
from datetime import date
from src.features.appointments.models import Appointment
from src.shared.repositories.base import BaseRepository

class AppointmentRepository(BaseRepository[Appointment]):
    def __init__(self, session: AsyncSession):
        super().__init__(Appointment, session)

    async def get_by_email(self, email: str) -> Optional[Appointment]:
        """Get appointment by email"""
        statement = select(Appointment).where(Appointment.email == email)
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()

    async def get_by_date(self, appointment_date: date) -> List[Appointment]:
        """Get all appointments for a specific date"""
        statement = select(Appointment).where(Appointment.appointment_date == appointment_date)
        result = await self.session.execute(statement)
        return result.scalars().all()

    async def get_by_status(self, status: str) -> List[Appointment]:
        """Get all appointments by status"""
        statement = select(Appointment).where(Appointment.status == status)
        result = await self.session.execute(statement)
        return result.scalars().all()

    async def search_by_name(self, name: str) -> List[Appointment]:
        """Search appointments by full name"""
        statement = select(Appointment).where(
            Appointment.full_name.ilike(f"%{name}%")
        )
        result = await self.session.execute(statement)
        return result.scalars().all()

    async def get_by_user(self, user_id: int, skip: int = 0, limit: int = 100) -> List[Appointment]:
        """Get appointments for a specific user"""
        statement = select(Appointment).where(
            Appointment.user_id == user_id
        ).offset(skip).limit(limit).order_by(Appointment.appointment_date.desc())
        result = await self.session.execute(statement)
        return result.scalars().all()

    async def count_by_user(self, user_id: int) -> int:
        """Count total appointments for a specific user"""
        statement = select(func.count()).select_from(Appointment).where(
            Appointment.user_id == user_id
        )
        result = await self.session.execute(statement)
        return result.scalar_one()
    
    async def get_all_appointments(self, skip: int = 0, limit: int = 100) -> List[Appointment]:
        """Get appointments for a specific user"""
        statement = select(Appointment).offset(skip).limit(limit).order_by(Appointment.appointment_date.desc())
        result = await self.session.execute(statement)
        return result.scalars().all()
