import mongoose from 'mongoose';

const ramSpecs = {
  cantidad: { type: Number },
  capacidadPorModulo: { type: String },
  total: { type: String },
  tipo: { type: String },
  velocidad: { type: String },
  formato: { type: String },
  voltaje: { type: Number },
};

const ramSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  specs: { type: ramSpecs, required: true },
  link: { type: String, required: true },
  model: { type: String, default: null },
  imagePath: { type: String, default: '' },
});

const Ram = mongoose.model('Ram', ramSchema, 'rams');

export default Ram;
