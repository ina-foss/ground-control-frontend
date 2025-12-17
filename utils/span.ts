/**
  * Type predicate for Span in text
  */
export function isSpan(span: AnySpan | null): span is Span {
  return span !== null &&
    !('spans' in span) &&
    'tcin' in span
}

/**
  * Type predicate for SpanGroup
  */
export function isSpanGroup(span: AnySpan | null): span is SpanGroup {
  return span !== null &&
        ('spans' in span)
}

/**
  * Type predicate for VirtualSpan
  */
export function isVirtualSpan(span: AnySpan | null): span is VirtualSpan {
  return span !== null &&
        !('tcin' in span) &&
        !('spans' in span)
}
