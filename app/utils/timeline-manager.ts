/**
 * Main application: initialization and coordination
 */

import {DataSet} from 'vis-data'
import { Timeline } from "vis-timeline/standalone"
import {createTimelineOptions, INITIAL_GROUPS} from './timeline-config';
import {SegmentManager, type SegmentManagerEvent} from './segment-manager';
// import {BusinessError, ErrorCode} from './errors.js';
// import {GroupManager} from './group-manager.js';
// import {PersistenceManager} from './persistence.js';
import {VideoSync} from './video-sync';
import AmaliaPlayerService from "~/services/amalia-player-service";
import { media } from "happy-dom/lib/PropertySymbol";
// import {QuickCreateMode} from './quick-create.js';
// import {UIController} from './ui-controller.js';
import KeyboardShortcuts from './keyboard-shortcuts';
import { EventEmitter } from "events"
import { usePlayer } from "~/composables/usePlayer";

export type TimelineParameters =  {
  handlers : Record<string,void> | undefined
}

type TimelineEvent = {
  "select" : [event: {items: number[], event: Event}]
}

export default class TimelineManager extends EventEmitter<SegmentManagerEvent & TimelineEvent> {

  public elements: VideoElements
  public timeline: Timeline
  public groups: DataSet
  public items: DataSet<{id:number,group:number,start:number,end:number},"id">
  public videoSync: VideoSync
  public video: AmaliaPlayerService
  public keyboard: KeyboardShortcuts
  public segmentManager : SegmentManager


    constructor( parameters? : TimelineParameters ) {
        super()
        this.elements = this.getElements();
        const playerOrPromise = usePlayer()
        if( playerOrPromise instanceof Promise){
          playerOrPromise.then((instance)=>{
            this.video = instance
            this.elements = this.getElements();
            this.initTimeline(parameters)
          })
        }
        else{
            this.video = playerOrPromise
            this.elements = this.getElements();
            this.initTimeline()
        }
  }

  forwardAllEvents(source: EventEmitter, target: EventEmitter) {
    const originalEmit = source.emit.bind(source);
    source.emit = (event: string, ...args: any[]) => {
      target.emit(event, ...args); // forward to target
      return originalEmit(event, ...args); // still emit on source
    };
  }


    initTimeline( parameters?: TimelineParameters){
        const mediaDurationMs = this.video.getDuration()
        this.initDatasets(mediaDurationMs);
        this.timeline = this.createTimelineElement(mediaDurationMs);
        this.videoSync = new VideoSync(this.elements.video,this.timeline,this.elements,this.video);
        this.segmentManager = new SegmentManager(this.items,this.timeline,this.videoSync)
        this.initShortcuts(parameters?.handlers)
        this.forwardAllEvents(this.segmentManager,this)
        this.timeline.on('select',(event) => this.emit('select',event))
        // this.initModules();
        // this.bindcvents();
        // this.checkAutosave();
  }

    getElements() : VideoElements {
        return {
            video: document.getElementById('PLAYER'),
            container: document.getElementById('visualization'),
            currentTime: document.getElementById('current-time'),
            duration: document.getElementById('duration'),
            btnTcIn: document.getElementById('btn-tc-in'),
            btnTcOut: document.getElementById('btn-tc-out'),
            status: document.getElementById('creation-status'),
            groupSelect: document.getElementById('group-select'),
            newGroupName: document.getElementById('new-group-name'),
            segmentInfo: document.getElementById('segment-info'),
            segmentEdit: document.getElementById('segment-edit'),
            editTitle: document.getElementById('edit-title'),
            editStart: document.getElementById('edit-start'),
            editEnd: document.getElementById('edit-end')
        };
    }

    initDatasets(duration: number) {
        this.groups = new DataSet(INITIAL_GROUPS);
        const fillingTimelineItems = new Set(INITIAL_GROUPS.map((group)=>({id:group.id, group:group.id,start: 0, end: duration })))
        this.items = new DataSet([...fillingTimelineItems.keys()]);
    }

    createTimelineElement(duration: number) {
        // const checkOverlap = (item) => this.segmentManager?.checkOverlap(item) ?? false;
        const options = createTimelineOptions(false,duration);
        if(!this.elements.container) throw new Error('vis-timeline could not be loaded, missing timeline container')
        return  new Timeline(
            this.elements.container,
            this.items,
            this.groups,
            options
        );
    }

    initShortcuts(handlers?: Record<string,void>){
        this.keyboard = new KeyboardShortcuts({
            togglePlayPause: this.videoSync.togglePlayPause,
            // setTcIn:  this.quickCreate.setTcIn(),
            // setTcOut: this.quickCreate.setTcOut(),
            // canSetTcOut: this.quickCreate.isActive(),
            addSegment:this.addSegment,
            duplicate: this.duplicateSelected,
            split: this.splitSelected,
            deleteSegment: this.deleteSelected,
            // save: this.saveData(),
            seekBackward: this.videoSync.seekRelative(-5),
            seekForward:this.videoSync.seekRelative(5),
            ...(handlers ?? {})
        });
  }

