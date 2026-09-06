"""Unit tests for Tier A run metrics."""

from email_parser.metrics.run_metrics import compute_run_metrics
from email_parser.models import Document, ParseStatus, Provenance, SourceType


def _doc(
    doc_id: str,
    *,
    source_type: SourceType = SourceType.email,
    parent_id: str | None = None,
    status: ParseStatus = ParseStatus.ok,
) -> Document:
    """Build a minimal document for run-metrics tests."""
    return Document(
        doc_id=doc_id,
        source_type=source_type,
        mime_type="message/rfc822",
        root_id=doc_id if parent_id is None else parent_id,
        parent_id=parent_id,
        depth=0 if parent_id is None else 1,
        provenance=Provenance(
            parser="test",
            parser_version="0.0.0",
            status=status,
        ),
    )


def test_partial_successes_detects_failed_descendant() -> None:
    """Root emails with failed nested attachments count as partial successes."""
    root = _doc("sha256:root", status=ParseStatus.ok)
    attachment = _doc(
        "sha256:pdf",
        source_type=SourceType.pdf,
        parent_id=root.doc_id,
        status=ParseStatus.failed,
    )

    metrics = compute_run_metrics([root, attachment])

    assert metrics["partial_successes"] == 1


def test_partial_successes_ignores_ok_descendants() -> None:
    """Root emails with only successful descendants are not partial successes."""
    root = _doc("sha256:root", status=ParseStatus.ok)
    attachment = _doc(
        "sha256:pdf",
        source_type=SourceType.pdf,
        parent_id=root.doc_id,
        status=ParseStatus.ok,
    )

    metrics = compute_run_metrics([root, attachment])

    assert metrics["partial_successes"] == 0
