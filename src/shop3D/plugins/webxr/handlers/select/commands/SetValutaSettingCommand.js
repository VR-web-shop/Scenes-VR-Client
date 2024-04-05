import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";
import SelectableProduct from "../selectables/SelectableProduct.js";

/**
 * @class SetValutaSettingCommand
 * @classdesc command for setting valuta setting.
 */
class SetValutaSettingCommand extends WebXRHandlerCommand {

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
     * @async
     */
    async execute(options) {
        SelectableProduct.setValuta({
            name: this.name,
            short: this.short,
            symbol: this.symbol
        })
        
        for (let i = 0; i < options.selectables.length; i++) {
            options.selectables[i].ui?.updateUI()
        }
    }
}

export default SetValutaSettingCommand
