from sqlalchemy import select
from db.models.comment import Comment
from uuid import UUID

class CommentRepository:

    @staticmethod
    async def get_comments(session, limit: int):
        result = await session.execute(
            select(Comment).limit(limit)
        )
        return result.scalars().all()

    @staticmethod
    async def get_user_comments(session, user_id: UUID):
        result = await session.execute(
            select(Comment).where(
                Comment.user_id == user_id
            )
        )
        return result.scalars().all()

    @staticmethod
    async def create_comment(
        session,
        user_id: UUID,
        image_id: UUID,
        text: str
    ):
        comment = Comment(
            user_id=user_id,
            image_id=image_id,
            text=text
        )

        session.add(comment)
        await session.commit()
        await session.refresh(comment)

        return comment