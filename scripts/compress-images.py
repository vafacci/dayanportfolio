"""Compress portfolio images in-place for faster page loads."""
from __future__ import annotations

import io
import os
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
IMG = ROOT / "img"

# Max width (px) by category — enough for 2x retina at current layout sizes
RULES = (
    (("hero-portrait", "dayan-portrait", "profilepic"), 1000),
    (("rejse", "spotit", "naturnat", "scana"), 1400),
    (("skills",), 900),
)

JPEG_QUALITY = 82
PNG_OPTIMIZE = True


def max_width_for(path: Path) -> int:
    name = path.as_posix().lower()
    for keys, width in RULES:
        if any(key in name for key in keys):
            return width
    return 1600


def resize_if_needed(img: Image.Image, max_width: int) -> Image.Image:
    if img.width <= max_width:
        return img
    ratio = max_width / img.width
    size = (max_width, max(1, round(img.height * ratio)))
    return img.resize(size, Image.Resampling.LANCZOS)


def save_jpeg(img: Image.Image, path: Path) -> None:
    rgb = img.convert("RGB")
    rgb.save(
        path,
        format="JPEG",
        quality=JPEG_QUALITY,
        optimize=True,
        progressive=True,
    )


def save_png(img: Image.Image, path: Path) -> None:
    if img.mode not in ("RGBA", "LA", "P"):
        img = img.convert("RGBA") if "A" in img.getbands() else img.convert("RGB")
    img.save(path, format="PNG", optimize=PNG_OPTIMIZE)


def compress_file(path: Path) -> tuple[int, int, str | None]:
    before = path.stat().st_size
    max_w = max_width_for(path)
    suffix = path.suffix.lower()

    with Image.open(path) as img:
        img.load()
        has_alpha = img.mode in ("RGBA", "LA") or (
            img.mode == "P" and "transparency" in img.info
        )
        resized = resize_if_needed(img, max_w)

        if suffix in (".jpg", ".jpeg"):
            save_jpeg(resized, path)
            return before, path.stat().st_size, None

        if suffix == ".png" and not has_alpha and before > 120_000:
            jpg_path = path.with_suffix(".jpg")
            save_jpeg(resized, jpg_path)
            path.unlink()
            return before, jpg_path.stat().st_size, jpg_path.name

        save_png(resized, path)
        return before, path.stat().st_size, None


def main() -> None:
    patterns = ("*.jpg", "*.jpeg", "*.png", "*.JPG", "*.JPEG", "*.PNG")
    files: list[Path] = []
    for pattern in patterns:
        files.extend(IMG.rglob(pattern))
    files = sorted(set(files))

    total_before = 0
    total_after = 0
    renames: list[tuple[str, str]] = []

    print(f"Compressing {len(files)} images in {IMG}\n")
    for path in files:
        try:
            before, after, new_name = compress_file(path)
            total_before += before
            total_after += after
            rel = path.relative_to(ROOT).as_posix()
            if new_name:
                new_rel = path.parent.relative_to(ROOT).as_posix() + "/" + new_name
                renames.append((rel, new_rel))
                rel = f"{rel} -> {new_name}"
            pct = (1 - after / before) * 100 if before else 0
            print(f"  {rel}: {before // 1024} KB -> {after // 1024} KB ({pct:.0f}% smaller)")
        except Exception as exc:
            print(f"  SKIP {path.name}: {exc}")

    print(f"\nTotal: {total_before // 1024} KB -> {total_after // 1024} KB")
    if renames:
        print("\nRenamed (update HTML if not done automatically):")
        for old, new in renames:
            print(f"  {old} -> {new}")


if __name__ == "__main__":
    main()
