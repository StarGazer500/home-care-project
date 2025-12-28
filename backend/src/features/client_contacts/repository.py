from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, List
from typing import Optional
from src.features.client_contacts.models import ClientContactInformation
from src.shared.repositories.base import BaseRepository

class ClientContactInformationRepository(BaseRepository[ClientContactInformation]):
    def __init__(self, session: AsyncSession):
        super().__init__(ClientContactInformation, session)

    async def get_by_email(self, email: str) -> Optional[ClientContactInformation]:
        """Get user by email"""
        statement = select().where(ClientContactInformation.email == email)
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()
    
    async def search_by_name(self, name: str) -> List[ClientContactInformation]:
        statement = select(ClientContactInformation).where(
            ClientContactInformation.full_name.ilike(f"%{name}%")
        )
        result = await self.session.execute(statement)
        return result.scalars().all()

    async def get_by_contact_id(self, contact_id: int) -> Optional[ClientContactInformation]:
        statement = select(ClientContactInformation).where(ClientContactInformation.id == contact_id)
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()
    
    async def get_by_phone(self, phone: str) -> Optional[ClientContactInformation]:
        statement = select(ClientContactInformation).where(ClientContactInformation.phone == phone)
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()
