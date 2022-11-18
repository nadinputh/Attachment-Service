import { CompressorService } from '@domain/service/compressor.service';
import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
  Scope,
  StreamableFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { join, resolve } from 'path';
import { FileService } from '@domain/service/file.service';

@Controller({ path: 'files', scope: Scope.REQUEST })
export class FileController {
  constructor(private readonly file: FileService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 25))
  uploadFile(
    @UploadedFiles()
    files: Array<Express.Multer.File>,
  ) {
    return this.file.upload(files);
  }

  @Get()
  getFile(
    @Query('page', new DefaultValuePipe(1), new ParseIntPipe()) page: number,
  ): Promise<any> {
    return this.file.find({ page });
  }

  @Get('/:uuid')
  read(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Query() query: any,
  ): Promise<any> {
    return this.file.read(uuid, query);
  }

  @Get('download')
  downloadFile(): StreamableFile {
    const file = createReadStream(join(process.cwd(), 'package.json'));
    return new StreamableFile(file, {
      type: 'application/json',
      disposition: 'attachment; filename="package.json"',
    });
  }

  @Get('download/:encode')
  downloadZip(
    @Param('encode') encode: string,
    @Query('files', new ParseArrayPipe({ separator: ',' })) files: string[],
  ): Promise<StreamableFile> {
    return this.file.downloadZip(files, { format: encode });
  }
}
