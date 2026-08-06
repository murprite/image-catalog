from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession



from services.user_service import UserService
from services.image_service import ImageService
from db.session import get_db

router = APIRouter()

@router.get("/{user_id}")
async def get_user(user_id: str):
    return await UserService.get_user(user_id)

@router.get("/{user_id}/images")
async def get_user_images(
    user_id: str,
    limit: int = 30,
    db: AsyncSession = Depends(get_db)
):
    return await ImageService.get_user_images(db, user_id, limit)