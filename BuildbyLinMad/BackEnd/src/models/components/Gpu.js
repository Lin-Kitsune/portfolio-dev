import mongoose from 'mongoose';

const memoriaSchema = new mongoose.Schema({
  cantidad: { type: String },
  tipo: { type: String },
  bus: { type: String },
}, { _id: false });

const frecuenciaCoreSchema = new mongoose.Schema({
  base: { type: Number },
  boost: { type: Number },
  oc: { type: Number },
}, { _id: false });

const gpuSpecs = {
  gpu: { type: String },
  memoria: memoriaSchema,
  frecuenciaCore: frecuenciaCoreSchema,
  frecuenciaMemorias: { type: Number },
  bus: { type: String },
};

const gpuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  specs: { type: gpuSpecs, required: true },
  link: { type: String, required: true },
  model: { type: String, default: null },
  imagePath: { type: String, default: '' },
}, { timestamps: true });

const Gpu = mongoose.model('Gpu', gpuSchema, 'gpus');

export default Gpu;
