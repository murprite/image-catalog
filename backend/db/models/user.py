from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(32), unique=True)
    email: Mapped[str] = mapped_column(String(50), unique=True)
    password: Mapped[str] = mapped_column(String(150), unique=True)
    login: Mapped[str] = mapped_column(String(255), unique=True)
    iconUrl: Mapped[str] = mapped_column(String(150), unique=True)