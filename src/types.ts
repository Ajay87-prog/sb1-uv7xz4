export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
}

export interface PlaylistState {
  songs: Song[];
  currentSongIndex: number;
  isPlaying: boolean;
  volume: number;
  progress: number;
}