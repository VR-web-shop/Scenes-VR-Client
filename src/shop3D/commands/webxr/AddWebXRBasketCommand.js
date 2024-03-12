import Command from "../../abstractions/commands/Command.js";
import SpatialUI from "../../plugins/webxr/handlers/gui/spatialui/SpatialUI.js";
import SetupInsertAreaCommand from "../../plugins/webxr/handlers/basket/commands/SetupInsertAreaCommand.js";
import FindUIObjectByName from "../../plugins/webxr/handlers/gui/commands/FindUIObjectByName.js";
import RemoveUIObjectCommand from "../../plugins/webxr/handlers/gui/commands/RemoveUIObjectCommand.js";
import AddUIObjectCommand from "../../plugins/webxr/handlers/gui/commands/AddUIObjectCommand.js";
import AddSelectableCommand from "../../plugins/webxr/handlers/select/commands/AddSelectableCommand.js";
import SetBasketSelectableCommand from "../../plugins/webxr/handlers/basket/commands/SetBasketSelectableCommand.js";
import SetBasketUIInterfaceCommand from "../../plugins/webxr/handlers/basket/commands/SetBasketUIInterfaceCommand.js";
import SelectableBasket from "../../plugins/webxr/handlers/select/selectables/SelectableBasket.js";
import * as THREE from "three";

/**
 * @function buildBasketUI
 * @description Build the basket UI.
 * @returns {void}
 */
async function buildBasketUI(guiHandler) {
    const font = await SpatialUI.SpatialUIText.loadFont('fonts/helvetiker_regular.typeface.json')
    const textOpt = { font, size: .2, height: .01 }

    const checkoutDispatcher = new THREE.EventDispatcher()
    const checkout = new SpatialUI.SpatialUIBuilder()
        .addText('Checkout', textOpt, 0xFFFFFF, 'checkout_title')
        .addText('Remove your headset to\n complete the purchase', textOpt, 0xFFFFFF, 'checkout_info')
        .addText('Total: $0.00', textOpt, 0xFFFFFF, 'checkout_total')
        .addButton(1.3, 0.5, 0xFFFFFF, 0xCCCDDD, 'Cancel', textOpt, 0x000000, 'checkout_cancel')
        .build()

    checkout.texts[0].setPosition(new THREE.Vector3(-2.15, 1.4, .0001))
    checkout.texts[1].setPosition(new THREE.Vector3(-1.65, 0.25, .0001))
    checkout.texts[2].setPosition(new THREE.Vector3(-2.15, -1.4, .0001))
    checkout.buttons[0].setPosition(new THREE.Vector3(1.2, -1.3, .0001))

    const columns = 4
    const rows = 3
    const perPage = columns * rows
    const content = new SpatialUI.SpatialUIBuilder()
        .addText('Content', textOpt, 0xFFFFFF, 'content_title')
        .addGridPaginator(
            { columns, rows, rowSpacing: 0.8, columnSpacing: 0.85 },
            { width: 1.3, height: 0.5, color: 0xFFFFFF, hoverColor: 0xCCCDDD, text: 'Previous', textOptions: textOpt, textColor: 0x000000 },
            { width: 1.3, height: 0.5, color: 0xFFFFFF, hoverColor: 0xCCCDDD, text: 'Next', textOptions: textOpt, textColor: 0x000000 },
            { text: 'Pages', textOptions: textOpt, textColor: 0xFFFFFF },
            { text: 'No items in basket', textOptions: textOpt, textColor: 0xFFFFFF },
        'content_paginator')
        .addButton(1.3, 0.5, 0xFFFFFF, 0xCCCDDD, 'Checkout', textOpt, 0x000000, 'content_checkout_button')
        .addButton(1.3, 0.5, 0xFFFFFF, 0xCCCDDD, 'Close', textOpt, 0x000000, 'content_close_button')
        .build()
    
    const createCard = (quantity, textureImage) => {
        const card = new SpatialUI.SpatialUIBuilder()
            .addPanel(0.6, 0.6, 0x333333, `card_panel_${i}`)
            .addImage(textureImage, 0.5, 0.4, `image_${i}`)
            .addText(`${quantity}x`, {font, size: .15, height: .01}, 0xFFFFFF, `text_${i}`)
            .addButton(0.6, 0.2, 0xFF0000, 0xCCCCCC, 'Remove', {font, size: .1, height: .01}, 0xFFFFFF, `remove_button_${i}`)
            .build()

        card.container.setName(`card_${i}`)
        card.images[0].setPosition(new THREE.Vector3(0, 0.05, .0001))
        card.texts[0].setPosition(new THREE.Vector3(-0.3, 0.15, .0001))
        card.buttons[0].setPosition(new THREE.Vector3(0, -0.25, .0001))
        card.buttons[0].addClickListener(() => {
            content.paginators[0].removeElement(card.container)
            guiHandler.invoke(new RemoveUIObjectCommand(card.container))
        })
        guiHandler.invoke(new AddUIObjectCommand(card.container))

        return card.container
    }

    content.texts[0].setPosition(new THREE.Vector3(-2.15, 1.4, .0001))
    content.paginators[0].emptyText.setPosition(new THREE.Vector3(-2.15, 1.0, .0001))
    content.paginators[0].pagesText.setPosition(new THREE.Vector3(-2.15, -1.4, .0001))
    content.paginators[0].prevButton.setPosition(new THREE.Vector3(0.3, -1.3, .0001))
    content.paginators[0].nextButton.setPosition(new THREE.Vector3(1.8, -1.3, .0001))
    content.paginators[0].paginatableContainer.setPosition(new THREE.Vector3(-0.25, .58, .0001))
    content.buttons[0].setPosition(new THREE.Vector3(1.8, 0.7, .0001))
    content.buttons[1].setPosition(new THREE.Vector3(1.8, 1.4, .0001))

    const parent = new SpatialUI.SpatialUIBuilder()
        .addPanel(5.5, 4, 0x000000, 'basket_bgg_panel')
        .addChildContainerElement(checkout.container, 'checkout')
        .addChildContainerElement(content.container, 'content')
        .build()
    parent.container.setName('basket')
    parent.container.setVisbility(false)
    checkout.container.setVisbility(false)

    // Show the content container
    checkout.buttons[0].addClickListener(() => {
        checkout.container.setVisbility(false)
        content.container.setVisbility(true)
    })

    // Show the checkout container
    content.buttons[0].addClickListener(() => {
        content.container.setVisbility(false)
        checkout.container.setVisbility(true)
        checkoutDispatcher.dispatchEvent({ type: 'checkout' })
    })

    // Close the parent container
    content.buttons[1].addClickListener(() => {
        parent.container.setVisbility(false)
    })

    const uiInterface = {
        checkout: {
            addCheckoutListener: (listener) => {
                checkoutDispatcher.addEventListener('checkout', listener)
            },
            removeCheckoutListener: (listener) => {
                checkoutDispatcher.removeEventListener('checkout', listener)
            },
            setTotal: (total) => checkout.texts[2].setText(`Total: $${total.toFixed(2)}`)
        },
        content: {
            setElements: (products) => {
                const elements = products.map(p => createCard(p.quantity, p.productTextureImage))
                content.paginators[0].setElements(elements)
            },
            addElement: (product) => {
                const element = createCard(product.quantity, product.productTextureImage)
                content.paginators[0].addElement(element)
            },
            removeElements: () => content.paginators[0].removeElements()
        },
        show: () => parent.container.setVisbility(true),
        hide: () => parent.container.setVisbility(false),
        setPosition: (position) => parent.container.setPosition(position),
        setRotation: (rotation) => parent.container.setRotation(rotation),
        parent
    }

    return { parent, uiInterface }
}

