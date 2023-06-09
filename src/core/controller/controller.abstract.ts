import { Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'inversify';
import asyncHandler from 'express-async-handler';
import { ControllerInterface } from './controller.interface.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import { RouteInterface } from '../../types/route.interface.js';
import HttpError from '../errors/http-error.js';
import { ConfigInterface } from '../config/config.interface.js';
import { RestSchema } from '../config/rest.schema.js';
import { UnknownRecord } from '../../types/unknown-record.type.js';
import { getFullServerPath, transformObject } from '../helpers/index.js';
import { STATIC_RESOURCE_FIELDS } from '../../app/rest.constant.js';

@injectable()
export abstract class Controller implements ControllerInterface {
  private readonly _router: Router;

  constructor(
    protected readonly logger: LoggerInterface,
    protected readonly configService: ConfigInterface<RestSchema>,
  ) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public addRoute(route: RouteInterface) {
    const routeHandler = asyncHandler(route.handler.bind(this));
    const middlewares = route.middlewares?.map((middleware) =>
      asyncHandler(middleware.execute.bind(middleware)),
    );

    const allHandlers = middlewares ? [...middlewares, routeHandler] : routeHandler;
    this._router[route.method](route.path, allHandlers);
    this.logger.info(`Route registered: ${route.method.toUpperCase()} ${route.path}`);
  }

  protected addStaticPath(data: UnknownRecord): void {
    const fullServerPath = getFullServerPath(
      this.configService.get('HOST'),
      this.configService.get('PORT'),
    );
    transformObject(
      STATIC_RESOURCE_FIELDS,
      `${fullServerPath}/${this.configService.get('STATIC_DIRECTORY_PATH')}`,
      `${fullServerPath}/${this.configService.get('UPLOAD_DIRECTORY')}`,
      data,
    );
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    this.addStaticPath(data as UnknownRecord);

    res.type('application/json').status(statusCode).json(data);
  }

  public ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public notFound(errorText: string, detail?: string): void {
    throw new HttpError(StatusCodes.NOT_FOUND, errorText, detail);
  }

  public noContent<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }

  public conflict(errorText: string, detail?: string): void {
    throw new HttpError(StatusCodes.CONFLICT, errorText, detail);
  }

  public unauthorized(errorText: string, detail?: string): void {
    throw new HttpError(StatusCodes.UNAUTHORIZED, errorText, detail);
  }

  public notImplemented(detail?: string): void {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented', detail);
  }

  public insufficientRights(errorText: string, detail?: string): void {
    throw new HttpError(StatusCodes.FORBIDDEN, errorText, detail);
  }

  public badRequest(errorText: string, detail?: string): void {
    throw new HttpError(StatusCodes.BAD_REQUEST, errorText, detail);
  }
}
