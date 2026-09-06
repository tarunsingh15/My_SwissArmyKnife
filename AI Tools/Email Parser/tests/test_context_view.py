"""Tests for the compact AI context view."""

from email_parser.ai_context.context_view import _root_emails, render_context
from email_parser.ids import make_block_id, make_doc_id
from email_parser.models import (
    Block,
    BlockType,
    CommonMetadata,
    Document,
    DocumentMetadata,
    NativeMetadata,
    ParseStatus,
    Provenance,
    SourceType,
)


def _email_with_quote_split() -> list[Document]:
    """Build a root email with new body text and quoted history."""
    raw = b"context view email"
    doc_id = make_doc_id(raw)
    document = Document(
        doc_id=doc_id,
        source_type=SourceType.email,
        mime_type="message/rfc822",
        root_id=doc_id,
        metadata=DocumentMetadata(
            common=CommonMetadata(title="Budget test", byte_size=len(raw)),
            native=NativeMetadata(
                subject="Budget test",
                from_addr="sender@example.com",
                to=[{"name": "Recipient", "addr": "to@example.com"}],
                date_utc="2026-01-01T00:00:00Z",
            ),
        ),
        blocks=[
            Block(
                block_id=make_block_id(doc_id, 0, BlockType.paragraph.value),
                type=BlockType.paragraph,
                text="New ask",
            ),
            Block(
                block_id=make_block_id(doc_id, 1, BlockType.quoted_history.value),
                type=BlockType.quoted_history,
                text="Old thread",
            ),
        ],
        provenance=Provenance(
            parser="test",
            parser_version="0.0.0",
            status=ParseStatus.ok,
        ),
    )
    return [document]


def test_render_context_excludes_quoted_history_by_default() -> None:
    """Default context includes new body text but not quoted history."""
    rendered = render_context(_email_with_quote_split())
    assert "New ask" in rendered
    assert "Old thread" not in rendered
    assert "--- untrusted source text begins ---" in rendered
    assert "--- untrusted source text ends ---" in rendered


def test_render_context_respects_tiny_token_budget() -> None:
    """A very small token budget truncates or keeps output short."""
    rendered = render_context(_email_with_quote_split(), token_budget=20)
    assert "[truncated]" in rendered or len(rendered) < 120


def _minimal_doc(
    *,
    doc_id: str,
    source_type: SourceType,
    parent_id: str | None = None,
    depth: int = 0,
    ordinal: int = 0,
) -> Document:
    """Build a minimal document for root-email selection tests."""
    return Document(
        doc_id=doc_id,
        source_type=source_type,
        mime_type="message/rfc822",
        root_id=doc_id,
        parent_id=parent_id,
        depth=depth,
        ordinal=ordinal,
        provenance=Provenance(
            parser="test",
            parser_version="0.0.0",
            status=ParseStatus.ok,
        ),
    )


def test_root_emails_only_parentless_email_documents() -> None:
    """Root emails match run.root_emails: parent_id is None and source_type is email."""
    root = _minimal_doc(doc_id="sha256:root", source_type=SourceType.email)
    child_email = _minimal_doc(
        doc_id="sha256:child",
        source_type=SourceType.email,
        parent_id="sha256:root",
        depth=1,
        ordinal=1,
    )
    depth_zero_child = _minimal_doc(
        doc_id="sha256:depth0",
        source_type=SourceType.email,
        parent_id="sha256:root",
        depth=0,
        ordinal=2,
    )
    misrouted_text = _minimal_doc(doc_id="sha256:text", source_type=SourceType.text)

    roots = _root_emails([root, child_email, depth_zero_child, misrouted_text])
    assert roots == [root]


def test_root_emails_returns_empty_without_parentless_emails() -> None:
    """No fallback to all emails when no true root emails exist."""
    child_email = _minimal_doc(
        doc_id="sha256:child",
        source_type=SourceType.email,
        parent_id="sha256:missing",
        depth=1,
    )
    misrouted_text = _minimal_doc(doc_id="sha256:text", source_type=SourceType.text)

    assert _root_emails([child_email, misrouted_text]) == []


def test_render_context_skips_non_root_emails() -> None:
    """Context view does not render child emails as thread roots."""
    root = _minimal_doc(doc_id="sha256:root", source_type=SourceType.email)
    root.metadata.native.subject = "Root subject"
    root.blocks = [
        Block(
            block_id=make_block_id(root.doc_id, 0, BlockType.paragraph.value),
            type=BlockType.paragraph,
            text="Root body",
        )
    ]
    child = _minimal_doc(
        doc_id="sha256:child",
        source_type=SourceType.email,
        parent_id=root.doc_id,
        depth=1,
        ordinal=1,
    )
    child.metadata.native.subject = "Child subject"
    child.blocks = [
        Block(
            block_id=make_block_id(child.doc_id, 0, BlockType.paragraph.value),
            type=BlockType.paragraph,
            text="Child body",
        )
    ]

    rendered = render_context([root, child])
    assert "Root body" in rendered
    assert "Child body" not in rendered
    assert "EMAIL E1" in rendered
    assert "EMAIL E2" not in rendered
