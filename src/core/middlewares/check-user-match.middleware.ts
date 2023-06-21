import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { MiddlewareInterface } from './middleware.interface.js';
import HttpError from '../errors/http-error.js';
import { FindUserDocumentInterface } from './find-user-document.interface.js';

export class CheckUserMatchMiddleware implements MiddlewareInterface {
  constructor(
    private readonly service: FindUserDocumentInterface,
    private readonly text: string,
  ) {}

  public async execute(
    { user, params }: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> {
    const finedUser = await this.service.findByID(params.userId);

    const userID = user.id;
    const finedUserId = finedUser?._id.toString();

    if (finedUserId !== userID) {
      throw new HttpError(StatusCodes.FORBIDDEN, this.text, 'CheckUserMatchMiddleware');
    }

    return next();
  }
}
