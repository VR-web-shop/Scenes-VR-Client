import * as THREE from 'three'

let _handler = null

class Selectable {
    constructor(mesh) {
        this.mesh = mesh
        this.selectOffset = new THREE.Vector3()
        this.collider = new THREE.Box3().setFromObject(this.mesh)
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

    onSelect() { }
    onDeselect() { }

    isSelected() {
        return _handler.isSelected(this)
    }

    select(controller) {
        _handler.setSelected(controller, this)
    }

    static setHandler(handler) {
        _handler = handler
    }
}

export default Selectable
