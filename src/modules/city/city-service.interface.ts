import { DocumentType } from '@typegoose/typegoose';
import CreateCityDto from './dto/create-city.dto';
import { CityEntity } from './city.entity';
import { DocumentExistsInterface } from '../../core/middlewares/document-exists.interface.js';

export interface CityServiceInterface extends DocumentExistsInterface {
  create(dto: CreateCityDto): Promise<DocumentType<CityEntity>>;
  findByName(name: string): Promise<DocumentType<CityEntity> | null>;
  findOrCreate(dto: CreateCityDto): Promise<DocumentType<CityEntity>>;
  find(): Promise<DocumentType<CityEntity>[]>;
  findById(offerId: string): Promise<DocumentType<CityEntity> | null>;
  exists(documentId: string): Promise<boolean>;
}
