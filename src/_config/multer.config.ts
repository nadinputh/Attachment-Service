import { Inject, Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { randomBytes } from 'crypto';
import { Request } from 'express';
import { existsSync, mkdirSync } from 'fs';
import * as mime from 'mime-types';
import * as multer from 'multer';
import { join } from 'path';

@Injectable({ scope: Scope.REQUEST })
export class MulterConfig implements MulterOptionsFactory {
  constructor(
    @Inject(REQUEST) private readonly req: Request,
    private readonly config: ConfigService,
  ) {}

  createMulterOptions(): MulterModuleOptions {
    let { path = '' } = this.req.query;
    path = join(this.config.get('MULTER_DEST', './upload'), `${path}`);
    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true });
    }
    const storage = multer.diskStorage({
      destination: path,
      filename: (_req, file, cb) => {
        /* need to use the file's mimetype because the file name may not have an extension at all */
        const ext = mime.extension(file.mimetype);
        cb(null, `${randomBytes(18).toString('hex')}.${ext}`);
      },
    });
    return {
      storage: storage,
    };
  }
}
