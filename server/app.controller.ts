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
    const MODE = process.env.NODE_ENV;
    if (MODE === 'production') {
      createRequestHandler({
        build: require(path.join(process.cwd(), 'build')),
      })(req, res, next);
    } else {
      purgeRequireCache();
      return createRequestHandler({
        build: require(path.join(process.cwd(), 'build')),
        mode: MODE,
      })(req, res, next);
    }
  }
}

const BUILD_DIR = path.join(process.cwd(), 'build');
function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, we prefer the DX of this though, so we've included it
  // for you by default
  for (let key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key];
    }
  }
}
