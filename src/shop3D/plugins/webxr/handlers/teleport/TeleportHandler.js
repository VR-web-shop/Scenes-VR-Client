import WebXRHandler from '../../WebXRHandler.js';
import Teleporter from './Teleporter.js';
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
 * @property {Object} teleporter - The teleporter.
 * @private
 */
let teleporter = null

/**
 * @function startTeleporting
 * @description Start teleporting.
 * @param {Object} event - The event.
 * @returns {void}
 * @private
 */
function startTeleporting(event) {
    if (teleporter) return

    teleporter = new Teleporter(event.target, _view, () => floor)
}

/**
 * @function endTeleporting
 * @description End teleporting.
 * @param {Object} event - The event.
 * @returns {void}
 * @private
 */
function endTeleporting(event) {
    teleporter.teleport()
    clearTeleporter()
}

/**
 * @function clearTeleporter
 * @description Clear the teleporter.
 * @returns {void}
 * @private
 */
function clearTeleporter() {
    if (teleporter) {
        teleporter.destroy()
        teleporter = null
    }
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
        view.renderer.xr.addEventListener('sessionend', clearTeleporter)

        for (let i = 0; i < controllers.length; i++) {
            const controller = controllers[i]

            controller.addEventListener('selectstart', startTeleporting)
            controller.addEventListener('selectend', endTeleporting)
        }
    }

    exit() {
        floor.length = 0
        clearTeleporter()

        _view.renderer.xr.removeEventListener('sessionend', clearTeleporter)

        for (let i = 0; i < this.controllers.length; i++) {
            const controller = this.controllers[i]

            controller.removeEventListener('selectstart', startTeleporting)
            controller.removeEventListener('selectend', endTeleporting)
        }
    }

    addFloor = function(object3D) {
        if (!(object3D instanceof THREE.Object3D)) {
            throw new Error('The object must be an instance of THREE.Object3D')
        }

        const floorObject = floor.find(floor => floor.uuid === object3D.uuid)
        if (floorObject) {
            throw new Error('The floor already exists')
        }

        floor.push(object3D)
    }

    removeFloor = function(object3D) {
        if (!(object3D instanceof THREE.Object3D)) {
            throw new Error('The object must be an instance of THREE.Object3D')
        }

        const floorObject = floor.find(floor => floor.uuid === object3D.uuid)
        if (!floorObject) {
            throw new Error('The floor does not exist')
        }

        
        const index = floor.indexOf(floorObject)
        floor.splice(index, 1)
    }
}

export default TeleportHandler
