from sqlmodel import Field,SQLModel
from datetime import datetime
from typing import Optional


class ClientContactInformation(SQLModel,table=True):
    __tablename__ = "client_contacts_information"

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    full_name: str = Field(max_length=255)
    phone: Optional[str] = Field(default=None, max_length=20)
    service_needed: Optional[str] = Field(default=None, max_length=100)
    message: Optional[str] = Field(default=None, max_length=1000)
    status: str = Field(default="pending", max_length=50)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)