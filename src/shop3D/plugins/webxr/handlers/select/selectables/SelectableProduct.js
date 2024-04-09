import Selectable from '../Selectable.js'
import SelectableBasket from './SelectableBasket.js'
import AddProductCommand from '../../basket/commands/AddProductCommand.js'
import RemoveProductCommand from '../../basket/commands/RemoveProductCommand.js'
import ShowQuantityUICommand from '../../basket/commands/ShowQuantityUICommand.js'
import SpatialUIText from '../../gui/spatialui/elements/SpatialUIText.js'
import * as THREE from 'three'

let valuta = { name: 'Euro', short: 'EUR', symbol: '€', active: false }
let font = null

class SelectableProduct extends Selectable {
    constructor(mesh, id, product, productEntities, checkoutHandler) {
        super(mesh, id)

        this.product = product
        this.productEntities = productEntities
        this.productEntitiesInUse = []
        this.checkoutHandler = checkoutHandler
        this.lastPosition = new THREE.Vector3().copy(mesh.position)
        this.lastRotation = new THREE.Euler().copy(mesh.rotation)
        this.outOfStockEffect = SelectableProduct.createOutOfStockEffect(this)
        this.ui = null
        this.setOutOfStockEffect()
    }

    setUI(ui) {
        this.ui = ui
    }

    getPrice() {
        return this.product.price
    }

    getValuta() {
        return valuta
    }

    getImageSource() {
        return this.product.thumbnail_source
    }

    setOutOfStockEffect() {
        const outOfStock = this.getAvailableProductEntities().length === 0
        if (outOfStock) this.outOfStockEffect.show()
        else this.outOfStockEffect.hide()
        this.ui?.updateUI()
    }

    /**
     * @function reserveProductEntity
     * @description Reserve a product entity for the product.
     * @param {Object} productEntity - The product entity.
     * @returns {void}
     */
    reserveProductEntity(productEntity) {
        this.productEntitiesInUse.push(productEntity)
        this.setOutOfStockEffect()
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

        this.setOutOfStockEffect()
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

    isProductEntityReserved(productEntity) {
        return this.productEntitiesInUse.find(entity => entity.uuid === productEntity.uuid)
    }

    isProductEntityExistent(productEntity) {
        return this.productEntities.find(entity => entity.uuid === productEntity.uuid)
    }

    /**
     * @function onUpdate
     * @description Called when the selectable is updated.
     * @param {Object} options - The options.
     * @returns {void}
     */
    onUpdate(options={}) {
        if (options.updateProduct) {
            this.product = options.updateProduct
            this.ui?.updateUI()
        }

        // Note: order matters. Always add before reserve.
        if (options.addProductEntities) {
            for (let i = 0; i < options.addProductEntities.length; i++) {
                if (this.isProductEntityExistent(options.addProductEntities[i])) {
                    continue
                }

                this.productEntities.push(options.addProductEntities[i])
                
            }
            // If the mesh is hidden and this update doesn't add
            // reserved product entities, then show the mesh.
            this.setOutOfStockEffect()
        }
        
        if (options.removeProductEntity) {
            for (let i = 0; i < options.removeProductEntity.length; i++) {
                const index = this.productEntities.findIndex(entity => entity.uuid === options.removeProductEntity[i].uuid)
                if (index !== -1) {
                    // When removing product entities, it is possible to pass a flag saying this removal
                    // should be blocked if the product entity is reserved.
                    if (options.blockIfReserved && this.isProductEntityReserved(options.removeProductEntity[i])) {
                        return
                    }

                    this.productEntities.splice(index, 1)
                }
            }
            
            // if the mesh is shown and it has no product entities, then hide the mesh.
            this.setOutOfStockEffect()
        }

        if (options.reserveProductEntities) {
            for (let i = 0; i < options.reserveProductEntities.length; i++) {
                if (this.isProductEntityReserved(options.reserveProductEntities[i])) {
                    continue
                }

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
                // When removing product entities, it is possible to pass a flag saying this removal
                // should be blocked if the product entity is reserved.
                if (options.blockIfReserved && this.isProductEntityReserved(options.removeProductEntity)) {
                    return
                }

                this.releaseProductEntity(options.releaseReservedProductEntities[i])

                /**
                 * Chanches are that the product is already in the basket,
                 * so the remove product must be removed.
                 */
                this.checkoutHandler.invoke(new RemoveProductCommand(this, false))
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
        this.mesh.visible = true
        this.productEntitiesInUse.length = 0
        this.setOutOfStockEffect()
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

        this.checkoutHandler.invoke(new AddProductCommand(this, true))
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
        return this.socket !== null || this.getAvailableProductEntities().length > 0
    }

    static createOutOfStockEffect(selectableProduct) {
        const materials = []

        selectableProduct.mesh.traverse(child => {
            if (child.isMesh) {
                const ogMat = child.material
                const efMat = ogMat.clone()
                efMat.transparent = true
                efMat.opacity = 0.5

                materials.push({
                    original: ogMat,
                    effect: efMat,
                    show: () => child.material = efMat,
                    hide: () => child.material = ogMat
                })
            }
        })

        const show = () => {
            materials.forEach(mat => mat.show())
        }

        const hide = () => {
            materials.forEach(mat => mat.hide())
        }
         
        return {
            show,
            hide
        }
    }

    static setValuta(newValuta) {
        valuta = newValuta
    }

    static getValuta() {
        return valuta
    }

    static async buildUI(selectableProduct, uiPosition, uiRotation, uiScale) {
        if (!font) font = await SpatialUIText.loadFont('fonts/helvetiker_regular.typeface.json')
        const textOptions = { font, size: 0.05, height: 0.01 }
        const nameText = new SpatialUIText("{name}", textOptions, 0x000000)
        const priceText = new SpatialUIText("{price}", textOptions, 0x000000)
        const outOfStockText = new SpatialUIText('Out of stock', textOptions, 0xff0000)
        const wrapper = new THREE.Object3D()

        nameText.setPosition(new THREE.Vector3(0, 0.1, 0))
        priceText.setPosition(new THREE.Vector3(0, 0, 0))
        outOfStockText.setPosition(new THREE.Vector3(0, 0.2, 0))

        wrapper.add(nameText.object3D)
        wrapper.add(priceText.object3D)
        wrapper.add(outOfStockText.object3D)
        
        const position = new THREE.Vector3(uiPosition.x, uiPosition.y, uiPosition.z)
            .add(selectableProduct.mesh.position)
        const rotation = new THREE.Euler().setFromQuaternion(selectableProduct.mesh.quaternion)
        const scale = new THREE.Vector3(uiScale.x, uiScale.y, uiScale.z)

        rotation.x += uiRotation.x
        rotation.y += uiRotation.y
        rotation.z += uiRotation.z
    
        wrapper.position.copy(position)
        wrapper.rotation.copy(rotation)
        wrapper.scale.copy(scale)

        const findScene = (object) => {
            if (object.type === 'Scene') {
                return object
            }
            return findScene(object.parent)
        }

        const scene = findScene(selectableProduct.mesh)
        scene.add(wrapper)
    
        const updateUI = () => {
            let { name, price } = selectableProduct.product
            price = parseFloat(price)
            const show = selectableProduct.getAvailableProductEntities().length > 0
            
            nameText.setText(name)
            priceText.setText(`${price.toFixed(2)} ${valuta.short}`)
            outOfStockText.setVisibility(!show)
        }

        const removeUI = () => {
            scene.remove(wrapper)
        }
    
        updateUI()
    
        return {
            updateUI,
            removeUI
        }
    }
}

export default SelectableProduct
