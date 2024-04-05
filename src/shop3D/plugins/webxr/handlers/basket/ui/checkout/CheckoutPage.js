import SpatialUI from "../../../gui/spatialui/SpatialUI.js";
import * as THREE from 'three'

/**
 * Text options.
 */
const textColor = 0xFFFFFF
const font = await SpatialUI.SpatialUIText.loadFont('fonts/helvetiker_regular.typeface.json')
const textOptions = { font, size: .05, height: .01 }
const titleTextValue = 'Checkout'
const descriptionTextValue = 'Remove your headset to\n complete the purchase'
const totalTextValue = 'Total:'
const cancelTextValue = 'Cancel'

/**
 * The button options.
 */
const btnWidth = 0.35
const btnHeight = 0.2
const btnBggColor = 0xFFFFFF
const btnHoverColor = 0xCCCDDD
const btnTextColor = 0x000000
const btnTextOptions = { font, size: .05, height: .01 }

/**
 * Position options.
 */
const titleTextPosition = new THREE.Vector3(-0.9, 0.4, .0001)
const descriptionTextPosition = new THREE.Vector3(-0.4, 0.1, .0001)
const totalTextPosition = new THREE.Vector3(-0.9, -0.33, .0001)
const cancelButtonPosition = new THREE.Vector3(0.7, -0.3, .0001)

/**
 * @function buildCheckoutPage
 * @description Build the checkout page.
 * @returns {void}
 */
export function buildCheckoutPage() {
    const checkout = new SpatialUI.SpatialUIBuilder()
        /**
         * Create the title text.
         */
        .addText(titleTextValue, textOptions, textColor)
        /**
         * Create the description text.
         */
        .addText(descriptionTextValue, textOptions, textColor)
        /**
         * Create the total text.
         */
        .addText(totalTextValue, textOptions, textColor)
        /**
         * Create the cancel button.
         */
        .addButton(btnWidth, btnHeight, btnBggColor, btnHoverColor, cancelTextValue, btnTextOptions, btnTextColor)
        .build()
    
    /**
     * Get the checkout texts and buttons.
     */
    const titleText = checkout.texts[0]
    const descriptionText = checkout.texts[1]
    const totalText = checkout.texts[2]
    const cancelButton = checkout.buttons[0]

    /**
     * Set the positions
     */
    titleText.setPosition(titleTextPosition)
    descriptionText.setPosition(descriptionTextPosition)
    totalText.setPosition(totalTextPosition)
    cancelButton.setPosition(cancelButtonPosition)

    function setTotal(total, symbol = 'DKK') {
        totalText.setText(`${totalTextValue} ${total} ${symbol}`)
    }

    function show() {
        checkout.container.setVisibility(true)
    }

    function hide() {
        checkout.container.setVisibility(false)
    }

    /**
     * Hide the checkout page as default.
     */
    hide()

    return {
        setTotal,
        show,
        hide,
        cancelButton,
        container: checkout.container
    }
}
