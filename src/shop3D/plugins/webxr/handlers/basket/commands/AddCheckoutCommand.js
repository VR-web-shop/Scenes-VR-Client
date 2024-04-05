import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";
import Checkout from "../Checkout.js";
import * as THREE from 'three'

/**
 * @class AddCheckoutCommand
 * @classdesc command for adding a checkout.
 */
class AddCheckoutCommand extends WebXRHandlerCommand {

    /**
     * @constructor
     * @param {THREE.Object3D} object3D - The checkout's object3D.
     * @param {THREE.Vector3} surfaceOffset - The offset for the surface.
     * @param {THREE.Vector3} surfaceSize - The size for the surface.
     * @param {THREE.Vector3} UIOffset - The UI offset.
     * @param {THREE.Euler} UIRotation - The UI rotation.
     * @param {THREE.Vector3} UIScale - The UI scale.
     */
    constructor(object3D, surfaceOffset, surfaceSize, UIOffset, UIRotation, UIScale) {
        super()

        if (!(object3D instanceof THREE.Object3D)) {
            throw new Error('The object must be an instance of THREE.Object3D')
        }

        if (!(surfaceOffset instanceof THREE.Vector3)) {
            throw new Error('The surfaceOffset must be an instance of THREE.Vector3')
        }

        if (!(surfaceSize instanceof THREE.Vector3)) {
            throw new Error('The surfaceSize must be an instance of THREE.Vector3')
        }

        if (!(UIOffset instanceof THREE.Vector3)) {
            throw new Error('The UIOffset must be an instance of THREE.Vector3')
        }

        if (!(UIRotation instanceof THREE.Euler)) {
            throw new Error('The UIRotation must be an instance of THREE.Euler')
        }

        if (!(UIScale instanceof THREE.Vector3)) {
            throw new Error('The UIScale must be an instance of THREE.Vector3')
        }

        this.object3D = object3D
        this.surfaceOffset = surfaceOffset
        this.surfaceSize = surfaceSize
        this.UIOffset = UIOffset
        this.UIRotation = UIRotation
        this.UIScale = UIScale
    }

    /**
     * @function execute
     * @description Execute the command.
     * @param {Object} options - The options for the command.
     * @returns {void}
     * @async
     */
    async execute(options) {
        options.checkouts.push(new Checkout(
            this.object3D,
            this.surfaceOffset, 
            this.surfaceSize, 
            this.UIOffset, 
            this.UIRotation,
            this.UIScale
        ));
    }
}

export default AddCheckoutCommand
