import SpatialUI from "../../../gui/spatialui/SpatialUI.js";
import ContentManager from "./ContentManager.js";
import ContentObject from "./ContentObject.js";
import RemoveUIObjectCommand from "../../../gui/commands/RemoveUIObjectCommand.js";
import AddUIObjectCommand from "../../../gui/commands/AddUIObjectCommand.js";
import * as THREE from 'three'

/**
 * Text options.
 */
const textColor = 0xFFFFFF
const titleTextValue = 'Content'
const pagesTextValue = 'Pages'
const emptyTextValue = 'No items in basket'
const previousTextValue = 'Previous'
const nextTextValue = 'Next'
const checkoutTextValue = 'Checkout'
const cancelTextValue = 'Close'

/**
 * The button options.
 */
const btnWidth = 0.35
const btnHeight = 0.2
const btnBggColor = 0xFFFFFF
const btnHoverColor = 0xCCCDDD
const btnTextColor = 0x000000


/**
 * Position options.
 */
const titleTextPosition = new THREE.Vector3(-0.9, 0.4, .0001)
const emptyTextPosition = new THREE.Vector3(-0.9, 0.3, .0001)
const pagesTextPosition = new THREE.Vector3(0.5, -0.33, .0001)
const prevButtonPosition = new THREE.Vector3(-0.73, -0.3, .0001)
const nextButtonPosition = new THREE.Vector3(-0.30, -0.3, .0001)
const paginatableContainerPosition = new THREE.Vector3(-0.05, 0.25, .0001)
const checkoutButtonPosition = new THREE.Vector3(0.7, 0.25, .0001)
const cancelButtonPosition = new THREE.Vector3(0.7, -0.03, .0001)

/**
 * Paginator options.
 */
const columns = 4
const rows = 2
const rowSpacing = 0.25
const columnSpacing = 0.35

/**
 * Content element options.
 */
const contentElementWidth = 0.3
const contentElementHeight = 0.2
const contentElementColor = 0x333333

/**
 * Content element image options.
 */
const contentElementImgWidth = 0.1
const contentElementImgHeight = 0.1
const contentElementImgPosition = new THREE.Vector3(-0.08, 0.04, .0001)

/**
 * Content element text options.
 */
const contentElementTextColor = 0xFFFFFF
const contentElementTextPosition = new THREE.Vector3(0.0, 0.02, .0001)

/**
 * Content element button options.
 */
const contentElementBtnWidth = 0.3
const contentElementBtnHeight = 0.1
const contentElementBtnColor = 0xFF0000
const contentElementBtnHoverColor = 0xCCCCCC
const contentElementBtnText = 'Remove'
const contentElementBtnTextColor = 0xFFFFFF
const contentElementBtnPosition = new THREE.Vector3(0, -0.08, .0001)

/**
 * @function buildContentPage
 * @description Build the content page.
 * @returns {Promise<Object>}
 */
