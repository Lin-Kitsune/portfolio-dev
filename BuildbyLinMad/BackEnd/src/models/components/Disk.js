import mongoose from 'mongoose';

const diskSpecs = {
  tipo: { type: String },
  capacidad: { type: String },
  rpm: { type: Number },
  tamaño: { type: String },
  bus: { type: String },
};

const diskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  specs: { type: diskSpecs, required: true },
  link: { type: String, required: true },
  model: { type: String, default: null },
  imagePath: { type: String, default: '' },
}, { timestamps: true });

const Disk = mongoose.model('Disk', diskSchema, 'disks');

export default Disk;
