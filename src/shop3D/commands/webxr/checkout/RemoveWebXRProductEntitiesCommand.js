import Command from "../../../abstractions/commands/Command.js";
import UpdateSelectableCommand from "../../../plugins/webxr/handlers/select/commands/UpdateSelectableCommand.js";

/**
 * @class RemoveWebXRProductEntitiesCommand
 * @classdesc Command for removing product entities.
 * @extends Command
 * @property options - The options for the command.
 */
class RemoveWebXRProductEntitiesCommand extends Command {

    /**
     * @constructor
     * @param {string} id - The id for the product.
     * @param {Object[]} productEntities - The product entities.
     * @param {boolean} blockIfReserved - The block if reserved flag.
     */
    constructor(id, productEntities, blockIfReserved=false) {
        super()

        if (typeof id !== 'string') {
            throw new Error('The id must be a string')
        }

        if (!Array.isArray(productEntities)) {
            throw new Error('The productEntities must be an array')
        }

        if (typeof blockIfReserved !== 'boolean') {
            throw new Error('The blockIfReserved must be a boolean')
        }

        this.id = id
        this.productEntities = productEntities
        this.blockIfReserved = blockIfReserved
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
            removeProductEntity: this.productEntities,
            releaseReservedProductEntities: this.productEntities,
            blockIfReserved: this.blockIfReserved
        }))
    }
}

export default RemoveWebXRProductEntitiesCommand
