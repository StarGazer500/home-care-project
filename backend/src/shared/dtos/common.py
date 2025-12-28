from pydantic import BaseModel
from typing import Generic, TypeVar, List

T = TypeVar('T')

class PaginatedResponse(BaseModel, Generic[T]):
    """Generic paginated response"""
    items: List[T]
    total: int
    page: int
    size: int
    pages: int
    
    @classmethod
    def create(cls, items: List[T], total: int, skip: int, limit: int):
        """Helper to create paginated response"""
        pages = (total + limit - 1) // limit  # Ceiling division
        page = (skip // limit) + 1
        return cls(
            items=items,
            total=total,
            page=page,
            size=limit,
            pages=pages
        )

class SuccessResponse(BaseModel):
    """Generic success response"""
    message: str
    success: bool = True

class ErrorResponse(BaseModel):
    """Generic error response"""
    detail: str
    error_code: str = None

class HealthCheckResponse(BaseModel):
    """Health check response"""
    status: str
    database: str = "healthy"
    redis: str = "healthy"