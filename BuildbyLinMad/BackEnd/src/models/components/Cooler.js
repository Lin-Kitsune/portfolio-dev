import mongoose from 'mongoose';

const coolerSpecs = {
  peso: { type: String },
  rpm: { type: Number },
  ruido: { type: String },
  flujoAire: { type: String },
  altura: { type: String },
};

const coolerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  specs: { type: coolerSpecs, required: true },
  link: { type: String, required: true },
  model: { type: String, default: null },
  imagePath: { type: String, default: '' },
});

const Cooler = mongoose.model('Cooler', coolerSchema, 'coolers');

export default Cooler;
