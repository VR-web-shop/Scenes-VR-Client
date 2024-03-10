import Command from "../../abstractions/commands/Command.js";
import SpatialUI from "../../plugins/webxr/gui/SpatialUI.js";
import * as THREE from "three";

let font = null

/**
 * @class AddWebXRBasketUICommand
 * @classdesc Command for adding a UI to a webxr basket.
 * @extends Command
 * @property options - The options for the command.
 */
class AddWebXRBasketUICommand extends Command {

    /**
     * @constructor
     */
    constructor() {
        super()
    }

    /**
     * @function execute
     * @description Add a UI to a webxr basket.
     * @param {Object} options - The options for the command.
     * @returns {void}
     */
    async execute(options) {
        const view = options.view
        const webxrPlugin = options.plugins.find('webxr')
        const basketHandler = webxrPlugin.getHandler('basket')

        if (font === null) {
            font = await SpatialUI.SpatialUIText.loadFont('fonts/helvetiker_regular.typeface.json')
        }

        const contentPage = function() {
            const ui = new SpatialUI.SpatialUIBuilder()
                .addPanel(5, 3.5, 0x000000, 'Background_Panel')
                .addText('Basket Content', { font, size: .2, height: .01 }, 0xFFFFFF, 'Basket_Title')
                .addGrid(5, 3, 0.7, 0.9, 'Products_Grid')
                .addText('Pages 1/3', { font, size: .2, height: .01 }, 0xFFFFFF, 'Page_Text')
                .addButton(1, 0.5, 0xFFFFFF, 0xCCCDDD, 'Previous', { font, size: .15, height: .015 }, 0x000000, 'Previous_Button')
                .addButton(1, 0.5, 0xFFFFFF, 0xCCCDDD, 'Next', { font, size: .15, height: .015 }, 0x000000, 'Next_Button')
                .build()
            
            const container = ui.container
            function showPage() {
                container.setVisbility(true)
            }

            function hidePage() {
                container.setVisbility(false)
            }

            const titleText = ui.texts[0]
            titleText.setPosition(new THREE.Vector3(-2.15, 1.4, .0001))

            const pageText = ui.texts[1]
            pageText.setPosition(new THREE.Vector3(-2.15, -1.4, .0001))

            const previousButton = ui.buttons[0]
            previousButton.setPosition(new THREE.Vector3(0.5, -1.3, .0001))
            previousButton.addClickListener(hidePage)

            const nextButton = ui.buttons[1]
            nextButton.setPosition(new THREE.Vector3(1.8, -1.3, .0001))
            nextButton.addClickListener(hidePage)

            const grid = ui.grids[0];
            const addGridElement = grid.addElement
            const removeGridElement = grid.removeElement
            const arrangeGridElements = grid.arrangeElements
            grid.setPosition(new THREE.Vector3(0.25, .28, .0001))
            
            const maxCards = 5 * 3
            for (let i = 0; i < maxCards; i++) {
                const randomColor = Math.floor(Math.random()*16777215).toString(16);
                const threeColor = parseInt(randomColor, 16)
                const card = new SpatialUI.SpatialUIBuilder()
                    .addPanel(0.8, 0.6, threeColor, 'Product_Card ' + i)
                    .build().panels[0]

                grid.addElement(card)
            }

            grid.arrangeElements()

            const methods = {
                container,
                addGridElement,
                removeGridElement,
                arrangeGridElements,
                showPage,
                hidePage,
            }

            return methods
        }

        const checkoutPage = function() {
            const ui = new SpatialUI.SpatialUIBuilder()
                .addText('Checkout', { font, size: .2, height: .01 }, 0xFFFFFF, 'Checkout_Title')
                .addText('Remove your headset to\n complete the purchase', { font, size: .2, height: .01 }, 0xFFFFFF, 'Checkout_Text')
                .addText('Total: $0.00', { font, size: .2, height: .01 }, 0xFFFFFF, 'Total_Text')
                .addButton(2, 0.5, 0xFFFFFF, 0xCCCDDD, 'Cancel', { font, size: .15, height: .015 }, 0x000000, 'Cancel_Button')
                .build()

            const container = ui.container
            function showPage() {
                container.setVisbility(true)
            }

            function hidePage() {
                container.setVisbility(false)
            }

            const titleText = ui.texts[0]
            titleText.setPosition(new THREE.Vector3(-2.15, 1.4, .0001))

            const checkoutText = ui.texts[1]
            checkoutText.setPosition(new THREE.Vector3(-1.65, 0.25, .0001))

            const totalText = ui.texts[2]
            totalText.setPosition(new THREE.Vector3(-2.15, -1.4, .0001))
            function setTotalText() {
                totalText.setText(text)
            }

            const cancelButton = ui.buttons[0]
            cancelButton.setPosition(new THREE.Vector3(1.2, -1.3, .0001))
            cancelButton.addClickListener(hidePage)

            const methods = {
                container,
                setTotalText,
                showPage,
                hidePage,
            }
            
            return methods
        }

        const parent = new SpatialUI.SpatialUIContainer()

        const _checkoutPage = checkoutPage()
        const _contentPage = contentPage()

        parent.addElement(_checkoutPage.container)
        parent.addElement(_contentPage.container)

        _checkoutPage.hidePage()

        parent.setPosition(new THREE.Vector3(0, 3, 0))
        parent.addToScene(view.scene)
        basketHandler.addBasketUI(parent)
    }
}

export default AddWebXRBasketUICommand
