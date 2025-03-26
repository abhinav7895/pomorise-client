export const musicTracks = [

  {
    name: "Ambient Focus",
    src: "https://8n5cq3g9tjckydmy.public.blob.vercel-storage.com/ambient-xK7iqq8cVO1fzzDbwscAQ5WDfTD7ed.mp3",
    type: "ambient"
  }
];

export class FocusMusicPlayer {
  private audio: HTMLAudioElement | null = null;
  private fadeInterval: number | null = null;
  private currentTrack: number = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audio = new Audio();
      this.audio.loop = true;
      this.setupAudio();
    }
  }

  private setupAudio() {
    if (!this.audio) return;
    
    this.audio.volume = 0.7;
    
    this.setTrack(0);
  }

  public setTrack(index: number) {
    if (!this.audio) return;
    
    this.currentTrack = index % musicTracks.length;
    this.audio.src = musicTracks[this.currentTrack].src;
    this.audio.load();
  }

  public play() {
    if (!this.audio) return;

    this.audio.play().catch(e => {
      console.log('Audio play failed:', e);
    });
  }

  public pause() {
    if (!this.audio) return;
    this.audio.pause();
  }

  public fadeOut(duration = 5000) {
    if (!this.audio || this.audio.paused || this.audio.volume === 0) return;
    
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
    }
    
    const startVolume = this.audio.volume;
    const steps = 20;
    const volumeStep = startVolume / steps;
    const intervalTime = duration / steps;
    
    let currentStep = 0;
    
    this.fadeInterval = window.setInterval(() => {
      currentStep++;
      
      if (currentStep >= steps) {
        if (this.audio) {
          this.audio.volume = 0;
          this.audio.pause();
        }
        if (this.fadeInterval) {
          clearInterval(this.fadeInterval);
          this.fadeInterval = null;
        }
        return;
      }
      
      if (this.audio) {
        this.audio.volume = Math.max(0, startVolume - (volumeStep * currentStep));
      }
    }, intervalTime);
  }

  public fadeIn(duration = 2000) {
    if (!this.audio) return;
    
    this.audio.volume = 0;
    
    this.play();
    
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
    }
    
    const targetVolume = 0.7;
    const steps = 20;
    const volumeStep = targetVolume / steps;
    const intervalTime = duration / steps;
    
    let currentStep = 0;
    
    this.fadeInterval = window.setInterval(() => {
      currentStep++;
      
      if (currentStep >= steps) {
        if (this.audio) {
          this.audio.volume = targetVolume;
        }
        if (this.fadeInterval) {
          clearInterval(this.fadeInterval);
          this.fadeInterval = null;
        }
        return;
      }
      
      if (this.audio) {
        this.audio.volume = Math.min(targetVolume, volumeStep * currentStep);
      }
    }, intervalTime);
  }

  public getIsPlaying(): boolean {
    if (!this.audio) return false;
    return !this.audio.paused;
  }

  public getCurrentTrack() {
    return musicTracks[this.currentTrack];
  }

  public nextTrack() {
    this.setTrack(this.currentTrack + 1);
    if (this.getIsPlaying()) {
      this.play();
    }
  }
}

let playerInstance: FocusMusicPlayer | null = null;

export const getFocusMusicPlayer = (): FocusMusicPlayer => {
  if (!playerInstance) {
    playerInstance = new FocusMusicPlayer();
  }
  return playerInstance;
};
