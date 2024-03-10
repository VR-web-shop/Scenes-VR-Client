import Command from "../../abstractions/commands/Command.js";
import CachesPlugin from "../../plugins/CachesPlugin.js";

/**
 * @class RemoveWebXRFloorCommand
 * @classdesc Command for removing a webxr floor.
 * @extends Command
 * @property options - The options for the command.
 */
class RemoveWebXRFloorCommand extends Command {

    /**
     * @constructor
     * @param {Object} search - The search for the mesh or primitive.
     * Possible parameters are: name, uuid
     * Note: Select only one parameter.
     * @example new RemoveWebXRFloorCommand( { name: 'primitiveName' } )
     * @example new RemoveWebXRFloorCommand( { uuid: 'meshUUID' } )
     */
    constructor(search) {
        super()
        this.search = search
    }

    /**
     * @function execute
     * @description Remove a webxr floor.
     * @param {Object} options - The options for the command.
     * @returns {void}
     */
    async execute(options) {
        const mesh = options.plugins.find('search').search(this.search)
        options.plugins.find('webxr').getHandler('teleport').removeFloor(mesh)
    }
}

export default RemoveWebXRFloorCommand
