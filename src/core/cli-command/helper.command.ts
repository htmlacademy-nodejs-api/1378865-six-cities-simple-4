import chalk from 'chalk';
import { CliCommandInterface } from './cli-command.interface.js';

const RED_COLOR = 49;
const GREEN_COLOR = 132;
const BLUE_COLOR = 149;

export default class HelpCommand implements CliCommandInterface {
  public readonly name = '--help';

  public async execute(): Promise<void> {
    console.log(`
        Программа для подготовки данных для REST API сервера.
        Пример:
            main.js --<${chalk.rgb(RED_COLOR, GREEN_COLOR, BLUE_COLOR)('command')}> [${chalk.blue('--arguments')}]
        Команды:
            ${chalk.rgb(RED_COLOR, GREEN_COLOR, BLUE_COLOR)('--version')}:                                                           ${chalk.magenta('# выводит номер версии')}
            ${chalk.rgb(RED_COLOR, GREEN_COLOR, BLUE_COLOR)('--help')}:                                                              ${chalk.magenta('# печатает этот текст')}
            ${chalk.rgb(RED_COLOR, GREEN_COLOR, BLUE_COLOR)('--import')} <path> <DB_USER> <DB_PASSWORD> <DB_HOST> <DB_NAME> <SALT>:  ${chalk.magenta('# импортирует данные из TSV')}
            ${chalk.rgb(RED_COLOR, GREEN_COLOR, BLUE_COLOR)('--generate')} <number> <path> <url>:                                    ${chalk.magenta('# генерирует заданное количество тестовых данных')}
            ${chalk.rgb(RED_COLOR, GREEN_COLOR, BLUE_COLOR)('--import-cities')} <DB_USER> <DB_PASSWORD> <DB_HOST> <DB_NAME>:         ${chalk.magenta('# Импортирует города')}
        `);
  }
}
