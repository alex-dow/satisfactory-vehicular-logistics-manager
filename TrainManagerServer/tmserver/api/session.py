from typing import  Annotated
from fastapi import Depends, HTTPException, APIRouter, Response

from tmserver.data.users import TMUser, get_user
from tmserver.exc import InvalidUserError
from tmserver.security.tokens import get_oauth2_user, create_user_token
from tmserver.security.hashing import verify_password

from pydantic import BaseModel, Field
from datetime import datetime
import logging

router = APIRouter()

class LoginRequest(BaseModel):
    username: str = Field(min_length=4)
    password: str


class LoginResponse(BaseModel):
    token: str
    type: str


@router.post("/login")
def login(req: LoginRequest, response: Response) -> LoginResponse:
    logger = logging.getLogger(__name__)
    try:
        user = get_user(username=req.username)
        if verify_password(req.password, user.password):
            token = create_user_token(user)
            res = LoginResponse(token=token, type="cookie")
            response.set_cookie(
                key="session",
                value=token,
                max_age=None,
                expires=None,
                httponly=True,
            )
            return res
        else:
            raise InvalidUserError("Invalid username or password")
    except:
        logging.exception("Invalid username or password")
        raise HTTPException(status_code=401, detail="Invalid username or password")


@router.post("/logout")
def logout(response: Response):
    response.set_cookie(
        key="session",
        value="",
        expires=int(datetime.now().timestamp()),
        httponly=True,
        max_age=0
    )


@router.get("/whoami")
def whoami(user: Annotated[TMUser, Depends(get_oauth2_user)]) -> TMUser:
    usercopy = user.model_copy(update={"password": ""}, deep=True)
    print("user copy password? %s" % usercopy)
    return usercopy