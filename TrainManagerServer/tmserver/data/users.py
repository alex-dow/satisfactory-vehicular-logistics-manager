from typing import Optional
from sqlmodel import Field, SQLModel, Session, select
from tmserver.db.conn import engine
from tmserver.exc import InvalidUserError
from tmserver.security.hashing import hash_password

class TMUser(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True)
    password: str
    

def filter_user_password(user: TMUser) -> TMUser:
    return user.model_copy(update={"password": ""})


def get_user(username: str | None = None, user_id: int | None = None) -> TMUser:

    with Session(engine) as session:

        s = select(TMUser)
        if username is not None:
            s = s.where(TMUser.username == username)
        elif user_id is not None:
            s = s.where(TMUser.id == user_id)
        else:
            raise RuntimeError("Must provide a username or user_id")

        user = session.exec(s).first()
        print("found user: %s" % user)
        if user is None:
            raise InvalidUserError

        return user


def get_users():
    with Session(engine) as session:
        statement = select(TMUser)
        return [filter_user_password(user) for user in session.exec(statement).all()]


def create_user(username: str, password: str) -> TMUser:
    with Session(engine) as session:
        user = TMUser(
            username=username, 
            password=hash_password(password)
        )
        session.add(user)
        session.commit()
        session.refresh(user)
    return user


def delete_user(user: TMUser | None = None, user_id: int | None = None):
    if user is not None:
        with Session(engine) as session:
            session.delete(user)
            session.commit()
    elif user_id is not None:
        with Session(engine) as session:
            user = session.get(TMUser, user_id)
            if user is not None:
                session.delete(user)
                session.commit()
    else:
        raise RuntimeError("user or user_id must be given")