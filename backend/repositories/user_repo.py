from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from db.models.user import User
from db.session import async_session


class UserRepository:

    @staticmethod
    async def get_by_id(user_id: int):
        async with async_session() as session:
            result = await session.execute(
                select(User).where(User.id == user_id)
            )

            return result.scalar_one_or_none()

    @staticmethod
    async def get_by_name(
            db: AsyncSession,
            name: str,
    ):
        result = await db.execute(
            select(User)
            .where(
                User.name == name
            )
        )

        return result.scalar_one_or_none()

    @staticmethod
    async def create(
            db: AsyncSession,
            user: User,
    ):
        db.add(user)

        await db.flush()

        return user