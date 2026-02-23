/**
  * Type predicate for Span in text
  */
export function isSpan(span: AnySpan | undefined): span is Span {
  return span !== undefined &&
    !('spans' in span) &&
    'tcin' in span
}

/**
  * Type predicate for SpanGroup
  */
export function isSpanGroup(span: AnySpan | undefined): span is SpanGroup {
  return span !== undefined &&
        ('spans' in span)
}

/**
  * Type predicate for VirtualSpan
  */
export function isVirtualSpan(span: AnySpan | undefined ): span is VirtualSpan {
  return span !== undefined &&
        !('tcin' in span) &&
        !('spans' in span)
}
