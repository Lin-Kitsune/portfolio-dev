import mongoose from 'mongoose';

const psuSpecs = {
  potencia: { type: Number },
  certificacion: { type: String },
  corriente12V: { type: Number },
  modular: { type: Boolean },
  pfcActivo: { type: Boolean },
};

const psuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  specs: { type: psuSpecs, required: true },
  link: { type: String, required: true },
  model: { type: String, default: null },
  imagePath: { type: String, default: '' },
}, { timestamps: true });

const Psu = mongoose.model('Psu', psuSchema, 'psus');

export default Psu;
