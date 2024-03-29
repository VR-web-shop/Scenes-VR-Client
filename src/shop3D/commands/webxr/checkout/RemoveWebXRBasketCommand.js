import Command from "../../../../abstractions/commands/Command.js";
import FindUIObjectByName from "../../../../plugins/webxr/handlers/gui/commands/FindUIObjectByName.js";
import RemoveUIObjectCommand from "../../../../plugins/webxr/handlers/gui/commands/RemoveUIObjectCommand.js";
import RemoveSelectableCommand from "../../../../plugins/webxr/handlers/select/commands/RemoveSelectableCommand.js";

import SetCheckoutUIInterfaceCommand from "../../../../plugins/webxr/handlers/basket/commands/SetCheckoutUIInterfaceCommand.js";
import SetQuantityUIInterfaceCommand from "../../../../plugins/webxr/handlers/basket/commands/SetQuantityUIInterfaceCommand.js";
import SelectableBasket from "../../../../plugins/webxr/handlers/select/selectables/SelectableBasket.js";
import SelectablePocket from "../../../../plugins/webxr/handlers/select/selectables/SelectablePocket.js";

/**
 * @class RemoveWebXRBasketCommand
 * @classdesc Command for removing a webxr basket.
 * @extends Command
 * @property options - The options for the command.
 */
class RemoveWebXRBasketCommand extends Command {

    /**
     * @constructor
     */
    constructor() {
        super()
    }

    /**
     * @function execute
     * @description Remove a webxr basket.
     * @param {Object} options - The options for the command.
     * @returns {void}
     */
    async execute(options) {
        const webxrPlugin = options.plugins.find('webxr')
        const selectHandler = webxrPlugin.getHandler('select')
        const basketHandler = webxrPlugin.getHandler('checkout')
        const guiHandler = webxrPlugin.getHandler('gui')

        const basket = SelectableBasket.getSelectableBasket()
        const pocket = SelectablePocket.getSelectablePocket()
        const basketUIContainer = await guiHandler.invoke(new FindUIObjectByName('basket'))
        const quantityUIContainer = await guiHandler.invoke(new FindUIObjectByName('quantity'))

        await guiHandler.invoke(new RemoveUIObjectCommand(basketUIContainer))
        await guiHandler.invoke(new RemoveUIObjectCommand(quantityUIContainer))
        await basketHandler.invoke(new SetCheckoutUIInterfaceCommand(null))
        await basketHandler.invoke(new SetQuantityUIInterfaceCommand(null))
        await selectHandler.invoke(new RemoveSelectableCommand(basket))
        await selectHandler.invoke(new RemoveSelectableCommand(pocket))
    }
}

export default RemoveWebXRBasketCommand
