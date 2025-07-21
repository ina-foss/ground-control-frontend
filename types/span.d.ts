declare interface Span {
    id: number,
    label: string,
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
    type: {
      value: string,
      label: string
    }
  }
