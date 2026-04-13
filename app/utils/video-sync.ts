/**
 * Video and timeline synchronization
 */

import AmaliaPlayerService from '~/services/amalia-player-service.js';
import { formatTimeDetailed, formatDate } from './utils';
import type {Timeline, TimelineEventPropertiesResult} from "vis-timeline/standalone"

export class VideoSync {

  public elements: VideoElements
  public timeline: Timeline
  public video: AmaliaPlayerService
  public playheadId: string
  public mediaPlayer : any


    constructor(_,timeline, elements : VideoElements,video: AmaliaPlayerService) {
        this.video = video
        this.timeline = timeline;
        this.elements = elements;
        this.playheadId = 'playhead';
        this.init()
    }

    init() {
        const players = this.video.getPlayers()
        this.timeline.addCustomTime(0, this.playheadId);
        this.timeline.setCustomTimeTitle('Position lecture', this.playheadId);
        this.mediaPlayer = players[0]?.mediaPlayerElement?.getMediaPlayer()
        const eventEmmitter = players[0]?.mediaPlayerElement?.eventEmitter
        eventEmmitter?.addListener('ina.player.TIME_CHANGE',() => this.onTimeUpdate() )

        // this.video.addEventListener('loadedmetadata', () => this.onMetadataLoaded());

        this.timeline.on('click', (props) => this.onTimelineClick(props));

    }

    onTimeUpdate() {
        const currentTime = this.video.callSeek()
        const currentMs = currentTime * 1000;
        this.timeline.setCustomTime(currentMs, this.playheadId);
        // this.elements.currentTime.textContent = formatTimeDetailed(currentMs);
    }

    onMetadataLoaded() {
        const durationMs = this.video.duration * 1000;
        this.elements.duration.textContent = formatTimeDetailed(durationMs);

        this.timeline.setOptions({
            max: durationMs,
            end: Math.min(durationMs, 120000)
        });
    }

    onTimelineClick(props: TimelineEventPropertiesResult ) {
        this.timeline.setCustomTime(props.time, this.playheadId);
        this.video.updateCurrentTc(formatDate(props.time))
    }

    getCurrentTimeMs() {
        return this.video.callSeek()
    }

    seekRelative = (seconds) => {
        const newTime = this.video.callSeek() + seconds
        this.video.updateCurrentTc(Math.max(0, Math.min(this.video.getDuration(), newTime)));
    }

    togglePlayPause() {
        if (this.video?.paused) {
            this.video.onPlay()
        } else {
            this.video.onPause();
        }
    }

}
