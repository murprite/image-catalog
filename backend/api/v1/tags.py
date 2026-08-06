from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from services.image_service import ImageService

from db.session import async_session
from db.session import get_db

router = APIRouter()

@router.get("/")
async def get_tags(
    db: AsyncSession = Depends(get_db),
):
    return await ImageService.get_tags(db)

@router.get("/by-tag/{tag_id}")
async def get_images_by_tag(
    tag_id: str,
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    return await ImageService.get_images_by_tag(
        db,
        tag_id,
        limit,
    )

@router.get("/{image_id}/tags")
async def get_image_tags(
    image_id: str,
    db: AsyncSession = Depends(get_db),
):
    return await ImageService.get_image_tags(
        db,
        image_id,
    )

@router.get("/by-tags")
async def get_images_by_tags(
    tag_ids: list[str] = Query(...),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    return await ImageService.get_images_by_tags(
        db,
        tag_ids,
        limit,
    )

@router.get("/by-all-tags")
async def get_images_by_all_tags(
    tag_ids: list[str] = Query(...),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    return await ImageService.get_images_with_all_tags(
        db,
        tag_ids,
        limit,
    )