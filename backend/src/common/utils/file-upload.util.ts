import { memoryStorage } from 'multer';
import * as path from 'path';

const driverCombinedFilter = (_req: any, file: any, cb: any) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const isImageField = ['profileImg', 'licenseImage', 'vehicleImage'].includes(file.fieldname);
  const isDocField = ['licenseDocument', 'insuranceDocument'].includes(file.fieldname);

  if (isImageField) {
    /\.(jpeg|jpg|png|gif|webp)$/.test(ext)
      ? cb(null, true)
      : cb(new Error('Only image files are allowed for this field'), false);
  } else if (isDocField) {
    /\.(pdf|doc|docx)$/.test(ext)
      ? cb(null, true)
      : cb(new Error('Only PDF or Word documents are allowed for this field'), false);
  } else {
    cb(null, true);
  }
};

export const DriverCombinedUploadConfig = {
  storage: memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: driverCombinedFilter,
};
