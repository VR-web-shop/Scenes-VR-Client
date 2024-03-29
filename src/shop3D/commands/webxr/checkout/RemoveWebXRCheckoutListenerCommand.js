import Command from "../../../abstractions/commands/Command.js";
import RemoveCheckoutEventListenerCommand from "../../../plugins/webxr/handlers/basket/commands/RemoveCheckoutEventListenerCommand.js";

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
        const webxrPlugin = options.plugins.find('webxr')
        const checkoutHandler = webxrPlugin.getHandler('checkout')

        await checkoutHandler.invoke(new RemoveCheckoutEventListenerCommand(this.type, this.callback))
    }
}

export default RemoveWebXRCheckoutListenerCommand
