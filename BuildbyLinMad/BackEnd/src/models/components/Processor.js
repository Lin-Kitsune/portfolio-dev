import mongoose from 'mongoose';

const processorSpecs = {
  socket: { type: String },
};

const processorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  specs: { type: processorSpecs, required: true },
  link: { type: String, required: true },
  model: { type: String, default: null },
  imagePath: { type: String, default: '' },
});

const Processor = mongoose.model('Processor', processorSchema, 'processors');

export default Processor;
