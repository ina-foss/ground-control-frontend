declare interface VideoElements {
    video: HTMLElement | null;
    container: HTMLElement | null;
    currentTime:HTMLElement | null;
    duration: HTMLElement | null;
    btnTcIn: HTMLElement | null;
    btnTcOut: HTMLElement | null;
    status: HTMLElement | null;
    groupSelect: HTMLElement | null;
    newGroupName: HTMLElement | null;
    segmentInfo: HTMLElement | null;
    segmentEdit: HTMLElement | null;
    editTitle: HTMLElement | null;
    editStart: HTMLElement | null;
    editEnd: HTMLElement | null;
}

declare interface Segment {
  start: number,
  end: number,
  id: number,
  content? : string
  group: number,
  plugins?: Record<string,PluginAutocompleteValueDto[]>
}

declare interface AmaliaSegment {
  tclevel: number,
  tcin: number,
  tcout: number,
  data: {
    id: number,
    group: number,
    content? : string,
    plugins?: Record<string,PluginAutocompleteValueDto[]>
  }
}
