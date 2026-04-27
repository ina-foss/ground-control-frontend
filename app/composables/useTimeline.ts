import TimelineManager, { type TimelineParameters } from "~/utils/vis-timeline/timeline-manager"

let timelineManager : TimelineManager | null

export default function useTimeline(parameters? : TimelineParameters) {
  if(!timelineManager) timelineManager = new TimelineManager(parameters)
  return timelineManager

}
