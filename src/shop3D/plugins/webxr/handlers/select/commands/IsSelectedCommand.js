import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";
import Selectable from "../Selectable.js";

/**
 * @class IsSelectedCommand
 * @classdesc command for checking if a selectable is selected.
 */
class IsSelectedCommand extends WebXRHandlerCommand {

    /**
     * @constructor
     * @param {Selectable} selectable - The selectable to be checked.
     */
    constructor(selectable) {
        super()

        if (!(selectable instanceof Selectable)) {
            throw new Error('The selectable is not an instance of Selectable')
        }

        this.selectable = selectable
    }

    /**
     * @function execute
     * @description Execute the command.
     * @param {Object} options - The options for the command.
     * @returns {void}
     * @async
     */
    async execute(options) {
        return options.selected && options.selected.mesh.uuid === this.selectable.mesh.uuid
    }
}

export default IsSelectedCommand
