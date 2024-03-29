import Selectable from '../Selectable.js'

class SelectablePocket extends Selectable {
    constructor(mesh, pocketOffset, selectableChild) {
        super(mesh)
        this.pocketOffset = pocketOffset
        this.selectableChild = selectableChild        
    }

    onSelect() {
        this.socket.replaceSelected(this.selectableChild)
    }

    onDeselect() {
    }
}

export default SelectablePocket
