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

    public configurePlayer(mediaSrc, metadataUrl, additionalConfig: {property: string, value: any} = null) {
        this.playerConfiguration = new PlayerConfig();
        this.playerConfiguration.player.src = mediaSrc;
        this.playerConfiguration.dataSources = [{
            url: metadataUrl,
            headers: [
                useService().$application.getDefaultHeader()
            ]
        }];

        this.playerConfiguration.debug = false;
        this.playerConfiguration.logLevel = 'trace';
        if (additionalConfig){
            this.playerConfiguration.player[additionalConfig.property] = additionalConfig.value;
        }
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
        console.log(player)

        // Create control bar
        const controlBar = document.createElement(AmaliaPlayerService.TAG_CONTROL_BAR);
        controlBar.setAttribute('player-id', playerId);
        player.setAttribute('config', JSON.stringify(this.playerConfiguration));
        player.appendChild(controlBar);


        return player;
    }

}
