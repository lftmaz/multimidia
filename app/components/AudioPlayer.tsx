'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Shuffle, 
  Repeat,
  Rewind,
  FastForward
} from 'lucide-react';

const tracks = [
  {
    id: 1,
    title: 'Body Splash',
    artist: 'Rey Vaqueiro',
    albumArt: '/foto.jpg',
    audioSrc: '/music/Body-Splash.mp3',
  },
  {
    id: 2,
    title: 'Centímentro',
    artist: 'Rey Vaqueiro',
    albumArt: '/foto2.jpg',
    audioSrc: '/music/Centimetro.mp3',
  },
  {
    id: 3,
    title: 'Nino Abravanel',
    artist: 'Rey Vaqueiro',
    albumArt: '/foto3.jpg',
    audioSrc: '/music/Nino-Abravanel.mp3',
  },
];

export default function AudioPlaye() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = tracks[currentTrackIndex];

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(prevIndex);
    setIsPlaying(true);
  };

  const handleSelectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };
  
  const handleForward = () => {
    if (audioRef.current) {
      const newTime = Math.min(audioRef.current.currentTime + 10, duration);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleRewind = () => {
    if (audioRef.current) {
      const newTime = Math.max(audioRef.current.currentTime - 10, 0);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = Number(e.target.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const duration = isNaN(timeInSeconds) ? 0 : timeInSeconds;
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Erro ao tocar:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(0);
    setDuration(0);

    const updateCurrentTime = () => setCurrentTime(audio.currentTime);
    const setAudioDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateCurrentTime);
    audio.addEventListener('loadedmetadata', setAudioDuration);

    if (isPlaying) {
      audio.play().catch(e => console.error("Erro ao carregar e tocar:", e));
    }

    return () => {
      audio.removeEventListener('timeupdate', updateCurrentTime);
      audio.removeEventListener('loadedmetadata', setAudioDuration);
    };
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div className="w-full max-w-xs rounded-2xl bg-slate-800 text-white shadow-2xl p-5 flex flex-col items-center">
        <img
          src={currentTrack.albumArt}
          alt="Capa do Álbum"
          className="w-full aspect-square object-cover rounded-lg shadow-lg mb-4"
        />
        <div className="text-center mb-5">
          <h2 className="text-xl font-bold">{currentTrack.title}</h2>
          <p className="text-sm text-gray-400">{currentTrack.artist}</p>
        </div>
        
        <div className="w-full space-y-1 mb-5">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-red-600"
          />
          <div className="flex justify-between text-xs font-mono text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-around w-full text-gray-300">
          <button className="hover:text-white transition-colors"><Shuffle size={20} /></button>
          
          <button onClick={handlePrev} className="hover:text-white transition-colors">
            <SkipBack size={24} />
          </button>
          
          <button onClick={handleRewind} className="hover:text-white transition-colors">
            <Rewind size={22} />
          </button>

          <button
            onClick={togglePlayPause}
            className="bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-transform transform hover:scale-110"
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
          </button>
          
          <button onClick={handleForward} className="hover:text-white transition-colors">
            <FastForward size={22} />
          </button>

          <button onClick={handleNext} className="hover:text-white transition-colors">
            <SkipForward size={24} />
          </button>

          <button className="hover:text-white transition-colors"><Repeat size={20} /></button>
        </div>

        <div className="w-full space-y-2 mt-6">
          <div className="flex items-center justify-center space-x-2">
            <Volume2 size={20} />
            <span className="font-mono text-xs">Volume: {Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-red-600"
          />
        </div>

        <audio
          ref={audioRef}
          src={currentTrack.audioSrc}
          onEnded={handleNext}
        />
      </div>

      <div className="w-full max-w-xs text-white">
        <h3 className="text-lg font-semibold mb-3 text-gray-300">Lista de Reprodução</h3>
        <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {tracks.map((track, index) => (
            <li
              key={track.id}
              onClick={() => handleSelectTrack(index)}
              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                index === currentTrackIndex
                  ? 'bg-red-600'
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              <img src={track.albumArt} alt={track.title} className="w-12 h-12 rounded object-cover" />
              <div>
                <p className="font-bold text-sm">{track.title}</p>
                <p className="text-xs text-gray-300">{track.artist}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}