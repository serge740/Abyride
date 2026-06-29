import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { DriverService } from './driver.service';
import { AdminAuthGuard } from '../../Guards/admin-auth.guard';
import { CloudinaryService, CLOUDINARY_FOLDERS } from '../../Global/cloudinary/cloudinary.service';
import { DriverCombinedUploadConfig } from '../../common/utils/file-upload.util';
import * as path from 'path';

type DriverFiles = {
  profileImg?: Express.Multer.File[];
  licenseImage?: Express.Multer.File[];
  vehicleImage?: Express.Multer.File[];
  licenseDocument?: Express.Multer.File[];
  insuranceDocument?: Express.Multer.File[];
};

const FILE_FIELDS = [
  { name: 'profileImg', maxCount: 1 },
  { name: 'licenseImage', maxCount: 1 },
  { name: 'vehicleImage', maxCount: 1 },
  { name: 'licenseDocument', maxCount: 1 },
  { name: 'insuranceDocument', maxCount: 1 },
];

@Controller('drivers')
@UseGuards(AdminAuthGuard)
export class DriverController {
  constructor(
    private readonly driverService: DriverService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  private async uploadFile(file: Express.Multer.File): Promise<string> {
    const ext = path.extname(file.originalname).toLowerCase();
    const isDoc = /\.(pdf|doc|docx)$/.test(ext);
    if (isDoc) {
      const result = await this.cloudinary.uploadFileFromBuffer(
        file.buffer,
        CLOUDINARY_FOLDERS.driverDocs,
        ext.replace('.', ''),
      );
      return result.secure_url;
    }
    const result = await this.cloudinary.uploadImageFromBuffer(file.buffer, CLOUDINARY_FOLDERS.profile);
    return result.secure_url;
  }

  private async uploadAll(files: DriverFiles) {
    const [profileImg, licenseImage, vehicleImage, licenseDocument, insuranceDocument] =
      await Promise.all([
        files?.profileImg?.[0] ? this.uploadFile(files.profileImg[0]) : Promise.resolve(undefined),
        files?.licenseImage?.[0] ? this.uploadFile(files.licenseImage[0]) : Promise.resolve(undefined),
        files?.vehicleImage?.[0] ? this.uploadFile(files.vehicleImage[0]) : Promise.resolve(undefined),
        files?.licenseDocument?.[0] ? this.uploadFile(files.licenseDocument[0]) : Promise.resolve(undefined),
        files?.insuranceDocument?.[0] ? this.uploadFile(files.insuranceDocument[0]) : Promise.resolve(undefined),
      ]);
    return { profileImg, licenseImage, vehicleImage, licenseDocument, insuranceDocument };
  }

  @Post()
  @UseInterceptors(FileFieldsInterceptor(FILE_FIELDS, DriverCombinedUploadConfig))
  async create(@Body() body: any, @UploadedFiles() files: DriverFiles) {
    const uploaded = await this.uploadAll(files);
    return this.driverService.create({ ...body, ...uploaded });
  }

  @Get()
  findAll() {
    return this.driverService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.driverService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileFieldsInterceptor(FILE_FIELDS, DriverCombinedUploadConfig))
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFiles() files: DriverFiles,
  ) {
    const uploaded = await this.uploadAll(files);
    return this.driverService.update(id, { ...body, ...uploaded });
  }

  @Patch(':id/suspend')
  suspend(@Param('id') id: string) {
    return this.driverService.setStatus(id, 'SUSPENDED');
  }

  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.driverService.setStatus(id, 'ACTIVE');
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.driverService.remove(id);
  }
}
