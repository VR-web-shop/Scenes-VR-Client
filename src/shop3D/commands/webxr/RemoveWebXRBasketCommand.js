import Command from "../../abstractions/commands/Command.js";
import FindUIObjectByName from "../../plugins/webxr/handlers/gui/commands/FindUIObjectByName.js";
import RemoveUIObjectCommand from "../../plugins/webxr/handlers/gui/commands/RemoveUIObjectCommand.js";
import RemoveSelectableCommand from "../../plugins/webxr/handlers/select/commands/RemoveSelectableCommand.js";
import RemoveBasketSelectableCommand from "../../plugins/webxr/handlers/basket/commands/RemoveBasketSelectableCommand.js";
import GetBasketSelectableCommand from "../../plugins/webxr/handlers/basket/commands/GetBasketSelectableCommand.js";
import SetBasketUIInterfaceCommand from "../../plugins/webxr/handlers/basket/commands/SetBasketUIInterfaceCommand.js";

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
        const basketHandler = webxrPlugin.getHandler('basket')
        const guiHandler = webxrPlugin.getHandler('gui')
        
        const basket = await basketHandler.invoke(new GetBasketSelectableCommand())
        const basketUIContainer = await guiHandler.invoke(new FindUIObjectByName('basket'))
        
        if (basketUIContainer) {
            await guiHandler.invoke(new RemoveUIObjectCommand(basketUIContainer))
            await basketHandler.invoke(new SetBasketUIInterfaceCommand(null))
        }

        await selectHandler.invoke(new RemoveSelectableCommand(basket))
        await basketHandler.invoke(new RemoveBasketSelectableCommand())
    }
}

export default RemoveWebXRBasketCommand
