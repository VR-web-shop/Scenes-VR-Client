import * as THREE from 'three'

class Selectable {
    constructor(mesh, id) {
        this.mesh = mesh
        this.id = id
        this.selectOffset = new THREE.Vector3()
        this.collider = new THREE.Box3().setFromObject(this.mesh)
        this.socket = null
    }

    intersectsBox(otherBox) {
        this.collider.setFromObject(this.mesh)
        return this.collider.intersectsBox(otherBox)
    }

    setSelectOffset(offset) {
        this.selectOffset.copy(offset)
    }

    setPosition(target) {
        this.mesh.position.copy(target)
    }

    setRotation(rotation) {
        this.mesh.rotation.copy(rotation)
    }

    select(socket) {
        this.socket = socket
        this.onSelect()
    }

    deselect() {
        this.socket = null
        this.onDeselect()
    }

    onUpdate(options={}) {
    }

    onSelect() { }
    onDeselect() { }
    isSelectable() { return true }
}

export default Selectable
