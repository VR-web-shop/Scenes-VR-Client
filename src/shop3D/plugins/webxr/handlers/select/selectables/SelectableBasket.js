import Selectable from '../Selectable.js'

class SelectableBasket extends Selectable {
    constructor(mesh, basketHandler) {
        super(mesh)
        this.basketHandler = basketHandler
        this.mesh.visible = false
    }

    onSelect() {
    }

    onDeselect() {
        this.mesh.visible = false
    }
}

export default SelectableBasket
