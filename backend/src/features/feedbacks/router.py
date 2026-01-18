from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from src.core.database import get_session
from src.features.feedbacks.service import FeedbackService
from src.features.feedbacks.dto import (
    FeedbackCreate,
    FeedbackUpdate,
    FeedbackList,
    FeedbackResponse
)


router = APIRouter(prefix="/feedbacks", tags=["feedbacks"])


async def get_feedback_service(session: AsyncSession = Depends(get_session)) -> FeedbackService:
    return FeedbackService(session)


@router.post("/create", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
async def create_feedback(
    data: FeedbackCreate,
    service: FeedbackService = Depends(get_feedback_service),
):
    """Create a new feedback (public endpoint)"""
    return await service.create_feedback(data)


@router.get("/published", response_model=FeedbackList)
async def get_published_feedbacks(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    service: FeedbackService = Depends(get_feedback_service)
):
    """Get all published feedbacks (public endpoint for homepage)"""
    feedbacks = await service.get_published_feedbacks(skip=skip, limit=limit)
    total = await service.repository.count_published()

    return FeedbackList(
        items=feedbacks,
        total=total,
        page=skip // limit + 1,
        size=limit
    )


@router.get("/all", response_model=FeedbackList)
async def get_all_feedbacks(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    service: FeedbackService = Depends(get_feedback_service)
):
    """Get all feedbacks (admin endpoint)"""
    feedbacks = await service.get_all_feedbacks(skip=skip, limit=limit)
    total = await service.repository.count()

    return FeedbackList(
        items=feedbacks,
        total=total,
        page=skip // limit + 1,
        size=limit
    )


@router.get("/get/{feedback_id}", response_model=FeedbackResponse)
async def get_feedback(
    feedback_id: int,
    service: FeedbackService = Depends(get_feedback_service),
):
    """Get a single feedback by ID"""
    return await service.get_feedback(feedback_id)


@router.patch("/update/{feedback_id}", response_model=FeedbackResponse)
async def update_feedback(
    feedback_id: int,
    data: FeedbackUpdate,
    service: FeedbackService = Depends(get_feedback_service),
):
    """Update a feedback"""
    return await service.update_feedback(feedback_id, data)


@router.patch("/toggle-publish/{feedback_id}", response_model=FeedbackResponse)
async def toggle_feedback_publish(
    feedback_id: int,
    service: FeedbackService = Depends(get_feedback_service),
):
    """Toggle the publish status of a feedback"""
    return await service.toggle_publish(feedback_id)


@router.delete("/delete/{feedback_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_feedback(
    feedback_id: int,
    service: FeedbackService = Depends(get_feedback_service)
):
    """Delete a feedback"""
    await service.delete_feedback(feedback_id)
    return None


@router.get("/search", response_model=List[FeedbackResponse])
async def search_feedbacks_by_name(
    name: str = Query(..., min_length=2),
    service: FeedbackService = Depends(get_feedback_service)
):
    """Search feedbacks by name"""
    return await service.search_by_name(name)
