import mongoose from 'mongoose';

const caseSpecs = {
  formato: { type: String },
  iluminacion: { type: String },
  fuenteDePoderIncluida: { type: Boolean },
  ubicacionFuente: { type: String },
  panelLateral: { type: String },
  ventiladoresIncluidos: { type: Boolean },
};

const caseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  specs: { type: caseSpecs, required: true },
  link: { type: String, required: true },
  model: { type: String, default: null },
  imagePath: { type: String, default: '' },
});

const Case = mongoose.model('Case', caseSchema, 'cases');

export default Case;
