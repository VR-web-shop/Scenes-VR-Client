import SceneSDK from '@vr-web-shop/scenes'

import SetCameraCommand from '../shop3D/commands/view/SetCameraCommand.js';
import SetSceneBggCommand from '../shop3D/commands/view/SetSceneBggCommand.js';
import LoadLightCommand from '../shop3D/commands/lights/LoadLightCommand.js';
import LoadMeshCommand from '../shop3D/commands/caches/LoadMeshCommand.js';
import RemoveMeshCommand from '../shop3D/commands/caches/RemoveMeshCommand.js';
import AddWebXRFloorCommand from '../shop3D/commands/webxr/teleport/AddWebXRFloorCommand.js';
import AddWebXRCheckoutCommand from '../shop3D/commands/webxr/checkout/AddWebXRCheckoutCommand.js';
import AddWebXRBasketCommand from '../shop3D/commands/webxr/checkout/AddWebXRBasketCommand.js';
import SetWebXRStartPositionCommand from '../shop3D/commands/webxr/teleport/SetWebXRStartPositionCommand.js';

import AddWebXRSelectableCommand from '../shop3D/commands/webxr/select/AddWebXRSelectableCommand.js';
import RemoveWebXRSelectableCommand from '../shop3D/commands/webxr/select/RemoveWebXRSelectableCommand.js';

import UpdateWebXRProductCommand from '../shop3D/commands/webxr/checkout/UpdateWebXRProductCommand.js';
import AddWebXRProductEntitiesCommand from '../shop3D/commands/webxr/checkout/AddWebXRProductEntitiesCommand.js';
import RemoveWebXRProductEntitiesCommand from '../shop3D/commands/webxr/checkout/RemoveWebXRProductEntitiesCommand.js';

import { useWebsocket } from './useWebsocket.js';
import { ref } from 'vue';

const SERVER_URL = 'http://localhost:3003'
const sdk = new SceneSDK(SERVER_URL)
const ws = useWebsocket();
let eventHandler = null;

const noOfProducts = ref(0);
const products = ref([]);

export function useSceneSDK() {

    /**
     * When the shop starts, the scenes sdk
     * will load scene and its assets.
     */
    async function start(shop) {
        const scene = await findActiveScene();
        const {
            SceneBackground, SceneBasket, SceneCheckouts,
            SceneFloors, SceneStaticObjects, SceneLights,
            SceneCamera, SceneProducts, SceneCharacter
        } = scene;

        await shop.invoke(new SetCameraCommand(SceneCamera.Position, SceneCamera.Rotation));
        await shop.invoke(new SetSceneBggCommand({ color: SceneBackground.hex }));

        await MeshUtils.loadMeshes(shop, [
            ...SceneStaticObjects, 
            ...SceneProducts, 
            ...SceneFloors,
            ...SceneCheckouts,
            {...SceneBasket, Mesh: SceneBasket.Object},
            {...SceneBasket, uuid: SceneBasket.uuid+'-ph', Mesh: SceneBasket.Placeholder},
            {...SceneBasket, uuid: SceneBasket.uuid+'-pk', Mesh: SceneBasket.Pocket}
        ]);

        await WebXrUtils.loadWebXR(
            shop, SceneLights, SceneFloors, SceneProducts, 
            SceneCheckouts, SceneBasket, SceneCharacter
        );

        eventHandler = new WebXREvents(shop);
        ws.addEventListener(ws.EVENTS.SCENES_UPDATE_SCENE_PRODUCT, eventHandler.onUpdateSceneProduct.bind(eventHandler));
        ws.addEventListener(ws.EVENTS.SCENES_DELETE_SCENE_PRODUCT, eventHandler.onDeleteSceneProduct.bind(eventHandler));
        ws.addEventListener(ws.EVENTS.SCENES_NEW_PRODUCT_ENTITY, eventHandler.onNewSceneProductEntity.bind(eventHandler));
        ws.addEventListener(ws.EVENTS.SCENES_UPDATE_PRODUCT_ENTITY, eventHandler.onUpdateSceneProductEntity.bind(eventHandler));
        ws.addEventListener(ws.EVENTS.SCENES_DELETE_PRODUCT_ENTITY, eventHandler.onDeleteSceneProductEntity.bind(eventHandler));
    
        noOfProducts.value = SceneProducts.length;
        products.value = SceneProducts;
    }

    async function exit(shop) {
        if (eventHandler === null) return;
        
        ws.removeEventListener(ws.EVENTS.SCENES_UPDATE_SCENE_PRODUCT, eventHandler.onUpdateSceneProduct.bind(eventHandler));
        ws.removeEventListener(ws.EVENTS.SCENES_DELETE_SCENE_PRODUCT, eventHandler.onDeleteSceneProduct.bind(eventHandler));
        ws.removeEventListener(ws.EVENTS.SCENES_NEW_PRODUCT_ENTITY, eventHandler.onNewSceneProductEntity.bind(eventHandler));
        ws.removeEventListener(ws.EVENTS.SCENES_UPDATE_PRODUCT_ENTITY, eventHandler.onUpdateSceneProductEntity.bind(eventHandler));
        ws.removeEventListener(ws.EVENTS.SCENES_DELETE_PRODUCT_ENTITY, eventHandler.onDeleteSceneProductEntity.bind(eventHandler));
    }

    async function findActiveScene() {
        const { rows } = await sdk.api.SceneController.findAll({
            limit: 100, where: { active: 1 }, include: [
                { model: 'SceneCamera', include: ['Position', 'Rotation'] },
                { model: 'SceneLights', include: ['Position', 'Rotation'] },
                { model: 'SceneStaticObjects', include: ['Position', 'Rotation', 'Scale', 'Mesh'] },
                { model: 'SceneFloors', include: ['Position', 'Rotation', 'Scale', 'Mesh'] },
                { model: 'SceneBasket', include: ['Position', 'Rotation', 'Scale', 'Object', 'Placeholder', 'Pocket', 'ObjectOffset', 'PlaceholderOffset', 'PocketOffset', 'InsertAreaOffset', 'InsertAreaSize'] },
                { model: 'SceneCheckouts', include: ['Position', 'Rotation', 'Scale', 'SurfaceOffset', 'SurfaceSize', 'UIOffsetPosition', 'UIOffsetRotation', 'UIScale', 'Mesh'] },
                { model: 'SceneProducts', include: ['Position', 'Rotation', 'Scale', 'UIOffsetPosition', 'UIOffsetRotation', 'UIScale', 'Mesh', 'Product'] },                
                { model: 'SceneCharacter', include: ['Position', 'Rotation']},
                { model: 'SceneBackground' },
            ]
        });

        if (rows.length === 0) {
            throw new Error(`Scene with UUID ${sceneUUID} not found`);
        }

        return rows[0];
    }

    return {
        sdk,
        start,
        exit,
        noOfProducts,
        products
    }
}

