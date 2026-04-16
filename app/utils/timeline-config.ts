/**
 * Timeline configuration and initialization
 */
import type { TimelineOptions } from 'vis-timeline/standalone';
import { formatTime } from '~/utils/utils';

export const INITIAL_GROUPS = [
    { id: 1, content: "Thematique", style: "color: red" },
    { id: 2, content: "Mediatique", style: "color: #22c55e" },
    { id: 3, content: "Autres", style: "color: blue" },
];

export function createTimelineOptions(checkOverlapFn, duration: number): TimelineOptions {
    return {
        selectable: true,
        height: "100%",
        editable: {
            add: true,
            updateTime: false,
            updateGroup: false,
            remove: true
        },
        groupEditable: true,
        horizontalScroll: true,
        itemsAlwaysDraggable: { item: true, range: true },
        multiselect: true,
        zoomable: true,
        zoomMin: 1000,
        zoomMax: 1000 * 60 * 60,
        showCurrentTime: true,
        showMajorLabels: true,
        showMinorLabels: true,
        stack: false,
        snap: null,
        orientation: 'top',
        min: 0,
        max: duration,
        start: 0,
        end: duration,
        format: {
            minorLabels: (date) => formatTime(date.valueOf()),
            majorLabels: (date) => formatTime(date.valueOf(), true)
        },
        onAdd: (item, callback) => {
            item.content = "Nouveau segment";
            callback(item);
        },
        onMove: (item, callback) => {
            callback(checkOverlapFn(item) ? null : item);
        },
        onUpdate: (item, callback) =>{
            callback(item)
        }
    };
}
