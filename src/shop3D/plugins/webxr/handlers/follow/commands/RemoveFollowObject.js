import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";
import FollowObject from "../FollowObject.js";
import * as THREE from 'three'

/**
 * @class RemoveFollowObjectCommand
 * @classdesc command for removing follow object.
 */
class RemoveFollowObjectCommand extends WebXRHandlerCommand {

    /**
     * @constructor
     * @param {THREE.Object3D} object3D - The object to remove.
     */
    constructor(object3D) {
        super()

        if (!(object3D instanceof THREE.Object3D)) {
            throw new Error('The object3D must be an instance of THREE.Object3D')
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
        const { followObjects } = options

        for (let i = 0; i < followObjects.length; i++) {
            const followObject = followObjects[i]
            if (followObject.object3D.uuid === object3D.uuid) {
                followObjects.splice(i, 1)
                break
            }
        }
    }
}

export default RemoveFollowObjectCommand
