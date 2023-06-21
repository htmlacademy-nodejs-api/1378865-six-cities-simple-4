import * as crypto from 'node:crypto';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import * as jose from 'jose';
import { ValidationError } from 'class-validator';
import { JWTPayloadType } from '../../types/jwt-payload.type.js';
import { ValidationErrorField } from '../../types/validation-error-field.type.js';
import { ServiceError } from '../../types/service-error.enum.js';
import { UnknownRecord } from '../../types/unknown-record.type.js';
import { DEFAULT_STATIC_IMAGES } from '../../app/rest.constant.js';

const ALGORITHM = 'sha256';
const CODING_STANDARD = 'utf-8';

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '';
}

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac(ALGORITHM, salt);
  return shaHasher.update(line).digest('hex');
};

export function fillDTO<T, V>(someDto: ClassConstructor<T>, plainObject: V) {
  return plainToInstance(someDto, plainObject, { excludeExtraneousValues: true });
}

export function createErrorObject(
  serviceError: ServiceError,
  message: string,
  details: ValidationErrorField[] = [],
) {
  return {
    errorType: serviceError,
    message,
    details: [...details],
  };
}

export async function createJWT(
  algorithm: string,
  jwtSecret: string,
  payload: JWTPayloadType,
): Promise<string> {
  return new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: algorithm })
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(crypto.createSecretKey(jwtSecret, CODING_STANDARD));
}

export function transformErrors(errors: ValidationError[]): ValidationErrorField[] {
  return errors.map(({ property, value, constraints }) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : [],
  }));
}

export function getFullServerPath(host: string, port: number) {
  return `http://${host}:${port}`;
}
export function isObject(value: unknown) {
  return typeof value === 'object' && value !== null;
}

export function transformProperty(
  property: string,
  someObject: UnknownRecord,
  transformFn: (object: UnknownRecord) => void,
) {
  return Object.keys(someObject).forEach((key) => {
    if (key === property) {
      transformFn(someObject);
    } else if (isObject(someObject[key])) {
      transformProperty(property, someObject[key] as UnknownRecord, transformFn);
    }
  });
}

export function transformObject(
  properties: string[],
  staticPath: string,
  uploadPath: string,
  data: UnknownRecord,
) {
  return properties.forEach((property) => {
    transformProperty(property, data, (target: UnknownRecord) => {
      let rootPath = DEFAULT_STATIC_IMAGES.includes(target[property] as string)
        ? staticPath
        : uploadPath;

      if (Array.isArray(target[property])) {
        target[property] = (target[property] as []).map((elem) => {
          rootPath = DEFAULT_STATIC_IMAGES.includes(elem as string) ? staticPath : uploadPath;

          return `${rootPath}/${elem}`;
        });

        return;
      }

      target[property] = `${rootPath}/${target[property]}`;
    });
  });
}
