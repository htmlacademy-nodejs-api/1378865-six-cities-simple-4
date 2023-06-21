import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { MiddlewareInterface } from './middleware.interface.js';
import HttpError from '../errors/http-error.js';
import { FindOfferDocumentInterface } from './find-offer-document.interface.js';

export class CheckUserMatchInOfferMiddleware implements MiddlewareInterface {
  constructor(
    private readonly service: FindOfferDocumentInterface,
    private readonly text: string,
  ) {}

  public async execute(
    { user, params }: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> {
    const offer = await this.service.findById(params.offerId);

    const userID = user.id;
    const offerUserId = offer?.userId._id.toString();

    if (offerUserId !== userID) {
      throw new HttpError(StatusCodes.FORBIDDEN, this.text, 'CheckUserMatchInOfferMiddleware');
    }

    return next();
  }
}