    initModules() {
        this.segmentManager = new SegmentManager(this.items, this.timeline);
        this.groupManager = new GroupManager(this.groups, () => this.refreshGroupSelect());
        this.persistence = new PersistenceManager(this.segmentManager, this.groups);

        this.videoSync = new VideoSync(this.elements.video, this.timeline, {
            currentTime: this.elements.currentTime,
            duration: this.elements.duration
        });

        this.quickCreate = new QuickCreateMode(this.segmentManager, this.videoSync, {
            btnTcIn: this.elements.btnTcIn,
            btnTcOut: this.elements.btnTcOut,
            status: this.elements.status
        });

        this.uiController = new UIController(this.timeline, this.items, this.segmentManager, {
            segmentInfo: this.elements.segmentInfo,
            segmentEdit: this.elements.segmentEdit,
            editTitle: this.elements.editTitle,
            editStart: this.elements.editStart,
            editEnd: this.elements.editEnd
        });

        this.videoSync.init();
        this.uiController.init();
        this.keyboard.init();
        this.persistence.startAutosave();
    }


    bindEvents() {
        this.elements.groupSelect.addEventListener('change', (e) => {
            this.selectGroup(e.target.value);
        });

        this.elements.newGroupName.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.addGroup();
            }
        });

        // Click on timeline to select group
        this.timeline.on('click', (props) => {
            if (props.group !== null && props.group !== undefined) {
                this.selectGroup(props.group);
            }
        });

        this.refreshGroupSelect();
    }

    selectGroup(groupId) {
        const id = parseInt(groupId);
        this.segmentManager.setSelectedGroup(id);
        this.elements.groupSelect.value = id;
        this.highlightSelectedGroup(id);
    }

    highlightSelectedGroup(groupId) {
        // Update group styles to show selection
        const allGroups = this.groupManager.getAll();
        const updatedGroups = allGroups.map(group => ({
            ...group,
            className: group.id === groupId ? 'selected-group' : ''
        }));
        this.groups.update(updatedGroups);
    }

    refreshGroupSelect() {
        const select = this.elements.groupSelect;
        const currentValue = select.value;

        select.innerHTML = '';

        for (const group of this.groupManager.getAll()) {
            const option = document.createElement('option');
            option.value = group.id;
            option.textContent = group.content;
            select.appendChild(option);
        }

        if (currentValue && select.querySelector(`option[value="${currentValue}"]`)) {
            this.selectGroup(currentValue);
        } else if (select.options.length > 0) {
            this.selectGroup(select.options[0].value);
        }
    }

    checkAutosave() {
        const autosave = this.persistence.checkAutosave();
        if (autosave) {
            const message = `Restaurer la session précédente du ${autosave.timestamp.toLocaleString()}?`;
            if (confirm(message)) {
                autosave.restore();
            }
        }
    }

    // Public API for HTML buttons
    addGroup() {
        try {
            const input = this.elements.newGroupName;
            const newGroup = this.groupManager.add(input.value);
            input.value = '';
            this.elements.groupSelect.value = newGroup.id;
            this.segmentManager.setSelectedGroup(newGroup.id);
        } catch (error) {
            alert(error.message);
        }
    }

    addSegment = () => {
        try {
            this.segmentManager.add(this.videoSync.getCurrentTimeMs());
        } catch (error) {
            alert(error.message);
        }
    }

    duplicateSelected = () => {
        try {
            this.segmentManager.duplicateSelected();
        } catch (error) {
            alert(error.message);
        }
    }

    splitSelected = () => {
        try {
            this.segmentManager.splitItem();
        } catch (error) {
          throw new Error(error)
        }
    }

    deleteSelected = () => {
        try {
            this.segmentManager.deleteSelected();
        } catch (error) {
            alert(error.message);
        }
    }

    fillGap() {
        try {
            this.segmentManager.fillGap();
        } catch (error) {
            alert(error.message);
        }
    }

    setTcIn() {
        this.quickCreate.setTcIn();
    }

    setTcOut() {
        this.quickCreate.setTcOut();
    }

    saveData() {
        this.persistence.save();
        alert("Données sauvegardées!");
    }

    loadData() {
        try {
            const timestamp = this.persistence.load();
            if (timestamp) {
                alert(`Données chargées (sauvegarde du ${timestamp.toLocaleString()})`);
            } else {
                throw new BusinessError(ErrorCode.PERSISTENCE_NO_SAVE_FOUND);
            }
        } catch (error) {
            alert(error.message);
        }
    }

    exportData() {
        this.persistence.exportToJson();
    }

    clearData() {
        if (confirm("Voulez-vous vraiment effacer tous les segments?")) {
            this.persistence.clear();
        }
    }

    updateSegment() {
        this.uiController.updateSelectedSegment();
    }

    zoomIn() {
        this.timeline.zoomIn(0.5);
    }

    zoomOut() {
        this.timeline.zoomOut(0.5);
    }

    fitTimeline() {
        this.timeline.fit();
    }
}
