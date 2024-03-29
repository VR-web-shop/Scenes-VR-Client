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

const startPosition = new THREE.Vector3()
const position = new THREE.Vector3()

export function getXRPosition() {
    return position
}

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
    teleportTo(point)
}

function teleportTo(newPosition) {
    const offsetPosition = position.sub(newPosition)

    // Teleport the user to the point.
    const xr = _view.renderer.xr
    const baseReferenceSpace = xr.getReferenceSpace();
    const offsetTransform = new XRRigidTransform(
        { x: offsetPosition.x, y: 0, z: offsetPosition.z },
        { x: 0, y: offsetRotation.y, z: 0, w: 1 },
    );
    const newReferenceSpace = baseReferenceSpace.getOffsetReferenceSpace(offsetTransform);
    xr.setReferenceSpace(newReferenceSpace);

    position.copy(newPosition)
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

function setupStartPosition() {
    teleportTo(startPosition)
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
        view.renderer.xr.addEventListener('sessionstart', setupStartPosition)
        view.renderer.xr.addEventListener('sessionend', clearPointer)

        for (let i = 0; i < controllers.length; i++) {
            const controller = controllers[i]

            controller.addEventListener('selectstart', startTeleporting)
            controller.addEventListener('selectend', endTeleporting)
        }

        this.initInvoker({ floor, teleportTo, startPosition })
    }

    exit() {
        clearFloor()
        clearPointer()

        _view.renderer.xr.removeEventListener('sessionstart', setupStartPosition)
        _view.renderer.xr.removeEventListener('sessionend', clearPointer)

        for (let i = 0; i < this.controllers.length; i++) {
            const controller = this.controllers[i]

            controller.removeEventListener('selectstart', startTeleporting)
            controller.removeEventListener('selectend', endTeleporting)
        }
    }
}

export default TeleportHandler
