'use client';

import { useState, useEffect } from 'react';
import { listTracks } from '@/app/lib/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function TrackList() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTracks();
  }, []);

  const loadTracks = async () => {
    try {
      const response = await listTracks();
      setTracks(response.data.tracks);
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

  if (loading) {
    return <div className="text-center text-gray-500">Loading tracks...</div>;
  }

  if (tracks.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
        No tracks uploaded yet. Upload some music to get started!
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        🎵 Uploaded Tracks ({tracks.length})
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tracks.map((track) => (
          <div key={track._id} className="border border-gray-300 rounded-lg p-4 bg-slate-50 hover:shadow-lg hover:bg-slate-100 transition">
            <h3 className="font-bold text-lg text-gray-900 mb-2 truncate" title={track.title}>{track.title}</h3>
            <p className="text-sm text-gray-600 mb-3">
              Uploaded: {new Date(track.uploaded_at).toLocaleDateString()}
            </p>
            <audio
              src={getAudioUrl(track)}
              controls
              className="w-full"
              crossOrigin="anonymous"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
