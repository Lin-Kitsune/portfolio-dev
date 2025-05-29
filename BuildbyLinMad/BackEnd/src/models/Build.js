import mongoose from 'mongoose';

const buildSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  components: {
    cpu: Object,
    gpu: Object,
    motherboard: Object,
    ram: Object,
    ssd: Object,
    hdd: Object,
    psu: Object,
    case: Object,
    cooler: Object,
    fans: Array,
  },
  total: Number,
  recommended: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Build = mongoose.model('Build', buildSchema);

export default Build;
