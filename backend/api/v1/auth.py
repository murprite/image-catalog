from fastapi import APIRouter

router = APIRouter()


@router.post("/register")
async def register():
    return {"message": "register"}


@router.post("/login")
async def login():
    return {"message": "login"}


@router.get("/me")
async def me():
    return {"message": "current user"}