import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";

/**
 * @class RemoveCheckoutEventListenerCommand
 * @classdesc command for removing an event listener from a checkout.
 */
class RemoveCheckoutEventListenerCommand extends WebXRHandlerCommand {

    /**
     * @constructor
     * @param {string} type - The type of event: 'startCheckout', 'cancelCheckout'
     * @param {Function} callback - The callback for the event.
     */
    constructor(type, callback) {
        super()
        
        if (type !== 'startCheckout' && type !== 'cancelCheckout') {
            throw new Error('The type must be either "startCheckout" or "cancelCheckout"')
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
        if (options.checkoutUI === undefined) {
            throw new Error('Set a checkoutUI by the SetCheckoutUIInterfaceCommand before adding a listener')
        }

        options.checkoutUI.removeEventListener(this.type, this.callback)
    }
}

export default RemoveCheckoutEventListenerCommand
