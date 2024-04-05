import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";

/**
 * @class RemoveSelectableCommand
 * @classdesc command for removing a selectable.
 */
class RemoveSelectableCommand extends WebXRHandlerCommand {

    /**
     * @constructor
     * @param {string} id - The id for the selectable.
     */
    constructor(id) {
        super()

        if (typeof id !== 'string') {
            throw new Error('The id must be a string')
        }

        this.id = id
    }

    /**
     * @function execute
     * @description Execute the command.
     * @param {Object} options - The options for the command.
     * @returns {void}
     * @async
     */
    async execute(options) {
        const selectables = options.selectables
        for (let i = 0; i < selectables.length; i++) {
            if (selectables[i].id === this.id) {
                selectables.splice(i, 1)
                break
            }
        }
    }
}

export default RemoveSelectableCommand
