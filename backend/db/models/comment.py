from sqlalchemy import DateTime, ForeignKey, Text, String
from datetime import datetime
from .base import Base
from sqlalchemy.orm import Mapped, mapped_column

class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[str] = mapped_column(
        primary_key=True
    )

    image_id: Mapped[str] = mapped_column(
        ForeignKey("images.id")
    )

    user_id: Mapped[str] = mapped_column(
        String(36)
    )

    text: Mapped[str] = mapped_column(
        Text
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime
    )