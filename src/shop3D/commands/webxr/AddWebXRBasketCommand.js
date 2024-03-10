import Command from "../../abstractions/commands/Command.js";
import { SelectableBasket } from "../../plugins/webxr/SelectHandler.js";

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
     * Possible parameters are: name, uuid
     * Note: Select only one parameter.
     * @example new AddWebXRBasketCommand( { name: 'meshName' } )
     * @example new AddWebXRBasketCommand( { uuid: 'meshUUID' } )
     */
    constructor(search) {
        super()
        this.search = search
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
        const selectable = new SelectableBasket(mesh, basketHandler)

        selectHandler.addSelectable(selectable)
        basketHandler.addBasket(mesh)
    }
}

export default AddWebXRBasketCommand
