import Command from "../../abstractions/commands/Command.js";

import FindUIObjectByName from "../../plugins/webxr/handlers/gui/commands/FindUIObjectByName.js";
import AddUIObjectCommand from "../../plugins/webxr/handlers/gui/commands/AddUIObjectCommand.js";

import AddSelectableCommand from "../../plugins/webxr/handlers/select/commands/AddSelectableCommand.js";
import SelectableBasket from "../../plugins/webxr/handlers/select/selectables/SelectableBasket.js";
import SelectablePocket from "../../plugins/webxr/handlers/select/selectables/SelectablePocket.js";

import AddFollowObjectCommand from "../../plugins/webxr/handlers/follow/commands/AddFollowObject.js";

import SetQuantityUIInterfaceCommand from "../../plugins/webxr/handlers/basket/commands/SetQuantityUIInterfaceCommand.js";
import SetCheckoutUIInterfaceCommand from "../../plugins/webxr/handlers/basket/commands/SetCheckoutUIInterfaceCommand.js";
import { buildBasketUI, buildQuantityUI } from "../../plugins/webxr/handlers/basket/CheckoutUI.js";


import * as THREE from "three";


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
        const view = options.view
        const searchPlugin = options.plugins.find('search')
        const webxrPlugin = options.plugins.find('webxr')
        const selectHandler = webxrPlugin.getHandler('select')
        const checkoutHandler = webxrPlugin.getHandler('checkout')
        const guiHandler = webxrPlugin.getHandler('gui')
        const followHandler = webxrPlugin.getHandler('follow')

        const offset = new THREE.Vector3(this.selectOffset.x, this.selectOffset.y, this.selectOffset.z)
        const placeholderOffset = new THREE.Vector3(this.placeholderOffset.x, this.placeholderOffset.y, this.placeholderOffset.z)
        const insertAreaOffset = new THREE.Vector3(this.insertAreaOffset.x, this.insertAreaOffset.y, this.insertAreaOffset.z)
        const insertAreaSize = new THREE.Vector3(this.insertAreaSize.x, this.insertAreaSize.y, this.insertAreaSize.z)

        const basketMesh = searchPlugin.search(this.searchBasketMesh)
        const placeholderMesh = searchPlugin.search(this.searchPlaceholderMesh)
        const selectable = new SelectableBasket(basketMesh, placeholderMesh, offset, placeholderOffset, checkoutHandler)
        selectable.insertArea.setOffset(insertAreaOffset)
        selectable.insertArea.setSize(insertAreaSize)
        
        const selectablePocketMesh = new THREE.Mesh(
            new THREE.BoxGeometry(.1, .1, .1),
            new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true }
        ))
        const selectablePocket = new SelectablePocket(selectablePocketMesh, new THREE.Vector3(0, 0, 0), selectable)
        view.scene.add(selectablePocket.mesh)

        await followHandler.invoke(new AddFollowObjectCommand(selectablePocket.mesh, new THREE.Vector3(-.2, -.3, -.25)))
        await selectHandler.invoke(new AddSelectableCommand(selectable))
        await selectHandler.invoke(new AddSelectableCommand(selectablePocket))

        const basketUIContainer = await guiHandler.invoke(new FindUIObjectByName('basket'))
        if (!basketUIContainer) {
            const ui = await buildBasketUI(guiHandler)
            await guiHandler.invoke(new AddUIObjectCommand(ui.parent.container))
            await checkoutHandler.invoke(new SetCheckoutUIInterfaceCommand(ui.uiInterface))
        }

        const quantityUIContainer = await guiHandler.invoke(new FindUIObjectByName('quantity'))
        if (!quantityUIContainer) {
            const ui = await buildQuantityUI(guiHandler)
            await guiHandler.invoke(new AddUIObjectCommand(ui.parent.container))
            await checkoutHandler.invoke(new SetQuantityUIInterfaceCommand(ui.uiInterface))
        }
    }
}

export default AddWebXRBasketCommand
