
from pydantic import BaseModel


class ImageMetadata(BaseModel):
    id: int
    width: int
    height: int
    geo: str | None
    authorId: int

    class Config:
        from_attributes = True