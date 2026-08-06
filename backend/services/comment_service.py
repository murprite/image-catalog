from repositories.comment_repo import CommentRepository
from repositories.image_repo import ImageRepository
from uuid import UUID

class CommentService:

    @staticmethod
    async def get_comments(
            db,
            image_id: str,
    ):
        return await ImageRepository.get_comments(
            db,
            image_id,
        )

    @staticmethod
    async def get_user_comments(session, user_id: int):
        return await CommentRepository.get_user_comments(
            session,
            user_id
        )

    @staticmethod
    async def create_comment(
        session,
        user_id: UUID,
        image_id: UUID,
        text: str
    ):
        return await CommentRepository.create_comment(
            session,
            user_id,
            image_id,
            text
        )

