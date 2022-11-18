import { registerAs } from '@nestjs/config';
import { Attachment } from 'src/io/attachments/entities/attachment.entity';

export default (config) =>
  registerAs(config, () => ({
    type: process.env.DB_DRIVER || 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    database: process.env.DB_DATABASE || 'test',
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    // autoLoadEntities: true,
    // entities: ['**/*.entity{.ts,.js}'],
    entities,
    // synchronize: process.env.NODE_ENV != 'production',
  }));

export const entities = [Attachment];
