import { CliCommandInterface } from './cli-command.interface.js';
import { getMongoURI } from '../helpers/index.js';
import { CityServiceInterface } from '../../modules/city/city-service.interface.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import ConsoleLoggerService from '../logger/console.service.js';
import CityService from '../../modules/city/city.service.js';
import MongoClientService from '../database-client/mongo-client.service.js';
import { CityModel } from '../../modules/city/city.entity.js';
import { DatabaseClientInterface } from '../database-client/database-client.interface.js';
import { CityData } from '../../constants/city.js';
import { City } from 'types';

const DEFAULT_DB_PORT = '27017';
const DEFAULT_CITY_COUNT = 0;

export default class ImportCitiesCommand implements CliCommandInterface {
  public readonly name = '--import-cities';
  private cityService!: CityServiceInterface;
  private databaseService!: DatabaseClientInterface;
  private logger: LoggerInterface;
  private citiesArray: City[];
  private cityCount: number;

  constructor() {
    this.onLine = this.onLine.bind(this);
    this.onComplete = this.onComplete.bind(this);

    this.logger = new ConsoleLoggerService();
    this.cityService = new CityService(this.logger, CityModel);
    this.databaseService = new MongoClientService(this.logger);
    this.citiesArray = Object.values(CityData);
    this.cityCount = DEFAULT_CITY_COUNT;
  }

  private async importSites() {
    return this.citiesArray?.forEach(async (city) => {
      await this.cityService.findOrCreate(city);
      this.cityCount++;

      if (this.citiesArray.length === this.cityCount) {
        this.onComplete();
      }
    });
  }

  private async onLine() {
    await this.importSites();
  }

  private async onComplete() {
    console.log(`${this.cityCount} cities imported.`);
    this.databaseService.disconnect();
  }

  public async execute(
    login: string,
    password: string,
    host: string,
    dbname: string,
  ): Promise<void> {
    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);

    await this.databaseService.connect(uri);

    this.onLine();
  }
}
