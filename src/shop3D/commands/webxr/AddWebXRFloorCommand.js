import Command from "../../abstractions/commands/Command.js";

/**
 * @class AddWebXRFloor
 * @classdesc Command for adding a webxr floor.
 * @extends Command
 * @property options - The options for the command.
 */
class AddWebXRFloorCommand extends Command {

    /**
     * @constructor
     * @param {Object} search - The search for the object 3d.
     * Possible parameters are: name, uuid
     * Note: Select only one parameter.
     * @example new AddWebXRFloor( { name: 'meshName' } )
     * @example new AddWebXRFloor( { uuid: 'meshUUID' } )
     */
    constructor(search) {
        super()
        this.search = search
    }

    /**
     * @function execute
     * @description Add a webxr floor.
     * @param {Object} options - The options for the command.
     * @returns {void}
     */
    async execute(options) {
        const mesh = options.plugins.find('search').search(this.search)
        options.plugins.find('webxr').getHandler('teleport').addFloor(mesh)
    }
}

export default AddWebXRFloorCommand
