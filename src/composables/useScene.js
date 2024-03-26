import { useSceneSDK } from "./useScenesSDK.js";

const { sdk } = useSceneSDK();

import SetCameraCommand from '../shop3D/commands/view/SetCameraCommand.js';
import SetSceneBggCommand from '../shop3D/commands/view/SetSceneBggCommand.js';
import LoadLightCommand from '../shop3D/commands/lights/LoadLightCommand.js';
import LoadMeshCommand from '../shop3D/commands/caches/LoadMeshCommand.js';
import AddWebXRFloorCommand from '../shop3D/commands/webxr/AddWebXRFloorCommand.js';
import AddWebXRSelectableCommand from '../shop3D/commands/webxr/AddWebXRSelectableCommand.js';
import AddWebXRCheckoutCommand from '../shop3D/commands/webxr/AddWebXRCheckoutCommand.js';
import AddWebXRBasketCommand from '../shop3D/commands/webxr/AddWebXRBasketCommand.js';

export function useScene() {

    async function loadScene(shop) {
        const { rows } = await sdk.api.SceneController.findAll({
            limit: 100, where: { active: 1 }, include: [
                { model: 'SceneCamera', include: ['Position', 'Rotation'] },
                { model: 'SceneLights', include: ['Position', 'Rotation'] },
                { model: 'SceneStaticObjects', include: ['Position', 'Rotation', 'Scale', 'Mesh'] },
                { model: 'SceneFloors', include: ['Position', 'Rotation', 'Scale', 'Mesh'] },
                { model: 'SceneBasket', include: ['Position', 'Rotation', 'Scale', 'Object', 'Placeholder', 'ObjectOffset', 'PlaceholderOffset'] },
                { model: 'SceneCheckouts', include: ['Position', 'Rotation', 'Scale', 'SurfaceOffset', 'SurfaceSize', 'UIOffset', 'UIRotation', 'Mesh'] },
                { model: 'SceneProducts', include: ['Position', 'Rotation', 'Scale', 'Mesh', 'Product'] },
                { model: 'SceneBackground' }
            ]
        });

        if (rows.length === 0) {
            throw new Error(`Scene with UUID ${sceneUUID} not found`);
        }

        const scene = rows[0];
        const {
            SceneBackground, SceneBasket, SceneCheckouts,
            SceneFloors, SceneStaticObjects, SceneLights,
            SceneCamera, SceneProducts
        } = scene;

        await shop.invoke(new SetCameraCommand(SceneCamera.Position, SceneCamera.Rotation));
        await shop.invoke(new SetSceneBggCommand({ color: SceneBackground.hex }));

        for (const light of SceneLights) {
            await shop.invoke(new LoadLightCommand(
                light.scene_light_type_name,
                light.hexColor,
                light.intensity,
                light.Position,
                light.uuid
            ));
        }

        const buildSubmeshes = async (mesh_uuid) => {
            const { rows } = await sdk.api.MeshController.findAll({ limit: 1000, where: { uuid: mesh_uuid }, include: [{ model: 'Material.Texture' }] });
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

        for (const floor of SceneFloors) {
            const submeshes = await buildSubmeshes(floor.mesh_uuid);
            await shop.invoke(new LoadMeshCommand(
                floor.Mesh.source,
                submeshes,
                floor.Position,
                floor.Rotation,
                floor.Scale,
                floor.uuid
            ));
            await shop.invoke(new AddWebXRFloorCommand({ name: floor.uuid }));
        }

        for (const object of SceneStaticObjects) {
            const submeshes = await buildSubmeshes(object.mesh_uuid);
            await shop.invoke(new LoadMeshCommand(
                object.Mesh.source,
                submeshes,
                object.Position,
                object.Rotation,
                object.Scale,
                object.uuid
            ));
        }

        for (const product of SceneProducts) {
            const submeshes = await buildSubmeshes(product.mesh_uuid);
            await shop.invoke(new LoadMeshCommand(
                product.Mesh.source,
                submeshes,
                product.Position,
                product.Rotation,
                product.Scale,
                product.uuid
            ));
            await shop.invoke(new AddWebXRSelectableCommand({ name: product.uuid }));
        }

        for (const checkout of SceneCheckouts) {
            const submeshes = await buildSubmeshes(checkout.mesh_uuid);
            await shop.invoke(new LoadMeshCommand(
                checkout.Mesh.source,
                submeshes,
                checkout.Position,
                checkout.Rotation,
                checkout.Scale,
                checkout.uuid
            ));
            await shop.invoke(new AddWebXRCheckoutCommand(
                { name: checkout.uuid },
                checkout.SurfaceOffset,
                checkout.SurfaceSize,
                checkout.UIOffset,
                checkout.UIRotation
            ));
        }

        if (SceneBasket.object_uuid) {
            const submeshes = await buildSubmeshes(SceneBasket.object_uuid);
            await shop.invoke(new LoadMeshCommand(
                SceneBasket.Object.source,
                submeshes,
                SceneBasket.Position,
                SceneBasket.Rotation,
                SceneBasket.Scale,
                SceneBasket.uuid
            ));            
        }

        if (SceneBasket.placeholder_uuid) {
            const submeshes = await buildSubmeshes(SceneBasket.placeholder_uuid);
            await shop.invoke(new LoadMeshCommand(
                SceneBasket.Placeholder.source,
                submeshes,
                SceneBasket.Position,
                SceneBasket.Rotation,
                SceneBasket.Scale,
                SceneBasket.uuid+'-placeholder'
            ));
        }

        if (SceneBasket.object_uuid && SceneBasket.placeholder_uuid) {
            await shop.invoke(new AddWebXRBasketCommand(
                { name: SceneBasket.uuid },
                { name: SceneBasket.uuid+'-placeholder' },
                SceneBasket.ObjectOffset,
                SceneBasket.PlaceholderOffset
            ));
        }
    }


    return {
        loadScene
    };
}