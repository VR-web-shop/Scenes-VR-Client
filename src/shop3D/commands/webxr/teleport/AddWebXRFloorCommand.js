import Command from "../../../abstractions/commands/Command.js";
import AddFloorCommand from "../../../plugins/webxr/handlers/teleport/commands/AddFloorCommand.js";

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
        const searchPlugin = options.plugins.find('search')
        const webxrPlugin = options.plugins.find('webxr')
        const teleportHandler = webxrPlugin.getHandler('teleport')
        const mesh = searchPlugin.search(this.search)
        
        await teleportHandler.invoke(new AddFloorCommand(mesh))
    }
}

export default AddWebXRFloorCommand
