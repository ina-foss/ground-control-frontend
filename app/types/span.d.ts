declare interface SpanBase {
  /**
   * Unique identifier across spans (virtual included) and groups
   * @readonly
   */
  id: number,
  /**
   *  String that will be display to the user
   *
   *  May contains span text content or plugin value
   */
  label: string,
}

declare interface Span extends SpanBase {
    deletedItems: number,
    /**
     * Text extracted from {@link nodes}
     *
     * Note: the value is updated only when the user saves his annotation
     */
    text? : string,
    /** Contains all the `Node` element the user selected to create the span */
    nodes: Node[],
    tcin: number | string,
    tcout: number | string,
    plugins: PluginAutocompleteValueDTO[]
  }

declare interface SpanGroup extends SpanBase  {
    spans: [
      {
        spanId: string | number,
        role: {
          value: string,
          label: string,
        }
      }
    ],
    plugins: PluginAutocompleteValueDTO[],
    tcin: number | string,
    tcout: number | string,
  }

declare interface VirtualSpan extends SpanBase {
    deletedItems?: number,
    plugins: PluginAutocompleteValueDTO[]
}

declare type AnySpan = Span | SpanGroup | VirtualSpan


