from passlib.hash import argon2


def verify_password(clear_pw: str, hashed_pw: str) -> bool:
    return argon2.verify(secret=clear_pw, hash=hashed_pw)

def hash_password(clear_pw: str) -> str:
    return argon2.hash(clear_pw)

