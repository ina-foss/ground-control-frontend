import {PlayerConfig} from './player-config';
import { useService } from '../composables/useService'

export default class AmaliaPlayerService {
    public static TAG_PLAYER_TAG = 'amalia-player';
    public static TAG_CONTROL_BAR = 'amalia-control-bar';
    public static TAG_TIMELINE = 'amalia-timeline';
    public static TAG_SLIDER = 'amalia-time-bar';


    /**
     * True when source loaded
     */
    private sourceLoaded = false;
    public playerConfiguration: any;

    private loadSource() {
        if (this.sourceLoaded) {
            return;
        }
        const script = document.createElement('script');
        script.setAttribute('type', 'module');
        script.src = '/_nuxt/app/node_modules/@ina/amalia/amalia.min.js';
        document.body.appendChild(script);
        this.sourceLoaded = true;
    }

  public configurePlayer(mediaSrc: string, urlStreamPlayBack?: string, thumbnailBaseUrl?: string, mediaType?: string,
                         downloadUrl?: string, aspectRatio?: string, audioTracks?: Array<{
      track: number,
      language: string,
      isDefault: boolean
    }>, tcOffset = 0, startTc = 0) {
    this.playerConfiguration = new PlayerConfig()//mediaType == 'video' ? new VideoPlayerConfig() : new AudioPlayerConfig();

    this.playerConfiguration.player.src = mediaSrc;
    this.playerConfiguration.player.hls.config.startPosition = Math.max(0, startTc);
    if (urlStreamPlayBack) {
      this.playerConfiguration.player.backwardsSrc = urlStreamPlayBack;
    }
    this.playerConfiguration.tcOffset = tcOffset;
    this.playerConfiguration.debug = false;
    this.playerConfiguration.logLevel = 'info';
    this.playerConfiguration.displaySizes = {
      large: 900,
      medium: 700,
      small: 550,
      xsmall: 340
    };
    this.playerConfiguration.dataSources = [];
    if (mediaType != '') {
      if (mediaType === 'video') {
        this.updateControlbarConfig('backward-second');
        this.updateControlbarConfig('forward-second');
        this.playerConfiguration.player.ratio = aspectRatio;
      } else {
        this.updateControlbarConfig('backward-5seconds');
        this.updateControlbarConfig('forward-5seconds');
        this.updateControlbarConfig('backward-frame');
        this.updateControlbarConfig('forward-frame');
        this.updateControlbarConfig('screenshot');
        this.updateControlbarConfig('aspectRatio');
        this.updateControlbarConfig('subtitles');
      }
    }
    if (downloadUrl != '') {
      this.playerConfiguration.pluginsConfiguration["CONTROL_BAR-PLAYER"].data.find((x: any) => x.control == 'download').data.href = downloadUrl;
    }
    if ((thumbnailBaseUrl && thumbnailBaseUrl !== '')) {
      this.playerConfiguration.thumbnail.baseUrl = `${thumbnailBaseUrl}?width=320`;
      if (mediaType === 'video') {
        this.playerConfiguration.pluginsConfiguration['CONTROL_BAR-PLAYER'].data.find((x: any) => x.icon === 'screenshot').data.href = thumbnailBaseUrl;
      }
    }
    if (audioTracks && audioTracks.length > 0) {
      const configAudioTrack = []
      for (let i = 0; i < audioTracks.length; i++) {
        configAudioTrack.push({track: audioTracks[i].track, label: audioTracks[i].language})
      }
      this.playerConfiguration.pluginsConfiguration["CONTROL_BAR-PLAYER"].data.find((x: any) => x.control == 'volume').data.tracks = configAudioTrack;
    }

  }
  private updateControlbarConfig(controlName: string) {
    let elementIndex;
    if (controlName == 'screenshot') {
      elementIndex = this.playerConfiguration.pluginsConfiguration["CONTROL_BAR-PLAYER"].data.findIndex((x: any) => x.icon == controlName);
    } else {
      elementIndex = this.playerConfiguration.pluginsConfiguration["CONTROL_BAR-PLAYER"].data.findIndex((x: any) => x.control == controlName);
    }
    this.playerConfiguration.pluginsConfiguration["CONTROL_BAR-PLAYER"].data.splice(elementIndex, 1);
  }

    public createPlayer(playerId: string, src: string): HTMLElement {
        this.loadSource();
        if( !this.playerConfiguration){
          this.configurePlayer(src)
          console.log(this.playerConfiguration)
        }
        // Create web component
        const player = document.createElement(AmaliaPlayerService.TAG_PLAYER_TAG);
        player.setAttribute('player-id', playerId);
        player.setAttribute('id', `ajs-${playerId}`);
        player.setAttribute('config', JSON.stringify(this.playerConfiguration));
        player.setAttribute('class', `${'timebar'}`);


      // Create control bar
        const controlBar = document.createElement(AmaliaPlayerService.TAG_CONTROL_BAR);
        controlBar.setAttribute('player-id', playerId);
        player.appendChild(controlBar);
        return player;
    }

}
