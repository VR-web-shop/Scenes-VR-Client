import Command from "../../../abstractions/commands/Command.js";
import RemoveSelectableCommand from "../../../plugins/webxr/handlers/select/commands/RemoveSelectableCommand.js";

/**
 * @class RemoveWebXRSelectableCommand
 * @classdesc Command for removing a webxr selectable.
 * @extends Command
 * @property options - The options for the command.
 */
class RemoveWebXRSelectableCommand extends Command {

    /**
     * @constructor
     * @param {string} id - The id for the product.
     */
    constructor(id) {
        super()
        this.id = id
    }

    /**
     * @function execute
     * @description Remove a webxr selectable.
     * @param {Object} options - The options for the command.
     * @returns {void}
     */
    async execute(options) {
        const webxrPlugin = options.plugins.find('webxr')
        const selectHandler = webxrPlugin.getHandler('select')
        
        await selectHandler.invoke(new RemoveSelectableCommand(this.id))
    }
}

export default RemoveWebXRSelectableCommand
