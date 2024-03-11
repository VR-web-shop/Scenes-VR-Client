import Selectable from '../Selectable.js'

class SelectableBasket extends Selectable {
    constructor(mesh, selectOffset, basketHandler) {
        super(mesh)
        this.basketHandler = basketHandler
        this.mesh.visible = false
        this.setSelectOffset(selectOffset)
    }

    onSelect() {
        this.mesh.visible = true
    }

    onDeselect() {
        this.mesh.visible = false
    }
}

export default SelectableBasket
