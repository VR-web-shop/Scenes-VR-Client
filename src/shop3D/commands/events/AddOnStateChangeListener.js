import Command from "../../abstractions/commands/Command.js";

/**
 * @class AddOnStateChangeListener
 * @classdesc Command for adding an on state change listener.
 * @extends Command
 * @property options - The options for the command.
 */
class AddOnStateChangeListener extends Command {

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
     * @description Add an on state change listener.
     * @param {Object} options - The options for the command.
     * @returns {void}
     */
    async execute(options) {
        options.context.addOnStateChangeListener(this.callback);
    }
}

export default AddOnStateChangeListener
