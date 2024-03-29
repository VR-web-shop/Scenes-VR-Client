import * as THREE from 'three'

class Selectable {
    constructor(mesh) {
        this.mesh = mesh
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
        this.mesh.position.copy(target).add(this.selectOffset)
    }

    select(socket) {
        this.socket = socket
        this.onSelect()
    }

    deselect() {
        this.socket = null
        this.onDeselect()
    }

    onSelect() { }
    onDeselect() { }
    isSelectable() { return true }
}

export default Selectable
