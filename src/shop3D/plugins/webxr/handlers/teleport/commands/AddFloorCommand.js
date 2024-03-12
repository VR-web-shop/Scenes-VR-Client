import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";
import * as THREE from 'three'

/**
 * @class AddFloorCommand
 * @classdesc command for adding a floor.
 */
class AddFloorCommand extends WebXRHandlerCommand {

    /**
     * @constructor
     * @param {THREE.Object3D} object3D - The floor's object3D.
     */
    constructor(object3D) {
        super()

        if (!(object3D instanceof THREE.Object3D)) {
            throw new Error('The object must be an instance of THREE.Object3D')
        }

        this.object3D = object3D
    }

    /**
     * @function execute
     * @description Execute the command.
     * @param {Object} options - The options for the command.
     * @returns {void}
     * @async
     */
    async execute(options) {
        const floorObject = options.floor.find(floor => floor.uuid === this.object3D.uuid)
        if (floorObject) {
            throw new Error('The floor already exists')
        }

        options.floor.push(this.object3D);
    }
}

export default AddFloorCommand
