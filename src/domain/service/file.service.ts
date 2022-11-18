import { AttachmentsService } from '@io/attachments/attachments.service';
import { Attachment } from '@io/attachments/entities/attachment.entity';
import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import * as sharp from 'sharp';
import { createReadStream, existsSync } from 'fs';
import { resolve } from 'path';
import { isImage, toBoolean } from '../../utilily';
import { Readable } from 'stream';
import { CompressorService } from './compressor.service';
import { isEmpty } from 'class-validator';

interface FileOptions {
  uploader?: string;
  collection?: string;
}

@Injectable()
export class FileService {
  constructor(
    private readonly attachments: AttachmentsService,
    private readonly compressor: CompressorService,
  ) {}

  async downloadZip(files: string[], options: any): Promise<StreamableFile> {
    const attachments = await this.attachments.findMany(files);

    if (isEmpty(attachments)) {
      throw new NotFoundException();
    }

    return this.compressor.compress(attachments, options);
  }

  async read(uuid: string, query: any): Promise<StreamableFile> {
    const attachment = await this.attachments.findOne(uuid);

    if (!attachment || !existsSync(resolve(attachment.path))) {
      throw new NotFoundException();
    }

    if (!isImage(attachment.mimetype)) {
      const file = createReadStream(resolve(attachment.path));
      return new StreamableFile(file, {
        type: attachment.mimetype,
        disposition: `attachment;`,
      });
    }

    const sha = sharp(resolve(attachment.path));
    const metadata = await sha.metadata();
    let size = metadata.width;
    if (query.size && parseInt(query.size) > 0) {
      size = parseInt(query.size);
      if (size > metadata.width) {
        size = metadata.width;
      }
    }
    let height = size === metadata.width ? metadata.height : size;
    if (!toBoolean(query.square)) {
      height = (size / metadata.width) * metadata.height;
      height = parseInt(height.toString());
    }
    const cropOptions: any = {
      width: size,
      height,
      top: 0,
      left: 0,
    };
    const buffer = await sha
      .resize(size)
      .extract(cropOptions)
      // .grayscale()
      .toBuffer();
    return new StreamableFile(Readable.from(buffer), {
      type: attachment.mimetype,
      disposition: `filename="${attachment.name}"`,
    });
  }

  find(query: any): Promise<any> {
    return this.attachments.findAll(query);
  }

  upload(
    files: Array<Express.Multer.File>,
    options?: FileOptions,
  ): Promise<Attachment[]> {
    const { collection } = options || {};

    const attachments = files.map((file, index) => ({
      collectionName: collection,
      fileName: file.filename,
      name: file.originalname,
      order: index + 1,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
    }));
    return this.attachments.create(attachments);
  }
}
