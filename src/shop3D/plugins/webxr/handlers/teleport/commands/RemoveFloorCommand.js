import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";
import * as THREE from 'three'

/**
 * @class RemoveFloorCommand
 * @classdesc command for removing a floor.
 */
class RemoveFloorCommand extends WebXRHandlerCommand {

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
        if (!floorObject) {
            throw new Error('The floor does not exist')
        }
        
        const index = options.floor.indexOf(floorObject)
        options.floor.splice(index, 1)
    }
}

export default RemoveFloorCommand
