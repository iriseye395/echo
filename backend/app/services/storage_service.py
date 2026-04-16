from __future__ import annotations

from datetime import datetime, timedelta, timezone
from pathlib import Path

import aiofiles
from azure.storage.blob import BlobSasPermissions, ContentSettings, generate_blob_sas
from azure.storage.blob.aio import BlobServiceClient

from app.core.config import get_settings


class StorageService:
    def __init__(self) -> None:
        settings = get_settings()
        self.settings = settings
        self.client = BlobServiceClient.from_connection_string(settings.azure_blob_connection_string)
        self.container_name = settings.azure_blob_container

    async def close(self) -> None:
        await self.client.close()

    async def ensure_container(self) -> None:
        container = self.client.get_container_client(self.container_name)
        if not await container.exists():
            await container.create_container()

    async def upload_file(
        self,
        local_path: str,
        blob_path: str,
        content_type: str | None = None,
    ) -> str:
        blob_client = self.client.get_blob_client(container=self.container_name, blob=blob_path)
        content_settings = (
            ContentSettings(content_type=content_type) if content_type else None
        )

        async with aiofiles.open(local_path, "rb") as file_handle:
            data = await file_handle.read()

        await blob_client.upload_blob(
            data,
            overwrite=True,
            content_settings=content_settings,
        )
        return self.blob_url(blob_path)

    async def download_file(self, blob_path: str, local_path: str) -> None:
        blob_client = self.client.get_blob_client(container=self.container_name, blob=blob_path)
        downloader = await blob_client.download_blob()
        data = await downloader.readall()

        out_path = Path(local_path)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        async with aiofiles.open(out_path, "wb") as file_handle:
            await file_handle.write(data)

    async def upload_directory(self, local_dir: str, blob_prefix: str) -> None:
        base_path = Path(local_dir)
        files = [path for path in base_path.rglob("*") if path.is_file()]

        for local_file in files:
            relative = local_file.relative_to(base_path).as_posix()
            blob_path = f"{blob_prefix}/{relative}"
            content_type = _guess_content_type(local_file)
            await self.upload_file(str(local_file), blob_path, content_type=content_type)

    def blob_url(self, blob_path: str) -> str:
        endpoint = self.client.primary_endpoint.rstrip("/")
        normalized_blob_path = blob_path.lstrip("/")
        base_url = f"{endpoint}/{self.container_name}/{normalized_blob_path}"
        if not self.settings.azure_use_signed_urls:
            return base_url

        credential = getattr(self.client, "credential", None)
        account_key = getattr(credential, "account_key", None)
        if not account_key:
            return base_url

        sas_token = generate_blob_sas(
            account_name=self.client.account_name,
            container_name=self.container_name,
            blob_name=blob_path,
            account_key=account_key,
            permission=BlobSasPermissions(read=True),
            expiry=datetime.now(timezone.utc) + timedelta(seconds=self.settings.azure_signed_url_ttl_seconds),
        )
        return f"{base_url}?{sas_token}"


def _guess_content_type(path: Path) -> str | None:
    suffix = path.suffix.lower()
    if suffix == ".m3u8":
        return "application/vnd.apple.mpegurl"
    if suffix == ".ts":
        return "video/mp2t"
    if suffix == ".aac":
        return "audio/aac"
    return None
