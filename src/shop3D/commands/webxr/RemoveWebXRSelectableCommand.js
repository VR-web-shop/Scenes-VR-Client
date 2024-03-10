import Command from "../../abstractions/commands/Command.js";
import CachesPlugin from "../../plugins/CachesPlugin.js";

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
        const mesh = options.plugins.find('search').search(this.search)
        options.plugins.find('webxr').getHandler('select').removeSelectable(mesh)
    }
}

export default RemoveWebXRSelectableCommand
