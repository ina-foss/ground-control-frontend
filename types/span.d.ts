declare interface Span {
    id: number,
    label: string,
    deletedItems: number,
    text? : string,
    nodes: Array<Node>,
    tcin: number | string,
    tcout: number | string,
    type: {
      value: string,
      label: string
    }
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
    type: {
      value: string,
      label: string
    },
    tcin: number | string,
    tcout: number | string,
  }

declare interface VirtualSpan  {
    id: number,
    label: string,
    deletedItems: number,
    type: {
      value: string,
      label: string
    }
  }
