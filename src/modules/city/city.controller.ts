import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { Controller } from '../../core/controller/controller.abstract.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { fillDTO } from '../../core/helpers/index.js';
import { CityServiceInterface } from './city-service.interface.js';
import CityRdo from './rdo/city.rdo.js';
import { ParamsDictionary } from 'express-serve-static-core';
import { cityRequestParams, cityRequestQuery } from '../../types/city-request-query.type.js';
import { OfferServiceInterface } from '../offer/offer-service.interface.js';
import OfferShortRdo from '../offer/rdo/offer-short.rdo.js';
import { ValidateObjectIdMiddleware } from '../../core/middlewares/validate-objectid.middleware.js';
import { DocumentExistsMiddleware } from '../../core/middlewares/document-exists.middleware.js';
import { ConfigInterface } from '../../core/config/config.interface.js';
import { RestSchema } from '../../core/config/rest.schema.js';

@injectable()
export default class CityController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponent.CityServiceInterface) private readonly cityService: CityServiceInterface,
    @inject(AppComponent.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
    @inject(AppComponent.ConfigInterface) configService: ConfigInterface<RestSchema>,
  ) {
    super(logger, configService);

    this.logger.info('Register routes for CityController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/:cityId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('cityId'),
        new DocumentExistsMiddleware(this.cityService, 'City', 'cityId'),
      ],
    });

    this.addRoute({
      path: '/:cityId/offers',
      method: HttpMethod.Get,
      handler: this.getOffersFromCity,
      middlewares: [
        new ValidateObjectIdMiddleware('cityId'),
        new DocumentExistsMiddleware(this.cityService, 'City', 'cityId'),
      ],
    });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const cites = await this.cityService.find();
    const citesToResponse = fillDTO(CityRdo, cites);
    this.ok(res, citesToResponse);
  }

  public async show(
    { params }: Request<ParamsDictionary | cityRequestParams>,
    res: Response,
  ): Promise<void> {
    const { cityId } = params;
    const city = await this.cityService.findById(cityId);

    this.ok(res, fillDTO(CityRdo, city));
  }

  public async getOffersFromCity(
    {
      params,
      query,
    }: Request<ParamsDictionary | cityRequestParams, unknown, unknown, cityRequestQuery>,
    res: Response,
  ): Promise<void> {
    const offers = await this.offerService.findByCityID(params.cityId, query.limit);
    this.ok(res, fillDTO(OfferShortRdo, offers));
  }
}
