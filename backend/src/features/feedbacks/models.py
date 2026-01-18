from sqlmodel import Field, SQLModel
from datetime import datetime
from typing import Optional


class Feedback(SQLModel, table=True):
    __tablename__ = "feedbacks"

    id: Optional[int] = Field(default=None, primary_key=True)
    full_name: str = Field(max_length=255)
    email: str = Field(max_length=255)
    rating: int = Field(ge=1, le=5)
    message: str = Field(max_length=2000)
    service_type: Optional[str] = Field(default=None, max_length=100)
    is_published: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
