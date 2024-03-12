import * as THREE from 'three'
import SetSelectedCommand from './commands/SetSelectedCommand.js'
import IsSelectedCommand from './commands/IsSelectedCommand.js'

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

    async isSelected() {
        console.log('Selectable isSelected')
        return await _handler.invoke(new IsSelectedCommand(this))
    }

    async select(controller) {
        await _handler.invoke(new SetSelectedCommand(controller, this))
    }

    static setHandler(handler) {
        _handler = handler
    }
}

export default Selectable
