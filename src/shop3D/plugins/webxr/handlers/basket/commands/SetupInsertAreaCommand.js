import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";
import * as THREE from 'three'

/**
 * @class SetupInsertAreaCommand
 * @classdesc command for setting the basket's insert area.
 */
class SetupInsertAreaCommand extends WebXRHandlerCommand {

    /**
     * @constructor
     * @param {THREE.Vector3} offset - The insert area's offset.
     * @param {THREE.Vector3} size - The insert area's size.
     */
    constructor(offset = new THREE.Vector3(), size = new THREE.Vector3()) {
        super()

        if (!(offset instanceof THREE.Vector3)) {
            throw new Error('The offset must be an instance of THREE.Vector3')
        }

        if (!(size instanceof THREE.Vector3)) {
            throw new Error('The size must be an instance of THREE.Vector3')
        }

        this.offset = offset
        this.size = size
    }

    /**
     * @function execute
     * @description Execute the command.
     * @param {Object} options - The options for the command.
     * @returns {void}
     * @async
     */
    async execute(options) {
        options.basket.setupInsertArea(this.offset, this.size)
    }
}

export default SetupInsertAreaCommand
