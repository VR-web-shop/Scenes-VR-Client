import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";

/**
 * @class RemoveProductEventListenerCommand
 * @classdesc command for removing an event listener for product changes.
 */
class RemoveProductEventListenerCommand extends WebXRHandlerCommand {

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
        options.checkoutProductsDispatcher.removeEventListener(this.type, this.callback)
    }
}

export default RemoveProductEventListenerCommand