/**
 * @class AddWebXRBasketCommand
 * @classdesc Command for adding a webxr basket.
 * @extends Command
 * @property options - The options for the command.
 */
class AddWebXRBasketCommand extends Command {

    /**
     * @constructor
     * @param {Object} searchBasketMesh - The search for the object 3d.
     * @param {Object} searchPlaceholderMesh - The search for the placeholder object 3d.
     * @param {THREE.Vector3} selectOffset - The offset for the controller select.
     * @param {THREE.Vector3} placeholderOffset - The offset for the placeholder object 3d.
     * Possible parameters are: name, uuid
     * Note: Select only one parameter.
     * @example new AddWebXRBasketCommand( { name: 'meshName' }, { name: 'meshName' } )
     * @example new AddWebXRBasketCommand( { uuid: 'meshUUID' }, { name: 'meshUUID' } )
     */
    constructor(
        searchBasketMesh, 
        searchPlaceholderMesh, 
        selectOffset = { x: 0, y: 0, z: 0 }, 
        placeholderOffset = { x: 0, y: 0, z: 0 },
        insertAreaOffset = { x: 0, y: 0, z: 0 },
        insertAreaSize = { x: 1, y: 1, z: 1 }) {
        super()
        this.searchBasketMesh = searchBasketMesh
        this.searchPlaceholderMesh = searchPlaceholderMesh
        this.selectOffset = selectOffset
        this.placeholderOffset = placeholderOffset
        this.insertAreaOffset = insertAreaOffset
        this.insertAreaSize = insertAreaSize
    }

    /**
     * @function execute
     * @description Add a webxr basket.
     * @param {Object} options - The options for the command.
     * @returns {void}
     */
    async execute(options) {
        const searchPlugin = options.plugins.find('search')
        const webxrPlugin = options.plugins.find('webxr')
        const selectHandler = webxrPlugin.getHandler('select')
        const basketHandler = webxrPlugin.getHandler('basket')
        const guiHandler = webxrPlugin.getHandler('gui')

        const offset = new THREE.Vector3(this.selectOffset.x, this.selectOffset.y, this.selectOffset.z)
        const placeholderOffset = new THREE.Vector3(this.placeholderOffset.x, this.placeholderOffset.y, this.placeholderOffset.z)
        const insertAreaOffset = new THREE.Vector3(this.insertAreaOffset.x, this.insertAreaOffset.y, this.insertAreaOffset.z)
        const insertAreaSize = new THREE.Vector3(this.insertAreaSize.x, this.insertAreaSize.y, this.insertAreaSize.z)

        const basketMesh = searchPlugin.search(this.searchBasketMesh)
        const placeholderMesh = searchPlugin.search(this.searchPlaceholderMesh)
        const selectable = new SelectableBasket(basketMesh, placeholderMesh, offset, placeholderOffset, basketHandler)

        await selectHandler.invoke(new AddSelectableCommand(selectable))
        await basketHandler.invoke(new SetBasketSelectableCommand(selectable))
        await basketHandler.invoke(new SetupInsertAreaCommand(insertAreaOffset, insertAreaSize))
        
        const basketUIContainer = await guiHandler.invoke(new FindUIObjectByName('basket'))
        if (!basketUIContainer) {
            const ui = await buildBasketUI(guiHandler)
            await guiHandler.invoke(new AddUIObjectCommand(ui.parent.container))
            await basketHandler.invoke(new SetBasketUIInterfaceCommand(ui.uiInterface))
        }
    }
}

export default AddWebXRBasketCommand
