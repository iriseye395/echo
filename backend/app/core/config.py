import json
from functools import lru_cache
from typing import Literal

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "ECHO Streaming Backend"
    environment: Literal["development", "staging", "production"] = "development"
    log_level: str = "INFO"
    api_prefix: str = ""

    secret_key: str = Field(default="change-me-in-production", min_length=16)
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    database_url: str = "postgresql+asyncpg://echo:echo@postgres:5432/echo"
    redis_url: str = "redis://redis:6379/0"

    kafka_bootstrap_servers: str = "kafka:9092"
    kafka_client_id: str = "echo-api"
    kafka_consumer_group: str = "echo-encoder-workers"
    kafka_max_retries: int = 3

    azure_blob_connection_string: str = (
        "DefaultEndpointsProtocol=http;"
        "AccountName=devstoreaccount1;"
        "AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/"
        "K1SZFPTOtr/KBHBeksoGMGw==;"
        "BlobEndpoint=http://azurite:10000/devstoreaccount1;"
    )
    azure_blob_container: str = "audio-streaming"
    azure_blob_public_read: bool = True
    azure_use_signed_urls: bool = False
    azure_signed_url_ttl_seconds: int = 3600

    ffmpeg_binary: str = "ffmpeg"
    ffprobe_binary: str = "ffprobe"
    hls_segment_duration: int = 6

    upload_tmp_dir: str = "/tmp/echo_uploads"

    cors_origins: list[str] = Field(default_factory=lambda: ["*"])

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, str):
            stripped = value.strip()
            if not stripped:
                return ["*"]

            if stripped.startswith("["):
                try:
                    parsed = json.loads(stripped)
                    if isinstance(parsed, list):
                        return [str(item).strip() for item in parsed if str(item).strip()]
                except json.JSONDecodeError:
                    pass

            return [item.strip() for item in stripped.split(",")]
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()
