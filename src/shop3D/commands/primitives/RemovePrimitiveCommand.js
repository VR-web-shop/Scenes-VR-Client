import Command from "../../abstractions/commands/Command.js";

/**
 * @class RemovePrimitiveCommand
 * @classdesc Command for removing a primitive.
 * @extends Command
 * @property options - The options for the command.
 */
class RemovePrimitiveCommand extends Command {

    /**
     * @constructor
     * @param {Object} search - The search parameters for the mesh.
     * Possible parameters are: name, uuid
     * Note: Select only one parameter.
     */
    constructor(search = {}) {
        super()
        this.search = search
    }

    /**
     * @function execute
     * @description Remove a primitive.
     * @param {Object} options - The options for the command.
     * @returns {void}
     */
    async execute(options) {
        const plugin = options.plugins.find('primitives')

        if (this.search.name) {
            plugin.removePrimitiveByName(this.search.name)
        } else if (this.search.uuid) {
            plugin.removePrimitiveByUUID(this.search.uuid)
        } else {
            throw new Error('Invalid search parameters for primitive removal.')
        }
    }
}

export default RemovePrimitiveCommand
