import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";
import Selectable from "../Selectable.js";

/**
 * @class AddSelectableCommand
 * @classdesc command for adding a selectable.
 */
class AddSelectableCommand extends WebXRHandlerCommand {

    /**
     * @constructor
     * @param {Selectable} selectable - The selectable to be added.
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
        /**
         * If the product exists in the selectables,
         * we don't need to add it again.
         */
        for (let i = 0; i < options.selectables.length; i++) {
            if (options.selectables[i].id === this.selectable.id) {
                return
            }
        }

        options.selectables.push(this.selectable);
    }
}

export default AddSelectableCommand
