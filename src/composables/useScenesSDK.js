import SceneSDK from '@vr-web-shop/scenes'
import readscene from '../utils/readscene.js'

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

const SERVER_URL = import.meta.env.VITE_SCENES_SERVER_URL
const sdk = SceneSDK(SERVER_URL)
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
        const scene = await readscene();
        const { rows: product_entities } = await sdk.ProductEntity.findAll(1, 1000);
        const {
            scene_background, 
            scene_basket,
            scene_checkouts,
            scene_floors,
            scene_static_objects,
            scene_lights,
            scene_camera,
            scene_products,
            scene_character
        } = scene;

        // Setup products with their entities
        for (const sceneProduct of scene_products) {
            const productEntities = product_entities.filter(pe => pe.product_client_side_uuid === sceneProduct.product_client_side_uuid);
            sceneProduct.product_entities = productEntities;
        }

        await shop.invoke(new SetCameraCommand(
            scene_camera.position_client_side_uuid, 
            scene_camera.rotation_client_side_uuid
        ));
        await shop.invoke(new SetSceneBggCommand({ 
            color: scene_background.hex 
        }));

        await MeshUtils.loadMeshes(shop, [
            ...scene_static_objects, 
            ...scene_products, 
            ...scene_floors,
            ...scene_checkouts,
            {...scene_basket, mesh_client_side_uuid: scene_basket.object_client_side_uuid},
            {...scene_basket, client_side_uuid: scene_basket.client_side_uuid+'-ph', mesh_client_side_uuid: scene_basket.placeholder_client_side_uuid},
            {...scene_basket, client_side_uuid: scene_basket.client_side_uuid+'-pk', mesh_client_side_uuid: scene_basket.pocket_client_side_uuid},
        ]);
        
        await WebXrUtils.loadWebXR(
            shop, scene_lights, scene_floors, scene_products, 
            scene_checkouts, scene_basket, scene_character
        );

        eventHandler = new WebXREvents(shop);
        
        ws.addEventListener(ws.EVENTS.SCENES_UPDATE_SCENE_PRODUCT, eventHandler.onUpdateSceneProduct.bind(eventHandler));
        ws.addEventListener(ws.EVENTS.SCENES_DELETE_SCENE_PRODUCT, eventHandler.onDeleteSceneProduct.bind(eventHandler));
        ws.addEventListener(ws.EVENTS.SCENES_NEW_PRODUCT_ENTITY, eventHandler.onNewSceneProductEntity.bind(eventHandler));
        ws.addEventListener(ws.EVENTS.SCENES_UPDATE_PRODUCT_ENTITY, eventHandler.onUpdateSceneProductEntity.bind(eventHandler));
        ws.addEventListener(ws.EVENTS.SCENES_DELETE_PRODUCT_ENTITY, eventHandler.onDeleteSceneProductEntity.bind(eventHandler));
    
        noOfProducts.value = scene_products.length;
        products.value = scene_products;
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
        const { rows } = await sdk.Scene.active()

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
    static async buildSubmeshes(mesh_materials) {
        const { rows: materials } = await sdk.Material.findAll(1, 1000);
        const { rows: textures } = await sdk.Texture.findAll(1, 1000);

        const submeshes = mesh_materials.map(m => {
            const material = materials.find(mat => mat.client_side_uuid === m.material_client_side_uuid);
            let mesh_textures = [];
            if (material.material_textures) {
                mesh_textures = material.material_textures.map(t => {
                    const _res = textures.find(tex => tex.client_side_uuid === t.texture_client_side_uuid)
                    return _res;
                });
            }

            return {
                name: m.submesh_name,
                material: {
                    type: material.material_type_name,
                    textures: mesh_textures.map(t => {
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
        const { rows: meshes } = await sdk.Mesh.findAll(1, 1000);

        for (const object of meshObjects) {
            if (!object.mesh_client_side_uuid) {
                console.log('Object does not have a mesh', object);
                continue;
            }

            const mesh = meshes.find(m => m.client_side_uuid === object.mesh_client_side_uuid);
            const submeshes = mesh.mesh_materials
                ? await MeshUtils.buildSubmeshes(mesh.mesh_materials)
                : [];

            await shop.invoke(new LoadMeshCommand(
                mesh.source,
                submeshes,
                object.position_client_side_uuid,
                object.rotation_client_side_uuid,
                object.scale_client_side_uuid,
                object.client_side_uuid
            ));
        }
    }
}

class WebXrUtils {
    static async loadCharacter(shop, character) {
        if (!character) return;
        await shop.invoke(new SetWebXRStartPositionCommand(
            character.position_client_side_uuid, 
            character.rotation_client_side_uuid
        ));
    }

    static async loadLights(shop, lights) {
        if (!lights) return;
        for (const light of lights) {
            await shop.invoke(new LoadLightCommand(
                light.scene_light_type_name,
                light.hex_color,
                light.intensity,
                light.position_client_side_uuid,
                light.uuid
            ));
        }
    }

    static async loadFloors(shop, floors) {
        if (!floors) return;
        for (const floor of floors) {
            await shop.invoke(new AddWebXRFloorCommand({ name: floor.client_side_uuid }));
        }
    }

    static async loadProducts(shop, products) {
        if (!products) return;
        for (const product of products) {
            if (!product.mesh_client_side_uuid) {
                continue;
            }
            const productEntities = product.product_entities || [];
            
            await shop.invoke(new AddWebXRSelectableCommand(
                { name: product.client_side_uuid }, 
                product.product_client_side_uuid, 
                product, 
                productEntities,
                product.ui_offset_position_client_side_uuid,
                product.ui_offset_rotation_client_side_uuid,
                product.ui_scale_client_side_uuid,
            ));
        }
    }

    static async loadCheckouts(shop, checkouts) {
        if (!checkouts) return;
        for (const checkout of checkouts) {
            await shop.invoke(new AddWebXRCheckoutCommand({ name: checkout.client_side_uuid },
                checkout.surface_offset_client_side_uuid,
                checkout.surface_size_client_side_uuid,
                checkout.ui_offset_position_client_side_uuid,
                checkout.ui_offset_rotation_client_side_uuid,
                checkout.ui_scale_client_side_uuid,
            ));
        }
    }

    static async loadBasket(shop, basket) {
        if (!basket) return;
        await shop.invoke(new AddWebXRBasketCommand(
            { name: basket.client_side_uuid },
            { name: basket.client_side_uuid + '-ph' },
            { name: basket.client_side_uuid + '-pk' },
            basket.client_side_uuid,
            basket.object_offset_client_side_uuid,
            basket.placeholder_offset_client_side_uuid,
            basket.pocket_offset_client_side_uuid,
            basket.insert_area_offset_client_side_uuid,
            basket.insert_area_size_client_side_uuid
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
        await this.shop.invoke(new UpdateWebXRProductCommand(sceneProduct.product_client_side_uuid, sceneProduct.Product));
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

        await this.shop.invoke(new RemoveWebXRSelectableCommand(sceneProduct.product_client_side_uuid));
        await this.shop.invoke(new RemoveMeshCommand({ name: sceneProduct.client_side_uuid }));
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
            await this.shop.invoke(new AddWebXRProductEntitiesCommand(sceneProductEntity.product_client_side_uuid, [sceneProductEntity]));
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
            await this.shop.invoke(new AddWebXRProductEntitiesCommand(sceneProductEntity.product_client_side_uuid, [sceneProductEntity]));
        } else if (product_entity_state_name === 'RESERVERED_BY_CUSTOMER_CART') {
            await this.shop.invoke(new RemoveWebXRProductEntitiesCommand(sceneProductEntity.product_client_side_uuid, [sceneProductEntity], true));
        } else {
           await this.shop.invoke(new RemoveWebXRProductEntitiesCommand(sceneProductEntity.product_client_side_uuid, [sceneProductEntity]));
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
        console.log('onDeleteSceneProductEntity', sceneProductEntity);
        await this.shop.invoke(new RemoveWebXRProductEntitiesCommand(sceneProductEntity.product_client_side_uuid, [sceneProductEntity]));
    }
}
