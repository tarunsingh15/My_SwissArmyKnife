"""PaddleOCR backend (sole PaddleOCR / paddlepaddle import site)."""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np

ENGINE_NAME = "paddleocr"
ENGINE_VERSION = "0.1.0"

_Y_PROXIMITY_FACTOR = 1.5

_ocr_engine: object | None = None
_import_checked = False
_import_error: str | None = None


@dataclass(frozen=True)
class OcrLine:
    """One OCR text line with a pixel-space bounding box."""

    text: str
    bbox: tuple[float, float, float, float]
    confidence: float


@dataclass(frozen=True)
class OcrParagraph:
    """Paragraph clustered from one or more OCR lines."""

    text: str
    bbox: tuple[float, float, float, float]


def paddle_is_available() -> bool:
    """Return True when paddlepaddle and PaddleOCR import successfully."""
    _ensure_import_checked()
    return _import_error is None


def paddle_import_error() -> str | None:
    """Return the import error message when Paddle is unavailable."""
    _ensure_import_checked()
    return _import_error


def _ensure_import_checked() -> None:
    """Probe Paddle imports once and cache the outcome."""
    global _import_checked, _import_error
    if _import_checked:
        return
    _import_checked = True
    try:
        import paddle  # noqa: F401
        from paddleocr import PaddleOCR  # noqa: F401
    except ImportError as exc:
        _import_error = str(exc)


def _get_ocr_engine() -> object:
    """Return a lazily constructed PaddleOCR instance."""
    global _ocr_engine, _import_error
    _ensure_import_checked()
    if _import_error is not None:
        raise RuntimeError(f"PaddleOCR is not available: {_import_error}")
    if _ocr_engine is None:
        from paddleocr import PaddleOCR

        # PaddleOCR 3.x: show_log removed; use_textline_orientation replaces use_angle_cls.
        # Disable doc preprocessing so bbox coords stay aligned to the raster image.
        _ocr_engine = PaddleOCR(
            lang="en",
            use_doc_orientation_classify=False,
            use_doc_unwarping=False,
            use_textline_orientation=True,
        )
    return _ocr_engine


def _ocr_result_payload(page_result: object) -> dict | None:
    """Extract the OCR payload dict from a PaddleOCR 3.x predict() result item."""
    json_data = getattr(page_result, "json", None)
    if not isinstance(json_data, dict):
        return None
    inner = json_data.get("res", json_data)
    return inner if isinstance(inner, dict) else None


def _bbox_from_poly(poly: object) -> tuple[float, float, float, float] | None:
    """Convert a polygon or axis-aligned box to a bbox tuple."""
    if poly is None:
        return None
    if hasattr(poly, "tolist"):
        poly = poly.tolist()
    if not isinstance(poly, (list, tuple)) or not poly:
        return None
    first = poly[0]
    if isinstance(first, (list, tuple)) and len(first) >= 2:
        return _quad_to_bbox(poly)
    if len(poly) >= 4 and all(isinstance(value, (int, float)) for value in poly[:4]):
        x0, y0, x1, y1 = (float(poly[0]), float(poly[1]), float(poly[2]), float(poly[3]))
        return (x0, y0, x1, y1)
    return None


def _lines_from_predict_result(page_result: object) -> list[OcrLine]:
    """Parse one PaddleOCR 3.x predict() result item into OCR lines."""
    payload = _ocr_result_payload(page_result)
    if payload is None:
        return []

    texts = payload.get("rec_texts") or []
    scores = payload.get("rec_scores") or []
    polys = payload.get("rec_polys")
    boxes = payload.get("rec_boxes")

    lines: list[OcrLine] = []
    for index, raw_text in enumerate(texts):
        text = str(raw_text).strip()
        if not text:
            continue
        confidence = float(scores[index]) if index < len(scores) else 0.0
        bbox: tuple[float, float, float, float] | None = None
        if polys is not None and index < len(polys):
            bbox = _bbox_from_poly(polys[index])
        if bbox is None and boxes is not None and index < len(boxes):
            bbox = _bbox_from_poly(boxes[index])
        if bbox is None:
            continue
        lines.append(OcrLine(text=text, bbox=bbox, confidence=confidence))
    return lines


def _quad_to_bbox(quad: list[list[float]]) -> tuple[float, float, float, float]:
    """Convert a four-point quad to an axis-aligned bbox tuple."""
    xs = [point[0] for point in quad]
    ys = [point[1] for point in quad]
    return (min(xs), min(ys), max(xs), max(ys))


def _merge_bboxes(
    left: tuple[float, float, float, float],
    right: tuple[float, float, float, float],
) -> tuple[float, float, float, float]:
    """Return the union of two axis-aligned bounding boxes."""
    return (
        min(left[0], right[0]),
        min(left[1], right[1]),
        max(left[2], right[2]),
        max(left[3], right[3]),
    )


def _line_height(bbox: tuple[float, float, float, float]) -> float:
    """Return the vertical extent of a bbox."""
    return max(bbox[3] - bbox[1], 1.0)


def group_lines_into_paragraphs(
    lines: list[OcrLine],
    *,
    y_proximity_factor: float = _Y_PROXIMITY_FACTOR,
) -> list[OcrParagraph]:
    """Cluster OCR lines into paragraph blocks by vertical proximity."""
    if not lines:
        return []

    ordered = sorted(lines, key=lambda line: (line.bbox[1], line.bbox[0]))
    paragraphs: list[OcrParagraph] = []
    current_texts: list[str] = []
    current_bbox = ordered[0].bbox
    previous_bbox = ordered[0].bbox

    for line in ordered:
        gap = line.bbox[1] - previous_bbox[3]
        threshold = _line_height(previous_bbox) * y_proximity_factor
        if current_texts and gap > threshold:
            paragraphs.append(
                OcrParagraph(text=" ".join(current_texts), bbox=current_bbox)
            )
            current_texts = []
            current_bbox = line.bbox
        else:
            if current_texts:
                current_bbox = _merge_bboxes(current_bbox, line.bbox)
            else:
                current_bbox = line.bbox
        current_texts.append(line.text)
        previous_bbox = line.bbox

    if current_texts:
        paragraphs.append(OcrParagraph(text=" ".join(current_texts), bbox=current_bbox))
    return paragraphs


def run_ocr_on_image(image: np.ndarray) -> list[OcrLine]:
    """Run PaddleOCR on one page image and return detected lines."""
    engine = _get_ocr_engine()
    raw_result = engine.predict(image)
    if not raw_result:
        return []

    lines: list[OcrLine] = []
    for page_result in raw_result:
        lines.extend(_lines_from_predict_result(page_result))
    return lines


def pixel_bbox_to_pdf_bbox(
    bbox: tuple[float, float, float, float],
    *,
    image_width: int,
    image_height: int,
    page_width: float,
    page_height: float,
) -> tuple[float, float, float, float]:
    """Map pixel-space OCR coordinates to PDF user-space points."""
    if image_width <= 0 or image_height <= 0:
        return bbox
    scale_x = page_width / image_width
    scale_y = page_height / image_height
    x0, y0, x1, y1 = bbox
    return (x0 * scale_x, y0 * scale_y, x1 * scale_x, y1 * scale_y)
