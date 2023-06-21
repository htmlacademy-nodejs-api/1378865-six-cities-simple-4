import { readFileSync } from 'node:fs';
import { CliCommandInterface } from './cli-command.interface.js';
import path from 'node:path';

const CODING_STANDARD = 'utf-8';
const PACKAGE_PATH = './package.json';

export default class VersionCommand implements CliCommandInterface {
  public readonly name = '--version';

  private readVersion(): string {
    const contentPageJSON = readFileSync(path.resolve(PACKAGE_PATH), CODING_STANDARD);
    const content = JSON.parse(contentPageJSON);
    return content.version;
  }

  public async execute(): Promise<void> {
    const version = this.readVersion();
    console.log(version);
  }
}
