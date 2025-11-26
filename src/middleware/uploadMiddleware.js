import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }

})

const fileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(pdf)$/)) {
        req.fileValidationError = 'Only PDF files are allowed!';
        return cb(new Error('Only PDF files are allowed!'), false);
    }
    cb(null, true);

};

const limits = {
    fileSize: 30 * 1024 * 1024,
};

const upload = multer({ storage: storage, fileFilter, limits }).single('file');

module.exports = { upload };