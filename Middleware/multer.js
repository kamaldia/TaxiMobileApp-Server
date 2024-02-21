import multer from "multer";

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // console.log("File object in multer image storage:", file);
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const date = new Date().toISOString().slice(0, 10); //YYYY-MM-DD format
    const filename =
      "profile-picture-" + date + "-" + file.originalname;
    cb(null, filename);
  },
});

const driverStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'image') {
      cb(null, 'images');
    } else if (file.fieldname === 'legals') {
      cb(null, 'legals');
    } else {
      cb(new Error('Invalid field name'), false);
    }
  },
  filename: (req, file, cb) => {
    // console.log("File object in multer driver storage:", req.files);
    const date = new Date().toISOString().slice(0,  10); //YYYY-MM-DD format
    let filename;
    if (file.fieldname === 'image') {
      filename = "profile-picture-" + date + "-" + file.originalname;
    } else if (file.fieldname === 'legals') {
      let prefix;
      switch (req.files.legals.length) {
        case  1:
          prefix = "driver-license-front";
          break;
        case  2:
          prefix = "driver-license-back";
          break;
        case  3:
          prefix = "driver-criminal-record";
          break;
        case  4:
          prefix = "driver-residence-paper";
          break;
        default:
          prefix = "unknown-document";
          break;
      }
      filename = prefix + "-" + date + "-" + file.originalname;
    }
    cb(null, filename);
  },
});

const vehicleStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'image') {
      cb(null, 'images');
    } else if (file.fieldname === 'legals') {
      cb(null, 'legals');
    } else {
      cb(new Error('Invalid field name'), false);
    }
  },
  filename: (req, file, cb) => {
    const date = new Date().toISOString().slice(0,  10); //YYYY-MM-DD format
    let filename;
    if (file.fieldname === 'image') {
      filename = "vehicle-picture-" + date + "-" + file.originalname;
    } else if (file.fieldname === 'legals') {
      let prefix;
      switch (req.files.legals.length) {
        case 1:
          prefix = "vehicle-id-front";
          break;
        case 2:
          prefix = "vehicle-id-back";
          break;
        default:
          prefix = "unknown-document";
          break;
      }
      filename = prefix + "-" + date + "-" + file.originalname;
    }
    cb(null, filename);
  },
});

const imageFileFilter = (req, file, cb) => {
  // console.log("File object in multer filter:", file);
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const imageUpload = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter,
});
const driverUpload = multer({
  storage: driverStorage,
  fileFilter: imageFileFilter,
});
const vehicleUpload = multer({
  storage: vehicleStorage,
  fileFilter: imageFileFilter,
});

const DriverFields = [
  { name: 'image', maxCount:  1 },
  { name: 'legals', maxCount:  4 }
];

const VehicleFields = [
  { name: 'image', maxCount:  1 },
  { name: 'legals', maxCount:  2 }
];

export { VehicleFields, DriverFields, imageUpload, driverUpload, vehicleUpload };