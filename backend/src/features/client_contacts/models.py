from sqlmodel import Field,SQLModel
from datetime import datetime,timezone
from typing import Optional


class ClientContactInformation(SQLModel,table=True):
    __tablename__ = "client_contacts_information"

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    full_name: str = Field(max_length=255)
    phone: Optional[str] = Field(default=None, max_length=20)
    service_needed: Optional[str] = Field(default=None, max_length=20)
    message: Optional[str] = Field(default=None, max_length=20)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))