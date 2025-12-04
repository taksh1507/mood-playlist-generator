import Track from '../models/Track.js';
import { getFromCache, setInCache } from '../services/cacheService.js';

const CACHE_KEY = 'top_tracks';
const CACHE_TTL = 60; // 60 seconds

export const getTopTracks = async (req, res, next) => {
  try {
    const cachedResult = await getFromCache(CACHE_KEY);
    if (cachedResult) {
      return res.json({
        source: 'cache',
        tracks: cachedResult,
      });
    }

    const topTracks = await Track.find({})
      .sort({ selected_count: -1, uploaded_at: -1 })
      .limit(10);

    await setInCache(CACHE_KEY, topTracks, CACHE_TTL);

    res.json({
      source: 'database',
      tracks: topTracks,
    });
  } catch (error) {
    next(error);
  }
};
