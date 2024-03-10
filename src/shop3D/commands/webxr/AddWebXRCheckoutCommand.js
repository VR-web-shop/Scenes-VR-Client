import Command from "../../abstractions/commands/Command.js";

/**
 * @class AddWebXRCheckoutCommand
 * @classdesc Command for adding a webxr checkout.
 * @extends Command
 * @property options - The options for the command.
 */
class AddWebXRCheckoutCommand extends Command {

    /**
     * @constructor
     * @param {Object} search - The search for the object 3d.
     * Possible parameters are: name, uuid
     * Note: Select only one parameter.
     * @example new AddWebXRCheckoutCommand( { name: 'meshName' } )
     * @example new AddWebXRCheckoutCommand( { uuid: 'meshUUID' } )
     */
    constructor(search) {
        super()
        this.search = search
    }

    /**
     * @function execute
     * @description Add a webxr checkout.
     * @param {Object} options - The options for the command.
     * @returns {void}
     */
    async execute(options) {
        const mesh = options.plugins
            .find('search')
            .search(this.search)
        
        options.plugins
            .find('webxr')
            .getHandler('basket')
            .addCheckout(mesh)
    }
}

export default AddWebXRCheckoutCommand
