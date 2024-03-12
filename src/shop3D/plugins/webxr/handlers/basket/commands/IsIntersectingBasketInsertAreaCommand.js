import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";
import * as THREE from 'three'

/**
 * @class IsIntersectingBasketInsertAreaCommand
 * @classdesc command for checking if the THREE.Box3 is intersecting the basket's insert area.
 */
class IsIntersectingBasketInsertAreaCommand extends WebXRHandlerCommand {

    /**
     * @constructor
     * @param {THREE.Box3} otherBox3 - The other box3 to check for intersection.
     */
    constructor(otherBox3) {
        super()

        if (!(otherBox3 instanceof THREE.Box3)) {
            throw new Error('The offset must be an instance of THREE.Box3')
        }

        this.otherBox3 = otherBox3
    }

    /**
     * @function execute
     * @description Execute the command.
     * @param {Object} options - The options for the command.
     * @returns {void}
     * @async
     */
    async execute(options) {
        return options.basket.intersectsInsertArea(this.otherBox3)
    }
}

export default IsIntersectingBasketInsertAreaCommand
