from functools import lru_cache

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_env: str

    # DB connection parts
    db_user: str
    db_password: str
    db_host: str
    db_port: int
    db_name: str

    @property
    def sqlalchemy_database_url(self) -> str:
        return f"postgresql+psycopg://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"

    console_api_token: str | None = None

    # Token for internal cron endpoints.
    # Vercel Cron Jobs automatically send `Authorization: Bearer <CRON_SECRET>` when CRON_SECRET is set.
    # Accept both names to reduce configuration footguns.
    cron_api_token: str | None = Field(default=None, validation_alias=AliasChoices("CRON_SECRET"))


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
