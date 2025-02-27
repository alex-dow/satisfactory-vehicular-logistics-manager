from datetime import datetime, timezone, timedelta
from typing import Annotated

from fastapi.params import Depends
from fastapi.security import OAuth2PasswordBearer, APIKeyCookie

from tmserver.data.users import TMUser, get_user
import jwt

from tmserver.exc import InvalidTokenError

JWT_SECRET = "CmvXdsHVuUmpdCQiQTL793k9Oyrd1qe8hNOIkoI9tAv0AuScoLpPU81z88YfpfhL"
JWT_ALGO = "HS256"
JWT_EXPIRES = 30



oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

cookie_scheme = APIKeyCookie(name="session")

def create_user_token(user: TMUser) -> str:
    expires = datetime.now(timezone.utc) + timedelta(minutes=JWT_EXPIRES)

    data = {
        "sub": user.username,
        "exp": expires
    }

    encoded_jwt = jwt.encode(data, JWT_SECRET, algorithm=JWT_ALGO)
    return encoded_jwt


def get_user_from_token(token: str) -> TMUser:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=JWT_ALGO)
        username: str = payload.get("sub")
        if username is None:
            raise InvalidTokenError
    except jwt.exceptions.InvalidTokenError:
        raise InvalidTokenError

    user = get_user(username)
    return user


def get_oauth2_user(token: Annotated[str, Depends(cookie_scheme)]) -> TMUser:
    return get_user_from_token(token)