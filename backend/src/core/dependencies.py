from typing import Optional
from fastapi import Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_session
from src.core.security import get_current_user

# Pagination dependency
class PaginationParams:
    def __init__(
        self,
        skip: int = Query(0, ge=0, description="Number of records to skip"),
        limit: int = Query(100, ge=1, le=100, description="Number of records to return")
    ):
        self.skip = skip
        self.limit = limit

# Common dependencies
async def get_current_user_dependency(
    current_user = Depends(get_current_user)
):
    """Common dependency for getting current user"""
    return current_user

async def get_db_session(
    session: AsyncSession = Depends(get_session)
):
    """Common dependency for getting database session"""
    return session