import Selectable from '../Selectable.js'
import SelectableBasket from './SelectableBasket.js'
import AddProductCommand from '../../basket/commands/AddProductCommand.js'
import RemoveProductCommand from '../../basket/commands/RemoveProductCommand.js'
import ShowQuantityUICommand from '../../basket/commands/ShowQuantityUICommand.js'
import * as THREE from 'three'


class SelectableProduct extends Selectable {
    constructor(mesh, id, product, productEntities, checkoutHandler) {
        super(mesh, id)

        this.product = product
        this.productEntities = productEntities
        this.productEntitiesInUse = []
        this.checkoutHandler = checkoutHandler
        this.lastPosition = new THREE.Vector3().copy(mesh.position)
        this.lastRotation = new THREE.Euler().copy(mesh.rotation)

        if (this.productEntities.length === 0) {
            this.mesh.visible = false
        }
    }

    getPrice() {
        return this.product.price
    }

    getImageSource() {
        return this.product.thumbnail_source
    }

    /**
     * @function reserveProductEntity
     * @description Reserve a product entity for the product.
     * @param {Object} productEntity - The product entity.
     * @returns {void}
     */
    reserveProductEntity(productEntity) {
        this.productEntitiesInUse.push(productEntity)

        if (this.mesh.visible && this.productEntitiesInUse.length === this.productEntities.length) {
            this.mesh.visible = false
        }
    }

    /**
     * @function releaseProductEntity
     * @description Release a product entity for the product.
     * @param {Object} productEntity - The product entity.
     * @returns {void}
     */
    releaseProductEntity(productEntity) {
        const index = this.productEntitiesInUse.findIndex(entity => entity.uuid === productEntity.uuid)
        if (index !== -1) {
            this.productEntitiesInUse.splice(index, 1)
        }

        if (!this.mesh.visible && this.productEntitiesInUse.length < this.productEntities.length) {
            this.mesh.visible = true
        }
    }

    /**
     * @function getTotalProductEntities
     * @description Get the total product entities for the product.
     * @returns {number}
     */
    getTotalProductEntities() {
        return this.productEntities.length
    }

    /**
     * @function getProductEntitiesInUse
     * @description Get the product entities in use for the product.
     * @returns {Object[]}
     */
    getProductEntitiesInUse() {
        return this.productEntitiesInUse
    }

    /**
     * @function getAvailableProductEntitiesTotal
     * @description Get the total available product entities for the product.
     * @returns {number}
     */
    getAvailableProductEntitiesTotal() {
        return this.productEntities.length - this.productEntitiesInUse.length
    }

    /**
     * @function getAvailableProductEntities
     * @description Get the available product entities for the product.
     * @returns {Object[]}
     */
    getAvailableProductEntities() {
        return this.productEntities.filter(productEntity => !this.productEntitiesInUse.includes(productEntity))
    }

    /**
     * @function onUpdate
     * @description Called when the selectable is updated.
     * @param {Object} options - The options.
     * @returns {void}
     */
    onUpdate(options={}) {
        // Note: order matters. Always add before reserve.
        if (options.addProductEntities) {
            for (let i = 0; i < options.addProductEntities.length; i++) {
                this.productEntities.push(options.addProductEntities[i])
            }
        }
        
        if (options.removeProductEntity) {
            const index = this.productEntities.findIndex(entity => entity.uuid === options.removeProductEntity.uuid)
            if (index !== -1) {
                this.productEntities.splice(index, 1)
            }
        }

        if (options.reserveProductEntities) {
            for (let i = 0; i < options.reserveProductEntities.length; i++) {
                this.reserveProductEntity(options.reserveProductEntities[i])
                /**
                 * Chanches are that the product is already in the basket, 
                 * so the add product command must be idempotent.
                 */
                this.checkoutHandler.invoke(new AddProductCommand(this, false))
            }
        }

        if (options.releaseReservedProductEntities) {
            for (let i = 0; i < options.releaseReservedProductEntities.length; i++) {
                this.releaseProductEntity(options.releaseReservedProductEntities[i])
            }
        }
        console.log('SelectableProduct.onUpdate', this)
    }

    /**
     * @function onRemoveFromBasket
     * @description called by the checkout UI when the user removes the product from the basket.
     * @returns {void}
     */
    async onRemoveFromBasket() {
        await this.checkoutHandler.invoke(new RemoveProductCommand(this))
        this.productEntitiesInUse.length = 0
        this.mesh.visible = true
    }

    /**
     * @function onConfirmAddToBasket
     * @description Called by the quantity UI when the user confirms adding the product to the basket.
     * @param {QuantityObject} quantityObject - The quantity object.
     * @returns {void}
     */
    onConfirmAddToBasket(quantityObject) {
        const quantity = quantityObject.getQuantity()
        const available = this.getAvailableProductEntities()
        for (let i = 0; i < quantity; i++) {
            this.reserveProductEntity(available[i])
        }

        this.checkoutHandler.invoke(new AddProductCommand(this))
        this.mesh.visible = this.getAvailableProductEntities().length > 0
    }

    /**
     * @function onCancelAddToBasket
     * @description Called by the quantity UI when the user cancels adding the product to the basket.
     * @param {QuantityObject} quantityObject - The quantity object.
     * @returns {void}
     */
    onCancelAddToBasket(quantityObject) {
        this.mesh.visible = true
    }

    onSelect() {
        // do nothing
    }

    async onDeselect() {
        const box3 = new THREE.Box3().setFromObject(this.mesh)
        const basket = SelectableBasket.getSelectableBasket()   
        if (basket.insertArea.intersectsBox(box3)) {
            await this.checkoutHandler.invoke(new ShowQuantityUICommand(this))
            this.mesh.visible = false
        }

        this.mesh.position.copy(this.lastPosition)
        this.mesh.rotation.copy(this.lastRotation)
    }

    isSelectable() {
        return !this.mesh.visible || this.socket !== null || this.getAvailableProductEntities().length > 0
    }
}

export default SelectableProduct
