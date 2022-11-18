import { BaseEntity } from '../../entities/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('attachments')
export class Attachment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'attachable_type' })
  attachableType: string;

  @Column({ name: 'attachable_id' })
  attachableId: number;

  @Column()
  order: number;

  @Column({ name: 'collection_name' })
  collectionName: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'file_name' })
  fileName: string;

  @Column({ name: 'size' })
  size: number;

  @Column({ name: 'path' })
  path: string;

  @Column({ name: 'mimetype' })
  mimetype: string;

  @Column({ name: 'properties', type: 'json' })
  properties: any;
}
