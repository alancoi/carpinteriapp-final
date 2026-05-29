import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    analysis: {
      type: String,
      required: true,
    },
    preview: {
      type: String, // Base64 o URL
      default: null,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Proyecto = mongoose.models.Proyecto || mongoose.model('Proyecto', projectSchema);

export default Proyecto;
