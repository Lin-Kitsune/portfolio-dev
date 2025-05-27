import mongoose from 'mongoose';

const memoriasSchema = new mongoose.Schema({
  cantidad: { type: Number },
  tipo: { type: String },
  formato: { type: String },
}, { _id: false });

const motherboardSpecs = {
  socket: { type: String },
  chipset: { type: String },
  memorias: memoriasSchema,
};

const motherboardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  specs: { type: motherboardSpecs, required: true },
  link: { type: String, required: true },
  model: { type: String, default: null },
  imagePath: { type: String, default: '' },
}, { timestamps: true });

const Motherboard = mongoose.model('Motherboard', motherboardSchema, 'motherboards');

export default Motherboard;
