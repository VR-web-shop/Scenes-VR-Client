import SpatialUI from "../gui/spatialui/SpatialUI.js";
import RemoveUIObjectCommand from "../gui/commands/RemoveUIObjectCommand.js";
import AddUIObjectCommand from "../gui/commands/AddUIObjectCommand.js";
import * as THREE from "three";

let _checkoutInterface = null
let _quantityInterface = null

export default class CheckoutUI {
    
    static setCheckoutInterface(newInterface) {
        _checkoutInterface = newInterface
    }

    static getCheckoutInterface() {
        return _checkoutInterface
    }

    static setQuantityInterface(newInterface) {
        _quantityInterface = newInterface
    }

    static getQuantityInterface() {
        return _quantityInterface
    }
}

/**
 * @function buildBasketUI
 * @description Build the basket UI.
 * @returns {void}
 */
export async function buildBasketUI(guiHandler) {
    const font = await SpatialUI.SpatialUIText.loadFont('fonts/helvetiker_regular.typeface.json')
    const textOpt = { font, size: .05, height: .01 }

    const checkoutDispatcher = new THREE.EventDispatcher()
    const checkout = new SpatialUI.SpatialUIBuilder()
        .addText('Checkout', textOpt, 0xFFFFFF, 'checkout_title')
        .addText('Remove your headset to\n complete the purchase', textOpt, 0xFFFFFF, 'checkout_info')
        .addText('Total: $0.00', textOpt, 0xFFFFFF, 'checkout_total')
        .addButton(0.35, 0.2, 0xFFFFFF, 0xCCCDDD, 'Cancel', textOpt, 0x000000, 'checkout_cancel')
        .build()

    checkout.texts[0].setPosition(new THREE.Vector3(-0.9, 0.4, .0001))
    checkout.texts[1].setPosition(new THREE.Vector3(-0.4, 0.1, .0001))
    checkout.texts[2].setPosition(new THREE.Vector3(-0.9, -0.33, .0001))
    checkout.buttons[0].setPosition(new THREE.Vector3(0.7, -0.3, .0001))

    const columns = 4
    const rows = 2
    const perPage = columns * rows
    const content = new SpatialUI.SpatialUIBuilder()
        .addText('Content', textOpt, 0xFFFFFF, 'content_title')
        .addGridPaginator(
            { columns, rows, rowSpacing: 0.25, columnSpacing: 0.35 },
            { width: 0.35, height: 0.2, color: 0xFFFFFF, hoverColor: 0xCCCDDD, text: 'Previous', textOptions: textOpt, textColor: 0x000000 },
            { width: 0.35, height: 0.2, color: 0xFFFFFF, hoverColor: 0xCCCDDD, text: 'Next', textOptions: textOpt, textColor: 0x000000 },
            { text: 'Pages', textOptions: textOpt, textColor: 0xFFFFFF },
            { text: 'No items in basket', textOptions: textOpt, textColor: 0xFFFFFF },
        'content_paginator')
        .addButton(0.35, 0.2, 0xFFFFFF, 0xCCCDDD, 'Checkout', textOpt, 0x000000, 'content_checkout_button')
        .addButton(0.35, 0.2, 0xFFFFFF, 0xCCCDDD, 'Close', textOpt, 0x000000, 'content_close_button')
        .build()
    
    const createCard = async (selectableProduct, removeCallback) => {
        const quantity = selectableProduct.productEntities.length
        console.log('selectableProduct', selectableProduct)

        const imageTexture = await SpatialUI.SpatialUIImage.loadTexture("images/couch_center.png")
        const card = new SpatialUI.SpatialUIBuilder()
            .addPanel(0.3, 0.2, 0x333333, `card_panel`)
            .addImage(imageTexture, 0.1, 0.1, `image`)
            .addText(`${quantity}x`, textOpt, 0xFFFFFF, `text`)
            .addButton(0.3, 0.1, 0xFF0000, 0xCCCCCC, 'Remove', textOpt, 0xFFFFFF, `remove_button`)
            .build()

        card.container.setName(`card`)
        card.images[0].setPosition(new THREE.Vector3(-0.08, 0.04, .0001))
        card.texts[0].setPosition(new THREE.Vector3(0.0, 0.02, .0001))
        card.buttons[0].setPosition(new THREE.Vector3(0, -0.08, .0001))
        card.buttons[0].addClickListener(() => {
            content.paginators[0].removeElement(card.container)
            guiHandler.invoke(new RemoveUIObjectCommand(card.container))
            removeCallback(selectableProduct)
        })
        guiHandler.invoke(new AddUIObjectCommand(card.container))

        return card.container
    }

    content.texts[0].setPosition(new THREE.Vector3(-0.9, 0.4, .0001))
    content.paginators[0].emptyText.setPosition(new THREE.Vector3(-0.9, 0.3, .0001))
    content.paginators[0].pagesText.setPosition(new THREE.Vector3(0.5, -0.33, .0001))
    content.paginators[0].prevButton.setPosition(new THREE.Vector3(-0.73, -0.3, .0001))
    content.paginators[0].nextButton.setPosition(new THREE.Vector3(-0.30, -0.3, .0001))
    content.paginators[0].paginatableContainer.setPosition(new THREE.Vector3(-0.05, 0.25, .0001))
    content.buttons[0].setPosition(new THREE.Vector3(0.7, 0.25, .0001))
    content.buttons[1].setPosition(new THREE.Vector3(0.7, -0.03, .0001))

    const parent = new SpatialUI.SpatialUIBuilder()
        .addPanel(2, 1, 0x000000, 'basket_bgg_panel')
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
        checkoutDispatcher.dispatchEvent({ type: 'cancelCheckout' })
    })

    // Show the checkout container
    content.buttons[0].addClickListener(() => {
        content.container.setVisbility(false)
        checkout.container.setVisbility(true)
        checkoutDispatcher.dispatchEvent({ type: 'startCheckout' })
    })

    // Close the parent container
    content.buttons[1].addClickListener(() => {
        parent.container.setVisbility(false)
    })

    const uiInterface = {
        checkout: {
            addStartCheckoutListener: (listener) => {
                checkoutDispatcher.addEventListener('checkout', listener)
            },
            addCancelCheckoutListener: (listener) => {
                checkoutDispatcher.addEventListener('cancelCheckout', listener)
            },
            removeStartCheckoutListener: (listener) => {
                checkoutDispatcher.removeEventListener('checkout', listener)
            },
            removeCancelCheckoutListener: (listener) => {
                checkoutDispatcher.removeEventListener('cancelCheckout', listener)
            },
            setTotal: (total) => checkout.texts[2].setText(`Total: $${total.toFixed(2)}`)
        },
        content: {
            setElements: async (products, removeCallback) => {
                const elements = await Promise.all(products.map(product => createCard(product, removeCallback)))
                content.paginators[0].setElements(elements)
            },
            addElement: async (product, removeCallback) => {
                const element = await createCard(product, removeCallback)
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

export async function buildQuantityUI() {
    const font = await SpatialUI.SpatialUIText.loadFont('fonts/helvetiker_regular.typeface.json')
    const textOpt = { font, size: .03, height: .01 }

    let selectableProduct = null
    let quantity = 1

    const quantityDispatcher = new THREE.EventDispatcher()
    const parent = new SpatialUI.SpatialUIBuilder()
        .addPanel(0.6, 0.3, 0x333333, `card_panel`)
        .addText('Select quantity:', textOpt, 0xFFFFFF, 'quantity_label')
        .addText('1', textOpt, 0xFFFFFF, 'quantity_value')
        .addButton(0.25, 0.05, 0xFFFFFF, 0xCCCDDD, 'Increase', textOpt, 0x000000, 'quantity_increase')
        .addButton(0.25, 0.05, 0xFFFFFF, 0xCCCDDD, 'Decrease', textOpt, 0x000000, 'quantity_decrease')
        .addButton(0.25, 0.05, 0xFFFFFF, 0xCCCDDD, 'Confirm', textOpt, 0x000000, 'quantity_confirm')
        .addButton(0.25, 0.05, 0xFFFFFF, 0xCCCDDD, 'Cancel', textOpt, 0x000000, 'quantity_cancel')
        .build()
    
    parent.texts[0].setPosition(new THREE.Vector3(-0.25, 0.08, .0001))
    parent.texts[1].setPosition(new THREE.Vector3(0.05, 0.08, .0001))
    parent.buttons[0].setPosition(new THREE.Vector3(0.15, 0.0, .0001))
    parent.buttons[1].setPosition(new THREE.Vector3(-0.15, 0.0, .0001))
    parent.buttons[2].setPosition(new THREE.Vector3(0.15, -0.08, .0001))
    parent.buttons[3].setPosition(new THREE.Vector3(-0.15, -0.08, .0001))

    function updateQuantityText() {
        parent.texts[1].setText(`${quantity}/${selectableProduct.getAvailableProductEntities().length}`)
    }

    parent.buttons[0].addClickListener(() => {
        if (selectableProduct.getAvailableProductEntities().length <= quantity) return

        quantity++
        quantityDispatcher.dispatchEvent({ type: 'increase', quantity })
        updateQuantityText()
    })

    parent.buttons[1].addClickListener(() => {
        if (quantity <= 1) return

        quantity--
        quantityDispatcher.dispatchEvent({ type: 'decrease', quantity })
        updateQuantityText()
    })

    parent.buttons[2].addClickListener(() => {
        parent.container.setVisbility(false)
        quantityDispatcher.dispatchEvent({ type: 'confirm', quantity, selectableProduct })
        updateQuantityText()
        hide()
        quantity = 1
        selectableProduct = null
    })

    parent.buttons[3].addClickListener(() => {
        
        parent.container.setVisbility(false)
        quantityDispatcher.dispatchEvent({ type: 'cancel', quantity, selectableProduct })
        updateQuantityText()
        hide()
        quantity = 1
        selectableProduct = null
    })

    /**
     * @function addEventListener
     * @description Add an event listener.
     * @param {string} type - The event type. Possible values: 'increase', 'decrease', 'cancel', 'confirm'.
     * @param {Function} listener - The event listener.
     * @returns {void}
     */
    function addEventListener(type, listener) {
        quantityDispatcher.addEventListener(type, listener)
    }

    /**
     * @function removeEventListener
     * @description Remove an event listener.
     * @param {string} type - The event type. Possible values: 'increase', 'decrease', 'cancel', 'confirm'.
     * @param {Function} listener - The event listener.
     * @returns {void}
     */
    function removeEventListener(type, listener) {
        quantityDispatcher.removeEventListener(type, listener)
    }

    /**
     * @function setProduct
     * @description Set the selectable product.
     * @returns {void}
     */
    function setSelectableProduct(product) {
        selectableProduct = product
        updateQuantityText()
    }

    /**
     * @function show
     * @description Show the UI.
     * @returns {void}
     */
    function show() {
        parent.container.setVisbility(true)
    }

    /**
     * @function hide
     * @description Hide the UI.
     * @returns {void}
     */
    function hide() {
        parent.container.setVisbility(false)
    }

    /**
     * @function setPosition
     * @description Set the position of the UI.
     * @param {THREE.Vector3}
     * @returns {void}
     */
    function setPosition(position) {
        parent.container.setPosition(position)
    }
    
    /**
     * @function setRotation
     * @description Set the rotation of the UI.
     * @param {THREE.Euler}
     * @returns {void}
     */
    function setRotation(rotation) {
        parent.container.setRotation(rotation)
    }

    /**
     * @function lookAt
     * @description Look at a position.
     * @param {THREE.Vector3}
     * @returns {void}
     */
    function lookAt(position) {
        parent.container.object3D.lookAt(position)
    }

    hide()

    const uiInterface = {
        addEventListener,
        removeEventListener,
        setSelectableProduct,
        show,
        hide,
        setPosition,
        setRotation,
        lookAt,
        parent
    }

    return { parent, uiInterface }
}