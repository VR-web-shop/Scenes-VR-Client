import * as THREE from 'three';

/**
 * @class Pointer
 * @classdesc The pointer.
 * @param {Object} target - The target.
 * @param {Object} scene - The scene.
 * @param {Function} getCollisionObjects - Get the collision objects.
 * @property {Function} setPosition - Set the position of the pointer.
 * @property {Function} dispose - Dispose the pointer.
 */
function Pointer(target, view, getCollisionObjects) {
    const scene = view.scene
    const point = new THREE.Vector3().copy(target.position)
    const targetDirection = new THREE.Vector3(0, 0, -1)
    const targetPosition = new THREE.Vector3().setFromMatrixPosition(target.matrixWorld)
    const raycaster = new THREE.Raycaster()
    const eventDispatcher = new THREE.EventDispatcher()
    let lastCollisionObject = null

    const linePoints = [target.position, target.position.clone()]
    const lineBuffer = new THREE.BufferGeometry().setFromPoints(linePoints)
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 })
    const line = new THREE.Line(lineBuffer, lineMaterial)

    const cubeGeometry = new THREE.BoxGeometry(.1, .1, .1)
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

    scene.add(line)
    scene.add(cube)

    this.dispose = function() {
        lineBuffer.dispose()
        lineMaterial.dispose()

        cubeGeometry.dispose()
        cubeMaterial.dispose()

        scene.remove(line)
        scene.remove(cube)

        view.removeBeforeRenderListener(updatePosition)
    }

    this.getPosition = function() {
        return point
    }

    this.getLastCollisionObject = function() {
        return lastCollisionObject
    }

    this.addCollisionListener = function(callback) {
        eventDispatcher.addEventListener('collision', callback)
    }

    this.removeCollisionListener = function(callback) {
        eventDispatcher.removeEventListener('collision', callback)
    }
    
    /**
     * @function updatePosition
     * @description Update the tracked position.
     * @returns {void}
     */
    const updatePosition = function() {
        const objectBefore = lastCollisionObject
        targetDirection.set(0, 0, -1).applyQuaternion(target.quaternion)
        targetPosition.setFromMatrixPosition(target.matrixWorld)
        raycaster.set(targetPosition, targetDirection)

        const objects = getCollisionObjects()
        const intersects = raycaster.intersectObjects(objects)
        if (intersects.length > 0) {
            lastCollisionObject = intersects[0].object
            point.copy(intersects[0].point)
            lineBuffer.setFromPoints([target.position, point])
            cube.position.copy(point)
        } else {
            //lastCollisionObject = null
            //point.copy(targetPosition)
            //lineBuffer.setFromPoints([target.position, target.position])
            //cube.position.copy(targetPosition)
        }

        if (!objectBefore || objectBefore && !lastCollisionObject || objectBefore.uuid !== lastCollisionObject.uuid) {
            eventDispatcher.dispatchEvent({ type: 'collision', before: objectBefore, after: lastCollisionObject })
        }
    }

    /**
     * Add the update function to the render loop,
     * to ensure the pointer is updated every frame.
     */
    view.addBeforeRenderListener(updatePosition)
}

export default Pointer;
