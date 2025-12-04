'use client';

import { useState, useRef } from 'react';
import { uploadTrack, listTracks } from '@/app/lib/api';

export default function TrackUpload({ onTrackUploaded }) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMessage('');

    try {
      await uploadTrack(file, title || file.name);
      setMessage('✓ Track uploaded successfully!');
      setTitle('');
      fileInputRef.current.value = '';
      
      const tracksRes = await listTracks();
      if (onTrackUploaded) {
        onTrackUploaded(tracksRes.data.tracks);
      }
    } catch (error) {
      setMessage(`✗ Upload failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-cyan-400">📤 Upload Music</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Track Title (optional)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter track title"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Select Audio File (MP3 or WAV)
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".mp3,.wav,audio/mpeg,audio/wav"
            onChange={handleFileSelect}
            disabled={loading}
            className="block w-full text-sm text-slate-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-cyan-600 file:text-white
              hover:file:bg-cyan-700
              cursor-pointer"
          />
        </div>

        {message && (
          <div className={`p-3 rounded-lg text-sm ${
            message.startsWith('✓') 
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
