'use client';

import { useState, useEffect } from 'react';
import { getAllPlaylists } from '@/app/lib/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function PlaylistStore() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [expandedPlaylist, setExpandedPlaylist] = useState(null);

  useEffect(() => {
    loadPlaylists(currentPage);
  }, [currentPage]);

  const loadPlaylists = async (page) => {
    try {
      setLoading(true);
      const response = await getAllPlaylists(page, 6);
      setPlaylists(response.data.playlists);
      setPagination(response.data.pagination);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 via-teal-600 to-cyan-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">🎬 Playlist Store</h2>
        <p className="text-cyan-100">View all your generated playlists</p>
      </div>

      {loading ? (
        <div className="text-center text-cyan-300 py-16">
          <div className="text-2xl mb-4">🎵</div>
          Loading playlists...
        </div>
      ) : playlists.length === 0 ? (
        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-8 text-blue-200 text-center">
          <p className="text-lg">No playlists generated yet.</p>
          <p className="text-sm mt-2">Start generating playlists to see them here!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {playlists.map((playlist) => (
              <div
                key={playlist._id}
                className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-lg p-6 hover:border-purple-400/60 hover:shadow-xl transition duration-300 transform hover:scale-[1.02]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🎵</span>
                      <h3 className="text-xl font-bold text-white truncate">
                        {playlist.mood_prompt}
                      </h3>
                    </div>
                    <p className="text-sm text-cyan-300">
                      {playlist.tracks_ordered?.length || 0} tracks
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {formatDate(playlist.created_at)}
                    </p>
                  </div>
                  <div className="text-3xl">🎧</div>
                </div>

                <button
                  onClick={() =>
                    setExpandedPlaylist(
                      expandedPlaylist === playlist._id ? null : playlist._id
                    )
                  }
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2 rounded-lg font-semibold transition duration-300 text-sm"
                >
                  {expandedPlaylist === playlist._id ? '▼ Hide Tracks' : '▶ Show Tracks'}
                </button>

                {expandedPlaylist === playlist._id && (
                  <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
                    {playlist.tracks_ordered && playlist.tracks_ordered.length > 0 ? (
                      playlist.tracks_ordered.map((track, index) => (
                        <div
                          key={track._id}
                          className="bg-white/5 border border-white/10 rounded-lg p-3"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-semibold text-purple-400">
                              {index + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-white truncate">
                                {track.title}
                              </p>
                              <p className="text-xs text-slate-400">
                                Duration: {track.duration || 'Unknown'}
                              </p>
                            </div>
                          </div>
                          <audio
                            src={getAudioUrl(track)}
                            controls
                            className="w-full h-6 rounded"
                            crossOrigin="anonymous"
                          />
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400 text-center py-2">
                        No tracks in this playlist
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-semibold transition duration-300"
              >
                ← Previous
              </button>

              <div className="flex gap-2">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg font-semibold transition duration-300 ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-slate-700/50 text-cyan-300 hover:bg-slate-600/50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                disabled={currentPage === pagination.pages}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-semibold transition duration-300"
              >
                Next →
              </button>
            </div>
          )}

          <div className="text-center text-sm text-slate-400">
            Showing {playlists.length} of {pagination?.total || 0} playlists
          </div>
        </>
      )}
    </div>
  );
}
