import Command from "../../../abstractions/commands/Command.js";
import AddCheckoutEventListenerCommand from "../../../plugins/webxr/handlers/basket/commands/AddCheckoutEventListenerCommand.js";

/**
 * @class AddWebXRCheckoutListenerCommand
 * @classdesc Command for adding a listener for the checkout.
 * @extends Command
 * @property options - The options for the command.
 */
class AddWebXRCheckoutListenerCommand extends Command {

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

        await checkoutHandler.invoke(new AddCheckoutEventListenerCommand(this.type, this.callback))
    }
}

export default AddWebXRCheckoutListenerCommand
