import Selectable from './Selectable.js'
import * as THREE from 'three'

export default class Socket {
    constructor() {
        this.selected = null
        this.selectOffset = new THREE.Vector3()
        this.position = new THREE.Vector3()
    }

    setPosition(position) {
        this.position.copy(position)
        this.updateSelectedPosition()
    }

    setOffset(offset) {
        this.selectOffset.copy(offset)
        this.updateSelectedPosition()
    }

    updateSelectedPosition() {
        if (this.selected) {
            const nextPosition = new THREE.Vector3()
                .copy(this.position)
                .sub(this.selectOffset)

            this.selected.setPosition(nextPosition)
        }
    }

    setSelected(selectable) {
        if (!(selectable instanceof Selectable)) {
            throw new Error('The selectable is not an instance of Selectable')
        }

        if (this.selected) {
            this.selected.deselect()
        }

        this.selected = selectable
        this.selected.select(this)
        this.updateSelectedPosition()
        this.onSelect()
    }

    removeSelected() {
        if (this.selected) {
            this.onDeselect()
            this.selected.deselect()
            this.selected = null
        }
    }

    replaceSelected(selectable) {
        this.removeSelected()
        this.setSelected(selectable)
    }

    onSelect() { }
    onDeselect() { }
}
