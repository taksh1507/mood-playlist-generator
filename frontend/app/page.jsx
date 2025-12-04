'use client';

import { useState } from 'react';
import TrackUpload from '@/app/components/TrackUpload';
import TrackList from '@/app/components/TrackList';
import MoodPlaylistGenerator from '@/app/components/MoodPlaylistGenerator';

export default function Home() {
  const [tracksUpdated, setTracksUpdated] = useState(0);

  const handleTrackUploaded = () => {
    setTracksUpdated(tracksUpdated + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-gradient-to-r from-blue-600 via-teal-600 to-cyan-600 text-white shadow-2xl border-b border-cyan-500/20">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h1 className="text-5xl font-black mb-3 bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent">
            🎵 Music Mood DJ
          </h1>
          <p className="text-cyan-100 text-lg font-light">
            Upload music, describe your vibe, and let AI craft your perfect playlist
          </p>
        </div>
      </header>

      <nav className="bg-slate-800/50 backdrop-blur border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-6 py-4 flex gap-8">
          <a href="/" className="text-cyan-400 font-semibold hover:text-cyan-300 transition duration-300 border-b-2 border-cyan-400 pb-2">
            Home
          </a>
          <a href="/playlists" className="text-slate-400 hover:text-cyan-300 font-semibold transition duration-300 pb-2">
            🎬 Playlists
          </a>
          <a href="/top-tracks" className="text-slate-400 hover:text-cyan-300 font-semibold transition duration-300 pb-2">
            🔥 Top Tracks
          </a>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <TrackUpload onTrackUploaded={handleTrackUploaded} />
          </div>

          <div className="lg:col-span-2 space-y-8">
            <MoodPlaylistGenerator />
            <TrackList key={tracksUpdated} />
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 text-center py-8 mt-20 border-t border-slate-700">
        <p className="font-light">Music Mood DJ • AI-Powered Playlist Generation</p>
      </footer>
    </div>
  );
}
