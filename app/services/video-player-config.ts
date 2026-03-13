export class VideoPlayerConfig {
  tcOffset = 0;
  player = {
    backwardsSrc: '',
    src: '',
    autoplay: false,
    hls: {
      enable: true,
      config: {
        maxBufferLength: 12,
        maxMaxBufferLength: 60,
        backBufferLength: 0,
        enableWorker: false
      }
    },
    crossOrigin: 'anonymous',
  };

  thumbnail = {
    baseUrl: '',
    enableThumbnail: true,
    tcParam: 'start'
  };
  dataSources = [];
  debug = true;
  logLevel = "debug";
  pluginsConfiguration = {
    'CONTROL_BAR-PLAYER': {
      data: [
        {
          label: 'Barre de progression',
          control: 'progressBar',
          priority: 1
        },
        {
          label: 'Aller au début du média',
          icon: 'backward-start',
          control: 'backward-start',
          zone: 2,
          priority: 1,
          key: 'Shift + ArrowLeft'
        },
        {
          label: 'Retour 5 secondes par 5 secondes',
          icon: 'backward-5seconds',
          control: 'backward-5seconds',
          zone: 2,
          priority: 1,
          key: 'ArrowLeft'
        },
        {
          label: 'Pause / Lire',
          control: 'playPause',
          zone: 2,
          priority: 1,
          key: 'espace'
        },
        {
          label: 'Avance rapide',
          icon: 'forward',
          control: 'forward',
          zone: 2,
          priority: 1,
          key: 'Control + ArrowRight'
        },
        {
          label: 'Avance 5 secondes par 5 secondes',
          icon: 'forward-5seconds',
          control: 'forward-5seconds',
          zone: 2,
          priority: 1,
          key: 'ArrowRight'
        },
        {
          label: 'Aller à la fin du média',
          icon: 'forward-end',
          control: 'forward-end',
          zone: 2,
          priority: 1,
          key: 'Shift + ArrowRight'
        },
        {
          label: 'Désactiver le son',
          control: 'volume',
          zone: 3,
          priority: 1,
          key: 'm',
          data: {'channelMergeVolume': false, 'channelMergerNode': ''},
        },
        {
          label: 'Plein écran',
          control: 'toggleFullScreen',
          icon: 'fullscreen',
          zone: 3,
          priority: 1,
          key: 'f'
        },
        {
          label: 'Figer',
          control: 'pinControls',
          icon: 'pin',
          zone: 3,
          priority: 1,
          order: 1,
          key: 'g',
        },
        {
          label: 'Afficher les vitesses',
          control: 'displaySlider',
          icon: 'slider',
          zone: 3,
          priority: 2,
          order: 1,
          key: 'v',
        },
        {
          label: 'Plus d\'options',
          control: 'menu',
          icon: 'dots',
          zone: 3,
          key: 'r'
        }

      ],
      pinnedControls: true,
    }
  };
}
