from repositories.user_repo import UserRepository


class UserService:

    @staticmethod
    async def get_user(user_id: int):
        user = await UserRepository.get_by_id(user_id)

        if not user:
            return {"error": "User not found"}

        return user

    