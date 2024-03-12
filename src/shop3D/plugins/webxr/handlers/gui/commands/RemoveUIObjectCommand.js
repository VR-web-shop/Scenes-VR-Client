import WebXRHandlerCommand from "../../../abstractions/WebXRHandlerCommand.js";
import SpatialUIElement, {SelectableSpatialUIElement} from "../spatialui/SpatialUIElement.js";

/**
 * @class RemoveUIObjectCommand
 * @classdesc command for removing UI object.
 */
class RemoveUIObjectCommand extends WebXRHandlerCommand {

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
                const index = options.uiSelectables.indexOf(allChildren[i])
                if (index !== -1) {
                    options.uiSelectables.splice(index, 1)
                }
            }
        }

        const index = options.uiObjects.indexOf(this.element)
        if (index !== -1) {
            options.uiObjects.splice(index, 1)
        }

        options.view.scene.remove(this.element.object3D)
    }
}

export default RemoveUIObjectCommand
