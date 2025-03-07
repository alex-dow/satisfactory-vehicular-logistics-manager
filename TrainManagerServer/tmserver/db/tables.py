import logging
from sqlmodel import SQLModel
from tmserver.data.users import TMUser, create_user, get_user
from tmserver.db.conn import Session, engine
from tmserver.exc import InvalidUserError


def init_db():
    SQLModel.metadata.create_all(engine)

def init_first_user():
    logger = logging.getLogger(__name__)
    user = get_user(user_id=1)
    if user == None:
        logger.info("Creating first user")
        user = create_user("admin", "admin")
        logger.info("User %s with id %i created" % (user.username, user.id))



