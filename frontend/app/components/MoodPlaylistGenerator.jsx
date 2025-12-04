'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generatePlaylist } from '@/app/lib/api';
import PlaylistPlayer from './PlaylistPlayer';

export default function MoodPlaylistGenerator() {
  const [mood, setMood] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [playlist, setPlaylist] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const router = useRouter();

  const handleGeneratePlaylist = async (e) => {
    e.preventDefault();
    if (!mood.trim()) {
      setError('Please enter a mood');
      return;
    }

    setLoading(true);
    setError('');
    setPlaylist(null);
    setShowPlayer(false);

    try {
      const response = await generatePlaylist(mood);
      setPlaylist(response.data.playlist);
      setShowPlayer(true);
      setMood('');
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Failed to generate playlist. Make sure tracks are uploaded.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewInStore = () => {
    router.push('/playlists');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 via-teal-600 to-cyan-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-4">✨ Generate Playlist by Mood</h2>
        
        <form onSubmit={handleGeneratePlaylist} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Describe Your Mood
            </label>
            <input
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="e.g., Happy and energetic, Calm and relaxing, Sad and introspective..."
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white/20 text-white font-bold py-3 rounded-lg hover:bg-white/30 disabled:opacity-50 transition backdrop-blur"
          >
            {loading ? 'Generating Playlist...' : 'Generate Playlist ✨'}
          </button>
        </form>

        {error && (
          <div className="mt-4 bg-red-500 bg-opacity-20 border border-red-400 text-red-200 px-4 py-3 rounded">
            {error}
          </div>
        )}
      </div>

      {playlist && showPlayer && (
        <div className="space-y-4">
          <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4 text-green-200 text-center">
            ✅ Playlist generated and saved to your store!
          </div>
          <PlaylistPlayer tracks={playlist.tracks_ordered} />
          <button
            onClick={handleViewInStore}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 rounded-lg transition duration-300 shadow-lg"
          >
            🎬 View in Playlist Store →
          </button>
        </div>
      )}
    </div>
  );
}
