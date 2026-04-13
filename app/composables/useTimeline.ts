import TimelineManager, { type TimelineParameters } from "~/utils/timeline-manager"

let timelineManager : TimelineManager | null

export default function useTimeline(parameters? : TimelineParameters) {
  if(!timelineManager) timelineManager = new TimelineManager(parameters)
  return timelineManager

}