class MeshUtils {
    static async buildSubmeshes(mesh_uuid) {
        const { rows } = await sdk.api.MeshController.findAll({ 
            limit: 1000, 
            where: { uuid: mesh_uuid }, 
            include: [{ model: 'Material.Texture' }] 
        });

        const submeshes = rows[0].Material.map(m => {
            return {
                name: m.MeshMaterial.submesh_name,
                material: {
                    type: m.material_type_name,
                    textures: m.Texture.map(t => {
                        return {
                            type: t.texture_type_name,
                            src: t.source
                        }
                    }),
                }
            }
        });

        return submeshes;
    }

    static async loadMeshes(shop, meshObjects) {
        for (const object of meshObjects) {
            if (!object.Mesh) {
                console.log('Object does not have a mesh', object);
                continue;
            }

            const submeshes = await MeshUtils.buildSubmeshes(object.Mesh.uuid);
            await shop.invoke(new LoadMeshCommand(
                object.Mesh.source,
                submeshes,
                object.Position,
                object.Rotation,
                object.Scale,
                object.uuid
            ));
        }
    }
}

class WebXrUtils {
    static async loadCharacter(shop, character) {
        if (!character) return;
        await shop.invoke(new SetWebXRStartPositionCommand(character.Position, character.Rotation));
    }

    static async loadLights(shop, lights) {
        if (!lights) return;
        for (const light of lights) {
            await shop.invoke(new LoadLightCommand(
                light.scene_light_type_name,
                light.hexColor,
                light.intensity,
                light.Position,
                light.uuid
            ));
        }
    }

    static async loadFloors(shop, floors) {
        if (!floors) return;
        for (const floor of floors) {
            await shop.invoke(new AddWebXRFloorCommand({ name: floor.uuid }));
        }
    }

    static async loadProducts(shop, products) {
        if (!products) return;
        for (const product of products) {
            if (product.Mesh === null) {
                continue;
            }

            const { rows: productEntities } = await sdk.api.ProductEntityController.findAll({
                limit: 100,
                where: {
                    product_uuid: product.Product.uuid,
                    product_entity_state_name: 'AVAILABLE_FOR_PURCHASE'
                }
            });
            
            await shop.invoke(new AddWebXRSelectableCommand(
                { name: product.uuid }, 
                product.Product.uuid, 
                product.Product, 
                productEntities,
                product.UIOffsetPosition,
                product.UIOffsetRotation,
                product.UIScale,
            ));
        }
    }

