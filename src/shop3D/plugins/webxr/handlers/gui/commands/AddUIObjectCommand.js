import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";
import SpatialUIElement, { SelectableSpatialUIElement } from "../spatialui/SpatialUIElement.js";

/**
 * @class AddUIObjectCommand
 * @classdesc command for adding UI object.
 */
class AddUIObjectCommand extends WebXRHandlerCommand {

    /**
     * @constructor
     * @param {SpatialUIElement} element - The UI element to be added.
     */
    constructor(element) {
        super()

        if (!(element instanceof SpatialUIElement)) {
            throw new Error('The element must be an instance of SpatialUIElement')
        }

        this.element = element
    }

    /**
     * @function execute
     * @description Execute the command.
     * @param {Object} options - The options for the command.
     * @returns {void}
     * @async
     */
    async execute(options) {
        // Find the childrens' children and add the selectables.
        const allChildren = this.element.findAllChildren()
        for (let i = 0; i < allChildren.length; i++) {
            if (allChildren[i] instanceof SelectableSpatialUIElement) {
                options.uiSelectables.push(allChildren[i])
            }
        }

        options.uiObjects.push(this.element)
        options.view.scene.add(this.element.object3D)
    }
}

export default AddUIObjectCommand
