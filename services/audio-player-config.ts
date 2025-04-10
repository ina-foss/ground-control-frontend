export class AudioPlayerConfig {
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
    enableThumbnail: false,
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
          label: "Télécharger",
          control: "download",
          icon: "download",
          zone: 1,
          order: 2,
          data: {
            href: ""
          },
          priority: 3,
          key: 'd',
        },
        /*{
          "label": "Sous titres",
          "control": "subtitles",
          "icon": "subtitle",
          "zone": 3,
          "priority": 3
        },*/
        {
          label: 'Playback rate custom steps',
          control: 'playbackRateCustomSteps'
        },
        {
          label: 'Playback rate steps',
          control: 'playbackRateSteps'
        },
        {
          label: 'Capture',
          control: 'download',
          icon: 'screenshot',
          key: 'c',
          zone: 1,
          order: 2,
          data: {'tcParam': 'start', 'href': ''},
          priority: 1
        },
        {
          label: 'Playback Rate',
          control: 'playbackRate',
          zone: 1,
          priority: 1,
          order: 3
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
          label: 'Retour image par image',
          icon: 'backward-frame',
          control: 'backward-frame',
          zone: 2,
          priority: 1,
          key: 'ArrowLeft'
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
          label: 'Retour 1 seconde par 1 seconde',
          icon: 'backward-second',
          control: 'backward-second',
          zone: 2,
          priority: 1,
          key: 'ArrowLeft'
        },
        {
          label: 'Retour ralenti',
          icon: 'slow-backward',
          control: 'slow-backward',
          zone: 2,
          priority: 1,
          key: 'Control + Shift + ArrowLeft'
        },
        {
          label: 'Retour rapide',
          icon: 'backward',
          control: 'backward',
          zone: 2,
          priority: 1,
          key: 'Control + ArrowLeft'
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
          label: 'Avance ralentie',
          icon: 'slow-forward',
          control: 'slow-forward',
          zone: 2,
          priority: 1,
          key: 'Control + Shift + ArrowRight'
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
          label: 'Avance 1 seconde par 1 seconde',
          icon: 'forward-second',
          control: 'forward-second',
          zone: 2,
          priority: 1,
          key: 'ArrowRight'
        },
        {
          label: 'Avance image par image',
          icon: 'forward-frame',
          control: 'forward-frame',
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
          "label": "Aspect ratio",
          "control": "aspectRatio",
          "zone": 3,
          "priority": 3,
          "key": "a"
        },
        {
          label: 'Plus d\'options',
          control: 'menu',
          icon: 'dots',
          zone: 3,
          //priority: 1,
          //order: 1,
          key: 'r'
        },
        {
          label: 'Figer',
          control: 'pinControls',
          icon: 'pin',
          zone: 3,
          priority: 1,
          key: 'g',
        },
        {
          label: 'Afficher les vitesses',
          control: 'displaySlider',
          icon: 'slider',
          zone: 3,
          priority: 2,
          key: 'v',
        },
        {
          label: 'Afficher les vitesses',
          control: 'displaySlider',
          icon: 'slider',
          zone: 3,
          priority: 1,
          key: 'v',
        }

      ]
    },
    'HISTOGRAM-PLAYER': {
      metadataIds: ['waveform-1024-0', 'waveform-1024-1', 'waveform-4096-0', 'waveform-4096-1'],
    }
  };
}
