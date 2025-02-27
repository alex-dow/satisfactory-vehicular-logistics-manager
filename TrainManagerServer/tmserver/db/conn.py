from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

SQLITE_FILE_NAME = "tmserver.db"
DATABASE_URL = f"sqlite:///{SQLITE_FILE_NAME}"
DATABASE_DEBUG = True

engine = create_engine(DATABASE_URL, echo=DATABASE_DEBUG)

Session = sessionmaker(engine)