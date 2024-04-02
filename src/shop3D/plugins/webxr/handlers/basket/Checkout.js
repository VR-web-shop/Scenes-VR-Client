import * as THREE from 'three';

function Checkout(
    mesh, 
    surfaceOffset = new THREE.Vector3(0, 0, 0), 
    surfaceSize = new THREE.Vector3(1, 1, 1),
    UIOffset = new THREE.Vector3(0, 3, 0),
    UIRotation = new THREE.Euler(0, 0, 0)) {
    

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

    this.getUIPosition = function () {
        return mesh.position.clone().add(UIOffset)
    }

    this.getUIEulerRotation = function () {
        return UIRotation
    }

    this.showHelper = function () {
        const pos = new THREE.Vector3().add(surfaceOffset)
        const box = new THREE.Box3().setFromCenterAndSize(pos, surfaceSize)
        const boxHelper = new THREE.Box3Helper(box, 0x00FF00)
        mesh.add(boxHelper)
    }
}

export default Checkout;
