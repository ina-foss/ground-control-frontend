/**
 * Keyboard shortcuts handler
 */

export default class KeyboardShortcuts {

  public handlers: Record<string,()=>void>

   constructor(handlers: Record<string,()=>void>) {
        this.handlers = handlers;
        this.init()
    }

    init() {
        // first remove listener
        document.removeEventListener('keydown', (e) => this.handleKeydown(e));
        // then add it
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
    }

    handleKeydown(event: KeyboardEvent) {
        if (this.isInputFocused(event.target as HTMLElement)) {
            return;
        }

        const key = event.key.toLowerCase();
        const handler = this.getHandler(key, event.ctrlKey);
        // console.log(`Key ${key} pressed (${event.ctrlKey ? 'ctrl+' : ''}${key})`);
        if (handler) {
            event.preventDefault();
            handler();
        }
    }

    isInputFocused(target: HTMLElement) {
        return target.tagName === 'INPUT' || target.tagName === 'SELECT';
    }

    getHandler(key: string, ctrlKey : boolean){
        const {
            togglePlayPause,
            setTcIn,
            setTcOut,
            addSegment,
            duplicate,
            split,
            deleteSegment,
            save,
            seekBackward,
            seekForward,
            canSetTcOut
        } = this.handlers;

        const shortcuts = {
            ' ': togglePlayPause,
            'i': setTcIn,
            'o': () => canSetTcOut() && setTcOut(),
            'n': addSegment,
            'd': duplicate,
            's': ctrlKey ? save : split,
            'delete': deleteSegment,
            'backspace': deleteSegment,
            'arrowleft': seekBackward,
            'arrowright': seekForward
        };

        return shortcuts[key];
    }
}

