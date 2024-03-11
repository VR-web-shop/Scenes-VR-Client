import Command from "../../abstractions/commands/Command.js";
import SelectableBasket from "../../plugins/webxr/handlers/select/selectables/SelectableBasket.js";
import * as THREE from "three";

/**
 * @class AddWebXRBasketCommand
 * @classdesc Command for adding a webxr basket.
 * @extends Command
 * @property options - The options for the command.
 */
class AddWebXRBasketCommand extends Command {

    /**
     * @constructor
     * @param {Object} search - The search for the object 3d.
     * @param {THREE.Vector3} selectOffset - The offset for the controller select.
     * Possible parameters are: name, uuid
     * Note: Select only one parameter.
     * @example new AddWebXRBasketCommand( { name: 'meshName' } )
     * @example new AddWebXRBasketCommand( { uuid: 'meshUUID' } )
     */
    constructor(search, selectOffset = {x: 0, y: 0, z: 0}) {
        super()
        this.search = search
        this.selectOffset = selectOffset
    }

    /**
     * @function execute
     * @description Add a webxr basket.
     * @param {Object} options - The options for the command.
     * @returns {void}
     */
    async execute(options) {
        const searchPlugin = options.plugins.find('search')
        const webxrPlugin = options.plugins.find('webxr')
        const selectHandler = webxrPlugin.getHandler('select')
        const basketHandler = webxrPlugin.getHandler('basket')
        const mesh = searchPlugin.search(this.search)
        const offset = new THREE.Vector3(this.selectOffset.x, this.selectOffset.y, this.selectOffset.z)
        const selectable = new SelectableBasket(mesh, offset, basketHandler)

        selectHandler.addSelectable(selectable)
        basketHandler.addBasket(selectable)
    }
}

export default AddWebXRBasketCommand
