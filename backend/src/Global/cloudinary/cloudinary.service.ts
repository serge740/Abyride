import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { cloudinary } from './cloudinary.config';
import { UploadApiResponse } from 'cloudinary';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const streamifier = require('streamifier');

export const CLOUDINARY_FOLDERS = {
  profile: 'abyride/profile',
  driverDocs: 'abyride/driver-docs',
  vehicles: 'abyride/vehicles',
};

@Injectable()
export class CloudinaryService {
  async uploadImageFromBuffer(
    buffer: Buffer,
    folder: string = CLOUDINARY_FOLDERS.profile,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image' },
        (error, result) => {
          if (error || !result) {
            return reject(
              new InternalServerErrorException(`Image upload failed: ${error?.message}`),
            );
          }
          resolve(result);
        },
      );
      streamifier.createReadStream(buffer).pipe(stream);
    });
  }

  async uploadFileFromBuffer(
    buffer: Buffer,
    folder: string = CLOUDINARY_FOLDERS.driverDocs,
    format?: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'raw', ...(format ? { format } : {}) },
        (error, result) => {
          if (error || !result) {
            return reject(
              new InternalServerErrorException(`File upload failed: ${error?.message}`),
            );
          }
          resolve(result);
        },
      );
      streamifier.createReadStream(buffer).pipe(stream);
    });
  }

  getPublicIdFromUrl(url: string): string {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(\.\w+)?$/);
    if (!match) throw new Error(`Cannot extract public_id from URL: ${url}`);
    return match[1];
  }

  async deleteByUrl(url: string, resourceType: 'image' | 'raw' = 'image'): Promise<void> {
    try {
      const publicId = this.getPublicIdFromUrl(url);
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch {
      // A missing/already-deleted asset should never block the request.
    }
  }
}
