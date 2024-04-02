import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";

/**
 * @class AddProductEventListenerCommand
 * @classdesc command for adding an event listener for product changes.
 */
class AddProductEventListenerCommand extends WebXRHandlerCommand {

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
        options.addEventListener(this.type, this.callback)
    }
}

export default AddProductEventListenerCommand
