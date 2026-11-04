import morgan from 'morgan';
import { Request, Response } from 'express';

export const requestLogger = morgan((tokens, req: Request, res: Response) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    '-',
    tokens['response-time'](req, res),
    'ms',
  ].join(' ');
});

