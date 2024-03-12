import WebXRHandler from '../../abstractions/WebXRHandler.js';
import Pointer from '../../pointers/Pointer.js';
import * as THREE from 'three';

/**
 * @property {Array} floor - The floor.
 * @private
 */
const floor = []

/**
 * @property {Object} _view - The view.
 * @private
 */
let _view = null

/**
 * @property {Object} pointer - The pointer.
 * @private
 */
let pointer = null

/**
 * @function startTeleporting
 * @description Start teleporting.
 * @param {Object} event - The event.
 * @returns {void}
 * @private
 */
function startTeleporting(event) {
    if (pointer) return

    pointer = new Pointer(event.target, _view, () => floor)
}

/**
 * @function endTeleporting
 * @description End teleporting.
 * @param {Object} event - The event.
 * @returns {void}
 * @private
 */
function endTeleporting(event) {
    const point = pointer.getPosition()
    clearPointer()

    // Teleport the user to the point.
    const xr = _view.renderer.xr
    const baseReferenceSpace = xr.getReferenceSpace()
    const offsetPosition = { x: - point.x, y: - point.y, z: - point.z, w: 1 };
    const offsetRotation = new THREE.Quaternion();
    const transform = new XRRigidTransform(offsetPosition, offsetRotation);
    const teleportSpaceOffset = baseReferenceSpace.getOffsetReferenceSpace(transform);
    xr.setReferenceSpace(teleportSpaceOffset);
}

/**
 * @function clearPointer
 * @description Clear the pointer.
 * @returns {void}
 * @private
 */
function clearPointer() {
    if (pointer) {
        pointer.dispose()
        pointer = null
    }
}

/**
 * @function clearFloor
 * @description Clear the floor.
 * @returns {void}
 * @private
 */
function clearFloor() {
    floor.length = 0
}

/**
 * @class TeleportHandler
 * @classdesc The teleport handler.
 */
class TeleportHandler extends WebXRHandler {
    constructor() {
        super()
    }

    init(view, controllers) {
        _view = view
        this.controllers = controllers

        // Note: If the xr session is ended, remove the teleporter.
        view.renderer.xr.addEventListener('sessionend', clearPointer)

        for (let i = 0; i < controllers.length; i++) {
            const controller = controllers[i]

            controller.addEventListener('selectstart', startTeleporting)
            controller.addEventListener('selectend', endTeleporting)
        }

        this.initInvoker({ floor })
    }

    exit() {
        clearFloor()
        clearPointer()

        _view.renderer.xr.removeEventListener('sessionend', clearPointer)

        for (let i = 0; i < this.controllers.length; i++) {
            const controller = this.controllers[i]

            controller.removeEventListener('selectstart', startTeleporting)
            controller.removeEventListener('selectend', endTeleporting)
        }
    }
}

export default TeleportHandler
