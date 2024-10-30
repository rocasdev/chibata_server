import cloudinary from "cloudinary";
import { Readable } from "stream";
import {
  CDY_API_KEY,
  CDY_API_SECRET,
  CDY_CLOUD_NAME,
} from "../config/constants";

cloudinary.v2.config({
  cloud_name: CDY_CLOUD_NAME,
  api_key: CDY_API_KEY,
  api_secret: CDY_API_SECRET,
  secure: true,
});

const bufferToStream = (buffer: any) => {
  const readable = new Readable();
  readable._read = () => {}; // No-op
  readable.push(buffer);
  readable.push(null);
  return readable;
};

const uploadImageToCloudinary = async (fileBuffer: any, folder: any) => {
  const fileStream = bufferToStream(fileBuffer);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
    fileStream.pipe(uploadStream);
  });
};

const deleteImageFromCloudinary = async (publicId: any) => {
  return cloudinary.v2.uploader.destroy(publicId);
};

export { uploadImageToCloudinary, deleteImageFromCloudinary };
