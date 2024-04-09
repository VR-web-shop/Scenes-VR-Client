import SpatialUIElement from "../SpatialUIElement.js";
import * as THREE from 'three';

const noImg = '/images/no_img.png';

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
            new THREE.MeshBasicMaterial({ map: texture })
        ));
    }

    static async loadTexture(textureUrl) {
        if (typeof textureUrl !== 'string') {
            throw new Error('textureUrl is not a string')
        }

        const loader = new THREE.TextureLoader();
        const image = await fetch(textureUrl);
        if (!image.ok) {
            console.log('Image not found at URL, loading placeholder image');
            return await loader.loadAsync(noImg);
        }

        
        return await loader.loadAsync(textureUrl);
    }
}

export default SpatialUIImage
