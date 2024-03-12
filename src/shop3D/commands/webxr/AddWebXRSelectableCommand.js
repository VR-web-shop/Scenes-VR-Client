import Command from "../../abstractions/commands/Command.js";
import SelectableProduct from "../../plugins/webxr/handlers/select/selectables/SelectableProduct.js";
import AddSelectableCommand from "../../plugins/webxr/handlers/select/commands/AddSelectableCommand.js";

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
        const searchPlugin = options.plugins.find('search')
        const webxrPlugin = options.plugins.find('webxr')
        const selectHandler = webxrPlugin.getHandler('select')
        const mesh = searchPlugin.search(this.search)
        const selectable = new SelectableProduct(mesh)

        await selectHandler.invoke(new AddSelectableCommand(selectable))
    }
}

export default AddWebXRSelectableCommand
