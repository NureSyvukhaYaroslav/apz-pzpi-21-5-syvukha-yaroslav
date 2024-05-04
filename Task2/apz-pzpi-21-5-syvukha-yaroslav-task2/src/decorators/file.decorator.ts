import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile,
} from '@nestjs/common';

export const File5Mb = () =>
  UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({
          maxSize: 1024 * 1024 * 5,
          message: 'File size too large, must be less than 5MB',
        }),
        new FileTypeValidator({
          fileType: /^(image\/(jpeg|png)|application\/pdf)$/,
        }),
      ],
    }),
  );
