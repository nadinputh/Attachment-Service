import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, In } from 'typeorm';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { Attachment } from './entities/attachment.entity';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectEntityManager()
    private readonly manager: EntityManager,
  ) {}

  create(attachments: CreateAttachmentDto[]): Promise<Attachment[]> {
    const attachs = attachments.map((file) => {
      const a = new Attachment();
      a.collectionName = file.collectionName;
      a.fileName = file.fileName;
      a.name = file.name;
      a.order = file.order;
      a.path = file.path;
      a.size = file.size;
      a.mimetype = file.mimetype;
      return a;
    });
    return this.manager.save(attachs);
  }

  async findAll(query: any): Promise<any> {
    const { page = 1 } = query;
    const count = await this.manager.count(Attachment);
    const list = await this.manager.find(Attachment, {
      skip: 10 * (page - 1),
      take: 10,
    });
    return {
      files: list,
      total: count,
      page,
      size: 10,
    };
  }

  findOne(id: string): Promise<Attachment> {
    return this.manager.findOneBy(Attachment, { uuid: id });
  }

  findMany(ids: string[]): Promise<Attachment[]> {
    return this.manager.findBy(Attachment, { uuid: In(ids) });
  }

  remove(id: number) {
    return `This action removes a #${id} attachment`;
  }
}
