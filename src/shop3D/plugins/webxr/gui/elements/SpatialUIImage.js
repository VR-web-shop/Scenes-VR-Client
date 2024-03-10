import SpatialUIElement from "../SpatialUIElement.js";
import * as THREE from 'three';

/**
 * @class SpatialUIImage
 * @classdesc A flat image.
 * @extends SpatialUIElement
 */
class SpatialUIImage extends SpatialUIElement {
    /**
     * @constructor
     * @param {THREE.Texture} texture - The texture.
     * @param {number} width - The width.
     * @param {number} height - The height.
     */
    constructor(texture, width, height) {
        super(new THREE.Mesh(
            new THREE.PlaneGeometry(width, height),
            new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
        ));
    }

    static async loadTexture(textureUrl) {
        const loader = new THREE.TextureLoader();
        return await loader.loadAsync(textureUrl);
    }
}

export default SpatialUIImage
