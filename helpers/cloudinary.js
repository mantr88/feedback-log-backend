import fs from 'fs/promises';
import { v2 as cloudinary } from 'cloudinary';

const { CLOUD_NAME, API_KEY, API_SECRET } = process.env;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

const options = {
  folder: 'Img',
  use_filename: true,
  unique_filename: true,
  overwrite: true,
  transformation: [{ width: 320, height: 240 }],
  allowed_formats: ['jpg', 'png', 'gif'],
};

const uploadImg = async imagePath => {
  try {
    const image = await cloudinary.uploader.upload(imagePath, options);
    await fs.unlink(imagePath);
    return image;
  } catch (error) {
    throw HttpError(404, error.message);
  }
};

export default uploadImg;
