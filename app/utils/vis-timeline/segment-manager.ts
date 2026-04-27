/**
 * Segment management: CRUD operations, overlap detection
 */

// import { BusinessError, ErrorCode } from './errors.js';
//
import type { DataSet } from "vis-data"
import type {Timeline } from 'vis-timeline/standalone'
import type { VideoSync } from './video-sync'
import { EventEmitter } from "events"
import { reduceRight } from "lodash";

export interface SegmentManagerEvent {
  "split": [id: number];
  "fusion": [tc: number, newItem: any]
}

export class SegmentManager extends EventEmitter<SegmentManagerEvent> {

  public timeline: Timeline
  public items : DataSet<any,string>
  public idCounter : number
  public selectedGroup: number
  public sync : VideoSync

    constructor(items: DataSet<any,string>, timeline: Timeline,sync: VideoSync) {
        super()
        this.items = items;
        this.timeline = timeline;
        this.sync = sync;
        this.idCounter = this.items.length + 1 ;
        this.selectedGroup = 1;
    }

    setSelectedGroup(groupId) {
        this.selectedGroup = parseInt(groupId);
    }

    checkOverlap(newItem) {
        const allItems = this.items.get();
        for (const item of allItems) {
            if (item.id === newItem.id || item.group !== newItem.group) {
                continue;
            }

            const newStart = new Date(newItem.start).getTime();
            const newEnd = new Date(newItem.end).getTime();
            const itemStart = new Date(item.start).getTime();
            const itemEnd = new Date(item.end).getTime();

            if (newStart < itemEnd && newEnd > itemStart) {
                return true;
            }
        }
        return false;
    }

    getSegmentsByTime(time:number,group:number): Array<any>{
     return this.items.get({
        filter: (item):boolean => {
          return item.group == group && item.start <= time && item.end >= time;
        }
      });
    }


    add(startTime, duration = 10000) {
        const newItem = {
            id: this.idCounter++,
            group: this.selectedGroup,
            content: `Segment ${this.idCounter}`,
            start: startTime,
            end: startTime + duration
        };
        debugger
        if (this.checkOverlap(newItem)) {
            // throw new BusinessError(ErrorCode.SEGMENT_OVERLAP);
        }

        this.items.add(newItem);
        return newItem;
    }

    addWithRange(startTime, endTime) {
        if (endTime <= startTime) {
            // throw new BusinessError(ErrorCode.SEGMENT_TC_OUT_BEFORE_TC_IN);
        }

        const newItem = {
            id: this.idCounter++,
            group: this.selectedGroup,
            content: `Segment ${this.idCounter}`,
            start: startTime,
            end: endTime
        };
        debugger
        if (this.checkOverlap(newItem)) {
            // throw new BusinessError(ErrorCode.SEGMENT_OVERLAP);
        }

        this.items.add(newItem);
        return newItem;
    }

    duplicateSelected() {
        const selection = this.timeline.getSelection();
        if (selection.length === 0) {
            // throw new BusinessError(ErrorCode.SEGMENT_NO_SELECTION_DUPLICATE);
        }

        const duplicated = [];
        for (const id of selection) {
            const item = this.items.get(id);
            const duration = new Date(item.end).getTime() - new Date(item.start).getTime();
            const newItem = {
                id: this.idCounter++,
                group: item.group,
                content: `${item.content} (copie)`,
                start: new Date(item.end).getTime() + 1000,
                end: new Date(item.end).getTime() + 1000 + duration
            };

            if (!this.checkOverlap(newItem)) {
                this.items.add(newItem);
                duplicated.push(newItem);
            }
        }
        return duplicated;
    }

    /**
    * @brief Split an item from the timeline at the given time
    * @param splitTime optional - the time
    * @param itemId optional - the
    */
    splitItem(splitTime?: number, itemId?: number) {
        const selection = this.timeline.getSelection()?.[0];
        if ( selection == undefined && itemId == undefined ) {
            return
            // throw new BusinessError(ErrorCode.SEGMENT_NO_SELECTION_SPLIT);
        }

        const item = itemId ? this.items.get(itemId) : this.items.get(selection!);


        const newEnd = splitTime || (this.sync.getCurrentTimeMs() * 1000)

        const finalEnd = item.end as number

        this.items.update({ id: item.id, end: newEnd });

        const newItem = {
            ...item,
            id: this.idCounter++,
            start: newEnd,
            end: finalEnd
        };

        this.items.add(newItem);

       this.emit("split",newItem.id)
        return newItem;
    }

    // TODO: revoir les parametres, et faire en sorte que ca marche pour plus que 2  ;)
    fusionItems(...segments : any[] ){
      if(segments.length > 2) throw new Error("fusion isn't implement for more than 2 segment")
      if(segments.length < 2) throw new Error("Tried to fusion only one items, required at least 2", {cause: segments})
      const [leftSegment, rightSegment] = segments.sort(
        (a, b) => a.start - b.start,
      );
      const commonTc = leftSegment.end

      this.items.update({...rightSegment,start: leftSegment.start})

      this.items.remove(leftSegment)

      this.emit('fusion',commonTc,rightSegment)


    }

    deleteSelected() {
        const selection = this.timeline.getSelection();
        if (selection.length === 0) {
            // throw new BusinessError(ErrorCode.SEGMENT_NO_SELECTION_DELETE);
        }
        this.items.remove(selection);
    }

    fillGap() {
        const selection = this.timeline.getSelection();
        if (selection.length !== 1) {
            // throw new BusinessError(ErrorCode.SEGMENT_NO_SELECTION_FILL_GAP);
        }

        const selectedItem = this.items.get(selection[0]);
        const groupItems = this.items.get({
            filter: item => item.group === selectedItem.group && item.id !== selectedItem.id
        });

        const selectedStart = new Date(selectedItem.start).getTime();
        let previousEnd = 0;

        for (const item of groupItems) {
            const itemEnd = new Date(item.end).getTime();
            if (itemEnd < selectedStart && itemEnd > previousEnd) {
                previousEnd = itemEnd;
            }
        }

        if (previousEnd === 0) {
            // throw new BusinessError(ErrorCode.SEGMENT_NO_PREVIOUS_SEGMENT);
        }

        const gapSize = selectedStart - previousEnd;
        if (gapSize <= 100) {
            // throw new BusinessError(ErrorCode.SEGMENT_NO_SIGNIFICANT_GAP);
        }

        const newItem = {
            id: this.idCounter++,
            group: selectedItem.group,
            content: "Segment comblé",
            start: previousEnd + 1,
            end: selectedStart - 1
        };
        this.items.add(newItem);

        return newItem;
    }

    updateTimecodes(id, start, end) {
        if (isNaN(start) || isNaN(end) || start >= end) {
            // throw new BusinessError(ErrorCode.SEGMENT_INVALID_TIMECODES);
        }

        const updatedItem = { id, start, end };
        if (this.checkOverlap(updatedItem)) {
            // throw new BusinessError(ErrorCode.SEGMENT_OVERLAP);
        }

        this.items.update(updatedItem);
    }

    updateTitle(id, title) {
        if (!title || title.trim() === '') {
            // throw new BusinessError(ErrorCode.SEGMENT_EMPTY_TITLE);
        }
        this.items.update({ id, content: title.trim() });
    }

    clear() {
        this.items.clear();
        this.idCounter = 1;
    }

    loadItems(itemsData) {
        this.items.clear();
        this.items.add(itemsData);
        this.idCounter = Math.max(...itemsData.map(i => i.id)) + 1;
    }

    getAll() {
        return this.items.get();
    }
}
