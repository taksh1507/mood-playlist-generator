'use client';

import { useState, useEffect } from 'react';
import { getTopTracks } from '@/app/lib/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function TopTracksPage() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('');

  useEffect(() => {
    loadTopTracks();
  }, []);

  const loadTopTracks = async () => {
    try {
      const response = await getTopTracks();
      setTracks(response.data.tracks);
      setSource(response.data.source);
    } finally {
      setLoading(false);
    }
  };

  const getAudioUrl = (track) => {
    if (!track) return '';
    if (track.file_url && track.file_url.startsWith('http')) {
      return track.file_url;
    }
    return `${API_BASE_URL}${track.file_url}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-gradient-to-r from-blue-600 via-teal-600 to-cyan-600 text-white shadow-2xl border-b border-cyan-500/20">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h1 className="text-5xl font-black mb-3 bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent">
            🔥 Top Tracks
          </h1>
          <p className="text-cyan-100 text-lg font-light">
            Most selected tracks across all playlists
          </p>
        </div>
      </header>

      <nav className="bg-slate-800/50 backdrop-blur border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-6 py-4 flex gap-8">
          <a href="/" className="text-slate-400 hover:text-cyan-300 font-semibold transition duration-300 pb-2">
            Home
          </a>
          <a href="/playlists" className="text-slate-400 hover:text-cyan-300 font-semibold transition duration-300 pb-2">
            🎬 Playlists
          </a>
          <a href="/top-tracks" className="text-cyan-400 font-semibold hover:text-cyan-300 transition duration-300 border-b-2 border-cyan-400 pb-2">
            🔥 Top Tracks
          </a>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-16">
        {source && (
          <div className="mb-8 inline-block bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-lg text-sm font-semibold text-white shadow-lg">
            Loaded from: <span className="capitalize">{source}</span>
          </div>
        )}

        {loading ? (
          <div className="text-center text-cyan-300 text-lg py-16">Loading top tracks...</div>
        ) : tracks.length === 0 ? (
          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-8 text-blue-200 text-center">
            No tracks yet. Start generating playlists to see top tracks!
          </div>
        ) : (
          <div className="space-y-6">
            {tracks.map((track, index) => (
              <div
                key={track._id}
                className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-lg p-6 hover:shadow-2xl hover:border-purple-400/60 transition duration-300 transform hover:scale-[1.02]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{track.title}</h3>
                        <p className="text-cyan-300 font-semibold">
                          Selected: <span className="text-lime-400">{track.selected_count} time{track.selected_count !== 1 ? 's' : ''}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-5xl">⭐</div>
                </div>
                <audio src={getAudioUrl(track)} controls className="w-full mt-4 rounded-lg" crossOrigin="anonymous" />
              </div>
            ))}
          </div>
        )}

        <button
          onClick={loadTopTracks}
          className="mt-12 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-3 rounded-lg font-semibold transition duration-300 shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105"
        >
          🔄 Refresh
        </button>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-center py-8 mt-20 border-t border-slate-700">
        <p className="font-light">Music Mood DJ • AI-Powered Playlist Generation</p>
      </footer>
    </div>
  );
}
