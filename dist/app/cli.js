export default class CLIApplication {
    constructor() {
        this.commands = {};
        this.defaultCommand = '--help';
    }
    parseCommand(cliArguments) {
        const parsedCommand = {};
        let command = '';
        return cliArguments.reduce((acc, item) => {
            if (item.startsWith('--')) {
                acc[item] = [];
                command = item;
            }
            else if (command && item) {
                acc[command].push(item);
            }
            return acc;
        }, parsedCommand);
    }
    getCommand(commandName) {
        return this.commands[commandName] ?? this.commands[this.defaultCommand];
    }
    processCommand(argv) {
        const parsedCommand = this.parseCommand(argv);
        const [commandName] = Object.keys(parsedCommand);
        const command = this.getCommand(commandName);
        const commandArguments = parsedCommand[commandName] ?? [];
        command.execute(...commandArguments);
    }
    registerCommands(commandList) {
        commandList.reduce((acc, command) => {
            const cliCommand = command;
            acc[cliCommand.name] = cliCommand;
            return acc;
        }, this.commands);
    }
}
//# sourceMappingURL=cli.js.map