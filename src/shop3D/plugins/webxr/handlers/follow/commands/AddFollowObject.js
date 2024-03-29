import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";
import FollowObject from "../FollowObject.js";
import * as THREE from 'three'

/**
 * @class AddFollowObjectCommand
 * @classdesc command for adding follow object.
 */
class AddFollowObjectCommand extends WebXRHandlerCommand {

    /**
     * @constructor
     * @param {THREE.Object3D} object3D - The object to follow.
     * @param {Object} offset - The offset. (optional)
     */
    constructor(object3D, offset) {
        super()

        if (!(object3D instanceof THREE.Object3D)) {
            throw new Error('The object3D must be an instance of THREE.Object3D')
        }

        this.object3D = object3D
        this.offset = offset
    }

    /**
     * @function execute
     * @description Execute the command.
     * @param {Object} options - The options for the command.
     * @returns {void}
     * @async
     */
    async execute(options) {
        const followObject = new FollowObject(options.view, this.object3D, this.offset)
        options.followObjects.push(followObject)
    }
}

export default AddFollowObjectCommand
