import mongoose from 'mongoose';

const calificacionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    estrellas: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    opinion: {
      type: String,
      default: '',
    },
    mejoras: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Calificacion = mongoose.models.Calificacion || mongoose.model('Calificacion', calificacionSchema);

export default Calificacion;
