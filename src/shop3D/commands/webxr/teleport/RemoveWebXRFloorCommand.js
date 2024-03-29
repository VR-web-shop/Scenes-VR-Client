import Command from "../../../abstractions/commands/Command.js";
import RemoveFloorCommand from "../../../plugins/webxr/handlers/teleport/commands/RemoveFloorCommand.js";

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
        const searchPlugin = options.plugins.find('search')
        const webxrPlugin = options.plugins.find('webxr')
        const teleportHandler = webxrPlugin.getHandler('teleport')
        const mesh = searchPlugin.search(this.search)
        
        await teleportHandler.invoke(new RemoveFloorCommand(mesh))
    }
}

export default RemoveWebXRFloorCommand
