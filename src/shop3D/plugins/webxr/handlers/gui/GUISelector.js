import Pointer from '../../pointers/Pointer.js';
import View from '../../../../abstractions/View.js';
import * as THREE from 'three';

/**
 * @class GUISelector
 * @classdesc The GUI selector.
 * @param {THREE.Object3D} target - The target.
 * @param {View} view - The view.
 * @param {Function} getUIInteractables - Get the UI interactables.
 * @property {Function} getCollisionObject - Get the collision object.
 * @property {Function} destroy - Destroy the teleporter.
 */
function GUISelector(target, view, getUIInteractables) {
    if (!(target instanceof THREE.Object3D)) {
        throw new Error('The target must be an instance of THREE.Object3D')
    }

    if (!(view instanceof View)) {
        throw new Error('The view must be an instance of View')
    }

    if (typeof getUIInteractables !== 'function') {
        throw new Error('The getUIInteractables must be a function')
    }

    const pointer = new Pointer(target, view, getUIInteractables)

    this.addCollisionListener = function(callback) {
        pointer.addCollisionListener(callback)
    }

    this.removeCollisionListener = function(callback) {
        pointer.removeCollisionListener(callback)
    }
    
    /**
     * @function getPosition
     * @description Get the position of the pointer.
     * @returns {void}
     */
    this.getCollisionObject = function() {
        return pointer.getLastCollisionObject()
    }

    /**
     * @function destroy
     * @description Destroy the teleporter.
     * @returns {void}
     */
    this.destroy = function() {
        pointer.dispose()
    }
}

export default GUISelector;
