export function convertDatasetToAmalia(visSegments: Segment[]): AmaliaSegment[] {
  return visSegments.map(segment => ({
    tclevel: 1,
    tcin: segment.start,
    tcout: segment.end,
    data: {
      id: segment.id,
      group: segment.group,
      plugins: segment.plugins,
      content: segment.content
    }
  }))
}

export function convertAmaliaToDataset(amaliaSegments: AmaliaSegment[]): Segment[] {
  return amaliaSegments.map(amaliaSegment => ({
    start: amaliaSegment.tcin,
    end: amaliaSegment.tcout,
    ...amaliaSegment.data,
  }))
}

export function extractVideoSegments(block){
  if(!block) return []
  return convertAmaliaToDataset(block.localisation[0].sublocalisations.localisation)
}
