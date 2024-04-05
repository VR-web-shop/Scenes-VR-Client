import Command from "../../../abstractions/commands/Command.js";
import UpdateSelectableCommand from "../../../plugins/webxr/handlers/select/commands/UpdateSelectableCommand.js";

/**
 * @class UpdateWebXRProductCommand
 * @classdesc Command for updating a product.
 * @extends Command
 * @property options - The options for the command.
 */
class UpdateWebXRProductCommand extends Command {

    /**
     * @constructor
     * @param {string} id - The id for the product.
     * @param {Object} product - The product.
     */
    constructor(id, product) {
        super()

        if (typeof id !== 'string') {
            throw new Error('The id must be a string')
        }

        if (typeof product !== 'object') {
            throw new Error('The product must be an object')
        }

        this.id = id
        this.product = product
    }

    /**
     * @function execute
     * @description Execute the command.
     * @param {Object} options - The options for the command.
     * @returns {void}
     */
    async execute(options) {
        const webxrPlugin = options.plugins.find('webxr')
        const selectHandler = webxrPlugin.getHandler('select')

        /**
         * To tell the selectable product about the product entities only known
         * by the shopping cart sdk, we need to update the selectable product
         * with the unknown product entities.
         */
        await selectHandler.invoke(new UpdateSelectableCommand(this.id, {
            updateProduct: this.product,
        }))
    }
}

export default UpdateWebXRProductCommand
