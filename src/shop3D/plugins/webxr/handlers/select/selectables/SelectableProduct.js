import Selectable from '../Selectable.js'
import SelectableBasket from './SelectableBasket.js'
import { getXRPosition } from '../../teleport/TeleportHandler.js'
import CheckoutUI from '../../basket/CheckoutUI.js'
import * as THREE from 'three'

function confirmQuantity(event) {
    clearQuantity()
    const basket = SelectableBasket.getSelectableBasket()
    const quantity = event.quantity
    const selectableProduct = event.selectableProduct
    const availableProductEntities = selectableProduct.getAvailableProductEntities()
    const productEntities = [];
    for (let i = 0; i < quantity; i++) {
        productEntities.push(availableProductEntities[i])
        selectableProduct.reserveProductEntity(availableProductEntities[i])
    }

    basket.inventory.addProduct({selectableProduct, productEntities})
    if (quantity === selectableProduct.getAvailableProductEntities().length) {
        selectableProduct.mesh.visible = false
    }
}

function cancelQuantity(event) {
    clearQuantity()
    event.selectableProduct.mesh.visible = true
}

function clearQuantity() {
    const quanitityInterface = CheckoutUI.getQuantityInterface()
    quanitityInterface.removeEventListener('confirm', confirmQuantity)
    quanitityInterface.removeEventListener('cancel', cancelQuantity)
}

class SelectableProduct extends Selectable {
    constructor(mesh, product, productEntities) {
        super(mesh)

        this.lastPosition = new THREE.Vector3().copy(mesh.position)
        this.product = product
        this.productEntities = productEntities
        this.productEntitiesInUse = []
    }

    getAvailableProductEntities() {
        return this.productEntities.filter(productEntity => !this.productEntitiesInUse.includes(productEntity))
    }

    reserveProductEntity(productEntity) {
        const exist = this.productEntitiesInUse.includes(productEntity)
        if (exist) {
            throw new Error('The product entity is already in use')
        }

        this.productEntitiesInUse.push(productEntity)
    }

    releaseProductEntity(productEntity) {
        const index = this.productEntitiesInUse.indexOf(productEntity)
        if (index !== -1) {
            this.productEntitiesInUse.splice(index, 1)
        }
    }

    onSelect() {
    }

    async onDeselect() {
        const box3 = new THREE.Box3().setFromObject(this.mesh)
        const basket = SelectableBasket.getSelectableBasket()   
        if (basket.insertArea.intersectsBox(box3)) {
            const xrPosition = getXRPosition()
            xrPosition.y = this.lastPosition.y
            const quanitityInterface = CheckoutUI.getQuantityInterface()
            quanitityInterface.setSelectableProduct(this)
            quanitityInterface.setPosition(this.lastPosition)
            quanitityInterface.lookAt(xrPosition)
            quanitityInterface.addEventListener('confirm', confirmQuantity)
            quanitityInterface.addEventListener('cancel', cancelQuantity)
            quanitityInterface.show()
            this.mesh.visible = false
        }

        this.mesh.position.copy(this.lastPosition)
    }

    isSelectable() {
        return !this.mesh.visible || this.socket !== null || this.getAvailableProductEntities().length > 0
    }
}

export default SelectableProduct
