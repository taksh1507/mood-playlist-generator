import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema(
  {
    mood_prompt: {
      type: String,
      required: true,
      trim: true,
    },
    tracks_ordered: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Track',
      },
    ],
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Playlist', playlistSchema);
