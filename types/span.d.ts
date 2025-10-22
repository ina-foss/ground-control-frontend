declare interface Span {
    id: number,
    label: string,
    deletedItems: number,
    text? : string,
    nodes: Array<Node>,
    tcin: number | string,
    tcout: number | string,
    plugins: Array
  }

declare interface SpanGroup  {
    id: number,
    label: string,
    spans: [
      {
        spanId: string | number,
        role: {
          value: string,
          label: string,
        }
      }
    ],
    plugins: Array,
    tcin: number | string,
    tcout: number | string,
  }

declare interface VirtualSpan  {
    id: number,
    label: string,
    deletedItems?: number,
    plugins: Array
}
