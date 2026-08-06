from fastapi import APIRouter

from .auth import router as auth_router
from .users import router as users_router
from .images import router as images_router
from .comments import router as comments_router
from .likes import router as likes_router
from .tags import router as tags_router
from .search import router as search_router
from .report import router as report_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth")
api_router.include_router(users_router, prefix="/users")
api_router.include_router(images_router, prefix="/images")
api_router.include_router(comments_router, prefix="/comments")
api_router.include_router(likes_router, prefix="/likes")
api_router.include_router(tags_router, prefix="/tags")
api_router.include_router(search_router, prefix="/search")
api_router.include_router(report_router, prefix="/report")
