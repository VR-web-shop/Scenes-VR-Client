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

export default Pointer;
