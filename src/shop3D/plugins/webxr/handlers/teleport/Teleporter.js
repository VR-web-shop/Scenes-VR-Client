import Pointer from './Pointer.js';
import View from '../../../../abstractions/View.js';
import * as THREE from 'three';

/**
 * @class Teleporter
 * @classdesc The teleporter.
 * @param {THREE.Object3D} target - The target.
 * @param {View} view - The view.
 * @param {Function} getFloor - Get the floor.
 * @property {Function} teleport - Teleport the target.
 * @property {Function} destroy - Destroy the teleporter.
 */
function Teleporter(target, view, getFloor) {
    if (!(target instanceof THREE.Object3D)) {
        throw new Error('The target must be an instance of THREE.Object3D')
    }

    if (!(view instanceof View)) {
        throw new Error('The view must be an instance of View')
    }

    if (typeof getFloor !== 'function') {
        throw new Error('The getFloor must be a function')
    } 

    const pointer = new Pointer(target, view.scene)
    const targetDirection = new THREE.Vector3(0, 0, -1)
    const targetPosition = new THREE.Vector3().setFromMatrixPosition(target.matrixWorld)
    const point = new THREE.Vector3().copy(target.position)
    const raycaster = new THREE.Raycaster()    

    /**
     * @function teleport
     * @description Teleport the target to last tracked position.
     * @returns {void}
     */
    this.teleport = function() {
        const xr = view.renderer.xr
        const baseReferenceSpace = xr.getReferenceSpace()
        const offsetPosition = { x: - point.x, y: - point.y, z: - point.z, w: 1 };
        const offsetRotation = new THREE.Quaternion();
        const transform = new XRRigidTransform( offsetPosition, offsetRotation );
        const teleportSpaceOffset = baseReferenceSpace.getOffsetReferenceSpace( transform );

        xr.setReferenceSpace( teleportSpaceOffset );
    }

    /**
     * @function destroy
     * @description Destroy the teleporter.
     * @returns {void}
     */
    this.destroy = function() {
        view.removeBeforeRenderListener(updatePosition)
        pointer.dispose()
    }

    /**
     * @function updatePosition
     * @description Update the tracked position.
     * @returns {void}
     */
    const updatePosition = function() {
        targetDirection.set(0, 0, -1).applyQuaternion(target.quaternion)
        targetPosition.setFromMatrixPosition(target.matrixWorld)
        raycaster.set(targetPosition, targetDirection)

        const floor = getFloor()
        const intersects = raycaster.intersectObjects(floor)
        if (intersects.length > 0) {
            point.copy(intersects[0].point)
            pointer.setPosition(point)
        }
    }

    /**
     * Add the update function to the render loop,
     * to ensure the pointer is updated every frame.
     */
    view.addBeforeRenderListener(updatePosition)
}

export default Teleporter;
