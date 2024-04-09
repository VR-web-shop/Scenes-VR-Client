import Selectable from '../Selectable.js'
import ShowCheckoutUICommand from '../../basket/commands/ShowCheckoutUICommand.js'
import HideCheckoutUICommand from '../../basket/commands/HideCheckoutUICommand.js'
import * as THREE from 'three'

/**
 * singleton
 */
let selectableBasket = null

class SelectableBasket extends Selectable {
    constructor(mesh, id, placeholderMesh, selectOffset, placeholderOffset, insertAreaOffset, insertAreaSize, checkoutHandler) {
        super(mesh, id)
        this.placeholderMesh = placeholderMesh
        this.checkoutHandler = checkoutHandler
        this.checkout = null
        
        this.insertArea = new InsertArea(this, insertAreaOffset, insertAreaSize)
        
        this.mesh.visible = false
        this.placeholderMesh.visible = false
        this.mesh.add(placeholderMesh)
        
        this.setPlaceholderOffset(placeholderOffset)
        this.setSelectOffset(selectOffset)

        selectableBasket = this        
    }

    setPlaceholderOffset(offset) {
        this.placeholderMesh.position.copy(offset)
    }

    setUIInterface(uiInterface) {
        this.uiInterface = uiInterface
    }

    async onSelect() {
        if (this.checkout) {
            await this.checkoutHandler.invoke(new HideCheckoutUICommand())
            this.checkout = null
        }

        this.mesh.visible = true
    }

    async onDeselect() {
        const box = new THREE.Box3().setFromObject(this.mesh)
        const checkouts = this.checkoutHandler.getCheckouts()
        for (let i = 0; i < checkouts.length; i++) {
            if (checkouts[i].intersectsBox(box)) {
                await this.checkoutHandler.invoke(new ShowCheckoutUICommand(this, checkouts[i]))
                return
            }
        }

        this.mesh.visible = false
        this.placeholderMesh.visible = false
        this.mesh.position.copy(new THREE.Vector3(-1000, -1000, -1000))
    }

    static getSelectableBasket() {
        return selectableBasket
    }
}

class InsertArea {
    constructor(basket, offset, size) {
        this.basketPosition = basket.mesh.position
        this.offset = offset || new THREE.Vector3()
        this.size = size || new THREE.Vector3()
        this.meshHelper = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.1, 0.1),
            new THREE.MeshBasicMaterial({ wireframe: true, color: 0x00FF00})
        )
        basket.mesh.add(this.meshHelper)
    }

    getCenter() {
        return new THREE.Vector3().copy(this.basketPosition).add(this.offset)
    }

    intersectsBox(box) {
        const pos = new THREE.Vector3().copy(this.basketPosition).add(this.offset)
        const box3 = new THREE.Box3().setFromCenterAndSize(pos, this.size)
        return box.intersectsBox(box3)
    }
}

export default SelectableBasket
