import multer from 'multer';
import path from 'path';
import fs from 'fs';

const getStorage = (folderName) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join('uploads', folderName);
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + unique + ext);
    }
  });
};

const uploadDynamic = (folderName) => multer({ storage: getStorage(folderName) });

export default uploadDynamic;
