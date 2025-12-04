import axios from 'axios';
import Track from '../models/Track.js';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const AVAILABLE_MODELS = [
  'openrouter/auto',
  'meta-llama/llama-2-7b-chat',
  'teknium/openhermes-2.5-mistral-7b',
  'undi95/toppy-m-7b',
];

export const generatePlaylistFromMood = async (mood) => {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY not configured');
    }

    const tracks = await Track.find({}).select('title _id');
    if (tracks.length === 0) {
      throw new Error('No tracks available to generate playlist');
    }

    const trackList = tracks
      .map((track, index) => `${index + 1}. ${track.title}`)
      .join('\n');

    const prompt = `You are a music playlist generator.

USER MOOD: "${mood}"

AVAILABLE TRACKS:
${trackList}

Return JSON ONLY in the following structure:
{
  "playlist": [
     { "title": "<track title>" },
     { "title": "<track title>" }
  ]
}
Number of tracks must be between 3 and 6 only. Do not include commentary.`;

    let lastError = null;
    for (const model of AVAILABLE_MODELS) {
      try {
        const requestBody = {
          model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        };

        const response = await axios.post(OPENROUTER_API_URL, requestBody, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'HTTP-Referer': 'http://localhost:5000',
            'X-Title': 'Music Mood DJ',
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        });

        let playlistData;
        try {
          const content = response.data.choices[0].message.content;
          playlistData = JSON.parse(content);
        } catch (parseError) {
          throw new Error('Invalid JSON response from LLM');
        }

        if (!playlistData.playlist || !Array.isArray(playlistData.playlist)) {
          throw new Error('Invalid playlist structure from LLM');
        }

        if (playlistData.playlist.length < 3 || playlistData.playlist.length > 6) {
          throw new Error('Playlist must contain between 3 and 6 tracks');
        }

        const trackIds = [];
        for (const playlistTrack of playlistData.playlist) {
          const matchedTrack = tracks.find(
            (t) => t.title.toLowerCase() === playlistTrack.title.toLowerCase()
          );
          if (matchedTrack) {
            trackIds.push(matchedTrack._id);
          }
        }

        if (trackIds.length === 0) {
          throw new Error('No tracks matched from LLM response');
        }

        return trackIds;
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError || new Error('All models failed');
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
    }
    throw error;
  }
};