export async function buildContentPage(guiHandler) {
    if (!guiHandler) {
        throw new Error('The GUI handler is required.')
    }

    const font = await SpatialUI.SpatialUIText.loadFont('fonts/helvetiker_regular.typeface.json')
    const textOptions = { font, size: .05, height: .01 }
    const btnTextOptions = { font, size: .05, height: .01 }
    const contentElementTextOptions = { font, size: .03, height: .01 }
    const contentElementBtnTextOptions = { font, size: .03, height: .01 }

    const content = new SpatialUI.SpatialUIBuilder()
        /**
         * Create the title text.
         */
        .addText(titleTextValue, textOptions, 0xFFFFFF)
        /**
         * Create a grid paginator to display the content.
         */
        .addGridPaginator(
            { columns, rows, rowSpacing, columnSpacing },
            { width: btnWidth, height: btnHeight, color: btnBggColor, hoverColor: btnHoverColor, text: previousTextValue, textOptions: btnTextOptions, textColor: btnTextColor },
            { width: btnWidth, height: btnHeight, color: btnBggColor, hoverColor: btnHoverColor, text: nextTextValue, textOptions: btnTextOptions, textColor: btnTextColor },
            { text: pagesTextValue, textOptions, textColor },
            { text: emptyTextValue, textOptions, textColor },
        )
        /**
         * Create the checkout button.
         */
        .addButton(btnWidth, btnHeight, btnBggColor, btnHoverColor, checkoutTextValue, btnTextOptions, btnTextColor)        
        /**
         * Create the cancel button.
         */
        .addButton(btnWidth, btnHeight, btnBggColor, btnHoverColor, cancelTextValue, btnTextOptions, btnTextColor)
        .build()

    /**
     * Get the texts and buttons.
     */
    const titleText = content.texts[0]
    const paginator = content.paginators[0]
    const checkoutButton = content.buttons[0]
    const cancelButton = content.buttons[1]

    /**
     * Set the positions
     */
    titleText.setPosition(titleTextPosition)
    paginator.emptyText.setPosition(emptyTextPosition)
    paginator.pagesText.setPosition(pagesTextPosition)
    paginator.prevButton.setPosition(prevButtonPosition)
    paginator.nextButton.setPosition(nextButtonPosition)
    paginator.paginatableContainer.setPosition(paginatableContainerPosition)
    checkoutButton.setPosition(checkoutButtonPosition)
    cancelButton.setPosition(cancelButtonPosition)

    /**
     * The content manager controls the content objects.
     */
    const contentManager = new ContentManager(async (contentObject) => {
        const quantity = contentObject.getQuantity()
        const imageTexture = await SpatialUI.SpatialUIImage.loadTexture(contentObject.imageSource)
        const card = new SpatialUI.SpatialUIBuilder()
            /**
             * Create the card's background panel.
             */
            .addPanel(contentElementWidth, contentElementHeight, contentElementColor)
            /**
             * Create the card's content object's image.
             */
            .addImage(imageTexture, contentElementImgWidth, contentElementImgHeight)
            /**
             * Create the card's content object's text.
             */
            .addText(`${quantity}x`, contentElementTextOptions, contentElementTextColor)
            /**
             * Create the card's content object's remove button.
             */
            .addButton(
                contentElementBtnWidth, 
                contentElementBtnHeight, 
                contentElementBtnColor, 
                contentElementBtnHoverColor, 
                contentElementBtnText, 
                contentElementBtnTextOptions, 
                contentElementBtnTextColor
            )
            .build()

        /**
         * Get the card's image, text and button.
         */
        const image = card.images[0]
        const text = card.texts[0]
        const button = card.buttons[0]

        /**
         * Set the positions.
         */
        image.setPosition(contentElementImgPosition)
        text.setPosition(contentElementTextPosition)
        button.setPosition(contentElementBtnPosition)

        /**
         * Add a click listener to the button.
         */
        button.addClickListener(() => {
            // Remove from container
            paginator.removeElement(card.container)
            // Remove from GUI handler
            guiHandler.invoke(new RemoveUIObjectCommand(card.container))
            // Call the object's remove callback
            contentObject.removeCallback(contentObject)
        })

        /**
          * Add the card to GUI handler, so it can be accessed
          * by GUI selection functions.
          */
        guiHandler.invoke(new AddUIObjectCommand(card.container))

        /**
         * Add the card to the paginator.
         */
        paginator.addElement(card.container)
    })

    /**
     * The content object holds information about the object it represents.
     * It can be passed in from the outside to set the initial content behavior.
     * It can also be used to store additional information about the object.
     */
    const contentObjects = () => contentManager.getContentObjects()

    function clearContentObjects() {
        contentManager.clearContentObjects()
        paginator.removeElements()
    }

    async function addContentObject(contentObject) {
        await contentManager.addContentObject(contentObject)
    }

    function show() {
        content.container.setVisibility(true)
    }

    function hide() {
        content.container.setVisibility(false)
    }


    return {
        contentObjects,
        addContentObject,
        clearContentObjects,
        show,
        hide,
        checkoutButton,
        cancelButton,
        container: content.container
    }
}
