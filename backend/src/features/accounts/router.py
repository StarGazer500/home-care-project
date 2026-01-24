from fastapi import APIRouter, Depends, status, Response, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from src.core.database import get_session
from src.core.security import get_current_user
from src.features.accounts.service import AccountService
from src.features.accounts.dto import (
    UserCreate,
    UserUpdate,
    UserResponse,
    UserLogin
)
from src.features.accounts.models import User

router = APIRouter(prefix="/auth", tags=["authentication"])

async def get_account_service(
    session: AsyncSession = Depends(get_session)
) -> AccountService:
    return AccountService(session)

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    data: UserCreate,
    service: AccountService = Depends(get_account_service)
):
    """Register new user account"""
    return await service.create_user(data)

@router.post("/login", response_model=UserResponse)
async def login(
    response: Response,
    credentials: UserLogin,
    service: AccountService = Depends(get_account_service)
):
    """Login and get access token"""
    access_token = await service.authenticate(credentials)

    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,  # Prevents JavaScript access (XSS protection)
        secure=False,    # Only send over HTTPS (set to False in development)
        samesite="lax", # CSRF protection ("lax" or "strict")
        max_age=1800,   # 30 minutes (match your JWT expiration)
    )

    # Get user by username or email (same logic as authenticate)
    user = await service.repository.get_by_username(credentials.username)
    if not user:
        user = await service.repository.get_by_email(credentials.username)

    return user

@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(response: Response):
    """Logout user by clearing authentication cookie"""
    response.delete_cookie(key="access_token")
    return None

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """Get current user information"""
    return current_user

@router.patch("/me", response_model=UserResponse)
async def update_current_user(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    service: AccountService = Depends(get_account_service)
):
    """Update current user profile"""
    return await service.update_user(current_user.id, data)

@router.post("/change-password", status_code=status.HTTP_204_NO_CONTENT)
async def change_password(
    old_password: str,
    new_password: str,
    current_user: User = Depends(get_current_user),
    service: AccountService = Depends(get_account_service)
):
    """Change user password"""
    await service.change_password(current_user.id, old_password, new_password)
    return None


@router.get("/users", response_model=dict)
async def get_all_users(
    skip: int = 0,
    limit: int = 15,
    current_user: User = Depends(get_current_user),
    service: AccountService = Depends(get_account_service)
):
    """Get all users (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    users = await service.repository.get_all_users(skip=skip, limit=limit)
    total = await service.repository.count()

    return {
        "items": users,
        "total": total,
        "page": (skip // limit) + 1,
        "size": limit
    }


@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    current_user: User = Depends(get_current_user),
    service: AccountService = Depends(get_account_service)
):
    """Get user by ID (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    user = await service.repository.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int,
    current_user: User = Depends(get_current_user),
    service: AccountService = Depends(get_account_service)
):
    """Delete user by ID (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")

    deleted = await service.repository.delete(user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")

    return None