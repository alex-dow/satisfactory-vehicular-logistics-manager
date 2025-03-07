from typing import  Annotated
from fastapi import Depends, HTTPException, APIRouter, Response

from tmserver.data.users import TMUser, get_user
from tmserver.exc import InvalidUserError
from tmserver.security.tokens import get_current_user, create_user_token, get_user_from_token, is_token_expired, refresh_cookie
from tmserver.security.hashing import verify_password

from pydantic import BaseModel, Field
from datetime import datetime
import logging

from tmserver.settings import Settings, get_settings

router = APIRouter()

class LoginRequest(BaseModel):
    username: str = Field(min_length=4)
    password: str


class LoginResponse(BaseModel):
    refresh_token: str
    type: str


@router.post("/refresh")
def refresh(refreshToken: Annotated[str, Depends(refresh_cookie)], response: Response, settings: Annotated[Settings, Depends(get_settings)]) -> LoginResponse:
    logger = logging.getLogger(__name__)
    if is_token_expired(refreshToken, settings.jwt_refresh_secret):
        raise HTTPException(status_code=401, detail="Token expired")
    
    user = get_user_from_token(refreshToken, settings.jwt_refresh_secret)
    auth_token = create_user_token(user, settings.jwt_auth_expires, settings.jwt_auth_secret)
    response.set_cookie(
        key="session",
        value=auth_token,
        max_age=None,
        expires=None,
        httponly=True,
    )
    res = LoginResponse(refresh_token=refreshToken, type="cookie")
    return res


@router.post("/login")
def login(req: LoginRequest, response: Response, settings: Annotated[Settings, Depends(get_settings)]) -> LoginResponse:
    logger = logging.getLogger(__name__)
    try:
        user = get_user(username=req.username)
        if user == None:
            raise InvalidUserError()
        if verify_password(req.password, user.password):

            print("auth secret: %s" % settings.jwt_auth_secret)
            print("refresh secret: %s" % settings.jwt_refresh_secret)

            auth_token = create_user_token(user, settings.jwt_auth_expires, settings.jwt_auth_secret)
            refresh_token = create_user_token(user, settings.jwt_refresh_expires, settings.jwt_refresh_secret)
            res = LoginResponse(refresh_token=refresh_token, type="cookie")
            response.set_cookie(
                key="session",
                value=auth_token,
                max_age=None,
                expires=None,
                httponly=True,
            )
            response.set_cookie(
                key="refresh",
                value=refresh_token,
                max_age=None,
                expires=None,
                httponly=True
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
    response.set_cookie(
        key="refresh",
        value="",
        expires=int(datetime.now().timestamp()),
        httponly=True,
        max_age=0
    )


@router.get("/whoami")
def whoami(user: Annotated[TMUser, Depends(get_current_user)]) -> TMUser:
    usercopy = user.model_copy(update={"password": ""}, deep=True)
    print("user copy password? %s" % usercopy)
    return usercopy