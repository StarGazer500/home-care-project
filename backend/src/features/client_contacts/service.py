from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from datetime import datetime
from src.features.client_contacts.models import ClientContactInformation
from src.features.client_contacts.repository import ClientContactInformationRepository
from src.features.client_contacts.dto import ClientContactInformationCreate,ClientContactInformationUpdate
from src.core.exceptions import NotFoundException, ConflictException

class ClientContactInformationService:
    def __init__(self, session: AsyncSession):
        self.repository = ClientContactInformationRepository(session)

    async def create_client_contact_information(self,data: ClientContactInformationCreate)->ClientContactInformation:
        existing = await self.repository.get_by_email(data.email)
        if existing:
            raise ConflictException(f"Contact Information Already Exists with{data.email}")
        
        client_contact_information = ClientContactInformation(**data.model_dump())
        return await self.repository.create(client_contact_information)
    
    async def get_client_contact_information(self,client_contact_id:int)->ClientContactInformation:
        client_contact_information = await self.repository.get(client_contact_id)
        if not client_contact_information:
            raise NotFoundException(f"Client {client_contact_id} not found")
        return client_contact_information
    
    async def update_client_contact_information(self,client_contact_id:int,data: ClientContactInformationUpdate)->ClientContactInformation:
        updated_data = data.model_dump(exclude_unset=True)
        updated_data['updated_at'] = datetime.now()
        updated = await self.repository.update(client_contact_id,updated_data)
        if not updated:
            raise NotFoundException(f"Client {client_contact_id} not found")
        return updated
    
    async def search_client_contact_by_name(self, name: str)->List[ClientContactInformation]:
        return await self.repository.search_by_name(name)
    
    async def get_all_client_contact_informations(self,skip: int = 0, limit: int=100)-> List[ClientContactInformation]:
        return await self.repository.get_all_client_contacts(skip=skip,limit=limit)
    
    async def delete_client_contact_information(self,client_contact_id)->bool:
        return await self.repository.delete(client_contact_id)