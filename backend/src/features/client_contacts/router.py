from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from src.core.database import get_session

from src.features.client_contacts.service import ClientContactInformationService

from src.features.client_contacts.dto import (
    ClientContactInformationCreate,
    ClientContactInformationUpdate,
    ClientContactInformationList,
    ClientContactInformationResponse
)


router = APIRouter(prefix="/client_contacts", tags=["client_contacts"])


async def get_client_contact_information_service(session: AsyncSession = Depends(get_session))->ClientContactInformationService:
    return ClientContactInformationService(session)


@router.post("/create_client_contact_info/", response_model=ClientContactInformationResponse, status_code=status.HTTP_201_CREATED)
async def create_client_contact_information(
    data: ClientContactInformationCreate,
    service: ClientContactInformationService = Depends(get_client_contact_information_service),

):
    return await service.create_client_contact_information(data)


@router.get("/get_one_client_contact_info/{client_contact_id}", response_model=ClientContactInformationResponse)
async def get_one_client_contact_information(
    client_contact_id: int,
    service: ClientContactInformationService = Depends(get_client_contact_information_service),
):
    return await service.get_client_contact_information(client_contact_id)
    

@router.patch("/update_client_contact_info/{client_contact_id}", response_model=ClientContactInformationResponse)
async def update_client_contact_information(
    client_contact_id: int,
    data : ClientContactInformationUpdate,
    service: ClientContactInformationService = Depends(get_client_contact_information_service),
):
    return await service.update_client_contact_information(client_contact_id,data)


@router.delete("/delete_client_contact_info/{client_contact_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_client_contact_information(
    client_contact_id: int,
    service: ClientContactInformationService = Depends(get_client_contact_information_service)
):
    
    await service.delete_client_contact_information(client_contact_id)
    return None


@router.get("/search_client_contact_by_name/", response_model=List[ClientContactInformationResponse])
async def search_client_contact_information_by_name(
    name: str = Query(...,min_length=2),
    service: ClientContactInformationService = Depends(get_client_contact_information_service)
):
    return await service.search_client_contact_by_name(name)


@router.get("/get_all_client_contact_info", response_model=ClientContactInformationList)

async def get_all_client_contact_information(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    service: ClientContactInformationService = Depends(get_client_contact_information_service)
):
    client_contact_information = await service.get_all_client_contact_informations(skip=skip,limit=limit)
    total =await service.repository.count()

    return ClientContactInformationList(
        items = client_contact_information,
        total=total,
        page=skip // limit + 1,
        size=limit
    )