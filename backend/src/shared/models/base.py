from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class TimestampMixin(SQLModel):
    """Mixin to add timestamp fields"""
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})

class SoftDeleteMixin(SQLModel):
    """Mixin to add soft delete functionality"""
    is_deleted: bool = Field(default=False)
    deleted_at: Optional[datetime] = Field(default=None)