import SceneSDK from '@vr-web-shop/scenes'

import SetCameraCommand from '../shop3D/commands/view/SetCameraCommand.js';
import SetSceneBggCommand from '../shop3D/commands/view/SetSceneBggCommand.js';
import LoadLightCommand from '../shop3D/commands/lights/LoadLightCommand.js';
import LoadMeshCommand from '../shop3D/commands/caches/LoadMeshCommand.js';
import AddWebXRFloorCommand from '../shop3D/commands/webxr/teleport/AddWebXRFloorCommand.js';
import AddWebXRSelectableCommand from '../shop3D/commands/webxr/select/AddWebXRSelectableCommand.js';
import AddWebXRCheckoutCommand from '../shop3D/commands/webxr/checkout/AddWebXRCheckoutCommand.js';
import AddWebXRBasketCommand from '../shop3D/commands/webxr/checkout/AddWebXRBasketCommand.js';
import SetWebXRStartPositionCommand from '../shop3D/commands/webxr/teleport/SetWebXRStartPositionCommand.js';

const SERVER_URL = 'http://localhost:3003'
const sdk = new SceneSDK(SERVER_URL)

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
    }

    async function findActiveScene() {
        const { rows } = await sdk.api.SceneController.findAll({
            limit: 100, where: { active: 1 }, include: [
                { model: 'SceneCamera', include: ['Position', 'Rotation'] },
                { model: 'SceneLights', include: ['Position', 'Rotation'] },
                { model: 'SceneStaticObjects', include: ['Position', 'Rotation', 'Scale', 'Mesh'] },
                { model: 'SceneFloors', include: ['Position', 'Rotation', 'Scale', 'Mesh'] },
                { model: 'SceneBasket', include: ['Position', 'Rotation', 'Scale', 'Object', 'Placeholder', 'Pocket', 'ObjectOffset', 'PlaceholderOffset', 'PocketOffset', 'InsertAreaOffset', 'InsertAreaSize'] },
                { model: 'SceneCheckouts', include: ['Position', 'Rotation', 'Scale', 'SurfaceOffset', 'SurfaceSize', 'UIOffset', 'UIRotation', 'Mesh'] },
                { model: 'SceneProducts', include: ['Position', 'Rotation', 'Scale', 'Mesh', 'Product'] },                
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
        start
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
    static async loadWebXR(shop, lights, floors, products, checkouts, basket, character) {
        await shop.invoke(new SetWebXRStartPositionCommand(character.Position, character.Rotation));

        for (const light of lights) {
            await shop.invoke(new LoadLightCommand(
                light.scene_light_type_name, 
                light.hexColor, 
                light.intensity, 
                light.Position, 
                light.uuid
            ));
        }

        for (const floor of floors) {
            await shop.invoke(new AddWebXRFloorCommand({ name: floor.uuid }));
        }

        for (const product of products) {
            const { rows: productEntities } = await sdk.api.ProductEntityController.findAll({
                limit: 100, 
                where: {
                    product_uuid: product.Product.uuid,
                    product_entity_state_name: 'AVAILABLE_FOR_PURCHASE'
                }
            });
            await shop.invoke(new AddWebXRSelectableCommand({ name: product.uuid }, product.Product.uuid, product.Product, productEntities));
        }

        for (const checkout of checkouts) {
            await shop.invoke(new AddWebXRCheckoutCommand({ name: checkout.uuid }, 
                checkout.SurfaceOffset, 
                checkout.SurfaceSize, 
                checkout.UIOffset, 
                checkout.UIRotation
            ));
        }

        await shop.invoke(new AddWebXRBasketCommand(
            { name: basket.uuid },
            { name: basket.uuid+'-ph' },
            { name: basket.uuid+'-pk' },
            basket.uuid,
            basket.ObjectOffset,
            basket.PlaceholderOffset,
            basket.PocketOffset,
            basket.InsertAreaOffset,
            basket.InsertAreaSize
        ));
    }
}
