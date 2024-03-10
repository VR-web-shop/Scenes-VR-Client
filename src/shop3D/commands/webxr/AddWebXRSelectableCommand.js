import Command from "../../abstractions/commands/Command.js";
import { SelectableProduct } from "../../plugins/webxr/SelectHandler.js";

/**
 * @class AddWebXRSelectableCommand
 * @classdesc Command for adding a webxr selectable.
 * @extends Command
 * @property options - The options for the command.
 */
class AddWebXRSelectableCommand extends Command {

    /**
     * @constructor
     * @param {Object} search - The search for the mesh or primitive.
     * Possible parameters are: name, uuid
     * Note: Select only one parameter.
     * @example new AddWebXRSelectableCommand( { name: 'primitiveName' } )
     * @example new AddWebXRSelectableCommand( { uuid: 'meshUUID' } )
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
        const selectable = new SelectableProduct(mesh)
        options.plugins.find('webxr').getHandler('select').addSelectable(selectable)
    }
}

export default AddWebXRSelectableCommand
