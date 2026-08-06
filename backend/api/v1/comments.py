from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from db.session import get_db
from schemas.comment import (
    CommentCreate,
    CommentResponse
)
from services.comment_service import CommentService

router = APIRouter()

@router.get("/")
async def get_comments(
    limit: int = 30,
    db: AsyncSession = Depends(get_db)
):
    return await CommentService.get_comments(
        db,
        limit
    )

@router.get("/user/{user_id}")
async def get_user_comments(
    user_id: str,
    db: AsyncSession = Depends(get_db)
):
    return await CommentService.get_user_comments(
        db,
        user_id
    )

@router.post("/")
async def create_comment(
    comment: CommentCreate,
    db: AsyncSession = Depends(get_db)
):
    return await CommentService.create_comment(
        db,
        comment.user_id,
        comment.image_id,
        comment.text
    )