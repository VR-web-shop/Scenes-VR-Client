import Command from "../../../abstractions/commands/Command.js";
import SelectableProduct from "../../../plugins/webxr/handlers/select/selectables/SelectableProduct.js";
import AddSelectableCommand from "../../../plugins/webxr/handlers/select/commands/AddSelectableCommand.js";
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
    constructor(search, id, product, productEntities, 
        uiOffset = { x: 0, y: 0.08, z: 0 },
        uiRotation = { x: 0, y: 0, z: 0 },
        uiScale = { x: 1, y: 1, z: 1 }) {
        super()
        this.search = search
        this.id = id
        this.product = product
        this.productEntities = productEntities
        this.uiOffset = uiOffset
        this.uiRotation = uiRotation
        this.uiScale = uiScale
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
        const checkoutHandler = webxrPlugin.getHandler('checkout')
        const mesh = searchPlugin.search(this.search)
        const selectable = new SelectableProduct(mesh, this.id, this.product, this.productEntities, checkoutHandler)
        const ui = await SelectableProduct.buildUI(selectable, this.uiOffset, this.uiRotation, this.uiScale)
        selectable.setUI(ui)

        await selectHandler.invoke(new AddSelectableCommand(selectable))
    }
}

export default AddWebXRSelectableCommand
