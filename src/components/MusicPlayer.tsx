import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Upload, Music } from 'lucide-react';
import type { Song } from '../types';

export default function MusicPlayer() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      const audio = new Audio(url);
      
      audio.addEventListener('loadedmetadata', () => {
        const newSong: Song = {
          id: Math.random().toString(36).substr(2, 9),
          title: file.name.replace(/\.[^/.]+$/, ""),
          artist: 'Unknown Artist',
          duration: audio.duration,
          url: url
        };
        
        setSongs(prev => [...prev, newSong]);
      });
    });
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playNext = () => {
    if (currentSongIndex < songs.length - 1) {
      setCurrentSongIndex(prev => prev + 1);
    }
  };

  const playPrevious = () => {
    if (currentSongIndex > 0) {
      setCurrentSongIndex(prev => prev - 1);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    if (audioRef.current) {
      const time = (value / 100) * audioRef.current.duration;
      audioRef.current.currentTime = time;
      setProgress(value);
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value;
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [currentSongIndex]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Your Music Player</h1>
            <label className="flex items-center gap-2 px-4 py-2 bg-purple-600 rounded-lg cursor-pointer hover:bg-purple-700 transition-colors">
              <Upload size={20} />
              <span>Upload Music</span>
              <input
                type="file"
                accept="audio/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {songs.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center">
                  <Music size={48} className="text-purple-400" />
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-xl font-semibold">
                  {songs[currentSongIndex]?.title || 'No song selected'}
                </h2>
                <p className="text-gray-400">
                  {songs[currentSongIndex]?.artist || 'Unknown Artist'}
                </p>
              </div>

              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleProgressChange}
                  className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-400">
                  {audioRef.current && (
                    <>
                      <span>{formatTime(audioRef.current.currentTime)}</span>
                      <span>{formatTime(audioRef.current.duration)}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={playPrevious}
                  className="p-2 hover:text-purple-400 transition-colors"
                >
                  <SkipBack size={24} />
                </button>
                <button
                  onClick={togglePlayPause}
                  className="p-4 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors"
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button
                  onClick={playNext}
                  className="p-2 hover:text-purple-400 transition-colors"
                >
                  <SkipForward size={24} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Volume2 size={20} className="text-gray-400" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Music size={48} className="mx-auto mb-4" />
              <p>Upload some music to get started</p>
            </div>
          )}

          {songs.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Your Library</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {songs.map((song, index) => (
                  <div
                    key={song.id}
                    onClick={() => setCurrentSongIndex(index)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      currentSongIndex === index
                        ? 'bg-purple-600'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{song.title}</p>
                        <p className="text-sm text-gray-400">{song.artist}</p>
                      </div>
                      <span className="text-sm text-gray-400">
                        {formatTime(song.duration)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <audio
        ref={audioRef}
        src={songs[currentSongIndex]?.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={playNext}
      />
    </div>
  );
}