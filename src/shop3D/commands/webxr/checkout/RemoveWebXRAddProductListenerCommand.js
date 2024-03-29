import Command from "../../../abstractions/commands/Command.js";
import RemoveProductEventListenerCommand from "../../../plugins/webxr/handlers/basket/commands/RemoveProductEventListenerCommand.js";

/**
 * @class RemoveWebXRAddProductListenerCommand
 * @classdesc Command for removing a listener for adding a product.
 * @extends Command
 * @property options - The options for the command.
 */
class RemoveWebXRAddProductListenerCommand extends Command {

    /**
     * @constructor
     * @param {string} type - The type of event: 'addProduct', 'removeProduct'
     * @param {Function} callback - The callback for the event.
     */
    constructor(type, callback) {
        super()

        if (type !== 'addProduct' && type !== 'removeProduct') {
            throw new Error('The type must be either "addProduct" or "removeProduct"')
        }

        this.type = type
        this.callback = callback
    }

    /**
     * @function execute
     * @description Execute the command.
     * @param {Object} options - The options for the command.
     * @returns {void}
     */
    async execute(options) {
        const webxrPlugin = options.plugins.find('webxr')
        const checkoutHandler = webxrPlugin.getHandler('checkout')

        await checkoutHandler.invoke(new RemoveProductEventListenerCommand(this.type, this.callback))
    }
}

export default RemoveWebXRAddProductListenerCommand
