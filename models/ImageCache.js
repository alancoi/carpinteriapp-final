import mongoose from 'mongoose';

const imageCacheSchema = new mongoose.Schema(
  {
    hash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      default: null,
    },
    analisis: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 86400, // Auto-delete después de 24h
    },
  },
  { timestamps: true }
);

const ImageCache = mongoose.models.ImageCache || mongoose.model('ImageCache', imageCacheSchema);

export default ImageCache;
