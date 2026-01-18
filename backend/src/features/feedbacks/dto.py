from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class FeedbackBase(BaseModel):
    full_name: str
    email: str
    rating: int = Field(ge=1, le=5)
    message: str
    service_type: Optional[str] = None


class FeedbackCreate(FeedbackBase):
    pass


class FeedbackUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    rating: Optional[int] = Field(default=None, ge=1, le=5)
    message: Optional[str] = None
    service_type: Optional[str] = None
    is_published: Optional[bool] = None


class FeedbackResponse(FeedbackBase):
    id: int
    is_published: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class FeedbackList(BaseModel):
    items: list[FeedbackResponse]
    total: int
    page: int
    size: int
