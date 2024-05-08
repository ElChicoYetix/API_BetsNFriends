"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadS3 = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const client_s3_1 = require("@aws-sdk/client-s3");
const s3 = new client_s3_1.S3Client({
    region: process.env.S3_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY
    }
});
const s3Storage = (0, multer_s3_1.default)({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    metadata: (req, file, cb) => {
        cb(null, { ...file });
    },
    acl: 'public-read',
    key: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    const validExtensions = ['jpg', 'png', 'jpeg'];
    const ext = file.originalname.split('.').pop().toLowerCase();
    const isValid = validExtensions.includes(ext);
    cb(null, isValid);
};
exports.uploadS3 = (0, multer_1.default)({
    storage: s3Storage,
    fileFilter: fileFilter
});
