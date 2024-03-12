import Selectable from '../Selectable.js'
import AddBasketProductCommand from '../../basket/commands/AddBasketProductCommand.js'
import IsIntersectingBasketInsertAreaCommand from '../../basket/commands/IsIntersectingBasketInsertAreaCommand.js'
import * as THREE from 'three'

class SelectableProduct extends Selectable {
    constructor(mesh, productTextureImage, quantity, price, name, basketHandler) {
        super(mesh)

        this.basketHandler = basketHandler
        this.lastPosition = new THREE.Vector3().copy(mesh.position)
        this.productTextureImage = productTextureImage
        this.quantity = quantity
        this.price = price
        this.name = name
    }

    onSelect() {
    }

    async onDeselect() {
        this.mesh.position.copy(this.lastPosition)

        const box3 = new THREE.Box3().setFromObject(this.mesh)
        const isIntersecting = await this.basketHandler.invoke(new IsIntersectingBasketInsertAreaCommand(box3))
        if (isIntersecting) {
            await this.basketHandler.invoke(new AddBasketProductCommand(this))
            this.mesh.visible = false
        }
    }
}

export default SelectableProduct
