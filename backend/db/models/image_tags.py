from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base

class ImageTag(Base):
    __tablename__ = "image_tags"

    image_id: Mapped[str] = mapped_column(
        ForeignKey("images.id"),
        primary_key=True
    )

    tag_id: Mapped[str] = mapped_column(
        ForeignKey("tags.id"),
        primary_key=True
    )