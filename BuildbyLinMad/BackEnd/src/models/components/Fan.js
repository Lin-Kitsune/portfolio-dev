import mongoose from 'mongoose';

const fanSpecs = {
  tamaño: { type: String },
  iluminacion: { type: String },
  bearing: { type: String },
  flujoAire: { type: String },
  rpm: { type: Number },
  ruido: { type: String },
};

const fanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  specs: { type: fanSpecs, required: true },
  link: { type: String, required: true },
  model: { type: String, default: null },
  imagePath: { type: String, default: '' },
}, { timestamps: true });

const Fan = mongoose.model('Fan', fanSchema, 'fans');

export default Fan;
