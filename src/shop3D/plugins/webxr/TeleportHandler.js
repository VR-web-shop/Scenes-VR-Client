import * as THREE from 'three';

/**
 * @class Pointer
 * @classdesc The pointer.
 * @param {Object} target - The target.
 * @param {Object} scene - The scene.
 * @property {Function} setPosition - Set the position of the pointer.
 * @property {Function} dispose - Dispose the pointer.
 */
function Pointer(target, scene) {
    const linePoints = [target.position, target.position.clone()]
    const lineBuffer = new THREE.BufferGeometry().setFromPoints(linePoints)
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 })
    const line = new THREE.Line(lineBuffer, lineMaterial)

    const cubeGeometry = new THREE.BoxGeometry(.1, .1, .1)
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

    scene.add(line)
    scene.add(cube)

    this.setPosition = function(position) {
        lineBuffer.setFromPoints([target.position, position])
        cube.position.copy(position)
    }

    this.dispose = function() {
        lineBuffer.dispose()
        lineMaterial.dispose()

        cubeGeometry.dispose()
        cubeMaterial.dispose()

        scene.remove(line)
        scene.remove(cube)
    }
}

/**
 * @class Teleporter
 * @classdesc The teleporter.
 * @param {Object} target - The target.
 * @param {Object} scene - The scene.
 * @param {Function} getFloor - Get the floor.
 * @property {Object} pointer - The pointer.
 * @property {Object} point - The point.
 * @property {Object} raycaster - The raycaster.
 * @property {Function} update - Update the teleporter.
 * @property {Function} teleport - Teleport the target.
 */
function Teleporter(target, scene, getFloor) {
    const pointer = new Pointer(target, scene)
    const point = new THREE.Vector3().copy(target.position)
    const raycaster = new THREE.Raycaster()

    this.update = function() {
        const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(target.quaternion)
        const position = new THREE.Vector3().setFromMatrixPosition(target.matrixWorld)
        raycaster.set(position, direction)

        const floor = getFloor()
        const intersects = raycaster.intersectObjects(floor)
        if (intersects.length > 0) {
            point.copy(intersects[0].point)
            pointer.setPosition(point)
        }
    }

    this.teleport = function(plugin) {
        const xr = plugin.view.renderer.xr
        const baseReferenceSpace = xr.getReferenceSpace()
        const offsetPosition = { x: - point.x, y: - point.y, z: - point.z, w: 1 };
        const offsetRotation = new THREE.Quaternion();
        const transform = new XRRigidTransform( offsetPosition, offsetRotation );
        const teleportSpaceOffset = baseReferenceSpace.getOffsetReferenceSpace( transform );

        xr.setReferenceSpace( teleportSpaceOffset );
        pointer.dispose()
    }

    this.destroy = function() {
        pointer.dispose()
    }
}

/**
 * @class TeleportHandler
 * @classdesc The teleport handler.
 * @param {Object} plugin - The webxr plugin.
 * @property {Object} teleporter - The teleporter.
 * @property {Object} interval - The interval.
 * @property {Function} start - Start the teleporter.
 * @property {Function} stop - Stop the teleporter.
 */
function TeleportHandler(plugin) {
    const floor = []
    let teleporter = null
    let interval = null

    const clearFloor = function() {
        floor.length = 0
    }

    const clearTeleporter = function() {
        if (interval) {
            clearInterval(interval)
            interval = null
        }

        if (teleporter) {
            teleporter.destroy()
            teleporter = null
        }
    }

    this.sessionStarted = function() {
    }

    this.sessionEnded = function() {
        clearTeleporter()
    }

    this.start = function(event) {
        if (teleporter) return

        teleporter = new Teleporter(event.target, plugin.view.scene, () => floor)
        interval = setInterval(teleporter.update, 1000 / 60)
    }

    this.stop = function(event) {
        teleporter.teleport(plugin)
        clearTeleporter()
    }

    this.exit = function() {
        clearTeleporter()
        clearFloor()
    }

    this.addFloor = function(mesh) {
        floor.push(mesh)
    }

    this.removeFloor = function(mesh) {
        floor = floor.filter(f => f !== mesh)
    }
}

export default TeleportHandler
