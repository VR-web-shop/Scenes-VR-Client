import Command from "../../../abstractions/commands/Command.js";
import UpdateSelectableCommand from "../../../plugins/webxr/handlers/select/commands/UpdateSelectableCommand.js";

/**
 * @class AddWebXRProductEntitiesCommand
 * @classdesc Command for adding product entities.
 * @extends Command
 * @property options - The options for the command.
 */
class AddWebXRProductEntitiesCommand extends Command {

    /**
     * @constructor
     * @param {string} id - The id for the product.
     * @param {Object[]} productEntities - The product entities.
     */
    constructor(id, productEntities) {
        super()

        if (typeof id !== 'string') {
            throw new Error('The id must be a string')
        }

        if (!Array.isArray(productEntities)) {
            throw new Error('The productEntities must be an array')
        }

        this.id = id
        this.productEntities = productEntities
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
            addProductEntities: this.productEntities,
        }))
    }
}

export default AddWebXRProductEntitiesCommand
