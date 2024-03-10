import Command from "../../abstractions/commands/Command.js";

/**
 * @class RemoveLightCommand
 * @classdesc Command for removing a light.
 * @extends Command
 * @property options - The options for the command.
 */
class RemoveLightCommand extends Command {

    /**
     * @constructor
     * @param {Object} search - The search parameters for the light.
     * Possible parameters are: name, uuid, type
     * Note: Select only one parameter.
     */
    constructor(search={}) {
        super()
        this.search = search
    }

    /**
     * @function execute
     * @description Remove a light.
     * @param {Object} options - The options for the command.
     * @returns {void}
     */
    async execute(options) {
        const lights = options.plugins.find('lights')

        if (this.search.name) {
            lights.removeLightByName(this.search.name)
        } else if (this.search.uuid) {
            lights.removeLightByUUID(this.search.uuid)
        } else if (this.search.type) {
            lights.removeLightByType(this.search.type)
        } else {
            throw new Error('Invalid search parameters for light removal.')
        }
    }
}

export default RemoveLightCommand
