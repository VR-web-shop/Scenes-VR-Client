import Command from "../../../abstractions/commands/Command.js";
import RemoveSelectableCommand from "../../../plugins/webxr/handlers/select/commands/RemoveSelectableCommand.js";

/**
 * @class RemoveWebXRSelectableCommand
 * @classdesc Command for removing a webxr selectable.
 * @extends Command
 * @property options - The options for the command.
 */
class RemoveWebXRSelectableCommand extends Command {

    /**
     * @constructor
     * @param {Object} search - The search for the mesh or primitive.
     * Possible parameters are: name, uuid
     * Note: Select only one parameter.
     * @example new RemoveWebXRSelectableCommand( { name: 'primitiveName' } )
     * @example new RemoveWebXRSelectableCommand( { uuid: 'meshUUID' } )
     */
    constructor(search) {
        super()
        this.search = search
    }

    /**
     * @function execute
     * @description Remove a webxr selectable.
     * @param {Object} options - The options for the command.
     * @returns {void}
     */
    async execute(options) {
        const searchPlugin = options.plugins.find('search')
        const webxrPlugin = options.plugins.find('webxr')
        const selectHandler = webxrPlugin.getHandler('select')
        const mesh = searchPlugin.search(this.search)
        
        await selectHandler.invoke(new RemoveSelectableCommand(mesh))
    }
}

export default RemoveWebXRSelectableCommand
