import Selectable from '../Selectable.js'
import * as THREE from 'three'

class SelectableProduct extends Selectable {
    constructor(mesh) {
        super(mesh)
        this.lastPosition = new THREE.Vector3().copy(mesh.position)
    }

    onSelect() {
    }

    onDeselect() {
        this.mesh.position.copy(this.lastPosition)
    }
}

export default SelectableProduct
