import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";
import * as THREE from 'three'

/**
 * @class RemoveSelectableCommand
 * @classdesc command for removing a selectable.
 */
class RemoveSelectableCommand extends WebXRHandlerCommand {

    /**
     * @constructor
     * @param {THREE.Object3D} object3D - The selectable's object3D.
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
        const selectables = options.selectables
        for (let i = 0; i < selectables.length; i++) {
            if (selectables[i].mesh.uuid === this.object3D.uuid) {
                selectables.splice(i, 1)
                break
            }
        }
    }
}

export default RemoveSelectableCommand
