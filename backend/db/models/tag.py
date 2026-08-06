from .base import Base
from sqlalchemy.orm import Mapped, mapped_column

class Tag(Base):
    __tablename__ = "tags"

    id: Mapped[str] = mapped_column(primary_key=True)
    name: Mapped[str]
    color: Mapped[str]