import { DomainModule } from '@domain/domain.module';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfig } from '@configs/multer.config';
import { FileController } from './controller/file.controller';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfig,
    }),
    DomainModule,
  ],
  controllers: [FileController],
})
export class ApplicationModule {}
