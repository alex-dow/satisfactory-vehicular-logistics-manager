from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    jwt_auth_secret: str = "default secret"
    jwt_auth_expires: int = 30 # 30 minutes
    jwt_refresh_secret: str = "default secret"
    jwt_refresh_expires: int = 24*60 # 1 day

    model_config = SettingsConfigDict(env_file="grrr_prod", env_file_encoding='utf-8')


def get_settings():
    s = Settings()
    print("s auth sec? %s" % s.jwt_auth_secret)
    return s
