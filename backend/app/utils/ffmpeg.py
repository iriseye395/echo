import asyncio
from pathlib import Path

from app.core.config import get_settings


BITRATES = [64, 128, 320]


async def probe_duration_seconds(input_path: str) -> int | None:
    settings = get_settings()
    cmd = [
        settings.ffprobe_binary,
        "-v",
        "error",
        "-show_entries",
        "format=duration",
        "-of",
        "default=noprint_wrappers=1:nokey=1",
        input_path,
    ]
    proc = await asyncio.create_subprocess_exec(
        *cmd,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    stdout, _stderr = await proc.communicate()
    if proc.returncode != 0:
        return None
    try:
        return int(float(stdout.decode().strip()))
    except ValueError:
        return None


async def transcode_to_hls(input_path: str, output_dir: str) -> str:
    settings = get_settings()
    out_dir = Path(output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    for bitrate in BITRATES:
        (out_dir / str(bitrate)).mkdir(parents=True, exist_ok=True)

    var_stream_map = " ".join([f"a:{idx},name:{bitrate}" for idx, bitrate in enumerate(BITRATES)])
    segment_pattern = str(out_dir / "%v" / "segment_%03d.ts")
    variant_playlist_pattern = str(out_dir / "%v" / "index.m3u8")

    cmd = [
        settings.ffmpeg_binary,
        "-y",
        "-i",
        input_path,
        "-vn",
        "-c:a",
        "aac",
        "-ar",
        "48000",
        "-ac",
        "2",
        "-map",
        "0:a:0",
        "-b:a:0",
        "64k",
        "-map",
        "0:a:0",
        "-b:a:1",
        "128k",
        "-map",
        "0:a:0",
        "-b:a:2",
        "320k",
        "-f",
        "hls",
        "-hls_time",
        str(settings.hls_segment_duration),
        "-hls_playlist_type",
        "vod",
        "-hls_flags",
        "independent_segments",
        "-hls_segment_filename",
        segment_pattern,
        "-master_pl_name",
        "master.m3u8",
        "-var_stream_map",
        var_stream_map,
        variant_playlist_pattern,
    ]

    proc = await asyncio.create_subprocess_exec(
        *cmd,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    _stdout, stderr = await proc.communicate()

    if proc.returncode != 0:
        raise RuntimeError(f"ffmpeg failed: {stderr.decode().strip()}")

    return str(out_dir / "master.m3u8")
