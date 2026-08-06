from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class Image(Base):
    __tablename__ = "images"

    id: Mapped[str] = mapped_column(primary_key=True)

    author: Mapped[str] = mapped_column(String(128))
    url: Mapped[str] = mapped_column(String(255))
    title: Mapped[str] = mapped_column(String(100))

