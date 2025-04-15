import mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
  nombre: String,
  creadoEn: {
    type: Date,
    default: Date.now,
  },
});

const Test = mongoose.model('Test', testSchema);
export default Test;
