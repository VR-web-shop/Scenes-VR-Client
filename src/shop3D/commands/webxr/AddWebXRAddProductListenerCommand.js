import Command from "../../abstractions/commands/Command.js";
import SelectableBasket from "../../plugins/webxr/handlers/select/selectables/SelectableBasket.js";

/**
 * @class AddWebXRAddProductListenerCommand
 * @classdesc Command for adding a listener for adding a product.
 * @extends Command
 * @property options - The options for the command.
 */
class AddWebXRAddProductListenerCommand extends Command {

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
        SelectableBasket.getSelectableBasket().inventory.addEventListener(this.type, this.callback)
    }
}

export default AddWebXRAddProductListenerCommand
