from typing import Annotated

from fastapi import APIRouter, HTTPException
from fastapi.params import Depends
from httpx import get
from pydantic import BaseModel, Field
import sqlalchemy
from tmserver.data.users import TMUser, filter_user_password, get_user, get_users,delete_user , create_user, save_user
from tmserver.security.hashing import hash_password
from tmserver.security.tokens import get_current_user

router = APIRouter()

class CreateUserRequest(BaseModel):
    username: str = Field(min_length=4)
    password: str = Field(min_length=4)

class UpdatePasswordRequest(BaseModel):
    password: str = Field(min_length=4)

@router.post("/api/users")
def api_create_user(req: CreateUserRequest) -> TMUser:
    try:
        user = create_user(req.username, req.password)
        return user.model_copy(update={"password": ""})
    except sqlalchemy.exc.IntegrityError:
        raise HTTPException(status_code=409, detail="Username already exists")

"""
@router.get("/users")
def api_get_all_users(currentUser: Annotated[TMUser, Depends(get_current_user)]):
    if currentUser is None or currentUser.id is None or currentUser.id > 1:
        raise HTTPException(status_code=403, detail="Forbidden")

    users = list(map(filter_user_password, get_users()))

    return users


@router.delete("/users/{user_id}")
def api_delete_user(user_id: int, currentUser: Annotated[TMUser, Depends(get_current_user)]):
    if currentUser is None or currentUser.id is None or currentUser.id > 1:
        raise HTTPException(status_code=403, detail="Forbidden")

    if user_id == 1:
        raise HTTPException(status_code=409, detail="Can't delete this user")

    delete_user(user_id=user_id)
"""

@router.put("/api/users/{user_id}/password")
def api_update_user_password(user_id: int, req: UpdatePasswordRequest, currentUser: Annotated[TMUser, Depends(get_current_user)]):

    user = get_user(user_id=user_id)
    if user == None:
        raise HTTPException(status_code=404, detail="User not found")
    
    if currentUser.id != 1 or user.id != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    user.password = hash_password(req.password)
    user = save_user(user)
