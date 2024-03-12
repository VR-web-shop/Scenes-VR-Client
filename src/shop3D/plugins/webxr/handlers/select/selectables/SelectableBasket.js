import Selectable from '../Selectable.js'
import * as THREE from 'three'

class SelectableBasket extends Selectable {
    constructor(mesh, placeholderMesh, selectOffset, placeholderOffset, basketHandler) {
        super(mesh)
        this.basketHandler = basketHandler
        this.placeholderMesh = placeholderMesh
        
        this.mesh.visible = false
        this.placeholderMesh.visible = false
        this.mesh.add(placeholderMesh)
        this.placeholderMesh.position.copy(placeholderOffset)
        this.setSelectOffset(selectOffset)
    }

    setPlaceholderVisibility(visible) {
        this.placeholderMesh.visible = visible
    }

    onSelect() {
        this.mesh.visible = true
    }

    onDeselect() {
        this.mesh.visible = false
    }
}

export default SelectableBasket
