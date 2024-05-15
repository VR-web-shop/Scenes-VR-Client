import Command from "../../../abstractions/commands/Command.js";

import FindUIObjectByName from "../../../plugins/webxr/handlers/gui/commands/FindUIObjectByName.js";
import AddUIObjectCommand from "../../../plugins/webxr/handlers/gui/commands/AddUIObjectCommand.js";

import AddSelectableCommand from "../../../plugins/webxr/handlers/select/commands/AddSelectableCommand.js";
import SelectableBasket from "../../../plugins/webxr/handlers/select/selectables/SelectableBasket.js";
import SelectablePocket from "../../../plugins/webxr/handlers/select/selectables/SelectablePocket.js";

import AddFollowObjectCommand from "../../../plugins/webxr/handlers/follow/commands/AddFollowObject.js";

import SetQuantityUIInterfaceCommand from "../../../plugins/webxr/handlers/basket/commands/SetQuantityUIInterfaceCommand.js";
import SetCheckoutUIInterfaceCommand from "../../../plugins/webxr/handlers/basket/commands/SetCheckoutUIInterfaceCommand.js";

import { buildBasketUI } from "../../../plugins/webxr/handlers/basket/ui/checkout/main.js";
import { buildQuantityUI } from "../../../plugins/webxr/handlers/basket/ui/quantity/main.js";
import * as THREE from "three";
import ContentObject from "../../../plugins/webxr/handlers/basket/ui/checkout/ContentObject.js";


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
     * @param {Object} searchPocketMesh - The search for the pocket object 3d.
     * @param {string} id - The id for the selectable.
     * @param {THREE.Vector3} selectOffset - The offset for the controller select.
     * @param {THREE.Vector3} placeholderOffset - The offset for the placeholder object 3d.
     * @param {THREE.Vector3} pocketOffset - The offset for the insert area.
     * @param {THREE.Vector3} insertAreaOffset - The offset for the insert area.
     * @param {THREE.Vector3} insertAreaSize - The size for the insert area.
     * @param {THREE.Vector3} selectablePocketOffset - The offset for the selectable pocket.
     * @param {THREE.Vector3} selectablePocketSize - The size for the selectable pocket.
     * @param {number} selectablePocketColor - The color for the selectable pocket.
     * Possible parameters are: name, uuid
     * Note: Select only one parameter.
     * @example new AddWebXRBasketCommand( { name: 'meshName' }, { name: 'meshName' }, { name: 'meshName' } )
     * @example new AddWebXRBasketCommand( { uuid: 'meshUUID' }, { name: 'meshUUID' }, { name: 'meshUUID' } )
     */
    constructor(
        searchBasketMesh, 
        searchPlaceholderMesh, 
        searchPocketMesh,
        id = 'basket',
        selectOffset = { x: 0, y: 0, z: 0 }, 
        placeholderOffset = { x: 0, y: 0, z: 0 },
        pocketOffset = { x: 0, y: 0, z: 0 },
        insertAreaOffset = { x: 0, y: 0, z: 0 },
        insertAreaSize = { x: 1, y: 1, z: 1 }) {
        super()
        this.id = id
        this.searchBasketMesh = searchBasketMesh
        this.searchPlaceholderMesh = searchPlaceholderMesh
        this.searchPocketMesh = searchPocketMesh
        this.selectOffset = selectOffset
        this.placeholderOffset = placeholderOffset
        this.pocketOffset = pocketOffset
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

        /**
         * Create Basket Selectable.
         */
        const objectOffset = new THREE.Vector3(this.selectOffset.x, this.selectOffset.y, this.selectOffset.z)
        const placeholderOffset = new THREE.Vector3(this.placeholderOffset.x, this.placeholderOffset.y, this.placeholderOffset.z)
        const insertAreaOffset = new THREE.Vector3(this.insertAreaOffset.x, this.insertAreaOffset.y, this.insertAreaOffset.z)
        const insertAreaSize = new THREE.Vector3(this.insertAreaSize.x, this.insertAreaSize.y, this.insertAreaSize.z)
        const basketMesh = searchPlugin.search(this.searchBasketMesh)
        const placeholderMesh = searchPlugin.search(this.searchPlaceholderMesh)
        const selectable = new SelectableBasket(
            basketMesh, 
            this.id,
            placeholderMesh, 
            objectOffset, 
            placeholderOffset,
            insertAreaOffset,
            insertAreaSize, 
            checkoutHandler
        )
        await selectHandler.invoke(new AddSelectableCommand(selectable))
        
        /**
         * Create Pocket Selectable.
         */
        const pocketMesh = searchPlugin.search(this.searchPocketMesh)
        const selectablePocketOffset = new THREE.Vector3(this.pocketOffset.x, this.pocketOffset.y, this.pocketOffset.z)
        const selectablePocket = new SelectablePocket(pocketMesh, this.id+'pk', selectable)
        await followHandler.invoke(new AddFollowObjectCommand(selectablePocket.mesh, selectablePocketOffset))
        await selectHandler.invoke(new AddSelectableCommand(selectablePocket))
        view.scene.add(selectablePocket.mesh)

        /**
         * Create checkout UI.
         */
        const basketUIContainer = await guiHandler.invoke(new FindUIObjectByName('basket'))
        
        if (!basketUIContainer) {
            const ui = await buildBasketUI(guiHandler)
            await guiHandler.invoke(new AddUIObjectCommand(ui.parent.container))
            await checkoutHandler.invoke(new SetCheckoutUIInterfaceCommand(ui.uiInterface))
        }

        /**
         * Create quantity UI.
         */
        const quantityUIContainer = await guiHandler.invoke(new FindUIObjectByName('quantity'))
        if (!quantityUIContainer) {
            const ui = await buildQuantityUI(guiHandler)
            await guiHandler.invoke(new AddUIObjectCommand(ui.parent.container))
            await checkoutHandler.invoke(new SetQuantityUIInterfaceCommand(ui.uiInterface))
        }
    }
}

export default AddWebXRBasketCommand
