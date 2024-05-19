import SceneSDK from '@vr-web-shop/scenes'

const SERVER_URL = import.meta.env.VITE_SCENES_SERVER_URL
const sdk = SceneSDK(SERVER_URL)

const getVectors = async (entities, attributes) => {
    const vector3dIds = entities.map(e => {
        return attributes.map(attribute => e[attribute]);
    }).flat();
    const { rows: vectors } = await sdk.Vector3D.batchByUUID(vector3dIds);
    entities.forEach((element, index) => {
        for (const attribute of attributes) {
            const vector_client_side_uuid = element[attribute];
            const vector = vectors.find(v => v.client_side_uuid === vector_client_side_uuid);
            entities[index][attribute] = { ...vector, vector_client_side_uuid };
        }
    });
};

const getProducts = async (entities) => {
    const productIds = entities.map(e => e.product_client_side_uuid);
    const { rows: products } = await sdk.Product.batchByUUID(productIds);
    entities.forEach((element, index) => {
        const product_client_side_uuid = element.product_client_side_uuid;
        const product = products.find(p => p.client_side_uuid === product_client_side_uuid);
        entities[index].product = { ...product, product_client_side_uuid };
    });
};

const findActiveScene = async () => {
    const { rows } = await sdk.Scene.active()

    if (rows.length === 0) {
        throw new Error(`Scene with UUID ${sceneUUID} not found`);
    }
    
    const scene = rows[0];

    await getVectors([scene.scene_character], [
        'position_client_side_uuid',
        'rotation_client_side_uuid',
    ]);
    await getVectors([scene.scene_camera], [
        'position_client_side_uuid',
        'rotation_client_side_uuid',
    ]);
    await getVectors([scene.scene_basket], [
        'position_client_side_uuid',
        'rotation_client_side_uuid',
        'scale_client_side_uuid',
        'object_offset_client_side_uuid',
        'placeholder_offset_client_side_uuid',
        'pocket_offset_client_side_uuid',
        'insert_area_size_client_side_uuid',
        'insert_area_offset_client_side_uuid',
    ]);

    await getVectors(scene.scene_checkouts, [
        'position_client_side_uuid',
        'rotation_client_side_uuid',
        'scale_client_side_uuid',
        'surface_offset_client_side_uuid',
        'surface_size_client_side_uuid',
        'ui_offset_position_client_side_uuid',
        'ui_offset_rotation_client_side_uuid',
        'ui_scale_client_side_uuid'
    ]);

    await getVectors(scene.scene_floors, [
        'position_client_side_uuid',
        'rotation_client_side_uuid',
        'scale_client_side_uuid',
    ]);

    await getVectors(scene.scene_static_objects, [
        'position_client_side_uuid',
        'rotation_client_side_uuid',
        'scale_client_side_uuid',
    ]);

    await getVectors(scene.scene_lights, [
        'position_client_side_uuid',
        'rotation_client_side_uuid',
    ]);

    await getVectors(scene.scene_products, [
        'position_client_side_uuid',
        'rotation_client_side_uuid',
        'scale_client_side_uuid',
        'ui_offset_position_client_side_uuid', 
        'ui_offset_rotation_client_side_uuid', 
        'ui_scale_client_side_uuid',
    ]);

    await getProducts(scene.scene_products);

    return scene;
}

export default findActiveScene;