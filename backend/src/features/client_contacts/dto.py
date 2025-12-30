from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class ClientContactInformationBase(BaseModel):
    email: str
    full_name: str
    phone: Optional[str] = None
    service_needed: Optional[str] = None
    message: Optional[str] = None
    status: Optional[str] = "pending"

class ClientContactInformationCreate(ClientContactInformationBase):
    pass
    

class ClientContactInformationUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    service_needed: Optional[str] = None
    message: Optional[str] = None
    status: Optional[str] = None


class ClientContactInformationResponse(ClientContactInformationBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ClientContactInformationList(BaseModel):
    items: list[ClientContactInformationResponse]
    total: int
    page: int
    size: int


    


