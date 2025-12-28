from typing import Generic, TypeVar, Type, Optional, List
from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete, update

ModelType = TypeVar("ModelType", bound=SQLModel)

class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType], session: AsyncSession):
        self.model = model
        self.session = session
    
    async def get(self, id: int) -> Optional[ModelType]:
        """Get single record by ID"""
        result = await self.session.get(self.model, id)
        return result
    
    async def get_multi(
        self, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[ModelType]:
        """Get multiple records with pagination"""
        statement = select(self.model).offset(skip).limit(limit)
        result = await self.session.execute(statement)
        return result.scalars().all()
    
    async def create(self, obj: ModelType) -> ModelType:
        """Create new record"""
        self.session.add(obj)
        await self.session.flush()
        await self.session.refresh(obj)
        return obj
    
    async def update(self, id: int, obj_data: dict) -> Optional[ModelType]:
        """Update record by ID"""
        db_obj = await self.get(id)
        if not db_obj:
            return None
        
        for key, value in obj_data.items():
            setattr(db_obj, key, value)
        
        await self.session.flush()
        await self.session.refresh(db_obj)
        return db_obj
    
    async def delete(self, id: int) -> bool:
        """Delete record by ID"""
        obj = await self.get(id)
        if not obj:
            return False
        
        await self.session.delete(obj)
        await self.session.flush()
        return True
    
    async def count(self) -> int:
        """Count total records"""
        statement = select(func.count()).select_from(self.model)
        result = await self.session.execute(statement)
        return result.scalar_one()
    
    async def exists(self, id: int) -> bool:
        """Check if record exists"""
        obj = await self.get(id)
        return obj is not None