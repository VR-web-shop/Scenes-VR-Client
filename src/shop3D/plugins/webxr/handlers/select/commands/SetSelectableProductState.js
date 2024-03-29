import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";
import Selectable from "../Selectable.js";
import * as THREE from 'three'

/**
 * @class SetSelectableProductState
 * @classdesc command for setting the state of a selectable product.
 */
class SetSelectableProductState extends WebXRHandlerCommand {

    /**
     * @constructor
     * @param {Object[]} productEntities - The updated productEntities
     */
    constructor(productEntities) {
        super()

        if (!Array.isArray(productEntities)) {
            throw new Error('The productEntities must be an array')
        }

        this.productEntities = productEntities
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
        console.log('selectables', selectables)
    }
}

export default SetSelectedCommand
