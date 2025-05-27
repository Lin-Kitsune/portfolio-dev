import Cpu from '../models/components/Processor.js';
import Gpu from '../models/components/Gpu.js';
import Ram from '../models/components/Ram.js';
import Motherboard from '../models/components/Motherboard.js';
import Psu from '../models/components/Psu.js';
import CaseComponent from '../models/components/Case.js';
import Cooler from '../models/components/Cooler.js';
import Disk from '../models/components/Disk.js';
import Fan from '../models/components/Fan.js';
import Ssd from '../models/components/Ssd.js';

export const componentModelMap = {
  cpu: Cpu,
  gpu: Gpu,
  ram: Ram,
  motherboard: Motherboard,
  psu: Psu,
  case: CaseComponent,
  cooler: Cooler,
  hdd: Disk,
  ssd: Ssd,
  fans: Fan,
};
