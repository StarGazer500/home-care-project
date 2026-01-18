from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from datetime import datetime
from src.features.feedbacks.models import Feedback
from src.features.feedbacks.repository import FeedbackRepository
from src.features.feedbacks.dto import FeedbackCreate, FeedbackUpdate
from src.core.exceptions import NotFoundException


class FeedbackService:
    def __init__(self, session: AsyncSession):
        self.repository = FeedbackRepository(session)

    async def create_feedback(self, data: FeedbackCreate) -> Feedback:
        feedback = Feedback(**data.model_dump())
        return await self.repository.create(feedback)

    async def get_feedback(self, feedback_id: int) -> Feedback:
        feedback = await self.repository.get(feedback_id)
        if not feedback:
            raise NotFoundException(f"Feedback {feedback_id} not found")
        return feedback

    async def update_feedback(self, feedback_id: int, data: FeedbackUpdate) -> Feedback:
        updated_data = data.model_dump(exclude_unset=True)
        updated_data['updated_at'] = datetime.now()
        updated = await self.repository.update(feedback_id, updated_data)
        if not updated:
            raise NotFoundException(f"Feedback {feedback_id} not found")
        return updated

    async def delete_feedback(self, feedback_id: int) -> bool:
        return await self.repository.delete(feedback_id)

    async def get_all_feedbacks(self, skip: int = 0, limit: int = 100) -> List[Feedback]:
        return await self.repository.get_multi(skip=skip, limit=limit)

    async def get_published_feedbacks(self, skip: int = 0, limit: int = 100) -> List[Feedback]:
        return await self.repository.get_published(skip=skip, limit=limit)

    async def search_by_name(self, name: str) -> List[Feedback]:
        return await self.repository.search_by_name(name)

    async def toggle_publish(self, feedback_id: int) -> Feedback:
        feedback = await self.get_feedback(feedback_id)
        return await self.update_feedback(
            feedback_id,
            FeedbackUpdate(is_published=not feedback.is_published)
        )
