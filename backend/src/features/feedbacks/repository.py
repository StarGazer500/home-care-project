from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, List
from src.features.feedbacks.models import Feedback
from src.shared.repositories.base import BaseRepository


class FeedbackRepository(BaseRepository[Feedback]):
    def __init__(self, session: AsyncSession):
        super().__init__(Feedback, session)

    async def get_by_email(self, email: str) -> List[Feedback]:
        """Get feedbacks by email"""
        statement = select(Feedback).where(Feedback.email == email)
        result = await self.session.execute(statement)
        return result.scalars().all()

    async def search_by_name(self, name: str) -> List[Feedback]:
        """Search feedbacks by name"""
        statement = select(Feedback).where(
            Feedback.full_name.ilike(f"%{name}%")
        )
        result = await self.session.execute(statement)
        return result.scalars().all()

    async def get_published(self, skip: int = 0, limit: int = 100) -> List[Feedback]:
        """Get only published feedbacks"""
        statement = (
            select(Feedback)
            .where(Feedback.is_published == True)
            .offset(skip)
            .limit(limit)
            .order_by(Feedback.created_at.desc())
        )
        result = await self.session.execute(statement)
        return result.scalars().all()

    async def count_published(self) -> int:
        """Count published feedbacks"""
        from sqlalchemy import func
        statement = select(func.count()).select_from(Feedback).where(Feedback.is_published == True)
        result = await self.session.execute(statement)
        return result.scalar_one()
