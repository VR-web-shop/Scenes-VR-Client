import Command from "../../../abstractions/commands/Command.js";
import AddProductEventListenerCommand from "../../../plugins/webxr/handlers/basket/commands/AddProductEventListenerCommand.js";

/**
 * @class AddWebXRAddProductListenerCommand
 * @classdesc Command for adding a listener for adding a product.
 * @extends Command
 * @property options - The options for the command.
 */
class AddWebXRAddProductListenerCommand extends Command {

    /**
     * @constructor
     * @param {string} type - The type of event: 'addProduct', 'removeProduct', 'clearCart'.
     * @param {Function} callback - The callback for the event.
     */
    constructor(type, callback) {
        super()

        if (type !== 'addProduct' && type !== 'removeProduct' && type !== 'clearCart') {
            throw new Error('The type must be either "addProduct" or "removeProduct or "clearCart"')
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

        await checkoutHandler.invoke(new AddProductEventListenerCommand(this.type, this.callback))
    }
}

export default AddWebXRAddProductListenerCommand
