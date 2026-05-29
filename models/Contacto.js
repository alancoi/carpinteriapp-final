import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Puede ser anónimo
    },
    email: {
      type: String,
      required: false,
    },
    mensaje: {
      type: String,
      required: true,
    },
    tipo: {
      type: String,
      enum: ['error', 'sugerencia', 'otro'],
      default: 'error',
    },
    leido: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Contacto = mongoose.models.Contacto || mongoose.model('Contacto', contactSchema);

export default Contacto;
