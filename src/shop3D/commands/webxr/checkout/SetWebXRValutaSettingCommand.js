import Command from "../../../abstractions/commands/Command.js";
import SetValutaSettingCommand from "../../../plugins/webxr/handlers/select/commands/SetValutaSettingCommand.js";

/**
 * @class SetWebXRValutaSettingCommand
 * @classdesc Command for setting valuta setting.
 * @extends Command
 * @property options - The options for the command.
 */
class SetWebXRValutaSettingCommand extends Command {
    
    /**
     * @constructor
     * @param {string} name - The name for the valuta setting.
     * @param {string} short - The short for the valuta setting.
     * @param {string} symbol - The symbol for the valuta setting.
     */
    constructor(name, short, symbol) {
        super()

        if (typeof name !== 'string') {
            throw new Error('The name must be a string')
        }

        if (typeof short !== 'string') {
            throw new Error('The short must be a string')
        }

        if (typeof symbol !== 'string') {
            throw new Error('The symbol must be a string')
        }

        this.name = name
        this.short = short
        this.symbol = symbol
    }

    /**
     * @function execute
     * @description Execute the command.
     * @param {Object} options - The options for the command.
     * @returns {void}
     */
    async execute(options) {
        await options.plugins.find('webxr')
            .getHandler('select')
            .invoke(new SetValutaSettingCommand(this.name, this.short, this.symbol))
    }
}

export default SetWebXRValutaSettingCommand
