import * as THREE from 'three'

/**
 * @class SelectPoint
 * @classdesc The Select Point.
 * @param {Object} view - The view.
 * @param {THREE.Vector3} offset - The offset.
 * @property {Function} setPosition - Set the position of the pointer.
 * @property {Function} dispose - Dispose the pointer.
 */
function SelectPoint(view, offset = new THREE.Vector3(0, 0, 0)) {
    const scene = view.scene
    const cubeGeometry = new THREE.BoxGeometry(.1, .1, .1)
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00FFFF })
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
    let interval = null;

    scene.add(cube)

    this.setPosition = function (position) {
        cube.position.copy(position)
    }

    this.dispose = function () {
        cubeGeometry.dispose()
        cubeMaterial.dispose()
        scene.remove(cube)
    }

    this.setVisbility = function (visible) {
        cube.visible = visible
    }

    this.intersectsBox = function (box) {
        const point = new THREE.Vector3()
        cube.getWorldPosition(point)
        return box.containsPoint(point)
    }

    const updatePosition = function () {
        const xr = view.renderer.xr
        if (xr.isPresenting) {
            const camera = xr.getCamera()
            const position = new THREE.Vector3()
            camera.getWorldPosition(position)
            cube.position.copy(position).add(offset)
        }
    }

    this.followVRPlayer = function () {
        view.addBeforeRenderListener(updatePosition)
    }

    this.stopFollowVRPlayer = function () {
        view.removeBeforeRenderListener(updatePosition)
    }
}

export default SelectPoint;
