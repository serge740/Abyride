import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { MemberService } from './member.service';
import { AdminAuthGuard } from '../../Guards/admin-auth.guard';
import { CloudinaryService, CLOUDINARY_FOLDERS } from '../../Global/cloudinary/cloudinary.service';

const imageUploadConfig = {
  storage: memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req: any, file: any, cb: any) => {
    /\.(jpeg|jpg|png|webp)$/i.test(file.originalname)
      ? cb(null, true)
      : cb(new Error('Only image files are allowed'), false);
  },
};

@Controller('members')
@UseGuards(AdminAuthGuard)
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('profileImg', imageUploadConfig))
  async create(@Body() body: any, @UploadedFile() file?: Express.Multer.File) {
    let profileImg: string | undefined;
    if (file) {
      const result = await this.cloudinary.uploadImageFromBuffer(file.buffer, CLOUDINARY_FOLDERS.profile);
      profileImg = result.secure_url;
    }
    return this.memberService.create({ ...body, profileImg });
  }

  @Get()
  findAll() {
    return this.memberService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.memberService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('profileImg', imageUploadConfig))
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let profileImg: string | undefined;
    if (file) {
      const result = await this.cloudinary.uploadImageFromBuffer(file.buffer, CLOUDINARY_FOLDERS.profile);
      profileImg = result.secure_url;
    }
    return this.memberService.update(id, { ...body, profileImg });
  }

  @Patch(':id/suspend')
  suspend(@Param('id') id: string) {
    return this.memberService.setStatus(id, 'SUSPENDED');
  }

  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.memberService.setStatus(id, 'ACTIVE');
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.memberService.remove(id);
  }
}
