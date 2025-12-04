import mongoose from 'mongoose';

const trackSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    file_url: {
      type: String,
      required: true,
    },
    uploaded_at: {
      type: Date,
      default: Date.now,
    },
    selected_count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Track', trackSchema);
