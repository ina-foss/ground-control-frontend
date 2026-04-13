/**
  * Type predicate for Span in text
  */
export function isSpan(span: AnySpan | undefined | null): span is Span {
  return span !== undefined && span !== null &&
    !('spans' in span) &&
    'tcin' in span
}

/**
  * Type predicate for SpanGroup
  */
export function isSpanGroup(span: AnySpan | undefined | null): span is SpanGroup {
  return span !== undefined && span !== null &&
        ('spans' in span)
}

/**
  * Type predicate for VirtualSpan
  */
export function isVirtualSpan(span: AnySpan | undefined | null ): span is VirtualSpan {
  return span !== undefined && span !== null &&
        !('tcin' in span) &&
        !('spans' in span)
}


const TRIM_CHARS = new Set(['.', ',', "'", ';', ' ', '\t', '\n', '\r', '\f', '\v']);

export function cleanText(text?: string): string {
  if (!text) return '';

  let start = 0;
  let end = text.length - 1;

  while (start <= end && TRIM_CHARS.has(text[start])) start++;
  while (end >= start && TRIM_CHARS.has(text[end])) end--;

  return text.slice(start, end + 1);
}
