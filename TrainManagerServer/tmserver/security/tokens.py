from datetime import datetime, timezone, timedelta
from typing import Annotated

from fastapi.params import Depends
from fastapi.security import OAuth2PasswordBearer, APIKeyCookie
from sqlalchemy import true

from tmserver.data.users import TMUser, get_user
import jwt

from tmserver.exc import InvalidTokenError
from tmserver.settings import Settings, get_settings

JWT_ALGO = "HS256"



oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

session_cookie = APIKeyCookie(name="session")
refresh_cookie = APIKeyCookie(name="refresh")

def create_user_token(user: TMUser, expires: int, secret: str) -> str:
    expiresDate = datetime.now(timezone.utc) + timedelta(minutes=expires)

    data = {
        "sub": user.username,
        "exp": expiresDate.timestamp()
    }

    encoded_jwt = jwt.encode(data, secret, algorithm=JWT_ALGO)
    return encoded_jwt


def is_token_expired(token: str, secret: str) -> bool:
    try:
        payload = jwt.decode(token, secret, algorithms=JWT_ALGO)
        expires: float = payload.get("exp")

        if datetime.now().timestamp() > expires:
            return True
        else:
            return False
    except jwt.exceptions.InvalidTokenError:
        raise InvalidTokenError
            

def get_user_from_token(token: str, secret: str) -> TMUser:
    try:
        payload = jwt.decode(token, secret, algorithms=JWT_ALGO)
        username: str = payload.get("sub")
        if username is None:
            raise InvalidTokenError
    except jwt.exceptions.InvalidTokenError:
        raise InvalidTokenError

    user = get_user(username)
    return user


def get_current_user(token: Annotated[str, Depends(session_cookie)], settings: Annotated[Settings, Depends(get_settings)]) -> TMUser:
    if is_token_expired(token, settings.jwt_auth_secret):
        raise InvalidTokenError
    return get_user_from_token(token, settings.jwt_auth_secret)

