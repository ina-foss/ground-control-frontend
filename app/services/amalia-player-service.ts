import {VideoPlayerConfig} from './video-player-config';
import {AudioPlayerConfig} from "./audio-player-config";

export default class AmaliaPlayerService {
  public static TAG_PLAYER_TAG = 'amalia-player';
  public static TAG_CONTROL_BAR = 'amalia-control-bar';
  public static TAG_HISTOGRAM = 'amalia-histogram';
  public player!: HTMLElement;
  /**
   * True when source loaded
   */
  private sourceLoaded = false;
  public playerConfiguration: any;

  public serviceReady : Promise<void>

  public mediaPlayerElement  = null

  public playerContainer: HTMLElement | undefined
  public  playerId: string | null = null
  public  src: string | null = null
  public media_params: any
  public dynamicTumbnails: string | null = null
  public downloadUrl: string | null = null
  public dynamicBackwardsSrc: string | null = null
  public media_type: string | null = null
  public mediaType:string | null = null
  public waveformUrl:string | null = null
  public customConfig?:Array<string> | null = null

  public constructor(playerContainer: HTMLElement, playerId: string, src: string,media_params:any,dynamicTumbnails:string,downloadUrl:string,mediaType:string,waveformUrl:string,dynamicBackwardsSrc:string,media_type:string,customConfig?:Array<string>){

    const rejectTimeout = setTimeout(() => {
      clearInterval(interval)
      reject(new Error('AmaliaPlayerService: timed out waiting for mediaElement'))
    }, 15000)

    // update serviceReady when mediaPlayerElement exists
    this.serviceReady = new Promise((resolve)=>{
      const interval =  setInterval(()=>{
        if ( this.getPlayers()?.[0]?.mediaPlayerElement?.getMediaPlayer()?.mediaElement?.duration ){
          clearInterval(interval)
          clearTimeout(rejectTimeout)
          this.mediaPlayerElement = this.getPlayers()[0].mediaPlayerElement
          resolve()
        }
      },50)

      // add player to the DOM
      const playerElement = this.createPlayer(playerId, src,media_params,dynamicTumbnails ,downloadUrl, mediaType,waveformUrl,dynamicBackwardsSrc,media_type,customConfig);
      playerContainer.appendChild(playerElement)

      this.playerContainer = playerContainer
      this.playerId = playerId
      this.customConfig = customConfig
      this.downloadUrl = downloadUrl
      this.waveformUrl = waveformUrl
      this.dynamicBackwardsSrc = dynamicBackwardsSrc
      this.media_type = media_type
      this.mediaType = mediaType
      this.src = src
      this.dynamicTumbnails = dynamicTumbnails

    })

  }

  waitUntilServiceReady(): Promise<void> {
    return this.serviceReady
  }

  public reloadConfig(newConfig: Array<string>){
    const updatedPlayer = this.createPlayer(this.playerId, this.src,this.media_params,this.dynamicTumbnails ,this.downloadUrl, this.mediaType,this.waveformUrl,this.dynamicBackwardsSrc,this.media_type,newConfig);
    this.playerContainer.removeChild(this.playerContainer.firstChild);
    this.playerContainer?.appendChild(updatedPlayer)
  }

  private loadSource() {
    if (this.sourceLoaded) {
      return;
    }
    const base = document.createElement('base')
    base.href = '/amalia/'
    document.body.appendChild(base)
    const script = document.createElement('script');
    script.setAttribute('type', 'module');
    script.src = 'amalia.min.js';
    document.body.appendChild(script);
    this.sourceLoaded = true;
  }

  public configurePlayer(mediaSrc: string, urlStreamPlayBack?: string, thumbnailBaseUrl?: string, mediaType?: string,
                         aspectRatio?: string, audioTracks?: Array<{
      track: number,
      language: string,
      isDefault: boolean
    }>, tcOffset = 0, startTc = 0,waveformUrl?:string,
                         media_type?:string,customConfig?:Array<string>) {
    this.playerConfiguration = mediaType == 'video' ? new VideoPlayerConfig() : new AudioPlayerConfig();
    this.playerConfiguration.player.src = mediaSrc;
    this.playerConfiguration.player.hls.config.startPosition = Math.max(0, startTc);
    if(media_type ===MediaType.HLS){
      this.playerConfiguration.player.hls.enable= true;
    }
    if (urlStreamPlayBack) {
      this.playerConfiguration.player.backwardsSrc = urlStreamPlayBack;
    }
    this.playerConfiguration.tcOffset = tcOffset;
    this.playerConfiguration.debug = false;
    this.playerConfiguration.logLevel = 'info';
    this.playerConfiguration.displaySizes = {
      large: 300,
      medium: 300,
      small: 300,
      xsmall: 340
    };
    this.playerConfiguration.dataSources = [];
    if (mediaType != '') {
      if (mediaType === 'video') {
        this.playerConfiguration.player.ratio = aspectRatio;
      } else {
        this.updateControlbarConfig('backward-5seconds');
        this.updateControlbarConfig('forward-5seconds');
        this.updateControlbarConfig('aspectRatio');
      }
      if(customConfig){
        customConfig.forEach(x=>{
          this.updateControlbarConfig(x);
        })
      }
    }
    if ((thumbnailBaseUrl && thumbnailBaseUrl !== '')) {
      this.playerConfiguration.thumbnail.baseUrl = `${thumbnailBaseUrl}?width=320`;
    }
    if (mediaType === 'audio' && waveformUrl != '') {
      this.configPlayerAudio(waveformUrl);
    }
    if (audioTracks && audioTracks.length > 0) {
      const configAudioTrack = []
      for (let i = 0; i < audioTracks.length; i++) {
        configAudioTrack.push({track: audioTracks[i].track, label: audioTracks[i].language})
      }
      this.playerConfiguration.pluginsConfiguration["CONTROL_BAR-PLAYER"].data.find((x: any) => x.control == 'volume').data.tracks = configAudioTrack;
    }

  }
  private configPlayerAudio(waveformUrl: string): void {
    this.playerConfiguration.dataSources.push({ 'url': waveformUrl + '?canal=0&format=1024&mid=waveform-1024-0' });
    this.playerConfiguration.dataSources.push({ 'url': waveformUrl + '?canal=1&format=1024&mid=waveform-1024-1' });
    this.playerConfiguration.dataSources.push({ 'url': waveformUrl + '?canal=0&format=4096&mid=waveform-4096-0' });
    this.playerConfiguration.dataSources.push({ 'url': waveformUrl + '?canal=1&format=4096&mid=waveform-4096-1' });
  }

