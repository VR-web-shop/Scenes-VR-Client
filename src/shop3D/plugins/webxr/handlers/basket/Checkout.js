import * as THREE from 'three';

function Checkout(mesh, surfaceOffset = new THREE.Vector3(0, 0, 0), surfaceSize = new THREE.Vector3(1, 1, 1)) {
    
    this.intersectsBox = function (box) {
        const point = new THREE.Vector3()
        mesh.getWorldPosition(point).add(surfaceOffset)
        const box2 = new THREE.Box3().setFromCenterAndSize(point, surfaceSize)
        return box.intersectsBox(box2)
    }

    this.getCenterSurface = function () {
        const point = new THREE.Vector3()
        mesh.getWorldPosition(point).add(surfaceOffset)
        return point
    }

    this.showHelper = function () {
        const pos = new THREE.Vector3().add(surfaceOffset)
        const box = new THREE.Box3().setFromCenterAndSize(pos, surfaceSize)
        const boxHelper = new THREE.Box3Helper(box, 0x00FF00)
        mesh.add(boxHelper)
    }
}

export default Checkout;
