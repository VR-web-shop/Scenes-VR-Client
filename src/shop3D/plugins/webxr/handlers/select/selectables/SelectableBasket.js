import Selectable from '../Selectable.js'
import * as THREE from 'three'

/**
 * singleton
 */
let selectableBasket = null

class SelectableBasket extends Selectable {
    constructor(mesh, placeholderMesh, selectOffset, placeholderOffset, insertAreaOffset, insertAreaSize, checkoutHandler) {
        super(mesh)
        this.placeholderMesh = placeholderMesh
        this.checkoutHandler = checkoutHandler
        this.checkout = null
        
        this.insertArea = new InsertArea(this, insertAreaOffset, insertAreaSize)
        this.inventory = new Inventory()
        
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

    onSelect() {
        if (this.checkout) {
            this.checkout.removeBasket()
        }

        this.mesh.visible = true
        if (this.inventory.products.length > 0) {
            this.placeholderMesh.visible = true
        }
    }

    onDeselect() {
        const box = new THREE.Box3().setFromObject(this.mesh)
        const checkouts = this.checkoutHandler.getCheckouts()
        for (let i = 0; i < checkouts.length; i++) {
            if (checkouts[i].intersectsBox(box)) {
                checkouts[i].addBasket(this)
                return
            }
        }

        this.mesh.visible = false
        this.placeholderMesh.visible = false
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

class Inventory {
    constructor() {
        this.products = []
        this.eventDispatcher = new THREE.EventDispatcher()
        this.ui = null
    }

    addEventListener(type, callback) {
        this.eventDispatcher.addEventListener(type, callback)
    }

    removeEventListener(type, callback) {
        this.eventDispatcher.removeEventListener(type, callback)
    }

    setUI(ui) {
        this.ui = ui
    }

    addProduct(product) {
        this.products.push(product)
        this.eventDispatcher.dispatchEvent({ type: 'addProduct', product })
    }

    removeProduct(product) {
        const index = this.products.indexOf(product)
        if (index !== -1) {
            this.products.splice(index, 1)
        }
        this.eventDispatcher.dispatchEvent({ type: 'removeProduct', product })
    }

    clear() {
        this.products = []
        this.eventDispatcher.dispatchEvent({ type: 'clearProduct' })
    }
}

export default SelectableBasket
