import SpatialUI from "../../../gui/spatialui/SpatialUI.js";
import BaseUIInterface from "../BaseUIInterface.js";
import QuantityManager from "./QuantityManager.js";
import QuantityObject from "./QuantityObject.js";
import * as THREE from 'three'

/**
 * Dimensions.
 */
const width = 0.6
const height = 0.3

/**
 * Colors.
 * Except for buttons.
 */
const bggColor = 0x333333
const textColor = 0xFFFFFF

/**
 * Text options.
 */
const font = SpatialUI.SpatialUIText.loadFont('fonts/helvetiker_regular.typeface.json')
const textOptions = { font, size: .03, height: .01 }
const titleTextValue = 'Select quantity:'
const increaseTextValue = 'Increase'
const decreaseTextValue = 'Decrease'
const confirmTextValue = 'Confirm'
const cancelTextValue = 'Cancel'

/**
 * The button options.
 */
const btnWidth = 0.25
const btnHeight = 0.05
const btnBggColor = 0xFFFFFF
const btnHoverColor = 0xCCCDDD
const btnTextColor = 0x000000
const btnTextOptions = { font, size: .03, height: .01 }

/**
 * Position options.
 */
const titleTextPosition = new THREE.Vector3(-0.25, 0.08, .0001)
const quantityTextPosition = new THREE.Vector3(0.05, 0.08, .0001)
const increaseButtonPosition = new THREE.Vector3(0.15, 0.0, .0001)
const decreaseButtonPosition = new THREE.Vector3(-0.15, 0.0, .0001)
const confirmButtonPosition = new THREE.Vector3(0.15, -0.08, .0001)
const cancelButtonPosition = new THREE.Vector3(-0.15, -0.08, .0001)

export async function buildQuantityUI() {
    const parent = new SpatialUI.SpatialUIBuilder()
        /**
         * The background panel.
         */
        .addPanel(width, height, bggColor)
        /**
         * The title text.
         */
        .addText(titleTextValue, textOptions, textColor)
        /**
         * The quantity text.
         */
        .addText(`${1}`, textOptions, textColor)
        /**
         * The buttons.
         */
        .addButton(btnWidth, btnHeight, btnBggColor, btnHoverColor, increaseTextValue, btnTextOptions, btnTextColor)
        .addButton(btnWidth, btnHeight, btnBggColor, btnHoverColor, decreaseTextValue, btnTextOptions, btnTextColor)
        .addButton(btnWidth, btnHeight, btnBggColor, btnHoverColor, confirmTextValue, btnTextOptions, btnTextColor)
        .addButton(btnWidth, btnHeight, btnBggColor, btnHoverColor, cancelTextValue, btnTextOptions, btnTextColor)
        .build()
    
    /**
     * Get the UI elements.
     */
    const titleText = parent.texts[0]
    const quantityText = parent.texts[1]
    const increaseButton = parent.buttons[0]
    const decreaseButton = parent.buttons[1]
    const confirmButton = parent.buttons[2]
    const cancelButton = parent.buttons[3]

    /**
     * Set the start positions.
     */
    titleText.setPosition(titleTextPosition)
    quantityText.setPosition(quantityTextPosition)
    increaseButton.setPosition(increaseButtonPosition)
    decreaseButton.setPosition(decreaseButtonPosition)
    confirmButton.setPosition(confirmButtonPosition)
    cancelButton.setPosition(cancelButtonPosition)

    /**
     * The quantity manager controls the quantity.
     */
    const quantityManager = new QuantityManager(new QuantityObject(1), (quantity, maxQuantity) => {
        quantityText.setText(`${quantity}/${maxQuantity}`)
    })

    /**
     * The quantity object holds the quantity and the method to get the max quantity.
     * It can be passed in from the outside to set the initial quantity behavior.
     * It can also be used to store additional information about the object
     * that the quantity is being set for.
     */
    const quantityObject = () => quantityManager.getQuantityObject()

    /**
     * Setup button click listeners.
     */
    increaseButton.addClickListener(quantityManager.increase.bind(quantityManager))
    decreaseButton.addClickListener(quantityManager.decrease.bind(quantityManager))
    
    confirmButton.addClickListener(() => {
        const object = quantityObject()
        object.onConfirmQuantity(object)
        uiInterface.hide()
    })

    cancelButton.addClickListener(() => {
        const object = quantityObject()
        object.onCancelQuantity(object)
        uiInterface.hide()
    })

    /**
     * @function setQuantityObject
     * @description Set the quantity object.
     * @returns {void}
     */
    function setQuantityObject(object) {
        quantityManager.setQuantityObject(object)
    }

    /**
     * The exposed functions.
     */
    const uiInterface = { 
        ...BaseUIInterface(parent),
        setQuantityObject
    }

    /**
     * Hide as default.
     */
    uiInterface.hide()

    return { parent, uiInterface }
}
