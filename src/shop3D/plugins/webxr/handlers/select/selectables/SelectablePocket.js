import Selectable from '../Selectable.js'

/**
 * singleton
 */
let selectableBasket = null

class SelectablePocket extends Selectable {
    constructor(mesh, selectableChild) {
        super(mesh)
        this.selectableChild = selectableChild
        
        selectableBasket = this
    }

    onSelect() {
        this.socket.replaceSelected(this.selectableChild)
    }

    onDeselect() {
    }

    static getSelectablePocket() {
        return selectableBasket
    }
}

export default SelectablePocket
