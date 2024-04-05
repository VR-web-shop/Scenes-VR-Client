import Command from "../../abstractions/commands/Command.js";

/**
 * @class ToggleWebXRCommand
 * @classdesc Command for toggling webxr mode.
 * @extends Command
 * @property options - The options for the command.
 */
class ToggleWebXRCommand extends Command {

    /**
     * @constructor
     */
    constructor() {
        super()
    }

    /**
     * @function execute
     * @description Add a webxr floor.
     * @param {Object} options - The options for the command.
     * @returns {void}
     */
    async execute(options) {
        options.plugins.find('webxr').toggleVRMode()
    }
}

export default ToggleWebXRCommand
