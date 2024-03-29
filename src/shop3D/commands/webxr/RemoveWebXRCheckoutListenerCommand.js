import Command from "../../abstractions/commands/Command.js";
import CheckoutUI from "../../plugins/webxr/handlers/basket/CheckoutUI.js";

/**
 * @class RemoveWebXRCheckoutListener
 * @classdesc Command for removing a listener for the checkout.
 * @extends Command
 * @property options - The options for the command.
 */
class RemoveWebXRCheckoutListenerCommand extends Command {

    /**
     * @constructor
     * @param {string} type - The type of event: 'startCheckout', 'cancelCheckout'
     * @param {Function} callback - The callback for the event.
     */
    constructor(type, callback) {
        super()
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
        if (this.type === 'startCheckout') {
            CheckoutUI.getCheckoutInterface().checkout.removeStartCheckoutListener(this.callback)
        }
        else if (this.type === 'cancelCheckout') {
            CheckoutUI.getCheckoutInterface().checkout.removeCancelCheckoutListener(this.callback)
        }
        else {
            throw new Error('The type must be either "startCheckout" or "cancelCheckout"')
        }
    }
}

export default RemoveWebXRCheckoutListenerCommand
