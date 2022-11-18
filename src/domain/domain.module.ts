import { IoModule } from '@io/io.module';
import { Module } from '@nestjs/common';
import { CompressorService } from './service/compressor.service';
import { FileService } from './service/file.service';

@Module({
  imports: [IoModule],
  providers: [CompressorService, FileService],
  exports: [CompressorService, FileService],
})
export class DomainModule {}
