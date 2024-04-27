import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';

const s3 = new S3Client({
    region: process.env.S3_BUCKET_REGION!,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY!,
        secretAccessKey: process.env.S3_SECRET_KEY!
    }
});
 
const s3Storage = multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME!,
    metadata: (req, file, cb) => {
      cb(null, { ...file });
    },
    acl: 'public-read',
    key: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const validExtensions = ['jpg', 'png', 'jpeg'];
    const ext = file.originalname.split('.').pop()!.toLowerCase();
    const isValid = validExtensions.includes(ext);
    cb(null, isValid);
}

export const uploadS3 = multer({
    storage: s3Storage,
    fileFilter: fileFilter
});