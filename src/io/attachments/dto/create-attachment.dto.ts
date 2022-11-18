export class CreateAttachmentDto {
  userId?: number;
  collectionName?: string;
  path: string;
  fileName: string;
  name: string;
  size: number;
  mimetype: string;
  order?: number;
  properties?: any;
}
