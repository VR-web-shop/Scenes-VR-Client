import Command from "../../abstractions/commands/Command.js";

/**
 * @class RemoveOnStateChangeListener
 * @classdesc Command for removing an on state change listener.
 * @extends Command
 * @property options - The options for the command.
 */
class RemoveOnStateChangeListener extends Command {

    /**
     * @constructor
     * @param {Function} callback - The callback for the on state change listener.
     */
    constructor(callback) {
        super()
        this.callback = callback
    }

    /**
     * @function execute
     * @description Remove an on state change listener.
     * @param {Object} options - The options for the command.
     * @returns {void}
     */
    async execute(options) {
        options.context.removeOnStateChangeListener(this.callback);
    }
}

export default RemoveOnStateChangeListener
