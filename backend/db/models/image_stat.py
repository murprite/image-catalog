from sqlalchemy import BigInteger, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime

from .base import Base


class ImageStat(Base):
    __tablename__ = "image_stats"

    image_id: Mapped[str] = mapped_column(
        ForeignKey("images.id"),
        primary_key=True
    )

    downloads: Mapped[int] = mapped_column(
        BigInteger,
        default=0
    )

    likes: Mapped[int] = mapped_column(
        BigInteger,
        default=0
    )

    createdAt: Mapped[datetime] = mapped_column(
        DateTime
    )

    views: Mapped[int] = mapped_column(
        BigInteger,
        default=0
    )