  private updateControlbarConfig(controlName: string) {
    let elementIndex= this.playerConfiguration.pluginsConfiguration["CONTROL_BAR-PLAYER"].data.findIndex((x: any) => x.control == controlName);

    this.playerConfiguration.pluginsConfiguration["CONTROL_BAR-PLAYER"].data.splice(elementIndex, 1);
  }


  public createPlayer(playerId: string,
                      src: string,
                      media_params:any,
                      dynamicTumbnails:string,
                      downloadUrl:string,
                      mediaType:string,
                      waveformUrl:string,
                      dynamicBackwardsSrc:string,
                      media_type:string,
                      customConfig?:Array<string>): HTMLElement {
    this.loadSource();
    if (!this.playerConfiguration || customConfig) {
      this.configurePlayer(src,dynamicBackwardsSrc,dynamicTumbnails,mediaType,undefined,
          undefined,media_params?.tc_offset,undefined,waveformUrl,media_type,customConfig)
    }
    // Create web component
    this.player = document.createElement(AmaliaPlayerService.TAG_PLAYER_TAG);
    this.player.setAttribute('player-id', playerId);
    this.player.setAttribute('id', `ajs-${playerId}`);
    this.player.setAttribute('config', JSON.stringify(this.playerConfiguration));
    this.player.setAttribute('class', `${'timebar'}`);
    // Create control bar
    const controlBar = document.createElement(AmaliaPlayerService.TAG_CONTROL_BAR);
    controlBar.setAttribute('player-id', playerId);
    this.player.appendChild(controlBar);
    //Create histogram
    if (mediaType ==="audio") {
      this.createHistogram(this.player,playerId);
    }
    return this.player;
  }

  public createHistogram(player: HTMLElement,playerId: string): void {
    const histogram = document.createElement(AmaliaPlayerService.TAG_HISTOGRAM);
    histogram.setAttribute('player-id', playerId);
    this.player.appendChild(histogram);
  }

  public getPlayers(){
    this.player = document.getElementById('PLAYER') as HTMLElement;

    if (!this.player) {
      console.error("L'élément avec l'ID 'PLAYER' n'a pas été trouvé.");
      return null;
    }

    const players: any = this.player.getElementsByTagName(AmaliaPlayerService.TAG_PLAYER_TAG);

    if (players.length === 0) {
      return null;
    }
    return players;
  }

  /**
  * Return the current time of the Amalia player
  * @return {number} A float that represents the position of the player in second
  * @example 214.1403 which represent 00:03:34.1403
  */
  public callSeek(): number | undefined {
    const players = this.getPlayers()
    if(players){
      return players[0]?.mediaPlayerElement?.getMediaPlayer().getCurrentTime();
    }
  }

  public getDuration(
    {inMs}:{
      /** Whether you want the returned value in seconds or milliseconds */
      inMs?: boolean
    } = {}){
    const durationInMs = this.getPlayers()[0]?.mediaPlayerElement?.getMediaPlayer()?.getDuration()
    return inMs ? durationInMs : durationInMs * 1000
  }


  public updateCurrentTc(tc: number) {
    const players = this.getPlayers()
    players[0].mediaPlayerElement.getMediaPlayer().setCurrentTime(tc);
  }

  public onPause() {
    const players = this.getPlayers()
    players[0].mediaPlayerElement.getMediaPlayer().pause();
  }

  /**
  * Launch amalia player's playback
  */
  public async onPlay() {
    const player = this.getPlayers()?.[0]
    if(player){
      try{
        await player.mediaPlayerElement.getMediaPlayer().play()
      }
      catch (e:any){
      }
    }
  }

}
