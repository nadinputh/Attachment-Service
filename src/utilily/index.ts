export const toBoolean = (val: string | number) => {
  if (typeof val === 'string') return val === 'true' || val === '1';
  return val === 1;
};

export const isImage = (mimetype: string) => {
  return [
    'image/png',
    'image/x-png',
    'image/gif',
    'image/jpeg',
    'image/x-citrix-jpeg',
    'image/svg+xml',
    'image/x-icon',
    'image/pjpeg',
  ].includes(mimetype);
};
