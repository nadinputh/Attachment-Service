import { Test, TestingModule } from '@nestjs/testing';
import { FileController } from './file.controller';
import { CompressorService } from '../../domain/service/compressor.service';

describe('AppController', () => {
  let fileController: FileController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [CompressorService],
    }).compile();

    fileController = app.get<FileController>(FileController);
  });
});
