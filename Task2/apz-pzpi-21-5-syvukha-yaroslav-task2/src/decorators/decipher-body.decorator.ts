import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AES, enc } from 'crypto-js';

export const DecipherBody = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const ciphertext = request.body.data;
    const bytes = AES.decrypt(ciphertext, process.env.AES_KEY);
    const originalText = bytes.toString(enc.Utf8);

    return JSON.parse(originalText);
  },
);
