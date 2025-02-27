from sqlmodel import SQLModel
from tmserver.db.conn import engine


def init_db():
    SQLModel.metadata.create_all(engine)

