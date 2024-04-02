import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";

/**
 * @class UpdateSelectableCommand
 * @classdesc command for updating a selectable.
 */
class UpdateSelectableCommand extends WebXRHandlerCommand {

    /**
     * @constructor
     * @param {string} id - the id of the selectable to be updated.
     * @param {Object} selectableUpdateOptions - The selectable update options.
     */
    constructor(id, selectableUpdateOptions) {
        super()

        if (typeof id !== 'string') {
            throw new Error('The id must be a string')
        }

        if (typeof selectableUpdateOptions !== 'object') {
            throw new Error('The selectableUpdateOptions must be an object')
        }

        this.id = id
        this.selectableUpdateOptions = selectableUpdateOptions
    }

    /**
     * @function execute
     * @description Execute the command.
     * @param {Object} options - The options for the command.
     * @returns {void}
     * @async
     */
    async execute(options) {
        for (let i = 0; i < options.selectables.length; i++) {
            if (options.selectables[i].id === this.id) {
                options.selectables[i].onUpdate(this.selectableUpdateOptions)
                return
            }
        }

        throw new Error(`The selectable with id ${this.id} does not exist`)
    }
}

export default UpdateSelectableCommand
