// utils/getIconForKey.ts
import {
  FaMicrochip, FaMemory, FaHdd, FaFan, FaBoxOpen, FaPlug, FaSnowflake, FaDatabase, FaMicrophoneAlt, FaLaptopHouse,
} from 'react-icons/fa';
import { MdStorage, MdOutlineDeviceHub } from 'react-icons/md';
import { GiComputerFan } from 'react-icons/gi';
import { BsCpu, BsMotherboard } from 'react-icons/bs';
import { IconType } from 'react-icons';

export const getIconForKey = (key: string): JSX.Element => {
  const icons: Record<string, IconType> = {
    processors: BsCpu,
    cpu: BsCpu,
    gpus: FaMicrochip,
    gpu: FaMicrochip,
    rams: FaMemory,
    ram: FaMemory,
    ssds: MdStorage,
    disks: FaHdd,
    hdd: FaHdd,
    fans: GiComputerFan,
    fan: GiComputerFan,
    coolers: FaSnowflake,
    cooler: FaSnowflake,
    motherboards: BsMotherboard,
    motherboard: BsMotherboard,
    cases: FaBoxOpen,
    case: FaBoxOpen,
    psus: FaPlug,
    psu: FaPlug,
  };

  const Icon = icons[key] || FaMicrochip;
  return <Icon className="text-white text-lg min-w-[20px]" />;
};
