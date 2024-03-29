import Command from "../../abstractions/commands/Command.js";
import SelectableProduct from "../../plugins/webxr/handlers/select/selectables/SelectableProduct.js";
import AddSelectableCommand from "../../plugins/webxr/handlers/select/commands/AddSelectableCommand.js";
import * as THREE from 'three'

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
     * @param {Object} product - The product
     * @param {Object[]} productEntities - The product entities.
     * Possible parameters are: name, uuid
     * Note: Select only one parameter.
     * @example new AddWebXRSelectableCommand( { name: 'primitiveName' }, someProduct )
     * @example new AddWebXRSelectableCommand( { uuid: 'meshUUID' }, someProduct )
     */
    constructor(search, product, productEntities) {
        super()
        this.search = search
        this.product = product
        this.productEntities = productEntities
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
        const selectable = new SelectableProduct(mesh, this.product, this.productEntities)

        await selectHandler.invoke(new AddSelectableCommand(selectable))
    }
}

export default AddWebXRSelectableCommand
