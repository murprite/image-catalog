from pydantic import BaseModel


class CommentCreate(BaseModel):
    user_id: str
    image_id: str
    text: str


class CommentResponse(BaseModel):
    id: str
    user_id: str
    image_id: str
    text: str

    class Config:
        from_attributes = True