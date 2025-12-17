/**
  * Type predicate for Span in text
  */
export function isSpan(span: Span | SpanGroup | VirtualSpan | null): span is Span {
  return span !== null &&
    !('spans' in span) &&
    'tcin' in span
}

/**
  * Type predicate for SpanGroup
  */
export function isSpanGroup(span: Span | SpanGroup | VirtualSpan | null): span is SpanGroup {
  return span !== null &&
        ('spans' in span)
}

/**
  * Type predicate for VirtualSpan
  */
export function isVirtualSpan(span: Span | SpanGroup | VirtualSpan | null): span is VirtualSpan {
  return span !== null &&
        !('tcin' in span) &&
        !('spans' in span)
}
