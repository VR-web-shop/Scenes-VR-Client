import Command from "../../../abstractions/commands/Command.js";
import RemoveCheckoutCommand from "../../../plugins/webxr/handlers/basket/commands/RemoveCheckoutCommand.js";

/**
 * @class RemoveWebXRCheckoutCommand
 * @classdesc Command for removing a webxr checkout.
 * @extends Command
 * @property options - The options for the command.
 */
class RemoveWebXRCheckoutCommand extends Command {

    /**
     * @constructor
     * @param {Object} search - The search for the object 3d.
     * Possible parameters are: name, uuid
     * Note: Select only one parameter.
     * @example new RemoveWebXRCheckoutCommand( { name: 'meshName' } )
     * @example new RemoveWebXRCheckoutCommand( { uuid: 'meshUUID' } )
     */
    constructor(search) {
        super()
        this.search = search
    }

    /**
     * @function execute
     * @description Remove a webxr checkout.
     * @param {Object} options - The options for the command.
     * @returns {void}
     */
    async execute(options) {
        const searchPlugin = options.plugins.find('search')
        const webxrPlugin = options.plugins.find('webxr')
        const basketHandler = webxrPlugin.getHandler('basket')
        const mesh = searchPlugin.search(this.search)
        
        await basketHandler.invoke(new RemoveCheckoutCommand(mesh))
    }
}

export default RemoveWebXRCheckoutCommand
