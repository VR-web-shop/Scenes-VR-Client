import * as THREE from 'three'

class Selectable {
    constructor(mesh) {
        this.mesh = mesh
        this.collider = new THREE.Box3().setFromObject(this.mesh)
    }

    intersectsBox(otherBox) {
        this.collider.setFromObject(this.mesh)
        return this.collider.intersectsBox(otherBox)
    }

    setPosition(target) {
        this.mesh.position.copy(target)
    }

    onSelect() { }
    onDeselect() { }
}

export default Selectable
