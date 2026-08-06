from fastapi import APIRouter, Depends, Query, HTTPException, File, Form, UploadFile
from faker import Faker
from sqlalchemy.ext.asyncio import AsyncSession
from services.image_service import ImageService
from services.comment_service import CommentService

from sqlalchemy import text, func, extract, select
from db.session import get_db

from db.models import Image, ImageMetadata, ImageStat, Tag, ImageTag

router = APIRouter()

from fastapi import APIRouter, Depends

router = APIRouter()

from sqlalchemy import select, func, cast, Date
from sqlalchemy.ext.asyncio import AsyncSession

from db.models import ImageStat


@router.get("/stats/views-by-day")
async def get_views_by_day(db: AsyncSession = Depends(get_db)):
    stmt = (
        select(
            cast(ImageStat.createdAt, Date).label("date"),
            func.sum(ImageStat.views).label("views")
        )
        .group_by(cast(ImageStat.createdAt, Date))
        .order_by(cast(ImageStat.createdAt, Date))
    )

    result = await db.execute(stmt)
    rows = result.all()

    return [
        {
            "date": str(row.date),
            "count": row.views
        }
        for row in rows
    ]


@router.get("/search")
async def search_images(
        q: str,
        limit: int = Query(20),
        page: int = Query(1),
        db: AsyncSession = Depends(get_db),
):
    return await ImageService.search_images(
        db=db,
        query=q,
        limit=limit,
        page=page,
    )


@router.get("/")
async def get_images(
        limit: int = Query(
            20,
            ge=1,
            le=100,
        ),
        page: int = Query(
            1,
            ge=1,
        ),
        db: AsyncSession = Depends(get_db),
):
    return await ImageService.get_images(
        db=db,
        limit=limit,
        page=page,
    )


@router.get("/by-tags")
async def get_images_by_tags(
        tags: list[str] = Query(...),
        limit: int = Query(10, ge=1, le=100),
        page: int = Query(1, ge=1),
        db: AsyncSession = Depends(get_db),
):
    return await ImageService.get_images_by_tags(
        db=db,
        tags=tags,
        limit=limit,
        page=page,
    )


@router.get("/{image_id}")
async def get_image(
        image_id: str,
        db: AsyncSession = Depends(get_db),
):
    image = await ImageService.get_image(
        db,
        image_id,
    )

    if image is None:
        raise HTTPException(
            status_code=404,
            detail="Image not found",
        )

    return image


@router.get("/{image_id}/tags")
async def get_image_tags(
        image_id: str,
        db: AsyncSession = Depends(get_db),
):
    return await ImageService.get_image_tags(
        db,
        image_id,
    )


@router.get("/{image_id}/stats")
async def get_stats(
        image_id: str,
        db: AsyncSession = Depends(get_db),
):
    return await ImageService.get_image_stats(
        db,
        image_id,
    )


@router.get("/{image_id}/metadata")
async def get_metadata(
        image_id: str,
        db: AsyncSession = Depends(get_db),
):
    return await ImageService.get_image_metadata(
        db,
        image_id,
    )


@router.get("/{image_id}/comments")
async def get_comments(
        image_id: str,
        db: AsyncSession = Depends(get_db),
):
    return await CommentService.get_comments(
        db,
        image_id,
    )


@router.post("/upload")
async def upload_image(

        file: UploadFile = File(...),

        title: str = Form(...),
        author: str = Form(...),

        geo: str = Form(""),

        tags: list[str] = Form([]),

        db: AsyncSession = Depends(get_db),

):
    return await ImageService.upload_image(

        db=db,

        file=file,

        title=title,

        author=author,

        geo=geo,

        tags=tags,

    )




@router.get("/stats/image_tags")
async def get_tags_stats(db: AsyncSession = Depends(get_db)):

    stmt = (
        select(
            Tag.id,
            Tag.name,
            Tag.color,
            func.count(ImageTag.image_id).label("count")
        )
        .select_from(Tag)
        .outerjoin(ImageTag, ImageTag.tag_id == Tag.id)
        .group_by(Tag.id, Tag.name, Tag.color)
        .order_by(func.count(ImageTag.image_id).desc())
    )

    result = await db.execute(stmt)

    rows = result.all()
    return [
        {
            "id": str(r.id),
            "name": r.name,
            "color": r.color,
            "count": int(r.count or 0)
        }
        for r in rows
    ]
