'use client';

import { useState, useRef, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function PlaylistPlayer({ tracks }) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (tracks && tracks.length > 0 && isPlaying) {
      // Auto-play when tracks change
      const timer = setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentTrackIndex, tracks, isPlaying]);

  const handlePlayNext = () => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    } else {
      setCurrentTrackIndex(0);
    }
  };

  const handlePlayPrev = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    } else {
      setCurrentTrackIndex(tracks.length - 1);
    }
  };

  const handleEnded = () => {
    handlePlayNext();
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const getAudioUrl = (track) => {
    if (!track) return '';
    if (track.file_url && track.file_url.startsWith('http')) {
      return track.file_url;
    }
    return `${API_BASE_URL}${track.file_url}`;
  };

  if (!tracks || tracks.length === 0) {
    return <p className="text-gray-500">No tracks in playlist</p>;
  }

  const currentTrack = tracks[currentTrackIndex];
  const audioUrl = getAudioUrl(currentTrack);

  return (
    <div className="bg-gradient-to-b from-purple-900 to-black rounded-lg p-8 text-white shadow-lg max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Now Playing</h2>
        <p className="text-lg text-purple-200">{currentTrack.title}</p>
        <p className="text-sm text-gray-400">
          Track {currentTrackIndex + 1} of {tracks.length}
        </p>
      </div>

      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={handleEnded}
        className="w-full mb-6"
        controls
        crossOrigin="anonymous"
      />

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={handlePlayPrev}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-semibold transition"
        >
          ⏮ Previous
        </button>
        <button
          onClick={togglePlay}
          className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-semibold transition"
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        <button
          onClick={handlePlayNext}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-semibold transition"
        >
          Next ⏭
        </button>
      </div>

      <div className="bg-black bg-opacity-50 rounded p-4 max-h-40 overflow-y-auto">
        <h3 className="font-semibold mb-2">Playlist:</h3>
        {tracks.map((track, index) => (
          <div
            key={index}
            onClick={() => {
              setCurrentTrackIndex(index);
              setIsPlaying(true);
            }}
            className={`p-2 rounded cursor-pointer transition ${
              index === currentTrackIndex
                ? 'bg-purple-600'
                : 'hover:bg-purple-500 bg-opacity-30'
            }`}
          >
            {index + 1}. {track.title}
          </div>
        ))}
      </div>
    </div>
  );
}
