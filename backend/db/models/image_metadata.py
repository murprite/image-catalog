from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base

class ImageMetadata(Base):
    __tablename__ = "image_metadata"

    id: Mapped[str] = mapped_column(
        ForeignKey("images.id"),
        primary_key=True
    )

    width: Mapped[int] = mapped_column(
        Integer
    )

    height: Mapped[int] = mapped_column(
        Integer
    )

    geo: Mapped[str] = mapped_column(
        String(255)
    )

    authorId: Mapped[str] = mapped_column(
        String(36)
    )