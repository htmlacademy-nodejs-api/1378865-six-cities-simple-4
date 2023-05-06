import { CliCommandInterface } from './cli-command.interface.js';
export default class ImportCommand implements CliCommandInterface {
    readonly name = "--import";
    execute(filename: string): void;
}
