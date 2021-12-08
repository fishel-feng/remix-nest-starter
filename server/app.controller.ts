import {
  All,
  Controller,
  HttpAdapterHost,
  Next,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AppService } from './app.service';
import { createRequestHandler } from '@remix-run/express';
import path from 'path';

@Controller()
export class AppController {
  @All('*')
  renderRemix(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    console.log();
    createRequestHandler({
      build: require(path.join(process.cwd(), 'build')),
    })(req, res, next);
    // next();
    // return this.appService.getHello();
  }
}
