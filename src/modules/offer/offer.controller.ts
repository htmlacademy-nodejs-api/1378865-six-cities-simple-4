import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { Controller } from '../../core/controller/controller.abstract.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import { fillDTO } from '../../core/helpers/index.js';
import OfferShortRdo from './rdo/offer-short.rdo.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import { OfferRequestParams, OfferRequestQuery } from '../../types/offer-request-query.type.js';
import OfferDetailedRdo from './rdo/offer-detailed.rdo.js';
import { ParamsDictionary } from 'express-serve-static-core';
import UpdateOfferDto from './dto/update-offer.dto.js';
import { OfferEntity } from './offer.entity';
import { CommentServiceInterface } from '../comment/comment-service.interface.js';
import CommentRdo from '../comment/rdo/comment.rdo.js';
import { ValidateObjectIdMiddleware } from '../../core/middlewares/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../../core/middlewares/validate-dto.middleware.js';
import { DocumentExistsMiddleware } from '../../core/middlewares/document-exists.middleware.js';
import { PrivateRouteMiddleware } from '../../core/middlewares/private-route.middleware.js';
import { CheckUserMatchInOfferMiddleware } from '../../core/middlewares/check-user-match-in-offer.middleware.js';
import OfferPreviewImageRdo from './rdo/offer-preview-image.rdo.js';
import { UploadFileMiddleware } from '../../core/middlewares/upload-file.middleware.js';
import { ConfigInterface } from '../../core/config/config.interface.js';
import { RestSchema } from '../../core/config/rest.schema.js';
import OfferImagesRdo from './rdo/offer-images.rdo.js';
import { UploadMultipleFilesMiddleware } from '../../core/middlewares/upload-multiple-files.middleware.js';
import { REQUIRED_IMAGE_ARRAY_LENGTH } from './offer.constant.js';
import { CityServiceInterface } from '../city/city-service.interface.js';

@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.OfferServiceInterface)
    private readonly offerService: OfferServiceInterface,
    @inject(AppComponent.CommentServiceInterface)
    private readonly commentService: CommentServiceInterface,
    @inject(AppComponent.ConfigInterface) configService: ConfigInterface<RestSchema>,
    @inject(AppComponent.CityServiceInterface)
    private readonly cityService: CityServiceInterface,
  ) {
    super(logger, configService);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new CheckUserMatchInOfferMiddleware(
          this.offerService,
          'У пользователя нет прав редактировать данное предложение по аренде.',
        ),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new CheckUserMatchInOfferMiddleware(
          this.offerService,
          'У пользователя нет прав удалять данное предложение по аренде.',
        ),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new PrivateRouteMiddleware(), new ValidateDtoMiddleware(CreateOfferDto)],
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: '/:offerId/image',
      method: HttpMethod.Post,
      handler: this.uploadPreviewImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new CheckUserMatchInOfferMiddleware(
          this.offerService,
          'У пользователя нет прав редактировать данное предложение по аренде.',
        ),
        new ValidateObjectIdMiddleware('offerId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'previewImage'),
      ],
    });
    this.addRoute({
      path: '/:offerId/pictures',
      method: HttpMethod.Post,
      handler: this.uploadImages,
      middlewares: [
        new PrivateRouteMiddleware(),
        new CheckUserMatchInOfferMiddleware(
          this.offerService,
          'У пользователя нет прав редактировать данное предложение по аренде.',
        ),
        new ValidateObjectIdMiddleware('offerId'),
        new UploadMultipleFilesMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'images'),
      ],
    });
  }

  public async index(
    { query }: Request<unknown, unknown, unknown, OfferRequestQuery>,
    res: Response,
  ): Promise<void> {
    const offers = await this.offerService.find(query.limit);
    const offerToResponse = fillDTO(OfferShortRdo, offers);
    this.ok<OfferShortRdo>(res, offerToResponse);
  }

  public async show(
    { params }: Request<ParamsDictionary | OfferRequestParams>,
    res: Response,
  ): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findById(offerId);

    this.ok<OfferDetailedRdo>(res, fillDTO(OfferDetailedRdo, offer));
  }

  public async delete(
    { params }: Request<ParamsDictionary | OfferRequestParams>,
    res: Response,
  ): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.deleteById(offerId);

    await this.commentService.deleteByOfferId(offerId);

    this.noContent<OfferEntity | null>(res, offer);
  }

  public async update(
    {
      body,
      params,
    }: Request<ParamsDictionary | OfferRequestParams, Record<string, unknown>, UpdateOfferDto>,
    res: Response,
  ): Promise<void> {
    if (body.cityId) {
      const city = await this.cityService.findById(body?.cityId);

      if (!city) {
        this.badRequest(`Город с ID ${body?.cityId} не найден.`);
      }
    }

    const updatedOffer = await this.offerService.updateById(params.offerId, body);

    this.ok<OfferDetailedRdo>(res, fillDTO(OfferDetailedRdo, updatedOffer));
  }

  public async create(
    { body, user }: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response,
  ): Promise<void> {
    const city = await this.cityService.findById(body?.cityId);
    console.log('city', city);
    if (!city) {
      this.badRequest(`Город с ID ${body?.cityId} не найден.`);
    }

    const result = await this.offerService.create({
      ...body,
      userId: user.id,
    });
    const createdOffer = await this.offerService.findById(result.id);

    this.created<OfferDetailedRdo>(res, fillDTO(OfferDetailedRdo, createdOffer));
  }

  public async getComments(
    { params }: Request<ParamsDictionary | OfferRequestParams, object, object>,
    res: Response,
  ): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }

  public async uploadPreviewImage(
    req: Request<ParamsDictionary | OfferRequestParams>,
    res: Response,
  ) {
    const { offerId } = req.params;
    const updateOffer = await this.offerService.updateById(offerId, {
      previewImage: req.file?.filename,
    });
    this.created(res, fillDTO(OfferPreviewImageRdo, updateOffer));
  }

  public async uploadImages(
    { params, files }: Request<ParamsDictionary | OfferRequestParams>,
    res: Response,
  ) {
    const { offerId } = params;

    const images = (files as Express.Multer.File[])?.map((file) => file.filename) as [
      string,
      string,
      string,
      string,
      string,
      string,
    ];

    if (images.length !== REQUIRED_IMAGE_ARRAY_LENGTH) {
      this.badRequest('Images array length must be 6');
    }

    const updatedOffer = await this.offerService.updateById(offerId, { images });
    this.ok(res, fillDTO(OfferImagesRdo, updatedOffer));
  }
}
