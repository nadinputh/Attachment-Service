import { Injectable, StreamableFile } from '@nestjs/common';
import * as archiver from 'archiver';
import { createReadStream } from 'fs';
import { resolve } from 'path';

class Options {
  format?: string | 'zip' | 'tar';
  filename?: string;
}

@Injectable()
export class CompressorService {
  compress(files: any[], options?: Options): StreamableFile {
    if (!options) {
      options = new Options();
    }
    if (!options.format) {
      options.format = 'zip';
    }
    if (!options.filename) {
      options.filename = 'archive';
    }
    const { format, filename } = options;
    // create archiver instance
    const archive = archiver(format, {
      zlib: { level: 9 }, // Sets the compression level.
    });

    // append files
    files.forEach((file) => {
      const f = createReadStream(resolve(file.path));
      archive.append(f, {
        name: file.name,
      });
    });

    // good practice to catch this error explicitly
    archive.on('error', function (err) {
      console.error(err);
    });

    // finalize the archive (ie we are done appending files but streams have to finish yet)
    // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
    archive.finalize();

    // create streamable file
    return new StreamableFile(archive, {
      type: 'application/octet-stream',
      disposition: `attachment; filename="${filename}.${format}"`,
    });
  }
}
