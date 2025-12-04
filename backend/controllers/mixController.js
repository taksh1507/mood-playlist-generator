import Playlist from '../models/Playlist.js';
import Track from '../models/Track.js';
import { generatePlaylistFromMood } from '../services/llmService.js';

export const generatePlaylist = async (req, res, next) => {
  try {
    const { mood } = req.body;

    if (!mood || mood.trim() === '') {
      return res.status(400).json({ error: 'Mood prompt is required' });
    }

    const trackIds = await generatePlaylistFromMood(mood);

    if (trackIds.length === 0) {
      return res.status(400).json({ error: 'Failed to generate playlist' });
    }

    const playlist = new Playlist({
      mood_prompt: mood,
      tracks_ordered: trackIds,
      created_at: new Date(),
    });

    const savedPlaylist = await playlist.save();

    for (const trackId of trackIds) {
      await Track.findByIdAndUpdate(
        trackId,
        { $inc: { selected_count: 1 } },
        { new: true }
      );
    }

    const populatedPlaylist = await Playlist.findById(savedPlaylist._id).populate(
      'tracks_ordered'
    );

    res.status(201).json({
      message: 'Playlist generated successfully',
      playlist: populatedPlaylist,
    });
  } catch (error) {
    next(error);
  }
};

export const getPlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;

    const playlist = await Playlist.findById(id).populate('tracks_ordered');

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    res.json(playlist);
  } catch (error) {
    next(error);
  }
};

export const getAllPlaylists = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const playlists = await Playlist.find()
      .populate('tracks_ordered')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Playlist.countDocuments();

    res.json({
      playlists,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};
