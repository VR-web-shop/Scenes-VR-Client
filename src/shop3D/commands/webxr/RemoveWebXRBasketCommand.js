import Command from "../../abstractions/commands/Command.js";

/**
 * @class RemoveWebXRBasketCommand
 * @classdesc Command for removing a webxr basket.
 * @extends Command
 * @property options - The options for the command.
 */
class RemoveWebXRBasketCommand extends Command {

    /**
     * @constructor
     */
    constructor() {
        super()
    }

    /**
     * @function execute
     * @description Remove a webxr basket.
     * @param {Object} options - The options for the command.
     * @returns {void}
     */
    async execute(options) {
        const webxrPlugin = options.plugins.find('webxr')
        const selectHandler = webxrPlugin.getHandler('select')
        const basketHandler = webxrPlugin.getHandler('basket')
        const basket = basketHandler.getBasket()

        selectHandler.removeSelectable(basket)
        basketHandler.removeBasket()
    }
}

export default RemoveWebXRBasketCommand
