from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    DATABASE_URL: str = "mysql+pymysql://root:password@localhost:3306/artisan_ai"
    SECRET_KEY: str = "change-this-secret"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080
    API_PUBLIC_URL: str = "http://localhost:8000"
    FRONTEND_ORIGIN: str = "http://localhost:3000"
    ALGORITHM: str = "HS256"


settings = Settings()
