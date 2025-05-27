import mongoose from 'mongoose';

const ssdSpecs = {
  capacidad: { type: String },
  formato: { type: String },
  bus: { type: String },
  poseeDram: { type: Boolean },
  tipoMemoria: { type: String },
};

const ssdSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  specs: { type: ssdSpecs, required: true },
  link: { type: String, required: true },
  model: { type: String, default: null },
  imagePath: { type: String, default: '' },
}, { timestamps: true });

const Ssd = mongoose.model('Ssd', ssdSchema, 'ssds');

export default Ssd;
