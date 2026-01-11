from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from src.features.accounts.models import User
from src.features.accounts.dto import UserCreate, UserUpdate, UserLogin
from src.features.accounts.repository import UserRepository
from src.core.security import get_password_hash, verify_password, create_access_token
from src.core.exceptions import (
    ConflictException, 
    UnauthorizedException, 
    NotFoundException
)

class AccountService:
    def __init__(self, session: AsyncSession):
        self.repository = UserRepository(session)
    
    async def create_user(self, data: UserCreate) -> User:
        """Register new user"""
        # Check if email exists
        if await self.repository.get_by_email(data.email):
            raise ConflictException("Email already registered")
        
        # Check if username exists
        if await self.repository.get_by_username(data.username):
            raise ConflictException("Username already taken")
        
        # Create user
        user_data = data.model_dump(exclude={"password"})
        user = User(
            **user_data,
            hashed_password=get_password_hash(data.password)
        )
        
        return await self.repository.create(user)
    
    async def authenticate(self, credentials: UserLogin) -> str:
        """Authenticate user and return JWT token"""
        # Get user by username or email
        user = await self.repository.get_by_username(credentials.username)

        # If not found by username, try email
        if not user:
            user = await self.repository.get_by_email(credentials.username)

        if not user:
            raise UnauthorizedException("Invalid username or password")

        # Verify password
        if not verify_password(credentials.password, user.hashed_password):
            raise UnauthorizedException("Invalid username or password")

        # Check if active


        # Create access token
        access_token = create_access_token(data={"sub": user.id})
        return access_token
    
    async def get_user_by_id(self, user_id: int) -> User:
        """Get user by ID"""
        user = await self.repository.get(user_id)
        if not user:
            raise NotFoundException(f"User {user_id} not found")
        return user
    
    async def update_user(self, user_id: int, data: UserUpdate) -> User:
        """Update user profile"""
        user = await self.get_user_by_id(user_id)
        
        update_data = data.model_dump(exclude_unset=True)
        updated = await self.repository.update(user_id, update_data)
        
        if not updated:
            raise NotFoundException(f"User {user_id} not found")
        
        return updated
    
    async def change_password(
        self, 
        user_id: int, 
        old_password: str, 
        new_password: str
    ) -> bool:
        """Change user password"""
        user = await self.get_user_by_id(user_id)
        
        # Verify old password
        if not verify_password(old_password, user.hashed_password):
            raise UnauthorizedException("Invalid current password")
        
        # Update password
        await self.repository.update(
            user_id, 
            {"hashed_password": get_password_hash(new_password)}
        )
        
        return True