from sqlalchemy.ext.asyncio import AsyncSession


from datetime import datetime
from pathlib import Path
from uuid import uuid4

from PIL import Image as PILImage

from db.models.image import Image
from db.models.image_metadata import ImageMetadata
from db.models.image_stat import ImageStat
from db.models.image_tags import ImageTag
from db.models.user import User

UPLOAD_DIR = Path("../public")
UPLOAD_DIR.mkdir(exist_ok=True)

from repositories.image_repo import ImageRepository
from repositories.user_repo import UserRepository



class ImageService:
    @staticmethod
    async def get_user_images(
        db: AsyncSession,
        user_id: str,
        limit: int,
    ):
        return await ImageRepository.get_by_user_id(
            db, user_id, limit
        )

    @staticmethod
    async def get_images(
            db: AsyncSession,
            limit: int,
            page: int,
    ):
        return await ImageRepository.get_images(
            db,
            limit,
            page,
        )

    @staticmethod
    async def get_tags(db):
        return await ImageRepository.get_all_tags(db)

    @staticmethod
    async def get_image_tags(
            db,
            image_id: str,
    ):
        return await ImageRepository.get_image_tags(
            db,
            image_id,
        )

    @staticmethod
    async def get_images_by_tag(
            db,
            tag_id: str,
            limit: int = 20,
    ):
        return await ImageRepository.get_images_by_tag(
            db,
            tag_id,
            limit,
        )

    @staticmethod
    async def get_images_by_tags(
            db: AsyncSession,
            tags: list[str],
            limit: int,
            page: int,
    ):
        return await ImageRepository.get_by_tags(
            db,
            tags,
            limit,
            page,
        )

    @staticmethod
    async def search_images(
            db: AsyncSession,
            query: str,
            limit: int,
            page: int,
    ):
        return await ImageRepository.search_images(
            db,
            query,
            limit,
            page,
        )

    @staticmethod
    async def get_image(
            db: AsyncSession,
            image_id: str,
    ):
        return await ImageRepository.get_by_id(
            db,
            image_id,
        )

    @staticmethod
    async def get_image_stats(
            db,
            image_id,
    ):
        return await ImageRepository.get_image_stats(
            db,
            image_id,
        )

    @staticmethod
    async def get_image_metadata(
            db,
            image_id,
    ):
        return await ImageRepository.get_image_metadata(
            db,
            image_id,
        )

    @staticmethod
    async def upload_image(
            db,
            file,
            title: str,
            author: str,
            geo: str,
            tags: list[str],
    ):
        image_id = str(uuid4())

        try:

            # -------- автор --------

            author_user = await UserRepository.get_by_name(
                db,
                author,
            )

            if author_user is None:
                author_user = User(
                    id=str(uuid4()),

                    name=author,

                    email=f"test@test.test",
                    password="TEST",
                    login=str(uuid4()),
                    iconUrl="TEST",
                )

                db.add(author_user)
                await db.flush()

            # -------- файл --------

            ext = file.filename.split(".")[-1]

            filename = f"{image_id}.{ext}"

            filepath = UPLOAD_DIR / filename

            contents = await file.read()

            with open(filepath, "wb") as f:
                f.write(contents)

            img = PILImage.open(filepath)

            width = img.width
            height = img.height

            url = f"/public/{filename}"

            # -------- images --------

            image = Image(
                id=image_id,

                author=author_user.name,

                title=title,

                url=url,
            )

            db.add(image)

            # -------- metadata --------

            metadata = ImageMetadata(
                id=image_id,

                width=width,
                height=height,

                geo=geo,

                authorId=author_user.id,
            )

            db.add(metadata)

            # -------- stats --------

            stats = ImageStat(
                image_id=image_id,

                downloads=0,
                likes=0,
                views=0,

                createdAt=datetime.utcnow(),
            )

            db.add(stats)

            # -------- tags --------

            for tag_id in tags:
                db.add(
                    ImageTag(
                        image_id=image_id,
                        tag_id=tag_id,
                    )
                )

            await db.commit()

            return {
                "id": image_id,
                "title": title,
                "url": url,
            }

        except Exception:

            await db.rollback()

            raise