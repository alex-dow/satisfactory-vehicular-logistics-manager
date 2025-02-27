from typing import Annotated

from fastapi import APIRouter, HTTPException
from fastapi.params import Depends
from pydantic import BaseModel, Field
import sqlalchemy
from tmserver.data.users import TMUser, filter_user_password, get_users,delete_user , create_user
from tmserver.security.tokens import get_oauth2_user

router = APIRouter()

class CreateUserRequest(BaseModel):
    username: str = Field(min_length=4)
    password: str = Field(min_length=4)


@router.post("/users")
def api_create_user(req: CreateUserRequest) -> TMUser:
    try:
        user = create_user(req.username, req.password)
        return user.model_copy(update={"password": ""})
    except sqlalchemy.exc.IntegrityError:
        raise HTTPException(status_code=409, detail="Username already exists")


@router.get("/users")
def api_get_all_users(user: Annotated[TMUser, Depends(get_oauth2_user)]):
    if user.id is not None and user.id > 1:
        raise HTTPException(status_code=403, detail="Forbidden")

    users = list(map(filter_user_password, get_users()))

    return users


@router.delete("/users/{user_id}")
def api_delete_user(user_id: int, user: Annotated[TMUser, Depends(get_oauth2_user)]):
    if user.id is not None and user.id > 1:
        raise HTTPException(status_code=403, detail="Forbidden")

    if user_id == 1:
        raise HTTPException(status_code=409, detail="Can't delete this user")

    delete_user(user_id=user_id)
