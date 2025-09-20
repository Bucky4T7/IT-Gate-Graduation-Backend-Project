const multer = require("multer");
const path = require("path");
const { errorResponse } = require("../utils/response");

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = "./uploads/";
    if (file.fieldname === "avatar") {
      uploadPath += "avatars/";
    } else if (file.fieldname === "images") {
      uploadPath += "items/";
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

const uploadAvatar = upload.single("avatar");
const uploadItemImages = upload.array("images", 5); // Max 5 images

const uploadErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return errorResponse(res, "File size too large. Max 5MB allowed.", 400);
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return errorResponse(res, "Too many files uploaded or unexpected field name.", 400);
    }
    return errorResponse(res, err.message, 400);
  } else if (err) {
    return errorResponse(res, err, 400);
  }
  next();
};

module.exports = {
  uploadAvatar,
  uploadItemImages,
  uploadErrorHandler,
};

