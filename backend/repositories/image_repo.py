from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from db.models.image import Image

from db.models.tag import Tag
from db.models.image import Image
from db.models.comment import Comment
from db.models.image_tags import ImageTag
from db.models.image_stat import ImageStat
from db.models.image_metadata import ImageMetadata


class ImageRepository:
    @staticmethod
    async def get_by_user_id(
        db: AsyncSession,
        user_id: str,
        limit: int,
    ) -> list[Image]:
        stmt = (
            select(Image)
            .where(Image.author == user_id)
            .limit(limit)
        )

        result = await db.execute(stmt)
        return result.scalars().all()

    @staticmethod
    async def get_random_images(
        db: AsyncSession,
        limit: int = 20,
    ) -> list[Image]:
        stmt = (
            select(Image)
            .order_by(func.random())
            .limit(limit)
        )

        result = await db.execute(stmt)
        return result.scalars().all()

    @staticmethod
    async def get_all_tags(
            db: AsyncSession,
    ) -> list[Tag]:
        result = await db.execute(
            select(Tag).order_by(Tag.name)
        )

        return result.scalars().all()

    @staticmethod
    async def get_image_tags(
        db: AsyncSession,
        image_id: str,
    ) -> list[Tag]:

        stmt = (
            select(Tag)
            .join(
                ImageTag,
                Tag.id == ImageTag.tag_id
            )
            .where(
                ImageTag.image_id == image_id
            )
        )

        result = await db.execute(stmt)

        return result.scalars().all()

    @staticmethod
    async def get_images_by_tag(
        db: AsyncSession,
        tag_id: str,
        limit: int = 20,
    ) -> list[Image]:

        stmt = (
            select(Image)
            .join(
                ImageTag,
                Image.id == ImageTag.image_id
            )
            .where(
                ImageTag.tag_id == tag_id
            )
            .limit(limit)
        )

        result = await db.execute(stmt)

        return result.scalars().all()

    @staticmethod
    async def get_by_tags(
            db: AsyncSession,
            tags: list[str],
            limit: int,
            page: int,
    ):
        offset = (page - 1) * limit

        total_stmt = (

            select(
                func.count(
                    func.distinct(
                        Image.id
                    )
                )
            )

            .join(
                ImageTag,
                Image.id == ImageTag.image_id,
            )

            .where(
                ImageTag.tag_id.in_(tags)
            )

        )

        total = (
            await db.execute(
                total_stmt
            )
        ).scalar()

        stmt = (

            select(Image)

            .join(
                ImageTag,
                Image.id == ImageTag.image_id,
            )

            .where(
                ImageTag.tag_id.in_(tags)
            )

            .distinct()

            .offset(offset)

            .limit(limit)

        )

        result = await db.execute(stmt)

        images = result.scalars().all()

        return {
            "items": images,
            "page": page,
            "limit": limit,
            "pages": (total + limit - 1) // limit,
            "total": total,
        }

    from sqlalchemy import func

    @staticmethod
    async def search_images(
            db: AsyncSession,
            query: str,
            limit: int,
            page: int,
    ):
        offset = (page - 1) * limit

        stmt = (
            select(Image)
            .where(
                Image.title.ilike(f"%{query}%")
            )
            .offset(offset)
            .limit(limit)
        )

        result = await db.execute(stmt)

        return {
            "items": result.scalars().all()
        }

    @staticmethod
    async def get_images_with_all_tags(
            db: AsyncSession,
            tag_ids: list[str],
            limit: int = 20,
    ):
        stmt = (
            select(Image)
            .join(ImageTag)
            .where(
                ImageTag.tag_id.in_(tag_ids)
            )
            .group_by(Image.id)
            .having(
                func.count(
                    ImageTag.tag_id
                ) == len(tag_ids)
            )
            .limit(limit)
        )

        result = await db.execute(stmt)

        return result.scalars().all()

    @staticmethod
    async def get_by_id(
            db: AsyncSession,
            image_id: str,
    ) -> Image | None:
        stmt = (
            select(Image)
            .where(Image.id == image_id)
        )

        result = await db.execute(stmt)

        return result.scalar_one_or_none()

    @staticmethod
    async def get_image_stats(
            db: AsyncSession,
            image_id: str,
    ):
        result = await db.execute(
            select(ImageStat)
            .where(
                ImageStat.image_id == image_id
            )
        )

        return result.scalar_one_or_none()

    @staticmethod
    async def get_image_metadata(
            db: AsyncSession,
            image_id: str,
    ):
        result = await db.execute(
            select(ImageMetadata)
            .where(
                ImageMetadata.id == image_id
            )
        )

        return result.scalar_one_or_none()

    @staticmethod
    async def get_comments(
            db: AsyncSession,
            image_id: str,
    ):
        result = await db.execute(
            select(Comment)
            .where(Comment.image_id == image_id)
            .order_by(Comment.created_at.desc())
        )

        return result.scalars().all()

    @staticmethod
    async def add(
            db: AsyncSession,
            obj,
    ):
        db.add(obj)

    @staticmethod
    async def flush(
            db: AsyncSession,
    ):
        await db.flush()

    @staticmethod
    async def commit(
            db: AsyncSession,
    ):
        await db.commit()

    @staticmethod
    async def rollback(
            db: AsyncSession,
    ):
        await db.rollback()

    @staticmethod
    async def get_images(
            db: AsyncSession,
            limit: int,
            page: int,
    ):
        offset = (page - 1) * limit

        stmt = (
            select(Image)
            .offset(offset)
            .limit(limit)
        )

        result = await db.execute(stmt)

        return result.scalars().all()