    static async loadCheckouts(shop, checkouts) {
        if (!checkouts) return;
        for (const checkout of checkouts) {
            await shop.invoke(new AddWebXRCheckoutCommand({ name: checkout.uuid },
                checkout.SurfaceOffset,
                checkout.SurfaceSize,
                checkout.UIOffsetPosition,
                checkout.UIOffsetRotation,
                checkout.UIScale,
            ));
        }
    }

    static async loadBasket(shop, basket) {
        if (!basket) return;
        await shop.invoke(new AddWebXRBasketCommand(
            { name: basket.uuid },
            { name: basket.uuid + '-ph' },
            { name: basket.uuid + '-pk' },
            basket.uuid,
            basket.ObjectOffset,
            basket.PlaceholderOffset,
            basket.PocketOffset,
            basket.InsertAreaOffset,
            basket.InsertAreaSize
        ));
    }

    static async loadWebXR(shop, lights, floors, products, checkouts, basket, character) {
        await WebXrUtils.loadCharacter(shop, character);
        await WebXrUtils.loadLights(shop, lights);
        await WebXrUtils.loadFloors(shop, floors);
        await WebXrUtils.loadProducts(shop, products);
        await WebXrUtils.loadCheckouts(shop, checkouts);
        await WebXrUtils.loadBasket(shop, basket);
    }
}

class WebXREvents {
    constructor(shop) {
        this.shop = shop;
    }

    /**
     * @function onUpdateSceneProduct
     * @description Called when a scene product is updated.
     * @param {Object} sceneProduct - The scene product.
     * @returns {void}
     */
    async onUpdateSceneProduct(e) {
        const sceneProduct = e.payload;
        if (sceneProduct.Mesh === null) {
            return;
        }

        // We only update the product itself on scene product updates,
        // because updating mesh, position, etc. in realtime would
        // hurt the user experience.
        // Mesh updates will, therefore, only take effect after reload.
        await this.shop.invoke(new UpdateWebXRProductCommand(sceneProduct.Product.uuid, sceneProduct.Product));
    }

    /**
     * @function onDeleteSceneProduct
     * @description Called when a scene product is deleted.
     * @param {Object} sceneProduct - The scene product.
     * @returns {void}
     */
    async onDeleteSceneProduct(e) {
        const sceneProduct = e.payload;
        if (sceneProduct.Mesh === null) {
            return;
        }

        await this.shop.invoke(new RemoveWebXRSelectableCommand(sceneProduct.product_uuid));
        await this.shop.invoke(new RemoveMeshCommand({ name: sceneProduct.uuid }));
    }

    /**
     * @function onNewSceneProductEntity
     * @description Called when a new scene product entity is added.
     * @param {Object} sceneProductEntity - The scene product entity.
     * @returns {void}
     */
    async onNewSceneProductEntity(e) {
        const sceneProductEntity = e.payload;
        const { product_entity_state_name } = sceneProductEntity;
        
        if (product_entity_state_name === 'AVAILABLE_FOR_PURCHASE') {
            await this.shop.invoke(new AddWebXRProductEntitiesCommand(sceneProductEntity.product_uuid, [sceneProductEntity]));
        }
    }

    /**
     * @function onUpdateSceneProductEntity
     * @description Called when a scene product entity is updated.
     * @param {Object} sceneProductEntity - The scene product entity.
     * @returns {void}
     */
    async onUpdateSceneProductEntity(e) {
        const sceneProductEntity = e.payload;
        const { product_entity_state_name } = sceneProductEntity;
        
        if (product_entity_state_name === 'AVAILABLE_FOR_PURCHASE') {
            await this.shop.invoke(new AddWebXRProductEntitiesCommand(sceneProductEntity.product_uuid, [sceneProductEntity]));
        } else if (product_entity_state_name === 'RESERVERED_BY_CUSTOMER_CART') {
            await this.shop.invoke(new RemoveWebXRProductEntitiesCommand(sceneProductEntity.product_uuid, [sceneProductEntity], true));
        } else {
           await this.shop.invoke(new RemoveWebXRProductEntitiesCommand(sceneProductEntity.product_uuid, [sceneProductEntity]));
        }
    }

    /**
     * @function onDeleteSceneProduct
     * @description Called when a scene product entity is deleted.
     * @param {Object} sceneProductEntity - The scene product entity.
     * @returns {void}
     */
    async onDeleteSceneProductEntity(e) {
        const sceneProductEntity = e.payload;
        await this.shop.invoke(new RemoveWebXRProductEntitiesCommand(sceneProductEntity.product_uuid, [sceneProductEntity]));
    }
}
