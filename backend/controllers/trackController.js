import Track from '../models/Track.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '../uploads');

export const uploadTrack = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const title = req.body.title || path.parse(req.file.filename).name;
    const file_url = `/uploads/${req.file.filename}`;

    const track = new Track({
      title,
      file_url,
      uploaded_at: new Date(),
      selected_count: 0,
    });

    const savedTrack = await track.save();
    res.status(201).json({
      message: 'Track uploaded successfully',
      track: savedTrack,
    });
  } catch (error) {
    next(error);
  }
};

export const listTracks = async (req, res, next) => {
  try {
    const tracks = await Track.find({}).sort({ uploaded_at: -1 });
    res.json({
      total: tracks.length,
      tracks,
    });
  } catch (error) {
    next(error);
  }
};
